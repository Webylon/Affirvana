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
;
