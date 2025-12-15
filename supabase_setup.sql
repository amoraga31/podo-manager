-- 1. Create table (if not exists)
CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- 2. Insert keys
INSERT INTO app_config (key, value) VALUES ('manager_password', 'amoraga31') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_config (key, value) VALUES ('commercial_password', 'link2025') ON CONFLICT (key) DO NOTHING;

-- 3. RLS
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No direct access" ON app_config FOR ALL USING (false);

-- 4. Generic Secure Function
-- Usage: verify_role_password('manager_password', 'input') or verify_role_password('commercial_password', 'input')
CREATE OR REPLACE FUNCTION verify_role_password(role_key text, input_pass text)
RETURNS boolean AS $$
DECLARE
  stored_pass text;
BEGIN
  SELECT value INTO stored_pass FROM app_config WHERE key = role_key;
  RETURN stored_pass = input_pass;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
