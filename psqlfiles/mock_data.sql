-- ============================================
-- MOCK DATA for frankBread testing
-- Run AFTER bread_ordering_schema.sql
-- ============================================

-- ============================================
-- USERS (test phone logins)
-- ============================================
INSERT INTO users (name, phone, address) VALUES
('Maria Garcia',  '+50212345678', 'Zona 10, Ciudad de Guatemala'),
('Carlos Lopez',  '+50287654321', 'Zona 1, Ciudad de Guatemala'),
('Ana Martinez',  '+50211112222', 'Mixco, Guatemala'),
('Pedro Ramirez', '+50233334444', 'Villa Nueva, Guatemala'),
('Sofia Herrera', '+50255556666', 'Zona 15, Ciudad de Guatemala')
;

-- ============================================
-- STOCK (ensure enough for all test orders)
-- ============================================
UPDATE current_stock SET quantity_available = 50, last_restocked = CURRENT_DATE;

-- ============================================
-- ORDERS  (CTEs so IDs are never hardcoded)
-- ============================================

-- Carlos: completed order
WITH o AS (
    INSERT INTO orders (user_id, current_status, total_amount)
    SELECT user_id, 'completed', 19.50 FROM users WHERE phone = '+50287654321'
    RETURNING order_id
)
INSERT INTO order_item (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.order_id, v.product_id, v.qty, v.price, v.subtotal
FROM o, (VALUES (1, 1, 6.50, 6.50), (3, 2, 4.00, 8.00), (2, 1, 5.00, 5.00)) AS v(product_id, qty, price, subtotal);

WITH o AS (SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE phone = '+50287654321') ORDER BY order_id DESC LIMIT 1)
INSERT INTO order_status_history (order_id, status, changed_by, notes)
SELECT o.order_id, v.status, v.by, v.notes
FROM o, (VALUES
    ('pending',          'system', 'Order placed'),
    ('confirmed',        'baker',  'Confirmed'),
    ('out_for_delivery', 'baker',  'Out for delivery'),
    ('completed',        'baker',  'Delivered')
) AS v(status, by, notes);

-- Ana: pending order (cancellable)
WITH o AS (
    INSERT INTO orders (user_id, current_status, total_amount)
    SELECT user_id, 'pending', 11.50 FROM users WHERE phone = '+50211112222'
    RETURNING order_id
)
INSERT INTO order_item (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.order_id, v.product_id, v.qty, v.price, v.subtotal
FROM o, (VALUES (4, 1, 5.50, 5.50), (5, 1, 6.00, 6.00)) AS v(product_id, qty, price, subtotal);

WITH o AS (SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE phone = '+50211112222') ORDER BY order_id DESC LIMIT 1)
INSERT INTO order_status_history (order_id, status, changed_by, notes)
SELECT o.order_id, 'pending', 'system', 'Order placed' FROM o;

-- Pedro: confirmed order (cancellable)
WITH o AS (
    INSERT INTO orders (user_id, current_status, total_amount)
    SELECT user_id, 'confirmed', 13.00 FROM users WHERE phone = '+50233334444'
    RETURNING order_id
)
INSERT INTO order_item (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.order_id, 1, 2, 6.50, 13.00 FROM o;

WITH o AS (SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE phone = '+50233334444') ORDER BY order_id DESC LIMIT 1)
INSERT INTO order_status_history (order_id, status, changed_by, notes)
SELECT o.order_id, v.status, v.by, v.notes
FROM o, (VALUES
    ('pending',   'system', 'Order placed'),
    ('confirmed', 'baker',  'Confirmed')
) AS v(status, by, notes);

-- Sofia: out for delivery (not cancellable)
WITH o AS (
    INSERT INTO orders (user_id, current_status, total_amount)
    SELECT user_id, 'out_for_delivery', 15.00 FROM users WHERE phone = '+50255556666'
    RETURNING order_id
)
INSERT INTO order_item (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.order_id, v.product_id, v.qty, v.price, v.subtotal
FROM o, (VALUES (3, 1, 4.00, 4.00), (2, 1, 5.00, 5.00), (5, 1, 6.00, 6.00)) AS v(product_id, qty, price, subtotal);

WITH o AS (SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE phone = '+50255556666') ORDER BY order_id DESC LIMIT 1)
INSERT INTO order_status_history (order_id, status, changed_by, notes)
SELECT o.order_id, v.status, v.by, v.notes
FROM o, (VALUES
    ('pending',          'system', 'Order placed'),
    ('confirmed',        'baker',  'Confirmed'),
    ('out_for_delivery', 'baker',  'Out for delivery')
) AS v(status, by, notes);

-- ============================================
-- TEST CREDENTIALS SUMMARY
-- ============================================
-- Phone           | Name           | Order status
-- +50212345678    | Maria Garcia   | no orders (returning user login test)
-- +50287654321    | Carlos Lopez   | completed
-- +50211112222    | Ana Martinez   | pending    (can cancel with phone +50211112222)
-- +50233334444    | Pedro Ramirez  | confirmed  (can cancel with phone +50233334444)
-- +50255556666    | Sofia Herrera  | out_for_delivery (cannot cancel)
-- (any new number)| new user       | registration flow test
