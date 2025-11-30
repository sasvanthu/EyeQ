-- Supabase schema for EyeQ Club Management

-- Enable Row Level Security
ALTER TABLE IF EXISTS members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance ENABLE ROW LEVEL SECURITY;

-- Profiles/Members table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Supabase Auth ID
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'Member', -- Admin, Vice President, Tech Lead, PR, Events, Member
  department text,
  year text,
  phone text,
  github_url text,
  linkedin_url text,
  skills text[],
  bio text,
  joined_at timestamptz DEFAULT now(),
  is_approved boolean DEFAULT false,
  avatar_url text
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  venue text,
  organizer text,
  type text, -- Workshop, Hackathon, Seminar
  prize text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id bigserial PRIMARY KEY,
  event_id bigint REFERENCES events(id) ON DELETE CASCADE,
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  status text DEFAULT 'Present',
  marked_at timestamptz DEFAULT now()
);

-- Messages (Communication Hub)
CREATE TABLE IF NOT EXISTS messages (
  id bigserial PRIMARY KEY,
  sender_id uuid REFERENCES members(id) ON DELETE SET NULL,
  content text NOT NULL,
  channel_id text, -- 'general', 'announcements', or 'dm_uuid1_uuid2'
  type text DEFAULT 'text', -- text, image, file
  file_url text,
  created_at timestamptz DEFAULT now()
);

-- Notifications (Admin Dashboard)
CREATE TABLE IF NOT EXISTS notifications (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES members(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  type text, -- info, warning, success
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id bigserial PRIMARY KEY,
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date timestamptz DEFAULT now(),
  event_id bigint REFERENCES events(id) ON DELETE SET NULL
);

