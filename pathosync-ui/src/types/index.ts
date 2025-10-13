export type Page = 'dashboard' | 'patients' | 'tests' | 'reports' | 'billing' | 'users' | 'settings' | 'getting-started' | 'subscription' | 'login' | 'signup' | 'password-reset' | 'enhanced-billing' | 'bills' | 'packages' | 'profile' | 'statistics' | 'notifications' | 'collection-centers' | 'upgrade-plan' | 'saas-portal';

export type Role = 'admin' | 'manager' | 'technician' | 'collection-agent' | 'data-entry' | 'viewer';

export interface SubscriptionPlan {
    id: string; // UUID
    plan_code: string;
    name: string;
    description?: string;
    monthly_price: number;
    yearly_price?: number;
    setup_fee?: number;
    max_users: number;
    max_patients: number;
    max_tests_per_month: number;
    max_reports_per_month: number;
    max_storage_gb: number;
    features: any; // JSONB
    api_calls_per_month?: number;
    webhook_endpoints?: number;
    support_level?: string;
    sla_response_hours?: number;
    is_popular?: boolean;
    sort_order?: number;
    is_active?: boolean;
    is_visible?: boolean;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
}

export interface Tenant {
    id: string; // UUID
    name: string;
    subdomain: string;
    domain?: string;
    contact_person: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    gst_number?: string;
    pan_number?: string;
    license_number?: string;
    nabl_accreditation?: string;
    iso_certification?: string;
    subscription_plan?: string;
    subscription_status?: string;
    subscription_start_date?: string; // TIMESTAMP
    subscription_end_date?: string; // TIMESTAMP
    trial_end_date?: string; // TIMESTAMP
    max_users?: number;
    max_patients?: number;
    max_tests_per_month?: number;
    max_reports_per_month?: number;
    max_storage_gb?: number;
    features?: any; // JSONB
    settings?: any; // JSONB
    whatsapp_config?: any; // JSONB
    email_config?: any; // JSONB
    sms__config?: any; // JSONB
    payment_gateway_config?: any; // JSONB
    logo_url?: string;
    letterhead_url?: string;
    signature_url?: string;
    brand_colors?: any; // JSONB
    billing_address?: string;
    billing_email?: string;
    current_balance?: number;
    credit_limit?: number;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    created_by?: string; // UUID
    is_active?: boolean;
    gdpr_compliant?: boolean;
    hipaa_compliant?: boolean;
    data_encryption_enabled?: boolean;
}

export interface User {
    id: string; // UUID
    tenant_id: string; // UUID
    email: string;
    password_hash: string;
    two_factor_enabled?: boolean;
    two_factor_secret?: string;
    employee_id?: string;
    first_name: string;
    last_name: string;
    phone?: string;
    alternative_phone?: string;
    date_of_birth?: string; // DATE
    gender?: string;
    role: Role;
    department?: string;
    designation?: string;
    qualification?: string;
    registration_number?: string;
    experience_years?: number;
    joining_date?: string; // DATE
    permissions?: any; // JSONB
    allowed_modules?: any; // JSONB
    working_hours?: any; // JSONB
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    emergency_contact?: string;
    emergency_contact_name?: string;
    is_active?: boolean;
    account_locked?: boolean;
    failed_login_attempts?: number;
    last_login?: string; // TIMESTAMP
    last_activity?: string; // TIMESTAMP
    password_reset_token?: string;
    password_reset_expires?: string; // TIMESTAMP
    email_verified?: boolean;
    email_verification_token?: string;
    avatar_url?: string;
    bio?: string;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    role_id?: number;
    name: string;
    features: string[];
    subscription_plan: 'starter' | 'basic' | 'professional' | 'enterprise';
    subscription_plan_name: string;
    organization_name: string;
    profile_picture?: string;
    join_date?: string;
}

export interface UserSession {
    id: string; // UUID
    user_id: string; // UUID
    token: string;
    refresh_token?: string;
    expires_at: string; // TIMESTAMP
    refresh_expires_at: string; // TIMESTAMP
    created_at?: string; // TIMESTAMP
    last_used_at?: string; // TIMESTAMP
    ip_address?: string; // INET
    user_agent?: string;
    device_type?: string;
    location?: any; // JSONB
    is_active?: boolean;
    revoked_at?: string; // TIMESTAMP
    revoked_reason?: string;
}

export interface TestCategory {
    id: string; // UUID
    tenant_id: string; // UUID
    parent_id?: string; // UUID
    name: string;
    description?: string;
    category_code?: string;
    icon?: string;
    color?: string;
    sort_order?: number;
    is_active?: boolean;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
}

export interface Test {
    id: string; // UUID
    tenant_id: string; // UUID
    test_code: string;
    name: string;
    short_name?: string;
    alias_names?: string[];
    test_type: string;
    category_id?: string; // UUID
    parent_test_id?: string; // UUID
    price: number;
    cost?: number;
    emergency_surcharge_percentage?: number;
    unit?: string;
    method?: string;
    principle?: string;
    formula?: string;
    calculation_logic?: string;
    reference_ranges?: any; // JSONB
    sample_type?: string;
    sample_volume?: string;
    sample_container?: string;
    sample_collection_instructions?: string;
    storage_condition?: string;
    storage_temperature?: string;
    specimen_stability?: string;
    reporting_time?: number;
    tat_emergency?: number;
    processing_time?: number;
    is_outsourced?: boolean;
    outsource_lab?: string;
    outsource_cost?: number;
    outsource_tat?: number;
    requires_fasting?: boolean;
    fasting_hours?: number;
    special_instructions?: string;
    contraindications?: string;
    interfering_substances?: string;
    clinical_significance?: string;
    disease_associations?: string[];
    interpretation_guide?: string;
    default_template?: string;
    default_impression?: string;
    default_recommendations?: string;
    sort_order?: number;
    is_popular?: boolean;
    is_profile_test?: boolean;
    nabl_scope?: boolean;
    cap_approved?: boolean;
    iso_compliant?: boolean;
    is_active?: boolean;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    created_by?: string; // UUID
    description: string;
    category: string;
}

export interface TestParameter {
    id: string; // UUID
    tenant_id: string; // UUID
    test_id: string; // UUID
    parameter_name: string;
    parameter_code?: string;
    unit?: string;
    reference_ranges?: any; // JSONB
    sort_order?: number;
    is_calculated?: boolean;
    calculation_formula?: string;
    is_critical?: boolean;
    critical_low?: number;
    critical_high?: number;
    is_active?: boolean;
    created_at?: string; // TIMESTAMP
}

export interface Patient {
    id: string; // UUID
    tenant_id: string; // UUID
    patient_id: string;
    uhid?: string;
    aadhaar_number?: string;
    name: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth?: string; // DATE
    age_years?: number;
    age_months?: number;
    age_days?: number;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    alternative_phone?: string;
    email?: string;
    whatsapp_number?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    emergency_contact?: string;
    emergency_contact_name?: string;
    emergency_relationship?: string;
    blood_group?: string;
    allergies?: string;
    medical_history?: string;
    current_medications?: string;
    insurance_details?: any; // JSONB
    government_scheme?: string;
    scheme_id?: string;
    occupation?: string;
    education?: string;
    marital_status?: string;
    religion?: string;
    nationality?: string;
    preferred_language?: string;
    communication_preference?: any; // JSONB
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    created_by?: string; // UUID
    is_active?: boolean;
    data_sharing_consent?: boolean;
    marketing_consent?: boolean;
    preferred_collection_center_id?: string; // UUID
    prefers_home_collection?: boolean;
}

export interface Doctor {
    id: string; // UUID
    tenant_id: string; // UUID
    doctor_code?: string;
    registration_number?: string;
    license_number?: string;
    title?: string;
    name: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    specialization?: string;
    sub_specialization?: string;
    qualification?: string;
    experience_years?: number;
    phone?: string;
    alternative_phone?: string;
    email?: string;
    whatsapp_number?: string;
    clinic_address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    medical_council_state?: string;
    medical_council_number?: string;
    consultation_fee?: number;
    commission_percentage?: number;
    working_days?: any; // JSONB
    working_hours?: any; // JSONB
    consultation_duration?: number;
    signature_url?: string;
    stamp_url?: string;
    bank_account_number?: string;
    bank_ifsc?: string;
    bank_name?: string;
    is_active?: boolean;
    is_visiting?: boolean;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
}

export interface TestPackage {
    id: string; // UUID
    tenant_id: string; // UUID
    package_code: string;
    name: string;
    short_name?: string;
    description?: string;
    purpose?: string;
    recommended_for?: string;
    individual_price?: number;
    package_price: number;
    discount_percentage?: number;
    savings_amount?: number;
    is_featured?: boolean;
    is_seasonal?: boolean;
    validity_start?: string; // DATE
    validity_end?: string; // DATE
    fasting_required?: boolean;
    special_instructions?: string;
    age_group?: string;
    gender_specific?: string;
    image_url?: string;
    sort_order?: number;
    is_active?: boolean;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    created_by?: string; // UUID
}

export interface PackageTest {
    id: string; // UUID
    package_id: string; // UUID
    test_id: string; // UUID
    sort_order?: number;
    is_optional?: boolean;
    added_at?: string; // TIMESTAMP
}

export type BillStatus = 'pending' | 'paid' | 'partially-paid' | 'cancelled';
export type ReportStatus = 'pending' | 'in-progress' | 'completed' | 'delivered' | 'approved';

export interface Bill {
    id: string; // UUID
    tenant_id: string; // UUID
    bill_number: string;
    invoice_number?: string;
    reference_number?: string;
    patient_id: string; // UUID
    doctor_id?: string; // UUID
    referred_by?: string;
    bill_date?: string; // TIMESTAMP
    due_date?: string; // TIMESTAMP
    sample_collection_date?: string; // TIMESTAMP
    subtotal: number;
    discount_amount?: number;
    discount_percentage?: number;
    cgst_percentage?: number;
    sgst_percentage?: number;
    igst_percentage?: number;
    cgst_amount?: number;
    sgst_amount?: number;
    igst_amount?: number;
    total_tax_amount?: number;
    total_amount: number;
    round_off?: number;
    paid_amount?: number;
    balance_amount?: number;
    advance_amount?: number;
    payment_status: BillStatus;
    bill_status?: string;
    payment_method?: string;
    payment_reference?: string;
    upi_transaction_id?: string;
    notes?: string;
    internal_notes?: string;
    terms_and_conditions?: string;
    is_emergency?: boolean;
    priority_level?: number;
    source?: string;
    campaign_code?: string;
    created_by?: string; // UUID
    approved_by?: string; // UUID
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    financial_year?: string;
    collection_center_id?: string; // UUID
    is_home_collection?: boolean;
    collection_address?: string;
    collection_charges?: number;
    referring_doctor_id?: string; // UUID
    patient: Patient;
    doctor: Doctor;
    tests: Test[];
    reportStatus: ReportStatus;
    paymentMethod: string;
    total: number;
    finalAmount: number;
}

export interface BillItem {
    id: string; // UUID
    bill_id: string; // UUID
    item_type: 'test' | 'package' | 'consultation' | 'other';
    test_id?: string; // UUID
    package_id?: string; // UUID
    item_name: string;
    item_code?: string;
    description?: string;
    quantity?: number;
    unit_price: number;
    total_price: number;
    discount_percentage?: number;
    discount_amount?: number;
    final_amount: number;
    hsn_code?: string;
    tax_percentage?: number;
    tax_amount?: number;
    is_emergency?: boolean;
    requires_fasting?: boolean;
    sort_order?: number;
    added_at?: string; // TIMESTAMP
    added_by?: string; // UUID
}

export interface CollectionCenter {
    id: string; // UUID
    tenant_id: string; // UUID
    center_code: string;
    name: string;
    short_name?: string;
    contact_person: string;
    phone: string;
    alternative_phone?: string;
    email?: string;
    whatsapp_number?: string;
    address: string;
    city: string;
    state: string;
    country?: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
    working_hours?: any; // JSONB
    services_offered?: string[];
    collection_capacity?: number;
    commission_percentage?: number;
    security_deposit?: number;
    monthly_rent?: number;
    total_samples_collected?: number;
    monthly_target?: number;
    last_sample_collection?: string; // TIMESTAMP
    has_centrifuge?: boolean;
    has_refrigerator?: boolean;
    has_sample_storage?: boolean;
    storage_capacity?: number;
    pickup_time_morning?: string; // TIME
    pickup_time_evening?: string; // TIME
    transport_partner?: string;
    average_transit_time?: number;
    is_active?: boolean;
    contract_start_date?: string; // DATE
    contract_end_date?: string; // DATE
    last_audit_date?: string; // DATE
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    created_by?: string; // UUID
}

export interface CollectionCenterStaff {
    id: string; // UUID
    tenant_id: string; // UUID
    center_id: string; // UUID
    user_id: string; // UUID
    role: string;
    is_primary?: boolean;
    shift_timing?: any; // JSONB
    can_collect_samples?: boolean;
    can_process_billing?: boolean;
    can_manage_inventory?: boolean;
    assigned_from?: string; // DATE
    assigned_until?: string; // DATE
    is_active?: boolean;
    created_at?: string; // TIMESTAMP
    assigned_by?: string; // UUID
}

export interface SampleMovement {
    id: string; // UUID
    tenant_id: string; // UUID
    sample_id: string;
    barcode?: string;
    batch_id?: string;
    bill_id?: string; // UUID
    patient_id?: string; // UUID
    collection_center_id: string; // UUID
    sample_type?: string;
    container_type?: string;
    volume_collected?: string;
    test_ids?: string[]; // UUID[]
    test_names?: string[];
    collected_at: string; // TIMESTAMP
    collection_confirmed_at?: string; // TIMESTAMP
    dispatch_from_center_at?: string; // TIMESTAMP
    in_transit_at?: string; // TIMESTAMP
    received_at_lab_at?: string; // TIMESTAMP
    processing_started_at?: string; // TIMESTAMP
    processing_completed_at?: string; // TIMESTAMP
    current_status?: string;
    priority?: string;
    is_delayed?: boolean;
    delay_reason?: string;
    sample_condition?: string;
    temperature_maintained?: boolean;
    chain_of_custody?: any; // JSONB
    transport_batch_number?: string;
    transport_partner?: string;
    vehicle_number?: string;
    driver_name?: string;
    driver_phone?: string;
    expected_lab_arrival?: string; // TIMESTAMP
    expected_result_completion?: string; // TIMESTAMP
    tat_hours?: number;
    pickup_location?: any; // JSONB
    dropoff_location?: any; // JSONB
    route_tracked?: any; // JSONB
    patient_notified_collection?: boolean;
    patient_notified_transit?: boolean;
    patient_notified_received?: boolean;
    storage_temperature?: string;
    special_handling_requirements?: string;
    refrigeration_required?: boolean;
    collection_charges?: number;
    transport_charges?: number;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    collected_by?: string; // UUID
    received_by?: string; // UUID
}

export interface CollectionCenterMetrics {
    id: string; // UUID
    tenant_id: string; // UUID
    center_id: string; // UUID
    metric_date: string; // DATE
    metric_month?: number;
    metric_year?: number;
    samples_collected?: number;
    samples_target?: number;
    collection_efficiency?: number;
    samples_rejected?: number;
    samples_delayed?: number;
    quality_score?: number;
    revenue_generated?: number;
    commission_earned?: number;
    collection_charges?: number;
    average_collection_time?: number;
    patient_satisfaction_score?: number;
    complaints_count?: number;
    average_tat_hours?: number;
    samples_within_tat?: number;
    tat_compliance_percentage?: number;
    staff_count?: number;
    staff_utilization_percentage?: number;
    equipment_uptime_percentage?: number;
    storage_utilization_percentage?: number;
    created_at?: string; // TIMESTAMP
}

export interface CollectionCenterInventory {
    id: string; // UUID
    tenant_id: string; // UUID
    center_id: string; // UUID
    item_type: string;
    item_name: string;
    item_code?: string;
    specification?: string;
    current_stock?: number;
    minimum_stock?: number;
    maximum_stock?: number;
    unit_of_measurement?: string;
    unit_cost?: number;
    has_expiry?: boolean;
    expiry_date?: string; // DATE
    batch_number?: string;
    last_restocked_date?: string; // DATE
    last_restocked_quantity?: number;
    consumption_rate_per_day?: number;
    low_stock_alert?: boolean;
    expiry_alert?: boolean;
    is_active?: boolean;
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
}

export interface LabReport {
    id: string;
    reportNo: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
    doctorName: string;
    sampleType: string;
    collectionDate: string;
    reportDate: string;
    tests: TestResult[];
    overallStatus: string;
    notes?: string;
    labInfo: {
        name: string;
        address: string;
        logoUrl?: string;
    };
    tenant_id: string; // UUID
    report_number: string;
    bill_id: string; // UUID
    patient_id: string; // UUID
    doctor_id?: string; // UUID
    sample_collected_at?: string; // TIMESTAMP
    sample_received_at?: string; // TIMESTAMP
    reported_at?: string; // TIMESTAMP
    verified_at?: string; // TIMESTAMP
    printed_at?: string; // TIMESTAMP
    delivered_at?: string; // TIMESTAMP
    status?: string;
    clinical_history?: string;
    impression?: string;
    recommendations?: string;
    technician_id?: string; // UUID
    pathologist_id?: string; // UUID
    created_at?: string; // TIMESTAMP
    updated_at?: string; // TIMESTAMP
    collection_center_id?: string; // UUID
    sample_movement_id?: string; // UUID
}

export interface Referral {
    id: number;
    doctor_id: string; // UUID
    patient_id: string; // UUID
    bill_id: string; // UUID
    referral_date?: string; // TIMESTAMPTZ
    tenant_id: string;
    created_at?: string; // TIMESTAMPTZ
    updated_at?: string; // TIMESTAMPTZ
}

export interface Module {
    id: number;
    name: string;
    description?: string;
}

export interface Action {
    id: number;
    name: string;
    description?: string;
}

export interface Permission {
    id: number;
    module_id: number;
    action_id: number;
}

export interface RolePermission {
    role_id: number;
    permission_id: number;
}

export interface UserPermission {
    user_id: string; // UUID
    permission_id: number;
    has_permission: boolean;
}

export interface TestResult {
    testId: string;
    name: string;
    value: string | number;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
}
