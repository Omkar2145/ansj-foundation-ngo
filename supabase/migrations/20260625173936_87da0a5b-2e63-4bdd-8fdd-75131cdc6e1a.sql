
DO $$ BEGIN CREATE TYPE public.registrant_type AS ENUM ('volunteer','guardian','elderly','staff');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.beneficiary_kind AS ENUM ('child','elderly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.registration_status AS ENUM ('pending','under_review','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.kyc_subject_type AS ENUM ('beneficiary','volunteer','vendor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.kyc_doc_type AS ENUM (
  'aadhaar','pan','birth_certificate','school_id','parent_aadhaar',
  'bank_passbook','voter_id','pension_document','photo','address_proof','gst_certificate');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'volunteer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'csr';
