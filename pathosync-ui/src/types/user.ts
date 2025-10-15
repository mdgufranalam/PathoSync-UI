import { Role } from '.';

export interface User {
    id: string; 
    tenant_id: string; 
    email: string;
    password_hash: string;
    two_factor_enabled?: boolean;
    two_factor_secret?: string;
    employee_id?: string;
    first_name: string;
    last_name: string;
    phone?: string;
    alternative_phone?: string;
    date_of_birth?: string; 
    gender?: string;
    role: Role;
    department?: string;
    designation?: string;
    qualification?: string;
    registration_number?: string;
    experience_years?: number;
    joining_date?: string; 
    permissions?: any; 
    allowed_modules?: any; 
    working_hours?: any; 
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    emergency_contact?: string;
    emergency_contact_name?: string;
    is_active?: boolean;
    account_locked?: boolean;
    failed_login_attempts?: number;
    last_login?: string; 
    last_activity?: string; 
    password_reset_token?: string;
    password_reset_expires?: string; 
    email_verified?: boolean;
    email_verification_token?: string;
    avatar_url?: string;
    bio?: string;
    created_at?: string; 
    updated_at?: string; 
    role_id?: number;
    name: string;
    features: string[];
    subscription_plan: 'starter' | 'basic' | 'professional' | 'enterprise';
    subscription_plan_name: string;
    organization_name: string;
    profile_picture?: string;
    join_date?: string;
}

export interface FilterTemplate {
  id: string;
  name: string;
  filters: any;
}
