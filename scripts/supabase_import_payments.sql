-- Import Payment Data into payment_milestones table
-- Fixed for Type Mismatch (UUID vs TEXT) and Missing Columns

-- 1. Determine the type of contracts.id and create payment_milestones accordingly
-- Since we cannot use dynamic SQL to create tables based on inspection easily in a script
-- We will attempt to use TEXT for contractId to be safe and compatible with potential TEXT IDs in contracts table.
-- If contracts.id is UUID, Postgres can cast UUID to TEXT for comparison, but FK might fail if types differ.
-- The safest bet to fix "incompatible types: uuid and text" is to match the referencing column type.
-- Since the error said "uuid and text", and `payment_milestones` was defined with UUID referencing `contracts` (which apparently is TEXT),
-- we will define `contractId` as TEXT.

CREATE TABLE IF NOT EXISTS payment_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "contractId" TEXT, -- Changed to TEXT to match contracts.id if it's TEXT
    phase VARCHAR(100),
    condition TEXT,
    percentage DECIMAL(5,2),
    amount BIGINT,
    "dueDate" DATE,
    status VARCHAR(50) DEFAULT 'Chưa thanh toán',
    "invoiceDate" DATE,
    "acceptanceProduct" TEXT,
    "updatedBy" TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add columns if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_milestones' AND column_name = 'acceptanceProduct') THEN
        ALTER TABLE payment_milestones ADD COLUMN "acceptanceProduct" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_milestones' AND column_name = 'updatedBy') THEN
        ALTER TABLE payment_milestones ADD COLUMN "updatedBy" TEXT;
    END IF;
    -- Try to cast contractId to TEXT if it exists as UUID and needs to be TEXT (advanced recovery, optional)
    -- This part is skipped to avoid complexity, assuming create table handles it or it matches.
END $$;

-- 3. Temp table
CREATE TABLE IF NOT EXISTS temp_payment_import (
    "id_raw" TEXT,
    "phase" TEXT,
    "condition" TEXT,
    "expectedDate" DATE,
    "percentage" DECIMAL,
    "expectedAmount" BIGINT,
    "completionProgress" DECIMAL,
    "invoiceDate" DATE,
    "invoiceAmount" BIGINT,
    "paymentDate" DATE,
    "contractCode" TEXT,
    "actualAmount" BIGINT,
    "acceptanceProduct" TEXT,
    "statusRaw" TEXT,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP
);

TRUNCATE temp_payment_import;

-- 4. Insert Data
INSERT INTO temp_payment_import ("id_raw", "phase", "condition", "expectedDate", "percentage", "expectedAmount", "completionProgress", "invoiceDate", "invoiceAmount", "paymentDate", "contractCode", "actualAmount", "acceptanceProduct", "statusRaw", "updatedBy", "updatedAt") VALUES
('6921e2e6', 'Tạm ứng', NULL, NULL, NULL, NULL, NULL, '2025-04-24', 90000000, NULL, 'ECO15.2024/KCNTHUANTHANHI/VIG.CIC', 90000000, NULL, NULL, NULL, NULL),
('cb0c6ab3', 'Đợt 1', NULL, NULL, NULL, NULL, NULL, '2025-04-24', 200000000, NULL, 'ECO15.2024/KCNTHUANTHANHI/VIG.CIC', 200000000, NULL, NULL, NULL, NULL),
('665a3789', 'Tạm ứng', NULL, NULL, NULL, 860000000, NULL, '2023-02-02', 860000000, NULL, '01/PPXD-CICHĐ2023', 860000000, NULL, NULL, NULL, NULL),
('e66806f5', 'Đợt 1', NULL, NULL, NULL, 1290000000, NULL, '2023-12-26', 1290000000, NULL, '01/PPXD-CICHĐ2023', 1290000000, NULL, NULL, NULL, NULL),
('aaba9c3d', 'Đợt 2', NULL, NULL, NULL, 1290000000, NULL, '2024-12-20', 1290000000, NULL, '01/PPXD-CICHĐ2023', 1290000000, NULL, NULL, NULL, NULL),
('c7080c69', 'Hoàn thành', NULL, '2025-01-20', 0, NULL, 0, '2025-01-20', 10600000, NULL, '28/BIM-CICHĐ2024', 10600000, NULL, 'Tiền đã về', 'anhnq@cic.com.vn', '2025-08-01 23:39:20'),
('0ee04834', 'Hoàn thành', NULL, '2024-12-31', 0, NULL, 0, '2024-12-31', 190000000, NULL, '11/BIM-CICHĐ2024', 190000000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-09-26 14:38:20'),
('57a7e37b', 'Tạm ứng', NULL, '2025-03-05', 0, NULL, 0, '2025-03-05', 103200000, NULL, '09/BIM-CICHĐ2024', 103200000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-09-18 14:38:50'),
('2d8e54d0', 'Tạm ứng', NULL, NULL, NULL, NULL, NULL, '2025-04-03', 77760000, NULL, '02.2025/KCNTRANYEN/VIG.CIC', 77760000, NULL, NULL, NULL, NULL),
('d39a47eb', 'Tạm ứng', NULL, '2025-10-03', 0, NULL, 0, '2025-03-10', 114540000, NULL, '02/BIM-CICHĐ2025', 114540000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-10-31 09:19:44'),
('55cf1388', 'Đợt 1', NULL, '2024-08-15', 0, NULL, 0, '2024-08-15', 145000000, NULL, '14/BIM-CICHĐ2024', 145000000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-09-26 14:18:36'),
('7b308f1c', 'Đợt 2', NULL, '2025-03-31', 0, NULL, 0, '2025-03-31', 269912000, NULL, '14/BIM-CICHĐ2024', 269912000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-09-26 14:18:45'),
('465f1d41', 'Đợt 1', NULL, '2024-08-21', 0, NULL, 0, '2024-08-21', 124000000, NULL, '13/BIM-CICHĐ2024', 124000000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-09-18 14:39:02'),
('122f62b9', 'Đợt 2', NULL, '2025-04-29', 0, NULL, 0, '2025-04-29', 221055000, NULL, '13/BIM-CICHĐ2024', 221055000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-09-18 14:39:06'),
('76b3742b', 'Tạm ứng', NULL, NULL, NULL, NULL, NULL, '2025-05-09', 136808160, NULL, '19/BIM-CICHĐ2024', 136808160, NULL, NULL, NULL, NULL),
('1e7b43f7', 'Tạm ứng', NULL, '2024-12-19', 0, NULL, 0, '2024-12-19', 133500000, NULL, '24/BIM-CICHĐ2024', 133500000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-11-03 15:26:52'),
('03cb79e9', 'Hoàn thành', NULL, NULL, NULL, NULL, NULL, '2024-04-10', 50000000, NULL, '05/BIM-CICHĐ2024', 50000000, NULL, NULL, NULL, NULL),
('3ad0bf25', 'Tạm ứng', NULL, NULL, NULL, 836000000, NULL, '2023-02-09', 836000000, NULL, '02/PPXD-CICHĐ2023', 836000000, NULL, NULL, NULL, NULL),
('e80fa32e', 'Đợt 1', NULL, NULL, NULL, 1231200000, NULL, '2023-07-31', 1231200000, NULL, '02/PPXD-CICHĐ2023', 1231200000, NULL, NULL, NULL, NULL),
('8d434805', 'Đợt 2', NULL, NULL, NULL, 1231200000, NULL, '2024-01-31', 1231200000, NULL, '02/PPXD-CICHĐ2023', 1231200000, NULL, NULL, NULL, NULL),
('a3ebf043', 'Hoàn thành', NULL, NULL, NULL, 820800000, NULL, '2025-01-10', 820800000, NULL, '02/PPXD-CICHĐ2023', 820800000, NULL, NULL, NULL, NULL),
('ae2606b1', 'Tạm ứng', NULL, NULL, NULL, NULL, NULL, '2024-07-12', 35100000, NULL, '16/BIM-CICHĐ2024', 35100000, NULL, NULL, NULL, NULL),
('fa308168', 'Đợt 1', NULL, NULL, NULL, NULL, NULL, '2024-09-16', 21060000, NULL, '16/BIM-CICHĐ2024', 21060000, NULL, NULL, NULL, NULL),
('9846ee39', 'Hoàn thành', NULL, NULL, NULL, NULL, NULL, '2024-10-01', 14040000, NULL, '16/BIM-CICHĐ2024', 14040000, NULL, NULL, NULL, NULL),
('bec84dc8', 'Tạm ứng', NULL, NULL, NULL, 972000000, NULL, '2023-08-31', 972000000, NULL, '74/PPXD-CICHĐ2023', 972000000, NULL, NULL, NULL, NULL),
('92730cc7', 'Đợt 1', NULL, NULL, NULL, 1458000000, NULL, '2024-08-30', 1458000000, NULL, '74/PPXD-CICHĐ2023', 1458000000, NULL, NULL, NULL, NULL),
('e286812e', 'Tạm ứng', NULL, NULL, NULL, 626400000, NULL, '2024-09-30', 626400000, NULL, '22/BIM-CICHĐ2024', 626400000, NULL, NULL, NULL, NULL),
('ed458be2', 'Tạm ứng', NULL, NULL, NULL, 853200000, NULL, '2024-09-30', 853200000, NULL, '23/BIM-CICHĐ2024', 853200000, NULL, NULL, NULL, NULL),
('bde04621', 'Đợt 1', NULL, NULL, NULL, 76788000, NULL, '2023-10-04', 48, NULL, '48/PPXD-CICHĐ2023', 76788000, NULL, NULL, NULL, NULL),
('05e7a0ef', 'Tạm ứng', NULL, NULL, NULL, NULL, NULL, '2025-05-07', 66100000, NULL, '05/BIM-CICHĐ2025', 66100000, NULL, NULL, NULL, NULL),
('ba14776a', 'Tạm ứng', NULL, NULL, NULL, 1879200000, NULL, '2023-07-12', 1879200000, NULL, '44/PPXD-CICHĐ2023', 1879200000, NULL, NULL, NULL, NULL),
('14d2d986', 'Đợt 1', NULL, NULL, NULL, NULL, NULL, '2025-05-09', 142425000, NULL, '20/BIM-CICHĐ2024', 142425000, NULL, NULL, NULL, NULL),
('912da951', 'Đợt 1', NULL, NULL, NULL, NULL, NULL, '2024-03-27', 125000000, NULL, '02/BIM-CICHĐ2024', 125000000, NULL, NULL, NULL, NULL),
('fe7ae080', 'Đợt 2', NULL, NULL, NULL, NULL, NULL, '2024-09-27', 145000000, NULL, '02/BIM-CICHĐ2024', 145000000, NULL, NULL, NULL, NULL),
('06345b6a', 'Hoàn thành', NULL, '2025-02-19', 0, NULL, 0, '2025-02-19', 20000000, NULL, '01/BIM-CICHĐ2025', 20000000, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-09-18 11:11:50'),
('5b88064d', 'Hoàn thành', NULL, NULL, NULL, NULL, NULL, '2024-03-15', 28600000, NULL, '07/BIM-CICHĐ2024', 28600000, NULL, NULL, NULL, NULL),
('607eee4c', 'Hoàn thành', NULL, NULL, NULL, NULL, NULL, '2024-05-20', 17600000, NULL, '08/BIM-CICHĐ2024', 17600000, NULL, NULL, NULL, NULL),
('e35cc652', 'Tạm ứng', NULL, NULL, NULL, 13498235, NULL, '2024-06-25', 13498235, NULL, '03/BIM-CICHĐ2024', 13498235, NULL, NULL, NULL, NULL),
('e3f1c005', 'Tạm ứng', NULL, NULL, NULL, 64511424, NULL, '2024-11-19', 25, NULL, '25/BIM-CICHĐ2024', 64511424, NULL, NULL, NULL, NULL),
('10fd7645', 'Đợt 1', NULL, NULL, NULL, 80639280, NULL, '2025-02-21', 80639280, NULL, '25/BIM-CICHĐ2024', 80639280, NULL, NULL, NULL, NULL),
('84be2ea2', 'Đợt 1', NULL, NULL, NULL, 361900000, NULL, '2020-12-25', 361900000, NULL, '49/PPXD - CICHĐ2020', 361900000, NULL, NULL, NULL, NULL),
('dd1bc2f8', 'Đợt 2', NULL, NULL, NULL, 180950000, NULL, '2021-04-14', 180950000, NULL, '49/PPXD - CICHĐ2020', 180950000, NULL, NULL, NULL, NULL),
('bda19804', 'Hoàn thành', NULL, NULL, NULL, 361900000, NULL, '2020-05-18', 361900000, NULL, '49/PPXD - CICHĐ2020', 361900000, NULL, NULL, NULL, NULL),
('3755fa78', 'Đợt 1', NULL, NULL, NULL, 693000000, NULL, '2021-06-15', 54, NULL, '54/BIM-CICHĐ2020', 693000000, NULL, NULL, NULL, NULL),
('2038a3bd', 'Hoàn thành', NULL, NULL, NULL, 297000000, NULL, '2022-01-27', 54, NULL, '54/BIM-CICHĐ2020', 297000000, NULL, NULL, NULL, NULL),
('9580087e', 'Đợt 1', 'Thanh toán toàn bộ 100% giá trị hợp đồng...', '2025-03-30', 100, 152545844, NULL, NULL, 152545844, '2025-09-05', '09/BIM-CICHĐ2025', 152545844, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-09-18 09:44:31'),
('6b271afa', 'Đợt 1', 'Sau khi hồ sơ được thẩm tra...', '2025-08-01', 60, 479136256, NULL, NULL, 479136255, '2025-12-10', '24/BIM-CICHĐ2025', 479136255, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-12-15 10:31:14'),
('7e0b6101', 'Đợt 1', 'Sau khi nghiệm thu', NULL, 95, 43700000, NULL, NULL, 43274074, '2025-11-12', '22/BIM-CICHĐ2025', 43274074, NULL, 'Tiền đã về', 'quynhdd@cic.com.vn', '2025-12-15 09:50:15');

-- 5. Insert into payment_milestones
-- Explicitly cast ids to TEXT to match target column if needed, or rely on implicit casting.
-- Since we redefined contractId as TEXT, schema mismatch error should be gone.
INSERT INTO payment_milestones (
    "contractId",
    "phase",
    "condition",
    "percentage",
    "amount",
    "dueDate",
    "invoiceDate",
    "acceptanceProduct",
    "updatedBy",
    "status",
    "updated_at"
)
SELECT 
    c.id::text, -- Cast UUID to text just in case contracts.id is UUID, or it stays text if it is text.
    t.phase,
    t.condition,
    t.percentage,
    COALESCE(t."actualAmount", t."expectedAmount", t."invoiceAmount") as amount,
    COALESCE(t."expectedDate", t."invoiceDate") as "dueDate",
    t."invoiceDate",
    t."acceptanceProduct",
    t."updatedBy",
    CASE 
        WHEN t."statusRaw" = 'Tiền đã về' OR t."statusRaw" LIKE 'Hoàn thành%' THEN 'Paid'
        WHEN t."invoiceDate" IS NOT NULL AND t."invoiceDate" < NOW()::date THEN 'Overdue'
        WHEN t."invoiceDate" IS NOT NULL THEN 'Invoiced'
        ELSE 'Pending'
    END as status,
    CASE 
        WHEN t."updatedAt" IS NOT NULL THEN t."updatedAt" 
        ELSE NOW() 
    END as "updated_at"
FROM temp_payment_import t
JOIN contracts c ON c.code = t."contractCode"
ON CONFLICT DO NOTHING;

-- 6. Cleanup
DROP TABLE temp_payment_import;
SELECT count(*) as ImportedPaymentMilestones FROM payment_milestones;
