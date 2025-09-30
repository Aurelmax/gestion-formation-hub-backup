-- Migration script to transform existing users for Clerk integration

-- First, let's see what data we have
-- SELECT id, email, name, role FROM users;

-- Since we're switching to Clerk for authentication, we need to:
-- 1. Add the clerk_id column as nullable first
-- 2. Generate temporary clerk IDs for existing users (they'll need to re-register with Clerk)
-- 3. Update the schema to match our new structure

-- Step 1: Add new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_boolean BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS image VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Step 2: Populate clerk_id with temporary values for existing users
-- NOTE: These users will need to register again with Clerk
UPDATE users SET
  clerk_id = 'temp_' || id::text,
  email_verified_boolean = true,
  is_active = true
WHERE clerk_id IS NULL;

-- Step 3: Split name into firstName and lastName if possible
UPDATE users SET
  first_name = CASE
    WHEN name IS NOT NULL AND position(' ' in name) > 0
    THEN split_part(name, ' ', 1)
    ELSE name
  END,
  last_name = CASE
    WHEN name IS NOT NULL AND position(' ' in name) > 0
    THEN substring(name from position(' ' in name) + 1)
    ELSE NULL
  END
WHERE first_name IS NULL;

-- Step 4: Make clerk_id unique and not null after population
ALTER TABLE users ALTER COLUMN clerk_id SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_clerk_id_unique UNIQUE (clerk_id);

-- Step 5: Remove old authentication fields that are no longer needed
ALTER TABLE users DROP COLUMN IF EXISTS password;
ALTER TABLE users DROP COLUMN IF EXISTS email_verified;

-- Step 6: Update ID column to be VARCHAR to match Clerk IDs
-- This is complex, so we'll keep numeric IDs for now and add clerk_id as foreign key

-- Final verification
SELECT id, clerk_id, email, first_name, last_name, name, role, is_active, email_verified_boolean FROM users;