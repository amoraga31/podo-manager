-- Create table for team members
CREATE TABLE IF NOT EXISTS salespeople (
  name text PRIMARY KEY,
  team text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE salespeople ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read (for login screen)
CREATE POLICY "Public Read" ON salespeople FOR SELECT USING (true);

-- Policy: Only authenticated (managers) can insert/delete?
-- For simplicity with current "password only" auth implementation, we might allow public insert/delete 
-- OR rely on the fact that only managers see the UI.
-- Since we are not using Supabase Auth (Users), 'public' is the role used.
CREATE POLICY "Public Write" ON salespeople FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete" ON salespeople FOR DELETE USING (true);

-- Seed Initial Data (Upsert to avoid duplicates)
INSERT INTO salespeople (name, team) VALUES
('Ian', 'AMORAGA'), ('Lizeth', 'AMORAGA'), ('Pablo', 'AMORAGA'), ('Formacion Amoraga', 'AMORAGA'),
('Pablo S', 'DAVID'), ('Pepe', 'DAVID'), ('Dario', 'DAVID'), ('Angel', 'DAVID'), ('Ivan', 'DAVID'), 
('Dana', 'DAVID'), ('Marcos', 'DAVID'), ('Sean', 'DAVID'), ('Xavi', 'DAVID'), ('Pepe P', 'DAVID'), 
('Formacion David', 'DAVID')
ON CONFLICT (name) DO UPDATE SET team = EXCLUDED.team;
