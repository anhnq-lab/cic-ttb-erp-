
-- Create Payment Milestones Table
CREATE TABLE IF NOT EXISTS payment_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "contractId" TEXT REFERENCES contracts(id) ON DELETE CASCADE,
    phase VARCHAR(100),
    condition TEXT,
    percentage DECIMAL(5,2),
    amount BIGINT,
    "dueDate" DATE,
    status VARCHAR(50) DEFAULT 'Chưa thanh toán',
    "invoiceDate" DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "contractId" TEXT REFERENCES contracts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount BIGINT NOT NULL,
    description TEXT,
    method VARCHAR(50) CHECK (method IN ('Bank Transfer', 'Cash')),
    "invoiceNumber" VARCHAR(100),
    status VARCHAR(50) CHECK (status IN ('Completed', 'Pending')) DEFAULT 'Pending',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_payment_milestones_contract ON payment_milestones("contractId");
CREATE INDEX IF NOT EXISTS idx_payment_transactions_contract ON payment_transactions("contractId");

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE payment_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_transactions;
