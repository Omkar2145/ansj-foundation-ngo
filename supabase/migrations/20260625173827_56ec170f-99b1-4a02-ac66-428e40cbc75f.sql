
CREATE TABLE public.beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category public.sponsorship_category NOT NULL,
  age INTEGER, location TEXT, story TEXT,
  goal_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  raised_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT true,
  active BOOLEAN NOT NULL DEFAULT true,
  monthly_amount NUMERIC(12,2) NOT NULL DEFAULT 1500,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.beneficiaries TO anon, authenticated;
GRANT ALL ON public.beneficiaries TO service_role;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Beneficiaries: public read active" ON public.beneficiaries FOR SELECT TO anon, authenticated USING (active = true);

CREATE TABLE public.beneficiary_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  title TEXT NOT NULL, body TEXT NOT NULL, image_url TEXT,
  posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.beneficiary_updates TO anon, authenticated;
GRANT ALL ON public.beneficiary_updates TO service_role;
ALTER TABLE public.beneficiary_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Updates: public read" ON public.beneficiary_updates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Updates: manager/admin write" ON public.beneficiary_updates FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE TYPE public.moderation_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  beneficiary_id UUID NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  moderation_status public.moderation_status NOT NULL DEFAULT 'pending',
  ai_sentiment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_sponsor_of(_user_id UUID, _beneficiary_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sponsorships s
    JOIN public.beneficiaries b ON b.id = _beneficiary_id
    WHERE s.user_id = _user_id AND s.beneficiary_id = b.id::text AND s.status = 'active'
  )
$$;
REVOKE EXECUTE ON FUNCTION public.is_sponsor_of(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_sponsor_of(UUID, UUID) TO authenticated;

CREATE POLICY "Messages: sponsor read own thread" ON public.messages FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR public.is_sponsor_of(auth.uid(), beneficiary_id)
    OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Messages: sponsor send" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.is_sponsor_of(auth.uid(), beneficiary_id));

CREATE TYPE public.call_kind AS ENUM ('video', 'audio');
CREATE TYPE public.call_status AS ENUM ('requested', 'confirmed', 'completed', 'cancelled');

CREATE TABLE public.scheduled_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  beneficiary_id UUID NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  link TEXT,
  kind public.call_kind NOT NULL DEFAULT 'video',
  status public.call_status NOT NULL DEFAULT 'requested',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.scheduled_calls TO authenticated;
GRANT ALL ON public.scheduled_calls TO service_role;
ALTER TABLE public.scheduled_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Calls: sponsor read/write own" ON public.scheduled_calls FOR SELECT TO authenticated
  USING (sponsor_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Calls: sponsor request" ON public.scheduled_calls FOR INSERT TO authenticated
  WITH CHECK (sponsor_id = auth.uid() AND public.is_sponsor_of(auth.uid(), beneficiary_id));
CREATE POLICY "Calls: sponsor update own" ON public.scheduled_calls FOR UPDATE TO authenticated
  USING (sponsor_id = auth.uid()) WITH CHECK (sponsor_id = auth.uid());

CREATE TABLE public.impact_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL UNIQUE REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  summary TEXT NOT NULL,
  model TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.impact_scores TO anon, authenticated;
GRANT ALL ON public.impact_scores TO service_role;
ALTER TABLE public.impact_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Impact: public read" ON public.impact_scores FOR SELECT TO anon, authenticated USING (true);

CREATE TRIGGER trg_beneficiaries_updated_at BEFORE UPDATE ON public.beneficiaries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.beneficiaries (slug, name, category, age, location, story, goal_amount, raised_amount, image_url, monthly_amount) VALUES
('ananya-12', 'Ananya R.', 'child', 12, 'Jharkhand', 'Ananya dreams of becoming a doctor. She lost her father last year and walks 4 km to reach the nearest school. With your sponsorship, she can stay in school and access books, uniforms, and nutritious meals.', 36000, 18500, '/src/assets/story-1.jpg', 1500),
('ravi-9', 'Ravi K.', 'child', 9, 'Bihar', 'Ravi is the eldest of three siblings. His mother works as a daily-wage labourer. ANSJ provides his school fees, study materials, and a daily nutritious meal so he can focus on his studies.', 36000, 24200, '/src/assets/story-2.jpg', 1500),
('priya-14', 'Priya S.', 'child', 14, 'Odisha', 'Priya is in Class 9 and the first in her family to reach high school. Her sponsorship covers tuition, science kits, and college-prep coaching.', 42000, 9800, '/src/assets/story-3.jpg', 1800),
('rajesh-68', 'Rajesh Uncle', 'elder', 68, 'Delhi', 'Rajesh ji lives alone and suffers from arthritis. His monthly support covers medicines, doctor visits, and groceries — a basic dignity that should never be optional.', 30000, 14600, '/src/assets/campaign-medical.jpg', 2500),
('sushila-72', 'Sushila Devi', 'elder', 72, 'Uttar Pradesh', 'After losing her husband, Sushila ji has no family support. ANSJ ensures she has nutritious food, healthcare check-ups, and warm clothing through the winter.', 30000, 22100, '/src/assets/campaign-rural.jpg', 2200),
('vijay-65', 'Vijay Sharma', 'elder', 65, 'Rajasthan', 'A retired teacher with no pension, Vijay ji needs ongoing cataract treatment and a regular supply of diabetes medication.', 35000, 7400, '/src/assets/campaign-food.jpg', 2500);

INSERT INTO public.impact_scores (beneficiary_id, score, summary, model)
SELECT id, 88, 'High-impact case: verified KYC, regular school attendance, family below poverty line. Each rupee directly funds essentials.', 'seed'
FROM public.beneficiaries WHERE slug = 'ananya-12';
