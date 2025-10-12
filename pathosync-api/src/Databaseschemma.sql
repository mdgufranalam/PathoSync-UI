-- ===============================================
-- HealthCare SaaS Database Setup Script
-- ===============================================
-- This script creates the complete database structure
-- for the multi-tenant healthcare laboratory management system

-- ===============================================
-- STEP 1: CREATE DATABASE AND EXTENSIONS
-- ===============================================

-- Note: Run this section as a superuser or database owner
-- CREATE DATABASE healthcare_saas;
-- \c healthcare_saas;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ===============================================
-- STEP 3: CREATE CORE TABLES
-- ===============================================

-- Create all tables in the correct dependency order
DROP TABLE IF EXISTS subscription_plans ;
-- 1. Subscription Plans (referenced by tenants)
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    monthly_price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2),
    setup_fee DECIMAL(10,2) DEFAULT 0,
    max_users INTEGER NOT NULL,
    max_patients INTEGER NOT NULL,
    max_tests_per_month INTEGER NOT NULL,
    max_reports_per_month INTEGER NOT NULL,
    max_storage_gb INTEGER NOT NULL,
    features JSONB NOT NULL DEFAULT '{}',
    api_calls_per_month INTEGER DEFAULT 0,
    webhook_endpoints INTEGER DEFAULT 0,
    support_level VARCHAR(50) DEFAULT 'email',
    sla_response_hours INTEGER DEFAULT 48,
    is_popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
DROP TABLE IF EXISTS tenants;
-- 2. Tenants (main isolation table)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    gst_number VARCHAR(20),
    pan_number VARCHAR(12),
    license_number VARCHAR(100),
    nabl_accreditation VARCHAR(100),
    iso_certification VARCHAR(100),
    subscription_plan VARCHAR(20) DEFAULT 'basic',
    subscription_status VARCHAR(20) DEFAULT 'trial',
    subscription_start_date TIMESTAMP DEFAULT NOW(),
    subscription_end_date TIMESTAMP,
    trial_end_date TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
    max_users INTEGER DEFAULT 5,
    max_patients INTEGER DEFAULT 1000,
    max_tests_per_month INTEGER DEFAULT 500,
    max_reports_per_month INTEGER DEFAULT 500,
    max_storage_gb INTEGER DEFAULT 1,
    features JSONB DEFAULT '{
        "whatsapp_integration": false,
        "sms_integration": false,
        "email_integration": true,
        "advanced_reports": false,
        "api_access": false,
        "custom_branding": false,
        "multi_location": false,
        "inventory_management": false,
        "appointment_booking": false,
        "telemedicine": false
    }',
    settings JSONB DEFAULT '{
        "language": "en",
        "currency": "INR",
        "timezone": "Asia/Kolkata",
        "date_format": "DD/MM/YYYY",
        "report_template": "standard",
        "auto_backup": true,
        "data_retention_days": 2555
    }',
    whatsapp_config JSONB DEFAULT '{}',
    email_config JSONB DEFAULT '{}',
    sms_config JSONB DEFAULT '{}',
    payment_gateway_config JSONB DEFAULT '{}',
    logo_url TEXT,
    letterhead_url TEXT,
    signature_url TEXT,
    brand_colors JSONB DEFAULT '{}',
    billing_address TEXT,
    billing_email VARCHAR(255),
    current_balance DECIMAL(12,2) DEFAULT 0.00,
    credit_limit DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    is_active BOOLEAN DEFAULT true,
    gdpr_compliant BOOLEAN DEFAULT false,
    hipaa_compliant BOOLEAN DEFAULT false,
    data_encryption_enabled BOOLEAN DEFAULT true
);
DROP TABLE IF EXISTS users ;
-- 3. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    employee_id VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    alternative_phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20) DEFAULT 'Male',
    role VARCHAR(50) NOT NULL DEFAULT 'Staff',
    department VARCHAR(100),
    designation VARCHAR(100),
    qualification VARCHAR(500),
    registration_number VARCHAR(100),
    experience_years INTEGER,
    joining_date DATE DEFAULT CURRENT_DATE,
    permissions JSONB DEFAULT '{}',
    allowed_modules JSONB DEFAULT '[]',
    working_hours JSONB DEFAULT '{}',
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    emergency_contact VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    account_locked BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    last_activity TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, email),
    UNIQUE(tenant_id, employee_id)
);
DROP TABLE IF EXISTS user_sessions ;
-- 4. User Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    refresh_expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    location JSONB,
    is_active BOOLEAN DEFAULT true,
    revoked_at TIMESTAMP,
    revoked_reason VARCHAR(255)
);
DROP TABLE IF EXISTS test_categories ;
-- 5. Test Categories
CREATE TABLE test_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES test_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_code VARCHAR(50),
    icon VARCHAR(100),
    color VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, name),
    UNIQUE(tenant_id, category_code)
);
DROP TABLE IF EXISTS tests ;
-- 6. Tests
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    test_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    alias_names TEXT[],
    test_type VARCHAR(50) NOT NULL DEFAULT 'normal',
    category_id UUID REFERENCES test_categories(id),
    parent_test_id UUID REFERENCES tests(id),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    emergency_surcharge_percentage DECIMAL(5,2) DEFAULT 0,
    unit VARCHAR(50),
    method VARCHAR(255),
    principle TEXT,
    formula TEXT,
    calculation_logic TEXT,
    reference_ranges JSONB DEFAULT '[]',
    sample_type VARCHAR(100),
    sample_volume VARCHAR(100),
    sample_container VARCHAR(100),
    sample_collection_instructions TEXT,
    storage_condition VARCHAR(255),
    storage_temperature VARCHAR(50),
    specimen_stability VARCHAR(255),
    reporting_time INTEGER DEFAULT 24,
    tat_emergency INTEGER DEFAULT 2,
    processing_time INTEGER DEFAULT 4,
    is_outsourced BOOLEAN DEFAULT false,
    outsource_lab VARCHAR(255),
    outsource_cost DECIMAL(10,2),
    outsource_tat INTEGER,
    requires_fasting BOOLEAN DEFAULT false,
    fasting_hours INTEGER,
    special_instructions TEXT,
    contraindications TEXT,
    interfering_substances TEXT,
    clinical_significance TEXT,
    disease_associations TEXT[],
    interpretation_guide TEXT,
    default_template TEXT,
    default_impression TEXT,
    default_recommendations TEXT,
    sort_order INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    is_profile_test BOOLEAN DEFAULT false,
    nabl_scope BOOLEAN DEFAULT false,
    cap_approved BOOLEAN DEFAULT false,
    iso_compliant BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
   
    UNIQUE(tenant_id, test_code)
);
ALTER TABLE tests ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION tests_search_vector_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name,'')), '') ||
        setweight(to_tsvector('english', COALESCE(NEW.test_code,'')), '') ||
        setweight(to_tsvector('english', COALESCE(NEW.short_name,'')), '') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.alias_names,' '),'')), '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_tests_search_vector
BEFORE INSERT OR UPDATE ON tests
FOR EACH ROW EXECUTE FUNCTION tests_search_vector_trigger();
DROP TABLE IF EXISTS test_parameters ;
-- 7. Test Parameters
CREATE TABLE test_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    parameter_name VARCHAR(255) NOT NULL,
    parameter_code VARCHAR(50),
    unit VARCHAR(50),
    reference_ranges JSONB DEFAULT '[]',
    sort_order INTEGER DEFAULT 0,
    is_calculated BOOLEAN DEFAULT false,
    calculation_formula TEXT,
    is_critical BOOLEAN DEFAULT false,
    critical_low DECIMAL(10,4),
    critical_high DECIMAL(10,4),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
DROP TABLE IF EXISTS patients ;
-- 8. Patients
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id VARCHAR(50) NOT NULL,
    uhid VARCHAR(50),
    aadhaar_number VARCHAR(12),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    age_years INTEGER,
    age_months INTEGER,
    age_days INTEGER,
    gender VARCHAR(20) DEFAULT '',
    phone VARCHAR(20),
    alternative_phone VARCHAR(20),
    email VARCHAR(60),
    whatsapp_number VARCHAR(20),
    address VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    emergency_contact VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    emergency_relationship VARCHAR(50),
    blood_group VARCHAR(5),
    allergies TEXT,
    medical_history TEXT,
    current_medications TEXT,
    insurance_details JSONB DEFAULT '{}',
    government_scheme VARCHAR(100),
    scheme_id VARCHAR(100),
    occupation VARCHAR(100),
    education VARCHAR(100),
    marital_status VARCHAR(20),
    religion VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'Indian',
    preferred_language VARCHAR(20) DEFAULT 'en',
    communication_preference JSONB DEFAULT '{"whatsapp": true, "sms": true, "email": false}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    data_sharing_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    UNIQUE(tenant_id, patient_id)
);
DROP TABLE IF EXISTS doctors ;
-- 9. Doctors
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    doctor_code VARCHAR(50),
    registration_number VARCHAR(100),
    license_number VARCHAR(100),
    title VARCHAR(10) DEFAULT 'Dr.',
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    specialization VARCHAR(255),
    sub_specialization VARCHAR(255),
    qualification VARCHAR(500),
    experience_years INTEGER,
    phone VARCHAR(20),
    alternative_phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),
    clinic_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    medical_council_state VARCHAR(100),
    medical_council_number VARCHAR(100),
    consultation_fee DECIMAL(10,2),
    commission_percentage DECIMAL(5,2),
    working_days JSONB DEFAULT '[]',
    working_hours JSONB DEFAULT '{}',
    consultation_duration INTEGER DEFAULT 30,
    signature_url TEXT,
    stamp_url TEXT,
    bank_account_number VARCHAR(20),
    bank_ifsc VARCHAR(15),
    bank_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_visiting BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, doctor_code),
    UNIQUE(tenant_id, registration_number)
);
DROP TABLE IF EXISTS test_packages ;
-- 10. Test Packages
CREATE TABLE test_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    package_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    description TEXT,
    purpose TEXT,
    recommended_for TEXT,
    individual_price DECIMAL(10,2),
    package_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    savings_amount DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    validity_start DATE,
    validity_end DATE,
    fasting_required BOOLEAN DEFAULT false,
    special_instructions TEXT,
    age_group VARCHAR(50),
    gender_specific VARCHAR(20),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    UNIQUE(tenant_id, package_code)
);
DROP TABLE IF EXISTS package_tests ;
-- 11. Package Tests Mapping
CREATE TABLE package_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES test_packages(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_optional BOOLEAN DEFAULT false,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(package_id, test_id)
);
DROP TABLE IF EXISTS bills ;
-- 12. Bills
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    bill_number VARCHAR(50) NOT NULL,
    invoice_number VARCHAR(50),
    reference_number VARCHAR(100),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    referred_by VARCHAR(255),
    bill_date TIMESTAMP DEFAULT NOW(),
    due_date TIMESTAMP,
    sample_collection_date TIMESTAMP,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    cgst_percentage DECIMAL(5,2) DEFAULT 0,
    sgst_percentage DECIMAL(5,2) DEFAULT 0,
    igst_percentage DECIMAL(5,2) DEFAULT 0,
    cgst_amount DECIMAL(12,2) DEFAULT 0,
    sgst_amount DECIMAL(12,2) DEFAULT 0,
    igst_amount DECIMAL(12,2) DEFAULT 0,
    total_tax_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    round_off DECIMAL(5,2) DEFAULT 0,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    balance_amount DECIMAL(12,2) DEFAULT 0,
    advance_amount DECIMAL(12,2) DEFAULT 0,
    payment_status VARCHAR(30) DEFAULT 'pending',
    bill_status VARCHAR(30) DEFAULT 'active',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    upi_transaction_id VARCHAR(100),
    notes TEXT,
    internal_notes TEXT,
    terms_and_conditions TEXT,
    is_emergency BOOLEAN DEFAULT false,
    priority_level INTEGER DEFAULT 1,
    source VARCHAR(100),
    campaign_code VARCHAR(50),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    financial_year VARCHAR(10),
    UNIQUE(tenant_id, bill_number),
    UNIQUE(tenant_id, invoice_number)
);
DROP TABLE IF EXISTS bill_items ;
-- 13. Bill Items
CREATE TABLE bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('test', 'package', 'consultation', 'other')) DEFAULT 'test',
    test_id UUID REFERENCES tests(id),
    package_id UUID REFERENCES test_packages(id),
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(50),
    description TEXT,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    hsn_code VARCHAR(20),
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    is_emergency BOOLEAN DEFAULT false,
    requires_fasting BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    added_at TIMESTAMP DEFAULT NOW(),
    added_by UUID REFERENCES users(id)
);
DROP TABLE IF EXISTS collection_centers ;
-- 14. Collection Centers
CREATE TABLE collection_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Center identification
    center_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    
    -- Contact information
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternative_phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),
    
    -- Address details
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10) NOT NULL,
    
    -- Geographic coordinates for mapping
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Operational details
    working_hours JSONB DEFAULT '{}', -- {"start": "09:00", "end": "18:00", "days": ["monday", ...]}
    services_offered TEXT[], -- ["Blood Collection", "Urine Collection", "Home Collection"]
    collection_capacity INTEGER DEFAULT 50, -- samples per day
    
    -- Financial terms
    commission_percentage DECIMAL(5,2) DEFAULT 0,
    security_deposit DECIMAL(10,2) DEFAULT 0,
    monthly_rent DECIMAL(10,2) DEFAULT 0,
    
    -- Performance metrics
    total_samples_collected INTEGER DEFAULT 0,
    monthly_target INTEGER DEFAULT 500,
    last_sample_collection TIMESTAMP,
    
    -- Equipment and infrastructure
    has_centrifuge BOOLEAN DEFAULT false,
    has_refrigerator BOOLEAN DEFAULT true,
    has_sample_storage BOOLEAN DEFAULT true,
    storage_capacity INTEGER DEFAULT 100,
    
    -- Connectivity and logistics
    pickup_time_morning TIME DEFAULT '10:00',
    pickup_time_evening TIME DEFAULT '17:00',
    transport_partner VARCHAR(255),
    average_transit_time INTEGER DEFAULT 180, -- minutes
    
    -- Status and dates
    is_active BOOLEAN DEFAULT true,
    contract_start_date DATE,
    contract_end_date DATE,
    last_audit_date DATE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    UNIQUE(tenant_id, center_code),
    UNIQUE(tenant_id, name)
);
DROP TABLE IF EXISTS collection_center_staff ;
-- 15. Collection Center Staff Assignment
CREATE TABLE collection_center_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    center_id UUID NOT NULL REFERENCES collection_centers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Assignment details
    role VARCHAR(50) NOT NULL, -- manager, technician, collection_agent
    is_primary BOOLEAN DEFAULT false, -- primary contact for center
    shift_timing JSONB DEFAULT '{}',
    
    -- Permissions at center level
    can_collect_samples BOOLEAN DEFAULT true,
    can_process_billing BOOLEAN DEFAULT false,
    can_manage_inventory BOOLEAN DEFAULT false,
    
    -- Assignment period
    assigned_from DATE DEFAULT CURRENT_DATE,
    assigned_until DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    
    UNIQUE(center_id, user_id, assigned_from)
);
DROP TABLE IF EXISTS sample_movements ;
-- 16. Sample Movements and Tracking
CREATE TABLE sample_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Sample identification
    sample_id VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),
    batch_id VARCHAR(100), -- for grouping samples in same transport
    
    -- Related entities
    bill_id UUID REFERENCES bills(id),
    patient_id UUID REFERENCES patients(id),
    collection_center_id UUID NOT NULL REFERENCES collection_centers(id),
    
    -- Sample details
    sample_type VARCHAR(100), -- Blood, Urine, Stool, etc.
    container_type VARCHAR(100), -- Tube type, container specifications
    volume_collected VARCHAR(50),
    
    -- Tests associated
    test_ids UUID[], -- Array of test IDs
    test_names TEXT[], -- Array of test names for quick reference
    
    -- Movement timeline
    collected_at TIMESTAMP NOT NULL,
    collection_confirmed_at TIMESTAMP,
    dispatch_from_center_at TIMESTAMP,
    in_transit_at TIMESTAMP,
    received_at_lab_at TIMESTAMP,
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    
    -- Status tracking
    current_status VARCHAR(30) DEFAULT 'collected',
    priority VARCHAR(20) DEFAULT 'normal',
    is_delayed BOOLEAN DEFAULT false,
    delay_reason TEXT,
    
    -- Quality control
    sample_condition VARCHAR(100), -- Good, Hemolyzed, Clotted, etc.
    temperature_maintained BOOLEAN DEFAULT true,
    chain_of_custody JSONB DEFAULT '[]', -- Track who handled the sample
    
    -- Transport details
    transport_batch_number VARCHAR(100),
    transport_partner VARCHAR(255),
    vehicle_number VARCHAR(50),
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    
    -- Expected vs actual timing
    expected_lab_arrival TIMESTAMP,
    expected_result_completion TIMESTAMP,
    tat_hours INTEGER, -- Actual turnaround time
    
    -- GPS tracking
    pickup_location JSONB, -- {"lat": 19.0760, "lng": 72.8777}
    dropoff_location JSONB,
    route_tracked JSONB DEFAULT '[]', -- Array of GPS coordinates during transit
    
    -- Communication tracking
    patient_notified_collection BOOLEAN DEFAULT false,
    patient_notified_transit BOOLEAN DEFAULT false,
    patient_notified_received BOOLEAN DEFAULT false,
    
    -- Storage and handling
    storage_temperature VARCHAR(50),
    special_handling_requirements TEXT,
    refrigeration_required BOOLEAN DEFAULT false,
    
    -- Financial
    collection_charges DECIMAL(8,2) DEFAULT 0,
    transport_charges DECIMAL(8,2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    collected_by UUID REFERENCES users(id),
    received_by UUID REFERENCES users(id),
    
    UNIQUE(tenant_id, sample_id)
);
DROP TABLE IF EXISTS collection_center_metrics ;
-- 17. Collection Center Performance Metrics
CREATE TABLE collection_center_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    center_id UUID NOT NULL REFERENCES collection_centers(id) ON DELETE CASCADE,
    
    -- Metric period
    metric_date DATE NOT NULL,
    metric_month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM metric_date)) STORED,
    metric_year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM metric_date)) STORED,
    
    -- Sample collection metrics
    samples_collected INTEGER DEFAULT 0,
    samples_target INTEGER DEFAULT 0,
    collection_efficiency DECIMAL(5,2) DEFAULT 0, -- (collected/target) * 100
    
    -- Quality metrics
    samples_rejected INTEGER DEFAULT 0,
    samples_delayed INTEGER DEFAULT 0,
    quality_score DECIMAL(5,2) DEFAULT 100, -- Percentage
    
    -- Financial metrics
    revenue_generated DECIMAL(12,2) DEFAULT 0,
    commission_earned DECIMAL(12,2) DEFAULT 0,
    collection_charges DECIMAL(12,2) DEFAULT 0,
    
    -- Operational metrics
    average_collection_time INTEGER DEFAULT 15, -- minutes per sample
    patient_satisfaction_score DECIMAL(3,2) DEFAULT 5.0, -- out of 5
    complaints_count INTEGER DEFAULT 0,
    
    -- TAT metrics
    average_tat_hours DECIMAL(5,2) DEFAULT 24,
    samples_within_tat INTEGER DEFAULT 0,
    tat_compliance_percentage DECIMAL(5,2) DEFAULT 100,
    
    -- Staff metrics
    staff_count INTEGER DEFAULT 0,
    staff_utilization_percentage DECIMAL(5,2) DEFAULT 80,
    
    -- Infrastructure metrics
    equipment_uptime_percentage DECIMAL(5,2) DEFAULT 100,
    storage_utilization_percentage DECIMAL(5,2) DEFAULT 50,
    
    -- Calculated fields
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(tenant_id, center_id, metric_date)
);
DROP TABLE IF EXISTS collection_center_inventory;
-- 18. Collection Center Inventory (if needed)
CREATE TABLE collection_center_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    center_id UUID NOT NULL REFERENCES collection_centers(id) ON DELETE CASCADE,
    
    -- Item details
    item_type VARCHAR(100) NOT NULL, -- Tubes, Needles, Containers, etc.
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(50),
    specification TEXT,
    
    -- Stock details
    current_stock INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 10,
    maximum_stock INTEGER DEFAULT 100,
    unit_of_measurement VARCHAR(50) DEFAULT 'pieces',
    
    -- Cost
    unit_cost DECIMAL(8,2) DEFAULT 0,
    
    -- Expiry tracking
    has_expiry BOOLEAN DEFAULT true,
    expiry_date DATE,
    batch_number VARCHAR(100),
    
    -- Stock movements
    last_restocked_date DATE,
    last_restocked_quantity INTEGER DEFAULT 0,
    consumption_rate_per_day DECIMAL(8,2) DEFAULT 0,
    
    -- Alerts
    low_stock_alert BOOLEAN DEFAULT false,
    expiry_alert BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(tenant_id, center_id, item_code)
);

-- 19. Update Bills table to include collection center reference
ALTER TABLE bills ADD COLUMN collection_center_id UUID REFERENCES collection_centers(id);
ALTER TABLE bills ADD COLUMN is_home_collection BOOLEAN DEFAULT false;
ALTER TABLE bills ADD COLUMN collection_address TEXT;
ALTER TABLE bills ADD COLUMN collection_charges DECIMAL(8,2) DEFAULT 0;

-- 20. Update Patients table to include preferred collection center
ALTER TABLE patients ADD COLUMN preferred_collection_center_id UUID REFERENCES collection_centers(id);
ALTER TABLE patients ADD COLUMN prefers_home_collection BOOLEAN DEFAULT false;
DROP TABLE IF EXISTS lab_reports ;
-- Lab reports
CREATE TABLE lab_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    report_number VARCHAR(50) NOT NULL,
    bill_id UUID NOT NULL REFERENCES bills(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    sample_collected_at TIMESTAMP,
    sample_received_at TIMESTAMP,
    reported_at TIMESTAMP,
    verified_at TIMESTAMP,
    printed_at TIMESTAMP,
    delivered_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sample_pending', -- sample_pending, in_progress, completed, verified, printed, delivered
    clinical_history TEXT,
    impression TEXT,
    recommendations TEXT,
    technician_id UUID REFERENCES users(id),
    pathologist_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, report_number)
);
-- 21. Update Lab Reports to track collection center
ALTER TABLE lab_reports ADD COLUMN collection_center_id UUID REFERENCES collection_centers(id);
ALTER TABLE lab_reports ADD COLUMN sample_movement_id UUID REFERENCES sample_movements(id);

-- ===============================================
-- STEP 4: CREATE INDEXES
-- ===============================================

-- Tenant-based indexes
CREATE INDEX idx_users_tenant_id ON users(tenant_id) WHERE is_active = true;
CREATE INDEX idx_patients_tenant_id ON patients(tenant_id) WHERE is_active = true;
CREATE INDEX idx_tests_tenant_id ON tests(tenant_id) WHERE is_active = true;
CREATE INDEX idx_bills_tenant_id ON bills(tenant_id);
CREATE INDEX idx_collection_centers_tenant_id ON collection_centers(tenant_id) WHERE is_active = true;
CREATE INDEX idx_sample_movements_tenant_id ON sample_movements(tenant_id);

-- Search and lookup indexes
CREATE INDEX idx_patients_phone ON patients(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_patients_search ON patients USING gin(first_name gin_trgm_ops, last_name gin_trgm_ops);
CREATE INDEX idx_tests_search ON tests USING gin(search_vector);
CREATE INDEX idx_bills_bill_number ON bills(tenant_id, bill_number);

-- Status indexes
CREATE  INDEX idx_bills_payment_status ON bills(tenant_id, payment_status);
CREATE  INDEX idx_bills_financial_year ON bills(tenant_id, financial_year, bill_date);

-- Session management
CREATE  INDEX idx_user_sessions_token ON user_sessions(token) WHERE is_active = true;
CREATE  INDEX idx_user_sessions_user_active ON user_sessions(user_id, is_active, last_used_at DESC);

-- Collection Centers specific indexes
CREATE  INDEX idx_collection_centers_city_state ON collection_centers(city, state) WHERE is_active = true;
CREATE  INDEX idx_collection_centers_code ON collection_centers(tenant_id, center_code);
CREATE  INDEX idx_sample_movements_status ON sample_movements(tenant_id, current_status, collected_at DESC);
CREATE  INDEX idx_sample_movements_center ON sample_movements(collection_center_id, collected_at DESC);
CREATE  INDEX idx_sample_movements_batch ON sample_movements(batch_id) WHERE batch_id IS NOT NULL;
CREATE  INDEX idx_center_metrics_date ON collection_center_metrics(center_id, metric_date DESC);
CREATE  INDEX idx_center_staff_assignment ON collection_center_staff(center_id, user_id) WHERE is_active = true;

-- ===============================================
-- STEP 5: CREATE FUNCTIONS AND TRIGGERS
-- ===============================================

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collection_centers_updated_at BEFORE UPDATE ON collection_centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sample_movements_updated_at BEFORE UPDATE ON sample_movements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- STEP 6: INSERT SAMPLE DATA
-- ===============================================

-- Insert default subscription plans
--INSERT INTO subscription_plans (plan_code, name, description, monthly_price, yearly_price, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features) VALUES
--('basic', 'Basic Plan', 'Perfect for small clinics and individual practitioners', 2999.00, 29990.00, 5, 1000, 500, 500, 1, '{"whatsapp_integration": true, "sms_integration": true, "email_integration": true, "basic_reports": true}'),
--('standard', 'Standard Plan', 'Ideal for medium-sized laboratories and clinics', 7999.00, 79990.00, 15, 5000, 2000, 2000, 5, '{"whatsapp_integration": true, "sms_integration": true, "email_integration": true, "advanced_reports": true, "custom_templates": true, "api_access": true}'),
--('premium', 'Premium Plan', 'Comprehensive solution for large hospitals and lab chains', 15999.00, 159990.00, 50, 20000, 10000, 10000, 20, '{"whatsapp_integration": true, "sms_integration": true, "email_integration": true, "advanced_reports": true, "custom_templates": true, "api_access": true, "custom_branding": true, "multi_location": true, "inventory_management": true}'),
--('enterprise', 'Enterprise Plan', 'Full-featured solution for enterprise-level operations', 49999.00, 499990.00, 200, 100000, 50000, 50000, 100, '{"whatsapp_integration": true, "sms_integration": true, "email_integration": true, "advanced_reports": true, "custom_templates": true, "api_access": true, "custom_branding": true, "multi_location": true, "inventory_management": true, "telemedicine": true, "dedicated_support": true}');
--
---- Sample tenants with different subscription plans
--INSERT INTO tenants (id, name, subdomain, contact_person, email, phone, city, state, subscription_plan) VALUES
--('550e8400-e29b-41d4-a716-446655440000', 'Basic Clinic', 'basicclinic', 'Dr. Basic User', 'admin@basic.com', '+91-9876543210', 'Mumbai', 'Maharashtra', 'basic'),
--('550e8400-e29b-41d4-a716-446655440001', 'Standard Diagnostics', 'starterdiag', 'Dr. Starter User', 'admin@standard.com', '+91-9876543211', 'Delhi', 'Delhi', 'starter'),
--('550e8400-e29b-41d4-a716-446655440002', 'Professional Labs', 'prolabs', 'Dr. Professional User', 'admin@professional.com', '+91-9876543212', 'Bangalore', 'Karnataka', 'professional'),
--('550e8400-e29b-41d4-a716-446655440003', 'Enterprise Healthcare', 'enterprise', 'Dr. Enterprise User', 'admin@enterprise.com', '+91-9876543213', 'Chennai', 'Tamil Nadu', 'enterprise');
--
---- Sample admin users for different subscription plans
--INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, employee_id,gender) VALUES
--('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'admin@basic.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyq', 'Basic', 'User', 'tenant_admin', 'EMP001','male'),
--('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'admin@standard.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyq', 'Starter', 'User', 'tenant_admin', 'EMP002','female'),
--('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'admin@professional.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyq', 'Professional', 'User', 'tenant_admin', 'EMP003','male'),
--('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'admin@enterprise.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyq', 'Enterprise', 'User', 'tenant_admin', 'EMP004','male'),
--('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', 'tech@professional.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyq', 'Technician', 'Pro', 'technician', 'EMP005','male');
--
---- Sample test categories
--INSERT INTO test_categories (id, tenant_id, name, description, category_code) VALUES
--('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Hematology', 'Blood related tests', 'HEMA'),
--('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Biochemistry', 'Chemical analysis tests', 'BIOCHEM'),
--('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Microbiology', 'Infection and culture tests', 'MICRO'),
--('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Immunology', 'Immunity and allergy tests', 'IMMUNO'),
--('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Endocrinology', 'Hormone tests', 'ENDO');
--
---- Sample tests
--INSERT INTO tests (id, tenant_id, test_code, name, test_type, category_id, price, unit, reference_ranges) VALUES
--('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440000', 'HB', 'Hemoglobin', 'normal', '550e8400-e29b-41d4-a716-446655440001', 150.00, 'g/dl', '[{"name": "Male", "min": "13.5", "max": "17.5"}, {"name": "Female", "min": "12.0", "max": "16.0"}]'),
--('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440000', 'CBC', 'Complete Blood Count', 'group', '550e8400-e29b-41d4-a716-446655440001', 450.00, '', '[]');
--
---- Sample collection centers
--INSERT INTO collection_centers (id, tenant_id, center_code, name, contact_person, phone, email, address, city, state, pincode, commission_percentage, is_active) VALUES
--('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440000', 'CC001', 'PathoCare Collection Center - Andheri', 'Priya Sharma', '+91-9876543210', 'andheri@pathocare.com', '123, S.V. Road, Andheri West', 'Mumbai', 'Maharashtra', '400058', 15.00, true),
--('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440000', 'CC002', 'PathoCare Collection Center - Borivali', 'Raj Patel', '+91-9876543211', 'borivali@pathocare.com', '456, Link Road, Borivali East', 'Mumbai', 'Maharashtra', '400066', 12.00, true),
--('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440000', 'CC003', 'PathoCare Collection Center - Thane', 'Sunita Desai', '+91-9876543212', 'thane@pathocare.com', '789, Ghodbunder Road, Thane West', 'Thane', 'Maharashtra', '400601', 18.00, true);
--
---- Sample test parameters for CBC
--INSERT INTO test_parameters (tenant_id, test_id, parameter_name, unit, reference_ranges) VALUES
--('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440102', 'Hemoglobin', 'g/dl', '[{"name": "Male", "min": "13.5", "max": "17.5"}, {"name": "Female", "min": "12.0", "max": "16.0"}]'),
--('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440102', 'Total WBC Count', '/cmm', '[{"name": "All", "min": "4000", "max": "11000"}]'),
--('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440102', 'RBC Count', 'million/cmm', '[{"name": "Male", "min": "4.5", "max": "5.5"}, {"name": "Female", "min": "3.8", "max": "4.8"}]');
--
-- ===============================================
-- STEP 7: ENABLE ROW LEVEL SECURITY
-- ===============================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Create basic tenant isolation policies
-- Note: In production, you would implement proper JWT-based policies
CREATE  POLICY tenant_isolation_users ON users FOR ALL TO authenticated 
USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_patients ON patients FOR ALL TO authenticated 
USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- ===============================================
-- STEP 8: CREATE MAINTENANCE PROCEDURES
-- ===============================================

-- Data cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Clean up old sessions (older than 30 days)
    DELETE FROM user_sessions 
    WHERE created_at < NOW() - INTERVAL '30 days' 
    AND is_active = false;
    
    -- Log cleanup activity
    RAISE NOTICE 'Cleaned up old sessions';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');

-- ===============================================
-- COMPLETION MESSAGE
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'HealthCare SaaS Database Setup Complete!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Database: healthcare_saas';
    RAISE NOTICE 'Sample Tenant: PathoCare Laboratory (pathocare)';
    RAISE NOTICE 'Admin User: admin@pathocare.com';
    RAISE NOTICE 'Password: [Set your own secure password]';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Update user passwords';
    RAISE NOTICE '2. Configure integrations';
    RAISE NOTICE '3. Add your test data';
    RAISE NOTICE '4. Set up backup procedures';
    RAISE NOTICE '==============================================';
END $$;