-- Categories
INSERT INTO categories (name) VALUES ('Health'), ('Guidance'), ('Thanksgiving');

--Prayers
INSERT INTO prayers (title, description, status, is_private, prayed_count, created_at)
VALUES
  ('Prayer for healing', 'Please pray for my recovery from surgery.', 'open', 0, 0, NOW()),
  ('Guidance needed', 'Seeking wisdom in making a career decision.', 'open', 0, 0, NOW()),
  ('Grateful heart', 'Thanking God for blessings this week.', 'open', 0, 0, NOW());

--categories
INSERT INTO prayer_categories (prayer_id, category_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3);

-- Comments
INSERT INTO comments (prayer_id, display_name, content, likes_count, created_at) VALUES
  (1, 'Anna', 'Praying for you!', 0, NOW()),
  (1, 'Mike', 'Stay strong!', 0, NOW()),
  (2, 'Grace', 'May you find clarity.', 0, NOW());
