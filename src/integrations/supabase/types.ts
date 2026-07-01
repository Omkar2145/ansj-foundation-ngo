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
      audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      beneficiaries: {
        Row: {
          active: boolean
          age: number | null
          category: Database["public"]["Enums"]["sponsorship_category"]
          created_at: string
          funds_allocated: number
          funds_pending_bills: number
          funds_released: number
          goal_amount: number
          id: string
          image_url: string | null
          location: string | null
          monthly_amount: number
          name: string
          needs_amount: number | null
          raised_amount: number
          registration_id: string | null
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
          funds_allocated?: number
          funds_pending_bills?: number
          funds_released?: number
          goal_amount?: number
          id?: string
          image_url?: string | null
          location?: string | null
          monthly_amount?: number
          name: string
          needs_amount?: number | null
          raised_amount?: number
          registration_id?: string | null
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
          funds_allocated?: number
          funds_pending_bills?: number
          funds_released?: number
          goal_amount?: number
          id?: string
          image_url?: string | null
          location?: string | null
          monthly_amount?: number
          name?: string
          needs_amount?: number | null
          raised_amount?: number
          registration_id?: string | null
          slug?: string
          story?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "beneficiaries_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "beneficiary_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficiary_registrations: {
        Row: {
          account_holder_name: string | null
          address: string | null
          approved_beneficiary_id: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          bank_name: string | null
          beneficiary_kind: Database["public"]["Enums"]["beneficiary_kind"]
          bpl_card_number: string | null
          city: string | null
          created_at: string
          current_medications: string | null
          date_of_birth: string | null
          disabilities: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          family_size: number | null
          full_name: string
          gender: string | null
          govt_schemes: string | null
          guardian_name: string | null
          guardian_phone: string | null
          guardian_relation: string | null
          id: string
          income_source: string | null
          medical_conditions: string | null
          monthly_income: number | null
          phone: string | null
          pincode: string | null
          registrant_type: Database["public"]["Enums"]["registrant_type"]
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          state: string | null
          status: Database["public"]["Enums"]["registration_status"]
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          account_holder_name?: string | null
          address?: string | null
          approved_beneficiary_id?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          beneficiary_kind: Database["public"]["Enums"]["beneficiary_kind"]
          bpl_card_number?: string | null
          city?: string | null
          created_at?: string
          current_medications?: string | null
          date_of_birth?: string | null
          disabilities?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          family_size?: number | null
          full_name: string
          gender?: string | null
          govt_schemes?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_relation?: string | null
          id?: string
          income_source?: string | null
          medical_conditions?: string | null
          monthly_income?: number | null
          phone?: string | null
          pincode?: string | null
          registrant_type: Database["public"]["Enums"]["registrant_type"]
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          account_holder_name?: string | null
          address?: string | null
          approved_beneficiary_id?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          beneficiary_kind?: Database["public"]["Enums"]["beneficiary_kind"]
          bpl_card_number?: string | null
          city?: string | null
          created_at?: string
          current_medications?: string | null
          date_of_birth?: string | null
          disabilities?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          family_size?: number | null
          full_name?: string
          gender?: string | null
          govt_schemes?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_relation?: string | null
          id?: string
          income_source?: string | null
          medical_conditions?: string | null
          monthly_income?: number | null
          phone?: string | null
          pincode?: string | null
          registrant_type?: Database["public"]["Enums"]["registrant_type"]
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficiary_registrations_approved_beneficiary_id_fkey"
            columns: ["approved_beneficiary_id"]
            isOneToOne: false
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
        ]
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
      expenses: {
        Row: {
          amount: number
          beneficiary_id: string
          bill_path: string
          category: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["expense_status"]
          submitted_by: string
          updated_at: string
          vendor_address: string | null
          vendor_name: string
          vendor_phone: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          beneficiary_id: string
          bill_path: string
          category: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["expense_status"]
          submitted_by: string
          updated_at?: string
          vendor_address?: string | null
          vendor_name: string
          vendor_phone: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          beneficiary_id?: string
          bill_path?: string
          category?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["expense_status"]
          submitted_by?: string
          updated_at?: string
          vendor_address?: string | null
          vendor_name?: string
          vendor_phone?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
        ]
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
      kyc_documents: {
        Row: {
          created_at: string
          doc_type: Database["public"]["Enums"]["kyc_doc_type"]
          file_name: string | null
          file_path: string
          id: string
          mime_type: string | null
          notes: string | null
          size_bytes: number | null
          subject_id: string
          subject_type: Database["public"]["Enums"]["kyc_subject_type"]
          updated_at: string
          uploaded_by: string | null
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          doc_type: Database["public"]["Enums"]["kyc_doc_type"]
          file_name?: string | null
          file_path: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          size_bytes?: number | null
          subject_id: string
          subject_type: Database["public"]["Enums"]["kyc_subject_type"]
          updated_at?: string
          uploaded_by?: string | null
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          doc_type?: Database["public"]["Enums"]["kyc_doc_type"]
          file_name?: string | null
          file_path?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          size_bytes?: number | null
          subject_id?: string
          subject_type?: Database["public"]["Enums"]["kyc_subject_type"]
          updated_at?: string
          uploaded_by?: string | null
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
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
      volunteer_profiles: {
        Row: {
          address: string | null
          availability: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          gender: string | null
          id: string
          interests: string[] | null
          kyc_status: Database["public"]["Enums"]["registration_status"]
          occupation: string | null
          phone: string | null
          pincode: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          skills: string[] | null
          state: string | null
          updated_at: string
          user_id: string
          why_volunteer: string | null
        }
        Insert: {
          address?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          kyc_status?: Database["public"]["Enums"]["registration_status"]
          occupation?: string | null
          phone?: string | null
          pincode?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          skills?: string[] | null
          state?: string | null
          updated_at?: string
          user_id: string
          why_volunteer?: string | null
        }
        Update: {
          address?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          kyc_status?: Database["public"]["Enums"]["registration_status"]
          occupation?: string | null
          phone?: string | null
          pincode?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          skills?: string[] | null
          state?: string | null
          updated_at?: string
          user_id?: string
          why_volunteer?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_unapproved_expenses: {
        Args: { _beneficiary_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "donor" | "volunteer" | "csr"
      beneficiary_kind: "child" | "elderly"
      call_kind: "video" | "audio"
      call_status: "requested" | "confirmed" | "completed" | "cancelled"
      donation_frequency: "one_time" | "monthly"
      donation_status: "pending" | "completed" | "failed" | "refunded"
      expense_status: "pending" | "verified" | "rejected"
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
      expense_status: ["pending", "verified", "rejected"],
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
