-- Drop existing tables if they exist
DROP TABLE IF EXISTS purchase_items CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;

-- Create purchases table with explicit column order
CREATE TABLE purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shipping_address JSONB,  -- Move JSONB column before numeric columns
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    sales_tax DECIMAL(10,2) NOT NULL,
    luxury_tax DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create purchase items table
CREATE TABLE purchase_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    title TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

-- Policies for purchases table
CREATE POLICY "Users can view their own purchases"
    ON purchases FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
    ON purchases FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policies for purchase_items table
CREATE POLICY "Users can view their purchase items"
    ON purchase_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM purchases
            WHERE purchases.id = purchase_items.purchase_id
            AND purchases.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their purchase items"
    ON purchase_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM purchases
            WHERE purchases.id = purchase_items.purchase_id
            AND purchases.user_id = auth.uid()
        )
    );

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
