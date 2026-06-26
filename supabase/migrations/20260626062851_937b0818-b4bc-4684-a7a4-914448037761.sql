
-- 1. Beneficiary registrations: restrict submitted_by
DROP POLICY IF EXISTS anyone_can_submit_registration ON public.beneficiary_registrations;

CREATE POLICY anon_can_submit_registration
  ON public.beneficiary_registrations
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending' AND submitted_by IS NULL);

CREATE POLICY authenticated_can_submit_registration
  ON public.beneficiary_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (status = 'pending' AND submitted_by = auth.uid());

-- 2. Volunteer profiles: only allow updates while still pending
DROP POLICY IF EXISTS user_updates_own_volunteer_profile ON public.volunteer_profiles;

CREATE POLICY user_updates_own_volunteer_profile
  ON public.volunteer_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND kyc_status = 'pending')
  WITH CHECK (user_id = auth.uid() AND kyc_status = 'pending');

-- 3. Storage: staff-only UPDATE/DELETE on private buckets
CREATE POLICY kyc_staff_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'kyc-documents' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)))
  WITH CHECK (bucket_id = 'kyc-documents' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)));

CREATE POLICY kyc_staff_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'kyc-documents' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)));

CREATE POLICY bills_staff_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'expense-bills' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)))
  WITH CHECK (bucket_id = 'expense-bills' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)));

CREATE POLICY bills_staff_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'expense-bills' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)));

CREATE POLICY visits_staff_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'volunteer-visits' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)))
  WITH CHECK (bucket_id = 'volunteer-visits' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)));

CREATE POLICY visits_staff_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'volunteer-visits' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'manager'::app_role)));
