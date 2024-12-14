-- Get category IDs
WITH category_ids AS (
  SELECT id, name FROM categories
)
-- Seed luxury items
INSERT INTO luxury_items (title, price, image, category_id, description, rating, rating_count)
SELECT
  'Luxury Villa in Malibu',
  2500000,
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  (SELECT id FROM category_ids WHERE name = 'Homes'),
  'Stunning beachfront villa with panoramic ocean views',
  4.9,
  15
UNION ALL
SELECT
  'Private Jet Experience',
  150000,
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800',
  (SELECT id FROM category_ids WHERE name = 'Travel'),
  'Luxury private jet charter with full service',
  4.8,
  23
UNION ALL
SELECT
  'Ferrari SF90 Stradale',
  625000,
  'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800',
  (SELECT id FROM category_ids WHERE name = 'Cars'),
  'Flagship Ferrari hybrid supercar',
  5.0,
  12
UNION ALL
SELECT
  'Luxury Yacht - Ocean Paradise',
  4500000,
  'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800',
  (SELECT id FROM category_ids WHERE name = 'Boats'),
  'Custom-built 55m luxury yacht',
  4.9,
  8
UNION ALL
SELECT
  'Limited Edition Watch Collection',
  185000,
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
  (SELECT id FROM category_ids WHERE name = 'Watches'),
  'Handcrafted limited edition timepiece',
  4.7,
  31
UNION ALL
SELECT
  'Diamond Necklace',
  250000,
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
  (SELECT id FROM category_ids WHERE name = 'Jewelry'),
  'Rare pink diamond necklace with platinum setting',
  4.8,
  19
UNION ALL
SELECT
  'Chanel Classic Flap Bag',
  6000,
  'https://images.unsplash.com/photo-1556742031-c701a8b1d7a6?w=800',
  (SELECT id FROM category_ids WHERE name = 'Fashion'),
  'Iconic handbag crafted from premium leather.',
  4.9,
  25
UNION ALL
SELECT
  'Rolex Submariner',
  8500,
  'https://images.unsplash.com/photo-1575936123456-0e8b9d0c5e5a?w=800',
  (SELECT id FROM category_ids WHERE name = 'Fashion'),
  'Classic dive watch with a timeless design.',
  5.0,
  15
UNION ALL
SELECT
  'iPhone 14 Pro Max',
  1099,
  'https://images.unsplash.com/photo-1631289012854-6f1d1b3b4e8c?w=800',
  (SELECT id FROM category_ids WHERE name = 'Gadgets'),
  'Latest smartphone with advanced features.',
  4.8,
  40
UNION ALL
SELECT
  'MacBook Pro 16-inch',
  2499,
  'https://images.unsplash.com/photo-1612833608835-2c8f2e5e9d3d?w=800',
  (SELECT id FROM category_ids WHERE name = 'Gadgets'),
  'Powerful laptop for professionals.',
  4.7,
  30;
