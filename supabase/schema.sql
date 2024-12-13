-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE luxury_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    rating NUMERIC,
    rating_count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar TEXT,
    currency TEXT NOT NULL DEFAULT 'USD',
    notifications BOOLEAN NOT NULL DEFAULT true,
    theme TEXT NOT NULL DEFAULT 'light',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES luxury_items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    total NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL,
    sales_tax NUMERIC NOT NULL,
    luxury_tax NUMERIC NOT NULL,
    shipping NUMERIC NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES luxury_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_at_time NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE luxury_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    TO authenticated, anon
    USING (true);

-- For now, allow all inserts for development
CREATE POLICY "Allow all inserts for categories"
    ON categories FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Allow all updates for categories"
    ON categories FOR UPDATE
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow all deletes for categories"
    ON categories FOR DELETE
    TO authenticated, anon
    USING (true);

-- Luxury Items policies (public read, admin write)
CREATE POLICY "Luxury items are viewable by everyone"
    ON luxury_items FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow all inserts for luxury items"
    ON luxury_items FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Allow all updates for luxury items"
    ON luxury_items FOR UPDATE
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow all deletes for luxury items"
    ON luxury_items FOR DELETE
    TO authenticated, anon
    USING (true);

-- Users policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for authentication users only"
    ON users FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON users FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Allow insert own user data"
    ON users FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow update own user data"
    ON users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to add favorites"
    ON favorites FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete favorites"
    ON favorites FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "Users can view their own purchases"
    ON purchases FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create purchases"
    ON purchases FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Purchase items policies
CREATE POLICY "Users can view their own purchase items"
    ON purchase_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM purchases
            WHERE purchases.id = purchase_items.purchase_id
            AND purchases.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow users to create purchase items"
    ON purchase_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM purchases
            WHERE purchases.id = purchase_items.purchase_id
            AND purchases.user_id = auth.uid()
        )
    );
