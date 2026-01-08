-- Add fileUrl and driveLink columns to contracts table
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS "fileUrl" TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS "driveLink" TEXT;

-- Verify columns are added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contracts' AND column_name IN ('fileUrl', 'driveLink');

-- Sample update for testing (Optional - can be removed or commented out)
-- UPDATE contracts 
-- SET "fileUrl" = 'Hopdong_Files_/41-PPXD-CICHĐ2018.File.042048.pdf',
--     "driveLink" = 'https://drive.google.com/drive/u/0/folders/example'
-- WHERE code = '41/PPXD-CICHĐ2018';
