ALTER TABLE bills
ADD COLUMN referring_doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL;

CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    referral_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tenant_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referrals_updated_at
BEFORE UPDATE ON referrals
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

-- Index for faster lookups
CREATE INDEX idx_referrals_doctor_id ON referrals(doctor_id);
CREATE INDEX idx_referrals_patient_id ON referrals(patient_id);
CREATE INDEX idx_referrals_bill_id ON referrals(bill_id);
CREATE INDEX idx_referrals_tenant_id ON referrals(tenant_id);
