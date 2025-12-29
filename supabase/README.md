# Database Setup Instructions

## Running the Migration

To set up the database table for guests, you need to run the SQL migration in your Supabase dashboard.

### Steps:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/001_create_guests_table.sql`
5. Click **Run** to execute the migration

### What the Migration Does:

- Creates a `guests` table with all necessary columns
- Sets up Row Level Security (RLS) policies so users can only access their own guests
- Creates indexes for better query performance
- Adds a trigger to automatically update the `updated_at` timestamp

### Table Schema:

- `id` - UUID primary key
- `user_id` - References the authenticated user
- `name` - Guest name (text)
- `category` - Guest category (text)
- `groom_rating` - Rating from 1-10 (integer)
- `bridesmaid_rating` - Rating from 1-10 (integer)
- `attendance_possibility` - Likelihood from 1-10 (integer)
- `final_grade` - Calculated grade A-F (text)
- `notes` - Optional notes (text, nullable)
- `created_at` - Timestamp when record was created
- `updated_at` - Timestamp when record was last updated

### Security:

The table uses Row Level Security (RLS) to ensure:
- Users can only view their own guests
- Users can only insert guests for themselves
- Users can only update their own guests
- Users can only delete their own guests

