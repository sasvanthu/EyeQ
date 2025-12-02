-- Learning Logs Table
CREATE TABLE IF NOT EXISTS learning_logs (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  hours numeric DEFAULT 0,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE learning_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own logs"
  ON learning_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON learning_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON learning_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON learning_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all logs
CREATE POLICY "Admins can view all logs"
  ON learning_logs FOR SELECT
  USING (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
