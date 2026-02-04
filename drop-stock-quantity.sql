-- Drop stock_quantity column from products table
-- Run this in your Supabase SQL Editor

-- Drop the column
ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;
