
-- 1. Audit log: remove client-side INSERT entirely; only service_role can write (bypasses RLS)
DROP POLICY IF EXISTS staff_writes_audit ON public.audit_log;
DROP POLICY IF EXISTS authenticated_writes_audit ON public.audit_log;

-- 2. Donations: ensure no user-facing UPDATE path exists. Drop any legacy owner-update policy if present.
DROP POLICY IF EXISTS "Sponsorships: update own" ON public.donations;
DROP POLICY IF EXISTS "Donations: update own" ON public.donations;

-- 3. Storage: enforce path prefix scoped to auth.uid() on owner INSERT policies,
--    and add owner UPDATE policies so users can replace their own files.
DROP POLICY IF EXISTS kyc_owner_upload ON storage.objects;
CREATE POLICY kyc_owner_upload ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS bills_owner_upload ON storage.objects;
CREATE POLICY bills_owner_upload ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'expense-bills'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS visits_owner_upload ON storage.objects;
CREATE POLICY visits_owner_upload ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'volunteer-visits'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY kyc_owner_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY bills_owner_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'expense-bills'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'expense-bills'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY visits_owner_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'volunteer-visits'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'volunteer-visits'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
