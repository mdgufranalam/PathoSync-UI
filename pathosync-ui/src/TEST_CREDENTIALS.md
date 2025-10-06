# 🔐 Test User Credentials for Role & Permission Testing

All test users use the password: **`password123`**

## 📋 Complete Test User Database

### 👑 **ADMIN USERS** (Full System Access)

| Email | Role | Subscription | Organization | Key Features |
|-------|------|-------------|--------------|--------------|
| `admin@basic.com` | Admin | Basic | Basic Healthcare Clinic | Limited admin features for basic plan |
| `admin@professional.com` | Admin | Professional | Professional Diagnostics Lab | Full admin access with collection centers |
| `admin@enterprise.com` | Admin | Enterprise | Enterprise Healthcare Network | Complete system access + analytics |

### 👨‍💼 **MANAGER USERS** (Management Operations)

| Email | Role | Subscription | Organization | Key Features |
|-------|------|-------------|--------------|--------------|
| `manager@professional.com` | Manager | Professional | Professional Diagnostics Lab | Operations management, staff oversight |
| `manager@enterprise.com` | Manager | Enterprise | Enterprise Healthcare Network | Full management + analytics access |

### 🔬 **TECHNICIAN USERS** (Laboratory Operations)

| Email | Role | Subscription | Organization | Key Features |
|-------|------|-------------|--------------|--------------|
| `tech@starter.com` | Technician | Starter | Starter Lab Services | Basic lab operations, test management |
| `tech@professional.com` | Technician | Professional | Professional Diagnostics Lab | Advanced lab features + collection centers |

### 🚗 **COLLECTION AGENT USERS** (Sample Collection)

| Email | Role | Subscription | Organization | Key Features |
|-------|------|-------------|--------------|--------------|
| `collector@professional.com` | Collection Agent | Professional | Professional Diagnostics Lab | Sample collection, patient interaction |
| `collector@enterprise.com` | Collection Agent | Enterprise | Enterprise Healthcare Network | Advanced collection features |

### ⌨️ **DATA ENTRY USERS** (Data Input Operations)

| Email | Role | Subscription | Organization | Key Features |
|-------|------|-------------|--------------|--------------|
| `dataentry@basic.com` | Data Entry | Basic | Basic Healthcare Clinic | Basic data entry capabilities |
| `dataentry@starter.com` | Data Entry | Starter | Starter Lab Services | Enhanced data entry features |

### 👁️ **VIEWER USERS** (Read-Only Access)

| Email | Role | Subscription | Organization | Key Features |
|-------|------|-------------|--------------|--------------|
| `viewer@basic.com` | Viewer | Basic | Basic Healthcare Clinic | Read-only access to basic modules |
| `viewer@professional.com` | Viewer | Professional | Professional Diagnostics Lab | Comprehensive view access |

## 🧪 **Permission Testing Scenarios**

### **Scenario 1: Admin Capabilities Testing**
1. Login as `admin@professional.com`
2. Test: User Management, Collection Centers, All CRUD operations
3. Expected: Full access to all features

### **Scenario 2: Role Restrictions Testing**
1. Login as `tech@starter.com`
2. Try: Accessing User Management, Creating bills
3. Expected: Limited access, permission warnings

### **Scenario 3: Subscription Plan Limitations**
1. Login as `admin@basic.com`
2. Try: Accessing Collection Centers
3. Expected: Upgrade plan prompt

### **Scenario 4: Data Entry Workflow**
1. Login as `dataentry@starter.com`
2. Test: Patient creation, Report entry
3. Expected: Can create/edit, cannot delete

### **Scenario 5: Viewer Experience**
1. Login as `viewer@professional.com`  
2. Test: Navigation through all modules
3. Expected: View-only access, no edit/delete buttons

### **Scenario 6: Collection Agent Workflow**
1. Login as `collector@professional.com`
2. Test: Sample collection, patient updates
3. Expected: Limited to collection-related operations

## 🔄 **Quick Login Guide**

```
Username: [any-email-from-above]
Password: password123
```

### **Recommended Testing Order:**
1. Start with `admin@professional.com` (full features)
2. Test `tech@professional.com` (lab operations)
3. Try `viewer@basic.com` (minimal access)
4. Explore `manager@enterprise.com` (management view)
5. Test `dataentry@starter.com` (data operations)
6. End with `collector@professional.com` (collection workflow)

## 📊 **Permission Matrix Validation**

Each user role has specific permissions as defined in the uploaded Feature & Role Permission Matrix:
- **17 different actions** across **14 modules**
- **6 distinct roles** with varying access levels
- **4 subscription tiers** affecting feature availability

## 🚀 **Getting Started**

1. Navigate to the login page
2. Choose any email from the tables above
3. Enter `password123` as the password
4. Explore the role-specific interface
5. Test permission boundaries by attempting restricted actions

## 📝 **Notes for Testing**

- Each role has a unique dashboard experience
- Subscription plans affect module availability
- Permission gates prevent unauthorized actions
- Staff creation shows view-only permission checkboxes
- Modal sizes are optimized (80% desktop, 90% mobile)

---

**Happy Testing! 🎉**

*This document helps validate the comprehensive role-based permission system implemented in the HealthCare SaaS platform.*