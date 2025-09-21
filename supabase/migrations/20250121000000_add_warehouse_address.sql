-- Add warehouse_address column to settings table
-- Migration to support warehouse address field in settings

USE menggeris_db;

-- Add warehouse_address column to settings table
ALTER TABLE settings 
ADD COLUMN warehouse_address TEXT AFTER address;

-- Update existing settings with default warehouse address if needed
UPDATE settings 
SET warehouse_address = 'Jl.M.T Haryono No.50, RT.01, Desa Loh Sumber, Kec. Loa Kulu, Kutai Kartanegara75571'
WHERE warehouse_address IS NULL OR warehouse_address = '';

-- Verify the column was added
DESCRIBE settings;
