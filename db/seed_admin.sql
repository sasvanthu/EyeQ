-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set variables
DO $$
DECLARE
    new_user_id uuid := gen_random_uuid();
    admin_email text := 'admineyeq@eyeq.com';
    admin_password text := 'eyeq2k25';
    admin_username text := 'admineyeq';
BEGIN
    -- 1. Insert into auth.users (if not exists)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            new_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            now(),
            null,
            null,
            '{"provider":"email","providers":["email"]}',
            '{}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );

        -- 2. Insert into public.profiles
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            role,
            department,
            is_approved
        ) VALUES (
            new_user_id,
            admin_email,
            'EyeQ Admin',
            'admin',
            'Administration',
            true
        );
        
        RAISE NOTICE 'Admin user created: %', admin_email;
    ELSE
        RAISE NOTICE 'Admin user already exists: %', admin_email;
    END IF;
END $$;
