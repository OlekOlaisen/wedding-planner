-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  groom_rating INTEGER NOT NULL CHECK (groom_rating >= 1 AND groom_rating <= 10),
  bridesmaid_rating INTEGER NOT NULL CHECK (bridesmaid_rating >= 1 AND bridesmaid_rating <= 10),
  attendance_possibility INTEGER NOT NULL CHECK (attendance_possibility >= 1 AND attendance_possibility <= 10),
  final_grade TEXT NOT NULL CHECK (final_grade IN ('A', 'B', 'C', 'D', 'F')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_guests_user_id ON guests(user_id);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own guests
CREATE POLICY "Users can view their own guests"
  ON guests FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own guests
CREATE POLICY "Users can insert their own guests"
  ON guests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own guests
CREATE POLICY "Users can update their own guests"
  ON guests FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own guests
CREATE POLICY "Users can delete their own guests"
  ON guests FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

