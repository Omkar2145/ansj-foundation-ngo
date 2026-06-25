import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, FileText, Receipt, Award } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tax-benefits")({
  head: () => ({
    meta: [
      { title: "Tax Benefits & 80G Certificates — ANSJ Foundation" },
      { name: "description", content: "All donations to ANSJ Foundation are tax-deductible under Section 80G. Download receipts, certificates and annual summaries anytime." },
      { property: "og:title", content: "Tax Benefits — ANSJ Foundation" },
      { property: "og:description", content: "80G certified. Download tax receipts instantly." },
      { property: "og:url", content: "/tax-benefits" },
    ],
    links: [{ rel: "canonical", href: "/tax-benefits" }],
  }),
  component: TaxPage,
});

const certs = [
  { icon: ShieldCheck, t: "Registration Certificate", d: "Section 12A registration under Income Tax Act" },
  { icon: Award, t: "80G Tax Exemption Certificate", d: "Donations qualify for 50% / 100% tax deduction" },
  { icon: FileText, t: "FCRA Certificate", d: "Authorized to receive foreign contributions" },
  { icon: Receipt, t: "NITI Aayog Darpan", d: "Registered on Government of India NGO portal" },
];

const downloads = [
  { t: "Latest Donation Receipt", d: "PDF receipt for your most recent donation" },
  { t: "80G Tax Certificate", d: "Official certificate for tax filing" },
  { t: "Annual Donation Summary", d: "Year-wise consolidated donation summary" },
  { t: "FY 2025-26 Tax Documents", d: "Complete tax document bundle" },
];

function TaxPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Tax Benefits"
        title="Give more. Save tax."
        subtitle="Every donation to ANSJ Foundation is eligible for deduction under Section 80G of the Income Tax Act, 1961."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold mb-2">Our certifications</h2>
          <p className="text-muted-foreground mb-8">Publicly verifiable. Click any certificate to view.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {certs.map((c) => (
              <div key={c.t} className="bg-card rounded-2xl border p-6 flex flex-col gap-3 card-hover">
                <div className="size-12 rounded-xl bg-secondary/10 text-secondary grid place-items-center">
                  <c.icon className="size-6" />
                </div>
                <div className="font-heading font-bold">{c.t}</div>
                <p className="text-sm text-muted-foreground flex-1">{c.d}</p>
                <Button variant="outline" size="sm" onClick={() => toast.info("Certificate preview — login to download")}>
                  <Download className="size-4" /> View
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-3xl border p-8 shadow-[var(--shadow-soft)]">
            <h2 className="font-heading text-3xl font-bold mb-2">Download center</h2>
            <p className="text-muted-foreground mb-6">Login to your donor portal to instantly download any tax document.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {downloads.map((d) => (
                <div key={d.t} className="flex items-center justify-between rounded-2xl border p-4 bg-muted/30">
                  <div>
                    <div className="font-semibold">{d.t}</div>
                    <div className="text-xs text-muted-foreground">{d.d}</div>
                  </div>
                  <Button onClick={() => toast.info("Login required to download tax documents")}>
                    <Download className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
