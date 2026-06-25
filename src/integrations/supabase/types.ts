export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      beneficiaries: {
        Row: {
          active: boolean
          age: number | null
          category: Database["public"]["Enums"]["sponsorship_category"]
          created_at: string
          goal_amount: number
          id: string
          image_url: string | null
          location: string | null
          monthly_amount: number
          name: string
          raised_amount: number
          slug: string
          story: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          active?: boolean
          age?: number | null
          category: Database["public"]["Enums"]["sponsorship_category"]
          created_at?: string
          goal_amount?: number
          id?: string
          image_url?: string | null
          location?: string | null
          monthly_amount?: number
          name: string
          raised_amount?: number
          slug: string
          story?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          active?: boolean
          age?: number | null
          category?: Database["public"]["Enums"]["sponsorship_category"]
          created_at?: string
          goal_amount?: number
          id?: string
          image_url?: string | null
          location?: string | null
          monthly_amount?: number
          name?: string
          raised_amount?: number
          slug?: string
          story?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      beneficiary_updates: {
        Row: {
          beneficiary_id: string
          body: string
          created_at: string
          id: string
          image_url: string | null
          posted_by: string | null
          title: string
        }
        Insert: {
          beneficiary_id: string
          body: string
          created_at?: string
          id?: string
          image_url?: string | null
          posted_by?: string | null
          title: string
        }
        Update: {
          beneficiary_id?: string
          body?: string
          created_at?: string
          id?: string
          image_url?: string | null
          posted_by?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficiary_updates_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          campaign: string | null
          category: string
          created_at: string
          currency: string
          frequency: Database["public"]["Enums"]["donation_frequency"]
          id: string
          message: string | null
          receipt_number: string | null
          status: Database["public"]["Enums"]["donation_status"]
          transaction_ref: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          campaign?: string | null
          category?: string
          created_at?: string
          currency?: string
          frequency?: Database["public"]["Enums"]["donation_frequency"]
          id?: string
          message?: string | null
          receipt_number?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          transaction_ref?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          campaign?: string | null
          category?: string
          created_at?: string
          currency?: string
          frequency?: Database["public"]["Enums"]["donation_frequency"]
          id?: string
          message?: string | null
          receipt_number?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          transaction_ref?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      impact_scores: {
        Row: {
          beneficiary_id: string
          generated_at: string
          id: string
          model: string | null
          score: number
          summary: string
        }
        Insert: {
          beneficiary_id: string
          generated_at?: string
          id?: string
          model?: string | null
          score: number
          summary: string
        }
        Update: {
          beneficiary_id?: string
          generated_at?: string
          id?: string
          model?: string | null
          score?: number
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "impact_scores_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: true
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_sentiment: string | null
          beneficiary_id: string
          body: string
          created_at: string
          id: string
          moderation_status: Database["public"]["Enums"]["moderation_status"]
          sender_id: string
        }
        Insert: {
          ai_sentiment?: string | null
          beneficiary_id: string
          body: string
          created_at?: string
          id?: string
          moderation_status?: Database["public"]["Enums"]["moderation_status"]
          sender_id: string
        }
        Update: {
          ai_sentiment?: string | null
          beneficiary_id?: string
          body?: string
          created_at?: string
          id?: string
          moderation_status?: Database["public"]["Enums"]["moderation_status"]
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          pan_number: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          pan_number?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          pan_number?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_calls: {
        Row: {
          beneficiary_id: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["call_kind"]
          link: string | null
          notes: string | null
          scheduled_at: string
          sponsor_id: string
          status: Database["public"]["Enums"]["call_status"]
        }
        Insert: {
          beneficiary_id: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["call_kind"]
          link?: string | null
          notes?: string | null
          scheduled_at: string
          sponsor_id: string
          status?: Database["public"]["Enums"]["call_status"]
        }
        Update: {
          beneficiary_id?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["call_kind"]
          link?: string | null
          notes?: string | null
          scheduled_at?: string
          sponsor_id?: string
          status?: Database["public"]["Enums"]["call_status"]
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_calls_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorships: {
        Row: {
          beneficiary_id: string
          beneficiary_name: string | null
          category: Database["public"]["Enums"]["sponsorship_category"]
          created_at: string
          id: string
          monthly_amount: number
          next_renewal_at: string | null
          started_at: string
          status: Database["public"]["Enums"]["sponsorship_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          beneficiary_id: string
          beneficiary_name?: string | null
          category: Database["public"]["Enums"]["sponsorship_category"]
          created_at?: string
          id?: string
          monthly_amount: number
          next_renewal_at?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["sponsorship_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          beneficiary_id?: string
          beneficiary_name?: string | null
          category?: Database["public"]["Enums"]["sponsorship_category"]
          created_at?: string
          id?: string
          monthly_amount?: number
          next_renewal_at?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["sponsorship_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "manager" | "donor" | "volunteer" | "csr"
      beneficiary_kind: "child" | "elderly"
      call_kind: "video" | "audio"
      call_status: "requested" | "confirmed" | "completed" | "cancelled"
      donation_frequency: "one_time" | "monthly"
      donation_status: "pending" | "completed" | "failed" | "refunded"
      kyc_doc_type:
        | "aadhaar"
        | "pan"
        | "birth_certificate"
        | "school_id"
        | "parent_aadhaar"
        | "bank_passbook"
        | "voter_id"
        | "pension_document"
        | "photo"
        | "address_proof"
        | "gst_certificate"
      kyc_subject_type: "beneficiary" | "volunteer" | "vendor"
      moderation_status: "pending" | "approved" | "rejected"
      registrant_type: "volunteer" | "guardian" | "elderly" | "staff"
      registration_status: "pending" | "under_review" | "approved" | "rejected"
      sponsorship_category: "child" | "elder"
      sponsorship_status: "active" | "paused" | "ended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "donor", "volunteer", "csr"],
      beneficiary_kind: ["child", "elderly"],
      call_kind: ["video", "audio"],
      call_status: ["requested", "confirmed", "completed", "cancelled"],
      donation_frequency: ["one_time", "monthly"],
      donation_status: ["pending", "completed", "failed", "refunded"],
      kyc_doc_type: [
        "aadhaar",
        "pan",
        "birth_certificate",
        "school_id",
        "parent_aadhaar",
        "bank_passbook",
        "voter_id",
        "pension_document",
        "photo",
        "address_proof",
        "gst_certificate",
      ],
      kyc_subject_type: ["beneficiary", "volunteer", "vendor"],
      moderation_status: ["pending", "approved", "rejected"],
      registrant_type: ["volunteer", "guardian", "elderly", "staff"],
      registration_status: ["pending", "under_review", "approved", "rejected"],
      sponsorship_category: ["child", "elder"],
      sponsorship_status: ["active", "paused", "ended"],
    },
  },
} as const
