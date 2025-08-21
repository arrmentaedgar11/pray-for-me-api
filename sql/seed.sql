USE pray_for_me;

-- Insert categories
INSERT INTO categories (name) VALUES ('Health'), ('Guidance'), ('Thanksgiving');

-- Insert prayers
INSERT INTO prayers (title, description, category_id)
VALUES
('Prayer for healing', 'Please pray for my recovery from surgery.', 1),
('Guidance needed', 'Seeking wisdom in making a career decision.', 2),
('Grateful heart', 'Thanking God for blessings this week.', 3);

-- Insert comments
INSERT INTO comments (prayer_id, message)
VALUES
(1, 'Praying for your healing!'),
(2, 'God will guide your steps.'),
(3, 'So happy for you!');
