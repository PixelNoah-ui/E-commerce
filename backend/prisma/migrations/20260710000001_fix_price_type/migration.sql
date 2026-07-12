-- Convert Product.price from text to numeric
ALTER TABLE "Product"
ALTER COLUMN "price" TYPE NUMERIC(10,2) USING price::numeric;
