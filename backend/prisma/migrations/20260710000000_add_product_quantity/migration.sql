-- Add optional quantity column to Product
ALTER TABLE "Product"
ADD COLUMN "quantity" INTEGER DEFAULT 0;
