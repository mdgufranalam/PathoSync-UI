-- roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- modules table
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- actions table
CREATE TABLE actions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- permissions table (junction table for modules and actions)
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    action_id INTEGER NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
    UNIQUE (module_id, action_id)
);

-- role_permissions table (junction table for roles and permissions)
CREATE TABLE role_permissions (
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- user_permissions table (for individual user overrides)
CREATE TABLE user_permissions (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    has_permission BOOLEAN NOT NULL DEFAULT true, -- true for grant, false for revoke
    PRIMARY KEY (user_id, permission_id)
);

-- Add role_id to users table
ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id);

-- Seed initial data

INSERT INTO roles (name, description) VALUES
('Admin', 'Full system access'),
('Manager', 'Manages collection centers and staff'),
('Technician', 'Performs tests and manages reports'),
('Collection Agent', 'Collects samples'),
('Data Entry', 'Enters patient and test data'),
('Viewer', 'Read-only access to specific modules');

INSERT INTO modules (name) VALUES
('Dashboard'),
('Billing'),
('Patients'),
('Doctors'),
('Tests'),
('Reports'),
('Users'),
('Subscription'),
('Statistics'),
('Test Categories'),
('Test Parameters'),
('Test Packages'),
('Collection Centers'),
('SaaS');

INSERT INTO actions (name) VALUES
('view'),
('list'),
('create'),
('edit'),
('delete'),
('approve'),
('reject'),
('export'),
('import'),
('process-payment'),
('view-transactions'),
('manage_users'),
('manage_doctors'),
('manage_tests'),
('manage_billing'),
('view-all-data'),
('assign-collection-center');
