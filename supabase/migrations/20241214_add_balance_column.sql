-- Add balance column to users table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'balance'
    ) THEN
        ALTER TABLE users ADD COLUMN balance INTEGER DEFAULT 2500000;
    END IF;
END $$;

-- Update existing rows to have default balance if they don't have one
UPDATE users 
SET balance = 2500000 
WHERE balance IS NULL;

-- Notify PostgREST to refresh its schema cache
NOTIFY pgrst, 'reload schema';
