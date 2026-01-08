-- Update a specific contract with sample links to test the UI
UPDATE contracts
SET 
    "fileUrl" = 'https://example.com/hop-dong-mau.pdf',
    "driveLink" = 'https://drive.google.com/drive/folders/sample-link'
WHERE code = '41/PPXD-CICHĐ2018';

-- Verify the update
SELECT code, "fileUrl", "driveLink" FROM contracts WHERE code = '41/PPXD-CICHĐ2018';
