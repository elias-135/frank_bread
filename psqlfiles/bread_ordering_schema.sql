-- ============================================
-- BREAD ORDERING SYSTEM - PostgreSQL Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,  -- enforces one record per customer
    address TEXT NOT NULL
);

-- ============================================
-- 2. PRODUCT TABLE
-- ============================================
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_active ON product(is_active);
CREATE INDEX idx_product_category ON product(category);

-- ============================================
-- 3. CURRENT_STOCK TABLE
-- ============================================
CREATE TABLE current_stock (
    stock_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL UNIQUE,
    quantity_available INTEGER NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
    last_restocked DATE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

CREATE INDEX idx_current_stock_product ON current_stock(product_id);

-- ============================================
-- 4. STOCK_HISTORY TABLE
-- ============================================
CREATE TABLE stock_history (
    history_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    stock_date DATE NOT NULL,
    quantity_added INTEGER DEFAULT 0 CHECK (quantity_added >= 0),
    quantity_sold INTEGER DEFAULT 0 CHECK (quantity_sold >= 0),
    closing_balance INTEGER NOT NULL CHECK (closing_balance >= 0),
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

CREATE INDEX idx_stock_history_product_date ON stock_history(product_id, stock_date DESC);
CREATE INDEX idx_stock_history_date ON stock_history(stock_date DESC);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT valid_status CHECK (current_status IN ('pending', 'confirmed', 'out_for_delivery', 'completed', 'cancelled'))
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(current_status);
CREATE INDEX idx_orders_date ON orders(order_date DESC);

-- ============================================
-- 6. ORDER_ITEM TABLE
-- ============================================
CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT
);

CREATE INDEX idx_order_item_order ON order_item(order_id);
CREATE INDEX idx_order_item_product ON order_item(product_id);

-- ============================================
-- 7. ORDER_STATUS_HISTORY TABLE
-- ============================================
CREATE TABLE order_status_history (
    history_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100),
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT valid_history_status CHECK (status IN ('pending', 'confirmed', 'out_for_delivery', 'completed', 'cancelled'))
);

CREATE INDEX idx_order_status_history_order ON order_status_history(order_id, changed_at DESC);


-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Shared function: bump updated_at on any UPDATE
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Keeps current_stock.last_updated accurate whenever stock changes
CREATE OR REPLACE FUNCTION fn_touch_stock_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-creates a zero-stock row whenever a new product is added,
-- so the baker never has to manually create the stock entry.
CREATE OR REPLACE FUNCTION fn_init_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO current_stock (product_id, quantity_available)
    VALUES (NEW.product_id, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Blocks an order_item insert if stock is insufficient.
-- Acts as a DB-level safety net on top of the app-layer check.
CREATE OR REPLACE FUNCTION fn_check_stock_before_order_item()
RETURNS TRIGGER AS $$
DECLARE
    available INTEGER;
BEGIN
    SELECT quantity_available INTO available
    FROM current_stock
    WHERE product_id = NEW.product_id;

    IF available IS NULL THEN
        RAISE EXCEPTION 'No stock record found for product %', NEW.product_id;
    END IF;

    IF available < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %',
            NEW.product_id, available, NEW.quantity;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- TRIGGERS
-- ============================================

-- updated_at timestamps
CREATE TRIGGER trg_product_updated_at
    BEFORE UPDATE ON product
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- current_stock.last_updated
CREATE TRIGGER trg_stock_last_updated
    BEFORE UPDATE ON current_stock
    FOR EACH ROW EXECUTE FUNCTION fn_touch_stock_last_updated();

-- Auto-create stock row on new product
CREATE TRIGGER trg_init_product_stock
    AFTER INSERT ON product
    FOR EACH ROW EXECUTE FUNCTION fn_init_product_stock();

-- Stock availability check before order item insert
CREATE TRIGGER trg_check_stock_before_order_item
    BEFORE INSERT ON order_item
    FOR EACH ROW EXECUTE FUNCTION fn_check_stock_before_order_item();


-- ============================================
-- VIEWS
-- ============================================

CREATE VIEW products_with_stock AS
SELECT
    p.product_id,
    p.name,
    p.description,
    p.image_url,
    p.base_price,
    p.category,
    p.is_active,
    COALESCE(cs.quantity_available, 0) AS quantity_available,
    cs.last_restocked
FROM product p
LEFT JOIN current_stock cs ON p.product_id = cs.product_id
WHERE p.is_active = TRUE;

CREATE VIEW order_details AS
SELECT
    o.order_id,
    o.user_id,
    u.name AS customer_name,
    u.phone AS customer_phone,
    o.order_date,
    o.current_status,
    o.total_amount,
    oi.product_id,
    p.name AS product_name,
    p.image_url,
    oi.quantity,
    oi.unit_price,
    oi.subtotal
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN order_item oi ON o.order_id = oi.order_id
JOIN product p ON oi.product_id = p.product_id;


-- ============================================
-- SAMPLE DATA
-- ============================================

-- Products (stock rows auto-created by trg_init_product_stock)
INSERT INTO product (name, description, image_url, base_price, category) VALUES
('Sourdough Loaf',  'Traditional sourdough with crispy crust', NULL, 6.50, 'sourdough'),
('Whole Wheat',     'Healthy whole grain bread',               NULL, 5.00, 'whole wheat'),
('French Baguette', 'Classic crispy baguette',                 NULL, 4.00, 'baguette'),
('Rye Bread',       'Dense and flavorful rye',                 NULL, 5.50, 'rye'),
('Ciabatta',        'Italian style with olive oil',            NULL, 6.00, 'italian');

-- Set actual opening stock quantities
UPDATE current_stock SET quantity_available = 20, last_restocked = CURRENT_DATE WHERE product_id = 1;
UPDATE current_stock SET quantity_available = 15, last_restocked = CURRENT_DATE WHERE product_id = 2;
UPDATE current_stock SET quantity_available = 30, last_restocked = CURRENT_DATE WHERE product_id = 3;
UPDATE current_stock SET quantity_available = 10, last_restocked = CURRENT_DATE WHERE product_id = 4;
UPDATE current_stock SET quantity_available = 12, last_restocked = CURRENT_DATE WHERE product_id = 5;

INSERT INTO users (name, phone, address) VALUES
('John Doe', '+1234567890', '123 Main St, City');


-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Stores customer information. phone is UNIQUE — one record per customer.';
COMMENT ON TABLE product IS 'Catalog of all products';
COMMENT ON TABLE current_stock IS 'Real-time inventory levels. Auto-created on product insert.';
COMMENT ON TABLE stock_history IS 'Historical stock movements and sales';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE order_item IS 'Individual items within each order';
COMMENT ON TABLE order_status_history IS 'Audit trail of order status changes';

COMMENT ON FUNCTION fn_init_product_stock() IS 'Auto-creates a current_stock row (qty=0) for every new product';
COMMENT ON FUNCTION fn_check_stock_before_order_item() IS 'Rejects order_item inserts when stock is insufficient';
COMMENT ON FUNCTION fn_touch_stock_last_updated() IS 'Keeps current_stock.last_updated accurate on every update';
