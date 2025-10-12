const SubscriptionPlanType = {
    Basic: 'Basic',
    Starter: 'Starter',
    Professional: 'Professional',
    Enterprise: 'Enterprise'
};

const SubscriptionStatusType = {
    Active: 'Active',
    Inactive: 'Inactive',
    Suspended: 'Suspended',
    Expired: 'Expired',
    Trial: 'Trial'
};

const UserRoleType = {
    SuperAdmin: 'SuperAdmin',
    TenantAdmin: 'TenantAdmin',
    Doctor: 'Doctor',
    Pathologist: 'Pathologist',
    Technician: 'Technician',
    Receptionist: 'Receptionist',
    Staff: 'Staff'
};

const Gender = {
    Male: 'Male',
    Female: 'Female',
    Other: 'Other'
};

const TestTypeEnum = {
    Normal: 'Normal',
    Descriptive: 'Descriptive',
    Group: 'Group'
};

const PaymentStatusType = {
    Pending: 'Pending',
    Partial: 'Partial',
    Paid: 'Paid',
    Cancelled: 'Cancelled',
    Refunded: 'Refunded'
};

const BillStatusType = {
    Draft: 'Draft',
    Active: 'Active',
    Cancelled: 'Cancelled',
    Refunded: 'Refunded'
};

const ReportStatusType = {
    SamplePending: 'SamplePending',
    SampleCollected: 'SampleCollected',
    InProgress: 'InProgress',
    Completed: 'Completed',
    Verified: 'Verified',
    Printed: 'Printed',
    Delivered: 'Delivered'
};

const CommunicationTypeEnum = {
    Whatsapp: 'Whatsapp',
    Sms: 'Sms',
    Email: 'Email',
    VoiceCall: 'VoiceCall'
};

const CommunicationStatusType = {
    Pending: 'Pending',
    Sent: 'Sent',
    Delivered: 'Delivered',
    Read: 'Read',
    Failed: 'Failed'
};

const SampleStatusType = {
    Collected: 'Collected',
    InTransit: 'InTransit',
    Received: 'Received',
    Processing: 'Processing',
    Completed: 'Completed',
    Delayed: 'Delayed'
};

const SamplePriorityType = {
    Normal: 'Normal',
    Urgent: 'Urgent',
    Emergency: 'Emergency'
};
const Department = {
    Administration: 'Administration',
    Laboratory: 'Laboratory',
    Collection: 'Collection',
    DataEntry: 'DataEntry',
    Operations: 'Operations',
    CustomerService: 'CustomerService'
};

module.exports = {
    SubscriptionPlanType,
    SubscriptionStatusType,
    UserRoleType,
    Gender,
    TestTypeEnum,
    PaymentStatusType,
    BillStatusType,
    ReportStatusType,
    CommunicationTypeEnum,
    CommunicationStatusType,
    SampleStatusType,
    SamplePriorityType,
    Department
}