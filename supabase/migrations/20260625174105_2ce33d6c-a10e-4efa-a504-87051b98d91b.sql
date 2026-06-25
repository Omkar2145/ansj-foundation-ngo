
CREATE TABLE IF NOT EXISTS public.beneficiary_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  registrant_type public.registrant_type NOT NULL,
  beneficiary_kind public.beneficiary_kind NOT NULL,
  full_name text NOT NULL,
  date_of_birth date, gender text, phone text, email text,
  address text, city text, state text, pincode text,
  monthly_income numeric(12,2), income_source text, bpl_card_number text,
  family_size int,
  guardian_name text, guardian_relation text, guardian_phone text,
  medical_conditions text, disabilities text, current_medications text,
  bank_name text, bank_account_number text, bank_ifsc text, account_holder_name text,
  govt_schemes text,
  emergency_contact_name text, emergency_contact_phone text, emergency_contact_relation text,
  status public.registration_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes text, reviewed_at timestamptz,
  approved_beneficiary_id uuid REFERENCES public.beneficiaries(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.beneficiary_registrations TO authenticated;
GRANT INSERT ON public.beneficiary_registrations TO anon;
GRANT ALL ON public.beneficiary_registrations TO service_role;
ALTER TABLE public.beneficiary_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_can_submit_registration" ON public.beneficiary_registrations FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "submitter_views_own_registration" ON public.beneficiary_registrations FOR SELECT TO authenticated USING (submitted_by = auth.uid());
CREATE POLICY "staff_views_all_registrations" ON public.beneficiary_registrations FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role));
CREATE POLICY "staff_updates_registrations" ON public.beneficiary_registrations FOR UPDATE TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role));
CREATE TRIGGER trg_breg_updated_at BEFORE UPDATE ON public.beneficiary_registrations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_breg_status ON public.beneficiary_registrations(status);
CREATE INDEX idx_breg_submitted_by ON public.beneficiary_registrations(submitted_by);

CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type public.kyc_subject_type NOT NULL,
  subject_id uuid NOT NULL,
  doc_type public.kyc_doc_type NOT NULL,
  file_path text NOT NULL, file_name text, mime_type text, size_bytes bigint,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  verified boolean NOT NULL DEFAULT false,
  verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at timestamptz, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kyc_documents TO authenticated;
GRANT ALL ON public.kyc_documents TO service_role;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uploader_views_own_kyc" ON public.kyc_documents FOR SELECT TO authenticated USING (uploaded_by = auth.uid());
CREATE POLICY "staff_views_all_kyc" ON public.kyc_documents FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role));
CREATE POLICY "authenticated_inserts_kyc" ON public.kyc_documents FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid() AND verified = false AND verified_by IS NULL);
CREATE POLICY "staff_updates_kyc" ON public.kyc_documents FOR UPDATE TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role));
CREATE TRIGGER trg_kyc_updated_at BEFORE UPDATE ON public.kyc_documents FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_kyc_subject ON public.kyc_documents(subject_type, subject_id);

CREATE TABLE IF NOT EXISTS public.volunteer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL, phone text, email text,
  date_of_birth date, gender text,
  address text, city text, state text, pincode text,
  occupation text, skills text[], interests text[], availability text, why_volunteer text,
  emergency_contact_name text, emergency_contact_phone text,
  kyc_status public.registration_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz, review_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.volunteer_profiles TO authenticated;
GRANT ALL ON public.volunteer_profiles TO service_role;
ALTER TABLE public.volunteer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_views_own_volunteer_profile" ON public.volunteer_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_inserts_own_volunteer_profile" ON public.volunteer_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND kyc_status = 'pending');
CREATE POLICY "user_updates_own_volunteer_profile" ON public.volunteer_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND kyc_status = 'pending');
CREATE POLICY "staff_views_all_volunteer_profiles" ON public.volunteer_profiles FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role));
CREATE POLICY "staff_updates_volunteer_profiles" ON public.volunteer_profiles FOR UPDATE TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role));
CREATE TRIGGER trg_vp_updated_at BEFORE UPDATE ON public.volunteer_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.beneficiaries
  ADD COLUMN IF NOT EXISTS registration_id uuid REFERENCES public.beneficiary_registrations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS funds_allocated numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS funds_released numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS funds_pending_bills numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS needs_amount numeric(12,2);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text, action text NOT NULL,
  entity_type text NOT NULL, entity_id uuid,
  before_data jsonb, after_data jsonb, metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_views_audit" ON public.audit_log FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role));
CREATE POLICY "authenticated_writes_audit" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());
CREATE INDEX idx_audit_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON public.audit_log(actor_id);
CREATE INDEX idx_audit_created ON public.audit_log(created_at DESC);

CREATE POLICY "kyc_owner_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'kyc-documents' AND owner = auth.uid());
CREATE POLICY "kyc_staff_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'kyc-documents' AND (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role)));
CREATE POLICY "kyc_owner_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'kyc-documents' AND owner = auth.uid());
CREATE POLICY "bills_owner_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'expense-bills' AND owner = auth.uid());
CREATE POLICY "bills_staff_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'expense-bills' AND (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role)));
CREATE POLICY "bills_owner_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'expense-bills' AND owner = auth.uid());
CREATE POLICY "visits_owner_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'volunteer-visits' AND owner = auth.uid());
CREATE POLICY "visits_staff_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'volunteer-visits' AND (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role)));
CREATE POLICY "visits_owner_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'volunteer-visits' AND owner = auth.uid());
CREATE POLICY "vendor_docs_staff_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'vendor-docs' AND (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role)));
CREATE POLICY "vendor_docs_staff_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vendor-docs' AND (private.has_role(auth.uid(),'admin'::app_role) OR private.has_role(auth.uid(),'manager'::app_role)));
