import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  UserCheck, 
  UserX,
  MoreHorizontal,
  Shield,
  Eye,
  EyeOff,
  Building2,
  UserPlus,
  Lock
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Role } from '../types/permissions';
import { PermissionDisplay, PermissionCheckboxes } from './PermissionDisplay';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionGate } from './PermissionGate';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  status: 'Active' | 'Inactive';
  department: string;
  employeeId?: string;
  collectionCenterAssignments?: {
    centerId: string;
    centerName: string;
    centerCode: string;
    assignedRole: 'center_manager' | 'technician' | 'collection_agent' | 'data_entry_operator';
    isPrimary: boolean;
    permissions: {
      canCollectSamples: boolean;
      canProcessBilling: boolean;
      canManageInventory: boolean;
      canViewReports: boolean;
    };
  }[];
  permissions: {
    smsWhatsappPatient: boolean;
    emailReportPatient: boolean;
    dailyReport: boolean;
    monthlyReport: boolean;
    dueReport: boolean;
    referralReport: boolean;
  };
  hasPassword: boolean;
  createdBy: string;
  createdAt: string;
}

interface UserManagementProps {
  currentUser?: {
    role: string;
    id: string;
    name: string;
    email: string;
  };
}

export function UserManagement({ currentUser: propCurrentUser }: UserManagementProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Get user subscription plan from App context
  const userSubscriptionPlan = (window as any).userSubscriptionPlan || 'professional';
  
  // Current user permissions - use passed prop or default
  const currentUser = propCurrentUser || {
    role: 'Admin' as Role,
    id: 'current-user-id'
  };
  
  const userPermissions = usePermissions({
    userRole: currentUser.role,
    userId: currentUser.id
  });
  
  // Collection Centers for assignment
  const mockCollectionCenters = [
    {
      id: 'main-lab',
      code: 'MAIN',
      name: 'Main Laboratory',
      address: '123 Medical Center Dr, Health City, HC 12345'
    },
    {
      id: 'cc1',
      code: 'CC001',
      name: 'PathoCare Collection Center - Andheri',
      address: '123, S.V. Road, Andheri West, Mumbai - 400058'
    },
    {
      id: 'cc2',
      code: 'CC002', 
      name: 'PathoCare Collection Center - Borivali',
      address: '456, Link Road, Borivali East, Mumbai - 400066'
    },
    {
      id: 'cc3',
      code: 'CC003',
      name: 'PathoCare Collection Center - Thane',
      address: '789, Ghodbunder Road, Thane West - 400601'
    }
  ];

  // Form state for creating/editing users
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+91 ',
    role: 'Technician' as Role,
    department: '',
    employeeId: '',
    password: '',
    confirmPassword: '',
    collectionCenterAssignments: [] as User['collectionCenterAssignments'],
    permissions: {
      smsWhatsappPatient: false,
      emailReportPatient: true,
      dailyReport: true,
      monthlyReport: true,
      dueReport: true,
      referralReport: false
    }
  });

  // Sample user data with updated collection center assignments and passwords
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'Dr. John',
      lastName: 'Admin',
      email: 'admin@healthcare.com',
      phone: '+91-9876543210',
      role: 'Admin',
      status: 'Active',
      department: 'Administration',
      employeeId: 'EMP001',
      hasPassword: true,
      permissions: {
        smsWhatsappPatient: true,
        emailReportPatient: true,
        dailyReport: true,
        monthlyReport: true,
        dueReport: true,
        referralReport: true
      },
      createdBy: 'System',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@healthcare.com',
      phone: '+91-9876543211',
      role: 'Technician',
      status: 'Active',
      department: 'Laboratory',
      employeeId: 'EMP002',
      hasPassword: true,
      collectionCenterAssignments: [{
        centerId: 'cc1',
        centerName: 'PathoCare Collection Center - Andheri',
        centerCode: 'CC001',
        assignedRole: 'technician',
        isPrimary: true,
        permissions: {
          canCollectSamples: true,
          canProcessBilling: true,
          canManageInventory: false,
          canViewReports: true
        }
      }],
      permissions: {
        smsWhatsappPatient: false,
        emailReportPatient: true,
        dailyReport: true,
        monthlyReport: true,
        dueReport: true,
        referralReport: false
      },
      createdBy: 'Dr. John Admin',
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Wilson',
      email: 'mike.w@healthcare.com',
      phone: '+91-9876543212',
      role: 'Viewer',
      status: 'Active',
      department: 'Administration',
      employeeId: 'EMP003',
      hasPassword: false,
      permissions: {
        smsWhatsappPatient: false,
        emailReportPatient: false,
        dailyReport: true,
        monthlyReport: true,
        dueReport: false,
        referralReport: false
      },
      createdBy: 'Dr. John Admin',
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@healthcare.com',
      phone: '+91-9876543213',
      role: 'Collection Agent',
      status: 'Active',
      department: 'Collection',
      employeeId: 'EMP004',
      hasPassword: true,
      collectionCenterAssignments: [{
        centerId: 'cc2',
        centerName: 'PathoCare Collection Center - Borivali',
        centerCode: 'CC002',
        assignedRole: 'collection_agent',
        isPrimary: false,
        permissions: {
          canCollectSamples: true,
          canProcessBilling: false,
          canManageInventory: false,
          canViewReports: false
        }
      }],
      permissions: {
        smsWhatsappPatient: false,
        emailReportPatient: false,
        dailyReport: false,
        monthlyReport: false,
        dueReport: false,
        referralReport: false
      },
      createdBy: 'Dr. John Admin',
      createdAt: '2024-02-10'
    },
    {
      id: '5',
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'amit.kumar@healthcare.com',
      phone: '+91-9876543214',
      role: 'Manager',
      status: 'Active',
      department: 'Operations',
      employeeId: 'EMP005',
      hasPassword: true,
      collectionCenterAssignments: [{
        centerId: 'cc3',
        centerName: 'PathoCare Collection Center - Thane',
        centerCode: 'CC003',
        assignedRole: 'center_manager',
        isPrimary: true,
        permissions: {
          canCollectSamples: true,
          canProcessBilling: true,
          canManageInventory: true,
          canViewReports: true
        }
      }],
      permissions: {
        smsWhatsappPatient: true,
        emailReportPatient: true,
        dailyReport: true,
        monthlyReport: true,
        dueReport: true,
        referralReport: true
      },
      createdBy: 'Dr. John Admin',
      createdAt: '2024-01-25'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '+91 ',
      role: 'Technician',
      department: '',
      employeeId: '',
      password: '',
      confirmPassword: '',
      collectionCenterAssignments: [],
      permissions: {
        smsWhatsappPatient: false,
        emailReportPatient: true,
        dailyReport: true,
        monthlyReport: true,
        dueReport: true,
        referralReport: false
      }
    });
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      employeeId: formData.employeeId || `EMP${Date.now().toString().slice(-3)}`,
      status: 'Active',
      hasPassword: true,
      collectionCenterAssignments: formData.collectionCenterAssignments,
      permissions: formData.permissions,
      createdBy: 'Dr. Admin',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '+91 ',
      role: 'Technician',
      department: '',
      employeeId: '',
      password: '',
      confirmPassword: '',
      collectionCenterAssignments: [],
      permissions: {
        smsWhatsappPatient: false,
        emailReportPatient: true,
        dailyReport: true,
        monthlyReport: true,
        dueReport: true,
        referralReport: false
      }
    });

    setIsCreateModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-purple-100 text-purple-800';
      case 'Technician': return 'bg-blue-100 text-blue-800';
      case 'Collection Agent': return 'bg-green-100 text-green-800';
      case 'Data Entry': return 'bg-orange-100 text-orange-800';
      case 'Viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Check if user has collection center access
  const hasCollectionCenterAccess = () => {
    return userSubscriptionPlan === 'professional' || userSubscriptionPlan === 'enterprise';
  };

  return (
    <PermissionGate
      userRole={currentUser.role as Role}
      module="Users Management"
      action="view"
      fallback={
        <div className="p-6">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">You don't have permission to access user management.</p>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1>User Management</h1>
            <p className="text-muted-foreground">Manage system users and their permissions</p>
          </div>
          {userPermissions.permissions.users.canCreate && (
            <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          )}
        </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Technician">Technician</SelectItem>
            <SelectItem value="Collection Agent">Collection Agent</SelectItem>
            <SelectItem value="Data Entry">Data Entry</SelectItem>
            <SelectItem value="Viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-semibold">{users.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-semibold">{users.filter(u => u.status === 'Active').length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-semibold">{users.filter(u => u.role === 'Admin').length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserX className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Technicians</p>
              <p className="text-2xl font-semibold">{users.filter(u => u.role === 'Technician').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <div className="p-4 border-b">
          <h3>System Users</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Collection Center</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      {user.hasPassword && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          Password Set
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.employeeId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{user.phone}</p>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{user.department}</p>
                </TableCell>
                <TableCell>
                  {user.collectionCenterAssignments && user.collectionCenterAssignments.length > 0 ? (
                    <div className="space-y-1">
                      {user.collectionCenterAssignments.map((assignment, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {assignment.centerCode}
                            </Badge>
                            {assignment.isPrimary && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">Primary</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{assignment.assignedRole}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No Assignment</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{user.createdBy}</p>
                  <p className="text-xs text-muted-foreground">{user.createdAt}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {userPermissions.permissions.users.canEdit && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {userPermissions.permissions.users.canEdit && (
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                            {user.status === 'Active' ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        {userPermissions.permissions.users.canDelete && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center bg-blue-600 text-white p-4 -m-6 mb-6 rounded-t-lg">
            <DialogTitle className="text-xl text-white">
              Add Staff
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Create a new staff member account
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white space-y-4 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Staff Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className={`${!formData.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} bg-white`}
                    required
                  />
                  {!formData.firstName && (
                    <p className="text-red-500 text-xs">First Name is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className={`${!formData.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} bg-white`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`${!formData.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} bg-white`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="border-gray-300 bg-white"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role">Role & Permissions *</Label>
                  <div className="space-y-3">
                    <PermissionCheckboxes
                      selectedRole={formData.role}
                      onChange={(role) => setFormData(prev => ({ ...prev, role }))}
                      disabled={false}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Laboratory">Laboratory</SelectItem>
                      <SelectItem value="Collection">Collection</SelectItem>
                      <SelectItem value="Data Entry">Data Entry</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="employeeId">Employee ID (Optional)</Label>
                  <Input
                    id="employeeId"
                    placeholder="Auto-generated if left empty"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="border-gray-300 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-white space-y-4 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Login Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password (min 6 characters)"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={`${formData.password.length < 6 && formData.password.length > 0 ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} bg-white pr-10`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {formData.password.length > 0 && formData.password.length < 6 && (
                    <p className="text-red-500 text-xs">Password must be at least 6 characters</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} bg-white pr-10`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>

            {/* Collection Center Assignment - Only for Professional/Enterprise */}
            {hasCollectionCenterAccess() ? (
              <div className="bg-white space-y-4 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Collection Center Assignment
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assign to Collection Center (Optional)</Label>
                    <Select 
                      value={formData.collectionCenterAssignments?.[0]?.centerId || 'no-assignment'} 
                      onValueChange={(value) => {
                        if (value && value !== 'no-assignment') {
                          const center = mockCollectionCenters.find(c => c.id === value);
                          if (center) {
                            setFormData(prev => ({
                              ...prev,
                              collectionCenterAssignments: [{
                                centerId: center.id,
                                centerName: center.name,
                                centerCode: center.code,
                                assignedRole: 'technician',
                                isPrimary: false,
                                permissions: {
                                  canCollectSamples: true,
                                  canProcessBilling: false,
                                  canManageInventory: false,
                                  canViewReports: true
                                }
                              }]
                            }));
                          }
                        } else {
                          setFormData(prev => ({ ...prev, collectionCenterAssignments: [] }));
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select collection center" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-assignment">No Assignment</SelectItem>
                        {mockCollectionCenters.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.code} - {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.collectionCenterAssignments?.[0] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Role at Center</Label>
                        <Select 
                          value={formData.collectionCenterAssignments[0].assignedRole} 
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            collectionCenterAssignments: prev.collectionCenterAssignments ? [{
                              ...prev.collectionCenterAssignments[0],
                              assignedRole: value as any
                            }] : []
                          }))}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="center_manager">Center Manager</SelectItem>
                            <SelectItem value="technician">Technician</SelectItem>
                            <SelectItem value="collection_agent">Collection Agent</SelectItem>
                            <SelectItem value="data_entry_operator">Data Entry Operator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id="isPrimary"
                          checked={formData.collectionCenterAssignments[0].isPrimary}
                          onCheckedChange={(checked) => setFormData(prev => ({
                            ...prev,
                            collectionCenterAssignments: prev.collectionCenterAssignments ? [{
                              ...prev.collectionCenterAssignments[0],
                              isPrimary: !!checked
                            }] : []
                          }))}
                        />
                        <Label htmlFor="isPrimary">Primary Contact for Center</Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Building2 className="w-5 h-5" />
                  <p className="font-medium">Collection Center Assignment</p>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Upgrade to Professional or Enterprise plan to assign staff to collection centers.
                </p>
              </div>
            )}

            {/* Permissions Section */}
            <div className="bg-white space-y-4 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Permissions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="smsWhatsappPatient"
                    checked={formData.permissions.smsWhatsappPatient}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, smsWhatsappPatient: !!checked }
                    }))}
                  />
                  <Label htmlFor="smsWhatsappPatient">SMS/WhatsApp to Patient</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="emailReportPatient"
                    checked={formData.permissions.emailReportPatient}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, emailReportPatient: !!checked }
                    }))}
                  />
                  <Label htmlFor="emailReportPatient">Email Report to Patient</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="dailyReport"
                    checked={formData.permissions.dailyReport}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, dailyReport: !!checked }
                    }))}
                  />
                  <Label htmlFor="dailyReport">Daily Report</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="monthlyReport"
                    checked={formData.permissions.monthlyReport}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, monthlyReport: !!checked }
                    }))}
                  />
                  <Label htmlFor="monthlyReport">Monthly Report</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="dueReport"
                    checked={formData.permissions.dueReport}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, dueReport: !!checked }
                    }))}
                  />
                  <Label htmlFor="dueReport">Due Report</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="referralReport"
                    checked={formData.permissions.referralReport}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, referralReport: !!checked }
                    }))}
                  />
                  <Label htmlFor="referralReport">Referral Report</Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!formData.firstName || !formData.lastName || !formData.email || formData.password.length < 6 || formData.password !== formData.confirmPassword}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Staff
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </PermissionGate>
  );
}