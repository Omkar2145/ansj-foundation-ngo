import { useState } from "react";
import { Upload, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type DocType = Database["public"]["Enums"]["kyc_doc_type"];
type SubjectType = Database["public"]["Enums"]["kyc_subject_type"];

export interface KycUploaderProps {
  label: string;
  docType: DocType;
  subjectType: SubjectType;
  subjectId: string | null; // null = stash until subject is created
  required?: boolean;
  onUploaded?: (path: string, docId?: string) => void;
}

export function KycUploader({ label, docType, subjectType, subjectId, required, onUploaded }: KycUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<{ name: string; path: string } | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Please sign in to upload documents");
        return;
      }
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${userData.user.id}/${subjectType}/${docType}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("kyc-documents").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) throw upErr;

      let docId: string | undefined;
      if (subjectId) {
        const { data: row, error: dbErr } = await supabase
          .from("kyc_documents")
          .insert({
            subject_type: subjectType,
            subject_id: subjectId,
            doc_type: docType,
            file_path: path,
            file_name: file.name,
            mime_type: file.type,
            size_bytes: file.size,
            uploaded_by: userData.user.id,
          })
          .select("id")
          .single();
        if (dbErr) throw dbErr;
        docId = row?.id;
      }
      setUploaded({ name: file.name, path });
      onUploaded?.(path, docId);
      toast.success(`${label} uploaded`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card">
      <div className="min-w-0">
        <div className="text-sm font-medium flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </div>
        {uploaded ? (
          <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Check className="size-3 text-primary" /> {uploaded.name}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">PDF, JPG, or PNG up to 5MB</div>
        )}
      </div>
      <div className="shrink-0">
        {uploaded ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setUploaded(null)}>
            <X className="size-4" />
          </Button>
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
              disabled={uploading}
            />
            <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
              <span>
                {uploading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Upload className="size-4 mr-1" />}
                Upload
              </span>
            </Button>
          </label>
        )}
      </div>
    </div>
  );
}
