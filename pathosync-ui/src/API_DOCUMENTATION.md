# Healthcare SaaS - Laboratory Test Management System API Documentation

This document outlines all the API endpoints required for the comprehensive Laboratory Test Management System with multi-tenant SaaS capabilities, role-based permissions, and advanced features for the Indian healthcare market.

## Base URL
```
https://your-api-domain.com/api/v1
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Multi-Tenancy Headers
For multi-tenant operations, include the tenant ID:
```
X-Tenant-ID: <tenant_uuid>
```

## Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {},
    "timestamp": "ISO_DATE"
  }
}
```

---

## 1. Authentication & Session Management

### POST /auth/login
Login user with captcha verification and remember me functionality
```json
// Request
{
  "email": "user@example.com",
  "password": "password123",
  "captcha": "captcha_token",
  "rememberMe": true
}

// Response
{
  "user": {
    "id": "uuid",
    "name": "Dr. Admin",
    "email": "admin@pathosync.com",
    "phone": "+91-9876543210",
    "role": "Admin|Manager|Technician|Collection Agent|Data Entry|Viewer",
    "department": "Administration",
    "joinDate": "2024-01-01",
    "subscriptionPlan": "basic|starter|professional|enterprise",
    "organizationName": "PathoCare Labs",
    "tenantId": "uuid",
    "permissions": ["Dashboard:View", "Bills:All", "Patients:Edit"],
    "isActive": true,
    "lastLogin": "ISO_DATE",
    "createdAt": "ISO_DATE"
  },
  "tokens": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "sessionId": "session_uuid",
    "expiresIn": 3600
  }
}
```

### POST /auth/refresh-token
Refresh access token using refresh token
```json
// Request
{
  "refreshToken": "refresh_token"
}

// Response
{
  "accessToken": "new_jwt_token",
  "expiresIn": 3600
}
```

### POST /auth/logout
Logout user and invalidate session
```json
// Request
{
  "sessionId": "session_uuid"
}

// Response
{
  "message": "Logged out successfully"
}
```

### GET /auth/me
Get current user profile with permissions
```json
// Response
{
  "user": {
    "id": "uuid",
    "name": "Dr. Admin",
    "email": "admin@pathosync.com",
    "role": "Admin",
    "permissions": ["Dashboard:View", "Bills:All"],
    "subscriptionPlan": "professional",
    "organizationName": "PathoCare Labs",
    "tenantId": "uuid"
  }
}
```

### POST /auth/forgot-password
Initiate password reset
```json
// Request
{
  "email": "user@example.com"
}

// Response
{
  "message": "Password reset link sent to email"
}
```

### POST /auth/reset-password
Reset password with token
```json
// Request
{
  "token": "reset_token",
  "newPassword": "new_password123"
}
```

---

## 2. Multi-Tenant Management (Admin Portal)

### GET /tenants
Get all tenants (Super Admin only)
```json
// Response
{
  "tenants": [
    {
      "id": "uuid",
      "organizationName": "PathoCare Labs",
      "domain": "pathocare.pathosync.com",
      "subscriptionPlan": "professional",
      "subscriptionStatus": "active|trial|suspended|cancelled",
      "subscriptionStartDate": "ISO_DATE",
      "subscriptionEndDate": "ISO_DATE",
      "billingInfo": {
        "billingEmail": "billing@pathocare.com",
        "address": "123 Medical Street",
        "gstNumber": "27AABCU9603R1ZM"
      },
      "settings": {
        "whatsappEnabled": true,
        "smsEnabled": true,
        "emailEnabled": true,
        "maxUsers": 50,
        "maxPatients": 10000
      },
      "usage": {
        "currentUsers": 25,
        "currentPatients": 5000,
        "monthlyBills": 1200,
        "monthlyReports": 800
      },
      "isActive": true,
      "createdAt": "ISO_DATE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### POST /tenants
Create new tenant
```json
// Request
{
  "organizationName": "New Lab",
  "domain": "newlab.pathosync.com",
  "subscriptionPlan": "professional",
  "adminUser": {
    "name": "Dr. Admin",
    "email": "admin@newlab.com",
    "phone": "+91-9876543210"
  },
  "billingInfo": {
    "billingEmail": "billing@newlab.com",
    "address": "456 Health Avenue",
    "gstNumber": "27AABCU9603R1ZM"
  }
}
```

### PUT /tenants/:id
Update tenant information

### DELETE /tenants/:id
Suspend tenant (soft delete)

### GET /tenants/:id/usage
Get tenant usage metrics
```json
// Response
{
  "usage": {
    "users": {
      "current": 25,
      "limit": 50,
      "percentage": 50
    },
    "patients": {
      "current": 5000,
      "limit": 10000,
      "percentage": 50
    },
    "monthlyStats": {
      "bills": 1200,
      "reports": 800,
      "tests": 5000,
      "revenue": 250000
    },
    "storageUsed": "2.5GB",
    "storageLimit": "10GB"
  }
}
```

---

## 3. Role-Based Permission Management

### GET /permissions/roles
Get all available roles with their permissions
```json
// Response
{
  "roles": [
    {
      "name": "Admin",
      "permissions": {
        "Dashboard": ["View"],
        "Billing/Enhanced Billing": ["View", "Create", "Edit", "Delete", "Export", "Print"],
        "Bills Management": ["All"],
        "Patients Management": ["All"],
        "Test Packages": ["All"],
        "Tests Management": ["All"],
        "Reports Page": ["All"],
        "Doctors Management": ["All"],
        "Users Management": ["All"],
        "Profile": ["View", "Edit"],
        "Statistics/Analytics": ["All"],
        "Subscription Management": ["All"],
        "Notifications": ["All"],
        "Collection Centers": ["All"]
      }
    },
    {
      "name": "Manager",
      "permissions": {
        "Dashboard": ["View"],
        "Bills Management": ["View", "Create", "Edit", "Delete", "Export", "Print"],
        "Patients Management": ["View", "Create", "Edit", "Delete", "Export"],
        "Tests Management": ["View", "Edit"],
        "Test Packages": ["View", "Create", "Edit", "Delete"],
        "Reports Page": ["View", "Create", "Edit", "Delete", "Export", "Print"],
        "Users Management": ["View"],
        "Doctors Management": ["View", "Create", "Edit", "Delete"],
        "Collection Centers": ["View"]
      }
    }
  ]
}
```

### GET /permissions/check
Check specific permission for current user
```json
// Request Query Parameters
// module: string
// action: string

// Response
{
  "hasPermission": true,
  "permissions": ["View", "Edit"]
}
```

### GET /permissions/modules
Get accessible modules for current user
```json
// Response
{
  "modules": [
    {
      "name": "Dashboard",
      "permissions": ["View"]
    },
    {
      "name": "Bills Management",
      "permissions": ["View", "Create", "Edit", "Delete"]
    }
  ]
}
```

---

## 4. User Management

### GET /users
Get all users with role-based filtering
```json
// Query Parameters:
// page: number
// limit: number
// role: Admin|Manager|Technician|Collection Agent|Data Entry|Viewer
// search: string
// isActive: boolean
// department: string

// Response
{
  "users": [
    {
      "id": "uuid",
      "name": "Dr. Admin",
      "email": "admin@pathosync.com",
      "phone": "+91-9876543210",
      "role": "Admin",
      "department": "Administration",
      "joinDate": "2024-01-01",
      "permissions": ["All Modules Access"],
      "isActive": true,
      "lastLogin": "ISO_DATE",
      "createdAt": "ISO_DATE",
      "createdBy": "uuid"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### POST /users
Create new user with role assignment
```json
// Request
{
  "name": "Sarah Manager",
  "email": "manager@lab.com",
  "phone": "+91-9876543213",
  "role": "Manager",
  "department": "Operations",
  "password": "temp_password123",
  "sendWelcomeEmail": true
}

// Response
{
  "user": {
    "id": "uuid",
    "name": "Sarah Manager",
    "email": "manager@lab.com",
    "role": "Manager",
    "permissions": ["Dashboard:View", "Bills:All"],
    "temporaryPassword": true,
    "isActive": true,
    "createdAt": "ISO_DATE"
  }
}
```

### PUT /users/:id
Update user information and role

### DELETE /users/:id
Deactivate user (soft delete)

### PATCH /users/:id/password
Reset user password

### GET /users/:id/activity
Get user activity log
```json
// Response
{
  "activities": [
    {
      "action": "login",
      "timestamp": "ISO_DATE",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    },
    {
      "action": "created_bill",
      "resourceId": "BILL-123456",
      "timestamp": "ISO_DATE"
    }
  ]
}
```

---

## 5. Patients Management

### GET /patients
Get all patients with advanced filtering
```json
// Query Parameters:
// page: number
// limit: number
// search: string
// gender: male|female|other
// ageRange: string (e.g., "18-30")
// registrationDate: ISO_DATE range
// lastVisit: ISO_DATE range

// Response
{
  "patients": [
    {
      "id": "uuid",
      "patientId": "PAT-000001",
      "name": "John Doe",
      "email": "patient@example.com",
      "phone": "+91-9876543210",
      "alternatePhone": "+91-9876543211",
      "address": {
        "street": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India"
      },
      "dateOfBirth": "1990-01-01",
      "age": 34,
      "gender": "male",
      "bloodGroup": "O+",
      "emergencyContact": {
        "name": "Jane Doe",
        "relationship": "Wife",
        "phone": "+91-9876543212"
      },
      "medicalHistory": [
        {
          "condition": "Diabetes",
          "diagnosedDate": "2020-01-01",
          "status": "active"
        }
      ],
      "insurance": {
        "provider": "Health Insurance Co.",
        "policyNumber": "POL-123456",
        "validUntil": "2024-12-31"
      },
      "lastVisit": "ISO_DATE",
      "totalBills": 15,
      "totalAmount": 25000,
      "isActive": true,
      "createdAt": "ISO_DATE",
      "updatedAt": "ISO_DATE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5000,
    "totalPages": 250
  }
}
```

### POST /patients
Create new patient
```json
// Request
{
  "name": "John Doe",
  "email": "patient@example.com",
  "phone": "+91-9876543210",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "bloodGroup": "O+",
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Wife",
    "phone": "+91-9876543212"
  }
}
```

### PUT /patients/:id
Update patient information

### DELETE /patients/:id
Deactivate patient

### GET /patients/:id
Get patient details with history

### GET /patients/:id/bills
Get patient's bill history

### GET /patients/:id/reports
Get patient's test reports

---

## 6. Tests Management

### GET /tests
Get all tests with advanced categorization
```json
// Query Parameters:
// page: number
// limit: number
// search: string
// category: string
// bodySystem: string
// testType: Normal|Descriptive|Group
// priceRange: string (e.g., "100-500")
// isActive: boolean

// Response
{
  "tests": [
    {
      "id": "uuid",
      "code": "CBC001",
      "name": "Complete Blood Count",
      "shortName": "CBC",
      "description": "Comprehensive blood analysis",
      "category": "Hematology",
      "bodySystem": "Blood & Immune System",
      "testType": "Normal",
      "price": 300,
      "discountedPrice": 250,
      "normalRange": {
        "male": "4.5-5.5 million/μL",
        "female": "4.0-5.0 million/μL"
      },
      "unit": "million/μL",
      "specimen": "Blood",
      "specimenVolume": "3ml",
      "fastingRequired": false,
      "reportingTime": "4-6 hours",
      "methodology": "Automated Cell Counter",
      "parameters": [
        {
          "name": "RBC Count",
          "normalRange": "4.5-5.5 million/μL",
          "unit": "million/μL"
        }
      ],
      "clinicalSignificance": "Used to evaluate overall health and detect blood disorders",
      "isActive": true,
      "popularityScore": 95,
      "createdAt": "ISO_DATE",
      "updatedAt": "ISO_DATE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25
  }
}
```

### POST /tests
Create new test
```json
// Request
{
  "name": "Complete Blood Count",
  "shortName": "CBC",
  "description": "Comprehensive blood analysis",
  "category": "Hematology",
  "bodySystem": "Blood & Immune System",
  "testType": "Normal",
  "price": 300,
  "normalRange": {
    "male": "4.5-5.5 million/μL",
    "female": "4.0-5.0 million/μL"
  },
  "unit": "million/μL",
  "specimen": "Blood",
  "fastingRequired": false,
  "reportingTime": "4-6 hours"
}
```

### PUT /tests/:id
Update test information

### DELETE /tests/:id
Deactivate test

### GET /tests/categories
Get all test categories with body systems
```json
// Response
{
  "categories": [
    {
      "name": "Hematology",
      "bodySystem": "Blood & Immune System",
      "testCount": 25,
      "description": "Blood-related tests and analysis"
    },
    {
      "name": "Biochemistry",
      "bodySystem": "Metabolic System",
      "testCount": 40,
      "description": "Chemical analysis of body fluids"
    }
  ]
}
```

### GET /tests/body-systems
Get all body systems with test counts

### GET /tests/popular
Get most popular tests

---

## 7. Test Packages Management

### GET /packages
Get all test packages
```json
// Response
{
  "packages": [
    {
      "id": "uuid",
      "name": "Basic Health Checkup",
      "description": "Comprehensive basic health screening",
      "category": "Preventive Care",
      "tests": [
        {
          "testId": "uuid",
          "test": {
            "name": "Complete Blood Count",
            "price": 300
          }
        }
      ],
      "originalPrice": 1500,
      "packagePrice": 1200,
      "discount": 20,
      "savings": 300,
      "isPopular": true,
      "ageGroup": "18-60",
      "gender": "both",
      "fastingRequired": true,
      "reportingTime": "24 hours",
      "isActive": true,
      "createdAt": "ISO_DATE"
    }
  ]
}
```

### POST /packages
Create new test package

### PUT /packages/:id
Update test package

### DELETE /packages/:id
Deactivate package

---

## 8. Bills Management & Billing Process

### GET /bills
Get all bills with advanced filtering
```json
// Query Parameters:
// page: number
// limit: number
// status: pending|paid|cancelled|partial
// paymentMethod: cash|card|upi|insurance|online
// patientId: uuid
// doctorId: uuid
// startDate: ISO_DATE
// endDate: ISO_DATE
// amountRange: string
// billType: individual|package

// Response
{
  "bills": [
    {
      "id": "BILL-123456",
      "billNumber": "INV-2024-001234",
      "patientId": "uuid",
      "patient": {
        "id": "uuid",
        "name": "John Doe",
        "phone": "+91-9876543210",
        "email": "patient@example.com"
      },
      "doctorId": "uuid",
      "doctor": {
        "id": "uuid",
        "name": "Dr. Smith",
        "specialization": "Cardiology"
      },
      "collectionCenter": {
        "id": "uuid",
        "name": "Main Lab",
        "address": "123 Medical Street"
      },
      "items": [
        {
          "type": "test",
          "itemId": "uuid",
          "item": {
            "name": "Complete Blood Count",
            "price": 300
          },
          "quantity": 1,
          "price": 300,
          "discount": 0
        }
      ],
      "subtotal": 300,
      "discount": {
        "amount": 30,
        "percentage": 10,
        "reason": "Senior Citizen"
      },
      "tax": {
        "cgst": 27,
        "sgst": 27,
        "total": 54
      },
      "total": 324,
      "status": "pending",
      "paymentMethod": "cash",
      "paymentDetails": {
        "transactionId": "TXN123456",
        "paidAmount": 324,
        "paymentDate": "ISO_DATE"
      },
      "sampleCollection": {
        "type": "lab|home",
        "scheduledDate": "ISO_DATE",
        "collectedDate": "ISO_DATE",
        "collectorId": "uuid",
        "status": "scheduled|collected|pending"
      },
      "notes": "Urgent processing required",
      "createdAt": "ISO_DATE",
      "updatedAt": "ISO_DATE",
      "createdBy": "uuid"
    }
  ],
  "summary": {
    "totalBills": 500,
    "totalAmount": 125000,
    "paidAmount": 100000,
    "pendingAmount": 25000
  }
}
```

### POST /bills
Create new bill (Enhanced Billing Process)
```json
// Request
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "collectionCenterId": "uuid",
  "items": [
    {
      "type": "test|package",
      "itemId": "uuid",
      "quantity": 1,
      "customPrice": 300 // optional
    }
  ],
  "discount": {
    "amount": 30,
    "percentage": 10,
    "reason": "Senior Citizen"
  },
  "paymentMethod": "cash",
  "sampleCollection": {
    "type": "lab|home",
    "scheduledDate": "ISO_DATE",
    "address": "Home address if home collection"
  },
  "notes": "Special instructions"
}
```

### PUT /bills/:id
Update bill

### DELETE /bills/:id
Cancel bill

### GET /bills/:id
Get detailed bill information

### PATCH /bills/:id/payment
Process payment
```json
// Request
{
  "paymentMethod": "cash|card|upi|online",
  "amount": 324,
  "transactionId": "TXN123456",
  "notes": "Payment received"
}
```

### GET /bills/:id/pdf
Generate and download bill PDF

### POST /bills/:id/send-whatsapp
Send bill via WhatsApp
```json
// Request
{
  "phone": "+91-9876543210",
  "message": "Your bill is ready"
}
```

### POST /bills/:id/send-email
Send bill via email

### POST /bills/:id/send-sms
Send bill notification via SMS

---

## 9. Reports Management

### GET /reports
Get all patient reports
```json
// Query Parameters:
// page: number
// limit: number
// patientId: uuid
// billId: uuid
// status: draft|in_progress|completed|verified|delivered
// testType: Normal|Descriptive|Group
// startDate: ISO_DATE
// endDate: ISO_DATE

// Response
{
  "reports": [
    {
      "id": "uuid",
      "reportNumber": "RPT-2024-001234",
      "patientId": "uuid",
      "patient": {
        "name": "John Doe",
        "age": 34,
        "gender": "male"
      },
      "billId": "uuid",
      "testResults": [
        {
          "testId": "uuid",
          "test": {
            "name": "Complete Blood Count",
            "normalRange": "4.5-5.5 million/μL"
          },
          "result": "5.2",
          "unit": "million/μL",
          "status": "normal|abnormal|critical",
          "remarks": "Within normal limits"
        }
      ],
      "descriptiveResults": [
        {
          "testId": "uuid",
          "test": {
            "name": "Histopathology Report"
          },
          "clinicalHistory": "Patient history",
          "grossExamination": "Gross findings",
          "microscopicExamination": "Microscopic findings",
          "diagnosis": "Final diagnosis",
          "recommendations": "Treatment recommendations"
        }
      ],
      "groupResults": [
        {
          "groupId": "uuid",
          "group": {
            "name": "Liver Function Tests"
          },
          "tests": [
            {
              "testId": "uuid",
              "result": "25",
              "status": "normal"
            }
          ]
        }
      ],
      "clinicalRemarks": "Overall assessment",
      "technician": {
        "name": "Lab Technician",
        "signature": "digital_signature_url"
      },
      "pathologist": {
        "name": "Dr. Pathologist",
        "qualification": "MD Pathology",
        "signature": "digital_signature_url"
      },
      "status": "completed",
      "reportDate": "ISO_DATE",
      "verifiedDate": "ISO_DATE",
      "deliveredDate": "ISO_DATE",
      "createdAt": "ISO_DATE"
    }
  ]
}
```

### POST /reports
Create new report

### PUT /reports/:id
Update report

### GET /reports/:id
Get detailed report

### PATCH /reports/:id/verify
Verify report (Pathologist action)

### POST /reports/:id/send
Send report to patient via WhatsApp/Email/SMS

### GET /reports/:id/pdf
Generate and download report PDF

---

## 10. Doctors Management

### GET /doctors
Get all doctors
```json
// Response
{
  "doctors": [
    {
      "id": "uuid",
      "name": "Dr. John Smith",
      "specialization": "Cardiology",
      "qualification": "MD, DM Cardiology",
      "experience": "15 years",
      "email": "doctor@example.com",
      "phone": "+91-9876543210",
      "licenseNumber": "MCI-12345",
      "hospitalAffiliation": "Apollo Hospital",
      "consultationFee": 500,
      "address": {
        "clinic": "Heart Care Clinic",
        "street": "456 Medical Avenue",
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "availability": [
        {
          "day": "Monday",
          "slots": ["09:00-12:00", "14:00-17:00"]
        }
      ],
      "totalPatients": 1250,
      "totalConsultations": 3500,
      "rating": 4.8,
      "isActive": true,
      "createdAt": "ISO_DATE"
    }
  ]
}
```

### POST /doctors
Create new doctor

### PUT /doctors/:id
Update doctor information

### DELETE /doctors/:id
Deactivate doctor

### GET /doctors/:id/stats
Get doctor performance statistics

---

## 11. Collection Centers Management

### GET /collection-centers
Get all collection centers (Professional/Enterprise plans)
```json
// Response
{
  "centers": [
    {
      "id": "uuid",
      "name": "Main Collection Center",
      "code": "MCC001",
      "type": "main|satellite|home_collection",
      "address": {
        "street": "123 Medical Street",
        "area": "Bandra West",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400050",
        "landmark": "Near Railway Station"
      },
      "contact": {
        "phone": "+91-9876543210",
        "email": "center@lab.com",
        "manager": "Manager Name"
      },
      "operatingHours": {
        "monday": "08:00-18:00",
        "tuesday": "08:00-18:00",
        "sunday": "closed"
      },
      "services": [
        "Sample Collection",
        "Report Delivery",
        "Consultation"
      ],
      "staff": [
        {
          "userId": "uuid",
          "user": {
            "name": "Collection Agent",
            "role": "Collection Agent"
          },
          "assignedDate": "ISO_DATE"
        }
      ],
      "coverage": {
        "areas": ["Bandra", "Khar", "Santacruz"],
        "radius": "5km"
      },
      "equipment": [
        "Centrifuge",
        "Refrigerator",
        "Sample Storage"
      ],
      "statistics": {
        "monthlySamples": 1500,
        "monthlyRevenue": 75000,
        "avgResponseTime": "30 minutes"
      },
      "isActive": true,
      "createdAt": "ISO_DATE"
    }
  ]
}
```

### POST /collection-centers
Create new collection center

### PUT /collection-centers/:id
Update collection center

### DELETE /collection-centers/:id
Deactivate collection center

### POST /collection-centers/:id/assign-staff
Assign staff to collection center
```json
// Request
{
  "userIds": ["uuid1", "uuid2"],
  "role": "Collection Agent"
}
```

### GET /collection-centers/:id/coverage
Get service coverage areas

### GET /collection-centers/:id/schedule
Get collection schedule

---

## 12. Statistics & Analytics

### GET /statistics/dashboard
Get comprehensive dashboard statistics
```json
// Response
{
  "overview": {
    "totalPatients": 5000,
    "totalDoctors": 25,
    "totalTests": 500,
    "totalBills": 12000,
    "monthlyRevenue": 250000,
    "pendingReports": 45,
    "completedReports": 1155
  },
  "revenueAnalytics": {
    "thisMonth": 250000,
    "lastMonth": 220000,
    "growth": 13.6,
    "dailyAverage": 8333,
    "projection": 275000
  },
  "testAnalytics": {
    "mostPopular": [
      {
        "testName": "Complete Blood Count",
        "count": 1200,
        "revenue": 360000
      }
    ],
    "categoryDistribution": [
      {
        "category": "Hematology",
        "count": 150,
        "percentage": 25
      }
    ]
  },
  "patientAnalytics": {
    "newPatients": 125,
    "returningPatients": 875,
    "ageDistribution": [
      {
        "ageGroup": "18-30",
        "count": 500,
        "percentage": 20
      }
    ],
    "genderDistribution": {
      "male": 55,
      "female": 43,
      "other": 2
    }
  },
  "operationalMetrics": {
    "avgReportTime": "4.5 hours",
    "sampleCollectionRate": 98.5,
    "reportAccuracy": 99.2,
    "customerSatisfaction": 4.7
  },
  "collectionCenters": [
    {
      "centerId": "uuid",
      "name": "Main Center",
      "samplesCollected": 800,
      "revenue": 120000,
      "efficiency": 95.2
    }
  ]
}
```

### GET /statistics/revenue
Get detailed revenue analytics

### GET /statistics/tests
Get test utilization statistics

### GET /statistics/patients
Get patient demographics and trends

### GET /statistics/performance
Get operational performance metrics

### GET /statistics/export
Export analytics data
```json
// Query Parameters:
// format: csv|excel|pdf
// dateRange: string
// metrics: string (comma-separated)
```

---

## 13. Subscription Management

### GET /subscription
Get current subscription details
```json
// Response
{
  "subscription": {
    "id": "uuid",
    "plan": "professional",
    "status": "active",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "billingCycle": "monthly|yearly",
    "amount": 2999,
    "currency": "INR",
    "features": [
      "Unlimited Patients",
      "50 Users",
      "Collection Centers",
      "Advanced Reports",
      "WhatsApp Integration"
    ],
    "usage": {
      "users": {
        "current": 25,
        "limit": 50
      },
      "patients": {
        "current": 5000,
        "limit": "unlimited"
      },
      "storage": {
        "used": "2.5GB",
        "limit": "10GB"
      }
    },
    "nextBillingDate": "2024-12-01",
    "autoRenewal": true
  }
}
```

### POST /subscription/upgrade
Upgrade subscription plan
```json
// Request
{
  "newPlan": "enterprise",
  "billingCycle": "yearly",
  "paymentMethod": "card|upi|netbanking"
}
```

### POST /subscription/cancel
Cancel subscription

### GET /subscription/invoices
Get billing history

### GET /subscription/usage
Get detailed usage metrics

---

## 14. Notifications Management

### GET /notifications
Get user notifications
```json
// Response
{
  "notifications": [
    {
      "id": "uuid",
      "type": "bill_created|report_ready|payment_received|system_alert",
      "title": "New Bill Created",
      "message": "Bill BILL-123456 has been created for John Doe",
      "data": {
        "billId": "BILL-123456",
        "patientName": "John Doe"
      },
      "isRead": false,
      "priority": "low|medium|high|urgent",
      "createdAt": "ISO_DATE"
    }
  ],
  "unreadCount": 5
}
```

### PATCH /notifications/:id/read
Mark notification as read

### POST /notifications/mark-all-read
Mark all notifications as read

### GET /notifications/settings
Get notification preferences

### PUT /notifications/settings
Update notification preferences

---

## 15. Print Management

### GET /print/settings
Get global print settings
```json
// Response
{
  "settings": {
    "billFormat": "A4|A5|thermal",
    "reportFormat": "A4",
    "headerSettings": {
      "showLogo": true,
      "showLabInfo": true,
      "customHeader": "Custom header text"
    },
    "footerSettings": {
      "showPageNumbers": true,
      "customFooter": "Thank you for choosing our services"
    },
    "margins": {
      "top": 20,
      "bottom": 20,
      "left": 15,
      "right": 15
    }
  }
}
```

### PUT /print/settings
Update print settings

### POST /print/preview
Generate print preview

### POST /print/custom
Custom print with specific settings

---

## 16. WhatsApp Integration

### POST /whatsapp/send-message
Send WhatsApp message
```json
// Request
{
  "phone": "+91-9876543210",
  "type": "text|image|document",
  "message": "Your test report is ready",
  "attachment": "file_url" // for image/document types
}
```

### GET /whatsapp/templates
Get WhatsApp message templates

### POST /whatsapp/templates
Create new message template

### GET /whatsapp/status/:messageId
Get message delivery status

### GET /whatsapp/settings
Get WhatsApp configuration

### PUT /whatsapp/settings
Update WhatsApp settings

---

## 17. SMS Integration

### POST /sms/send
Send SMS
```json
// Request
{
  "phone": "+91-9876543210",
  "message": "Your bill amount is ₹324. Pay now: [link]",
  "type": "notification|otp|marketing"
}
```

### GET /sms/templates
Get SMS templates

### GET /sms/delivery-report/:messageId
Get SMS delivery status

---

## 18. Email Integration

### POST /email/send
Send email
```json
// Request
{
  "to": "patient@example.com",
  "subject": "Your Test Report",
  "body": "HTML email body",
  "attachments": ["report.pdf"]
}
```

### GET /email/templates
Get email templates

### POST /email/templates
Create email template

---

## 19. File Management

### POST /files/upload
Upload files (reports, bills, images)
```json
// Response
{
  "file": {
    "id": "uuid",
    "filename": "report.pdf",
    "originalName": "patient_report.pdf",
    "url": "https://storage.com/files/report.pdf",
    "size": 1024,
    "mimeType": "application/pdf",
    "category": "report|bill|document|image",
    "uploadedBy": "uuid",
    "createdAt": "ISO_DATE"
  }
}
```

### GET /files/:id
Get file details

### DELETE /files/:id
Delete file

### GET /files/:id/download
Download file

---

## 20. Audit & Compliance

### GET /audit/logs
Get system audit logs
```json
// Response
{
  "logs": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "name": "Dr. Admin",
        "role": "Admin"
      },
      "action": "CREATE|READ|UPDATE|DELETE",
      "resource": "bills|patients|reports",
      "resourceId": "uuid",
      "details": {
        "changes": {
          "before": {},
          "after": {}
        }
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "ISO_DATE"
    }
  ]
}
```

### GET /audit/compliance
Get compliance reports

### GET /audit/data-export
Export data for compliance

---

## Error Codes Reference

### Authentication Errors
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Token invalid
- `AUTH_004`: Account suspended
- `AUTH_005`: Permission denied

### Validation Errors
- `VAL_001`: Missing required field
- `VAL_002`: Invalid data format
- `VAL_003`: Data constraint violation
- `VAL_004`: Duplicate entry

### Business Logic Errors
- `BIZ_001`: Insufficient subscription plan
- `BIZ_002`: Usage limit exceeded
- `BIZ_003`: Resource not found
- `BIZ_004`: Operation not allowed

### System Errors
- `SYS_001`: Database error
- `SYS_002`: External service unavailable
- `SYS_003`: File upload failed
- `SYS_004`: Rate limit exceeded

---

## Rate Limiting
- **Standard Users**: 1000 requests/hour
- **Admin Users**: 5000 requests/hour
- **File Uploads**: 100 uploads/hour
- **WhatsApp/SMS**: As per provider limits

## Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- API rate limiting
- Request/response logging
- Data encryption at rest
- Secure file uploads
- CORS protection
- Input sanitization

## Data Validation Rules
- Email format validation
- Indian phone number format (+91-XXXXXXXXXX)
- GST number validation
- Date format (ISO 8601)
- Positive numeric values for prices
- Required field validation
- Data type validation

## Subscription Plan Features

### Basic Plan
- 5 Users
- 1000 Patients
- Basic Tests
- Standard Reports
- Email Support

### Starter Plan
- 15 Users
- 5000 Patients
- All Tests
- Advanced Reports
- Phone Support

### Professional Plan
- 50 Users
- Unlimited Patients
- Collection Centers
- WhatsApp Integration
- SMS Integration
- Priority Support

### Enterprise Plan
- Unlimited Users
- Unlimited Patients
- Multi-location Support
- API Access
- Custom Integrations
- Dedicated Support

## Indian Healthcare Compliance
- Digital signature support
- NABH compliance features
- Government reporting formats
- Tax calculation (GST)
- Regional language support
- Indian address formats
- Healthcare regulations adherence