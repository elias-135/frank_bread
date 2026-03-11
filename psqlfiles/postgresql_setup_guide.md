# PostgreSQL Setup Guide - Bread Ordering System

## Prerequisites
- PostgreSQL installed (version 12 or higher recommended)
- psql command-line tool or pgAdmin GUI

## Step 1: Create Database

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create the database
CREATE DATABASE bread_ordering_db;

# Connect to the new database
\c bread_ordering_db

# Exit psql
\q
```

## Step 2: Run the Schema File

```bash
# Execute the schema file
psql -U postgres -d bread_ordering_db -f bread_ordering_schema.sql
```

OR if you're already in psql:
```sql
\c bread_ordering_db
\i bread_ordering_schema.sql
```

## Step 3: Verify Database Creation

```bash
# Connect to the database
psql -U postgres -d bread_ordering_db

# List all tables
\dt

# You should see:
# - users
# - bread_product
# - current_stock
# - stock_history
# - orders
# - order_item
# - order_status_history

# Check table structure
\d users
\d bread_product
\d orders

# View sample data
SELECT * FROM bread_product;
SELECT * FROM products_with_stock;
```

## Step 4: Common Queries and Operations

### Check Available Products with Stock
```sql
SELECT * FROM products_with_stock;
```

### Place an Order (Transaction Example)
```sql
BEGIN;

-- 1. Create the order
INSERT INTO orders (user_id, total_amount, current_status)
VALUES (1, 17.50, 'pending')
RETURNING order_id;
-- Let's say this returns order_id = 1

-- 2. Add order items
INSERT INTO order_item (order_id, bread_product_id, quantity, unit_price, subtotal)
VALUES 
    (1, 1, 2, 6.50, 13.00),  -- 2 Sourdough
    (1, 3, 1, 4.00, 4.00);    -- 1 Baguette

-- 3. Update stock
UPDATE current_stock 
SET quantity_available = quantity_available - 2
WHERE bread_product_id = 1;

UPDATE current_stock 
SET quantity_available = quantity_available - 1
WHERE bread_product_id = 3;

-- 4. Record initial status
INSERT INTO order_status_history (order_id, status, changed_by)
VALUES (1, 'pending', 'system');

COMMIT;
```

### Update Order Status
```sql
BEGIN;

UPDATE orders 
SET current_status = 'confirmed'
WHERE order_id = 1;

INSERT INTO order_status_history (order_id, status, changed_by, notes)
VALUES (1, 'confirmed', 'baker_admin', 'Order confirmed and being prepared');

COMMIT;
```

### Daily Stock Restock
```sql
BEGIN;

-- Add 30 new sourdough loaves
UPDATE current_stock
SET quantity_available = quantity_available + 30,
    last_restocked = CURRENT_DATE
WHERE bread_product_id = 1;

-- Record in history
INSERT INTO stock_history (bread_product_id, stock_date, quantity_added, closing_balance)
VALUES (1, CURRENT_DATE, 30, (SELECT quantity_available FROM current_stock WHERE bread_product_id = 1));

COMMIT;
```

### Get User's Order History
```sql
SELECT 
    o.order_id,
    o.order_date,
    o.current_status,
    o.total_amount,
    bp.bread_name,
    oi.quantity,
    oi.unit_price
FROM orders o
JOIN order_item oi ON o.order_id = oi.order_id
JOIN bread_product bp ON oi.bread_product_id = bp.bread_product_id
WHERE o.user_id = 1
ORDER BY o.order_date DESC;
```

### View Order Status History
```sql
SELECT 
    osh.status,
    osh.changed_by,
    osh.notes,
    osh.changed_at
FROM order_status_history osh
WHERE osh.order_id = 1
ORDER BY osh.changed_at;
```

### Daily Sales Report
```sql
SELECT 
    bp.bread_name,
    SUM(oi.quantity) as total_sold,
    SUM(oi.subtotal) as total_revenue
FROM order_item oi
JOIN orders o ON oi.order_id = o.order_id
JOIN bread_product bp ON oi.bread_product_id = bp.bread_product_id
WHERE DATE(o.order_date) = CURRENT_DATE
  AND o.current_status != 'cancelled'
GROUP BY bp.bread_name
ORDER BY total_revenue DESC;
```

### Low Stock Alert
```sql
SELECT 
    bp.bread_name,
    cs.quantity_available
FROM bread_product bp
JOIN current_stock cs ON bp.bread_product_id = cs.bread_product_id
WHERE cs.quantity_available < 5
  AND bp.is_active = TRUE;
```

## Step 5: Create Database User (Recommended for Production)

```sql
-- Create a dedicated user for the application
CREATE USER bread_app WITH PASSWORD 'your_secure_password';

-- Grant permissions
GRANT CONNECT ON DATABASE bread_ordering_db TO bread_app;
GRANT USAGE ON SCHEMA public TO bread_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO bread_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO bread_app;

-- Make grants apply to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO bread_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO bread_app;
```

## Step 6: Connection String for Your Application

```
postgresql://bread_app:your_secure_password@localhost:5432/bread_ordering_db
```

## Backup and Restore

### Backup
```bash
pg_dump -U postgres bread_ordering_db > bread_ordering_backup.sql
```

### Restore
```bash
psql -U postgres bread_ordering_db < bread_ordering_backup.sql
```

## Performance Tips

1. **Regular VACUUM**: PostgreSQL needs periodic maintenance
```sql
VACUUM ANALYZE;
```

2. **Monitor slow queries**:
```sql
-- Enable slow query logging in postgresql.conf
log_min_duration_statement = 1000  -- Log queries taking > 1 second
```

3. **Add indexes** as your data grows based on query patterns

## Troubleshooting

### Can't connect to PostgreSQL?
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Permission denied?
```sql
-- Grant yourself superuser (if needed)
ALTER USER your_username WITH SUPERUSER;
```

### Reset all data (CAREFUL - deletes everything!)
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Then run schema file again
```

## Next Steps

1. ✅ Database is set up
2. Connect from your application (Node.js, Python, etc.)
3. Implement API endpoints
4. Add authentication/authorization
5. Build frontend interface
