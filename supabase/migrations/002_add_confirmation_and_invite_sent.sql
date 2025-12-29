-- Add confirmation and invite_sent columns to guests table
ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS confirmation BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS invite_sent BOOLEAN NOT NULL DEFAULT false;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_guests_confirmation ON guests(confirmation);
CREATE INDEX IF NOT EXISTS idx_guests_invite_sent ON guests(invite_sent);

