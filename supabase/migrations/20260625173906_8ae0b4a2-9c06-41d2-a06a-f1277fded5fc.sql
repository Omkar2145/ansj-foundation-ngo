
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
ALTER FUNCTION public.is_sponsor_of(uuid, uuid) SET SCHEMA private;

DROP POLICY IF EXISTS "Donations: update own" ON public.donations;
DROP POLICY IF EXISTS "Donations: insert own" ON public.donations;

CREATE POLICY "Donations: insert own pending"
  ON public.donations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending'::donation_status AND receipt_number IS NULL AND transaction_ref IS NULL);

DROP POLICY IF EXISTS "Messages: sponsor read own thread" ON public.messages;
CREATE POLICY "Messages: read own or admin"
  ON public.messages FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'manager'::public.app_role));

DROP POLICY IF EXISTS "Calls: sponsor update own" ON public.scheduled_calls;
CREATE POLICY "Calls: admin/manager update"
  ON public.scheduled_calls FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'manager'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'manager'::public.app_role));

CREATE POLICY "Roles: admin insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Roles: admin update" ON public.user_roles FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Roles: admin delete" ON public.user_roles FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
