import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Plus, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search,
  Building2,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Settings
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'technician' | 'collection_agent' | 'data_entry';
  department: string;
  isActive: boolean;
  joinDate: string;
}

interface CollectionCenter {
  id: string;
  centerCode: string;
  name: string;
  city: string;
  state: string;
  isActive: boolean;
}

interface StaffAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  centerId: string;
  centerName: string;
  centerCode: string;
  assignedRole: 'center_manager' | 'technician' | 'collection_agent' | 'data_entry_operator';
  isPrimary: boolean;
  canCollectSamples: boolean;
  canProcessBilling: boolean;
  canManageInventory: boolean;
  canViewReports: boolean;
  shiftTiming: {
    start: string;
    end: string;
    days: string[];
  };
  assignedFrom: string;
  assignedUntil?: string;
  isActive: boolean;
  assignedBy: string;
  createdAt: string;
}

interface CollectionCenterStaffAssignmentProps {
  selectedCenterId?: string;
  onClose?: () => void;
}

export function CollectionCenterStaffAssignment({ selectedCenterId, onClose }: CollectionCenterStaffAssignmentProps) {
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [centers, setCenters] = useState<CollectionCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(selectedCenterId || 'all');
  const [activeTab, setActiveTab] = useState('assignments');

  const [assignmentForm, setAssignmentForm] = useState({
    userId: '',
    centerId: selectedCenterId || '',
    assignedRole: 'technician' as StaffAssignment['assignedRole'],
    isPrimary: false,
    canCollectSamples: true,
    canProcessBilling: false,
    canManageInventory: false,
    canViewReports: true,
    shiftTiming: {
      start: '09:00',
      end: '18:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    assignedFrom: new Date().toISOString().split('T')[0],
    assignedUntil: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Mock users
      const mockUsers: User[] = [
        {
          id: 'user1',
          name: 'Dr. Priya Sharma',
          email: 'priya.sharma@lab.com',
          phone: '+91-9876543210',
          role: 'admin',
          department: 'Administration',
          isActive: true,
          joinDate: '2024-01-15'
        },
        {
          id: 'user2',
          name: 'Raj Patel',
          email: 'raj.patel@lab.com',
          phone: '+91-9876543211',
          role: 'technician',
          department: 'Laboratory',
          isActive: true,
          joinDate: '2024-02-01'
        },
        {
          id: 'user3',
          name: 'Sunita Desai',
          email: 'sunita.desai@lab.com',
          phone: '+91-9876543212',
          role: 'collection_agent',
          department: 'Collection',
          isActive: true,
          joinDate: '2024-02-15'
        },
        {
          id: 'user4',
          name: 'Amit Kumar',
          email: 'amit.kumar@lab.com',
          phone: '+91-9876543213',
          role: 'data_entry',
          department: 'Operations',
          isActive: true,
          joinDate: '2024-03-01'
        },
        {
          id: 'user5',
          name: 'Meera Joshi',
          email: 'meera.joshi@lab.com',
          phone: '+91-9876543214',
          role: 'manager',
          department: 'Operations',
          isActive: true,
          joinDate: '2024-01-20'
        }
      ];

      // Mock collection centers
      const mockCenters: CollectionCenter[] = [
        {
          id: 'cc1',
          centerCode: 'CC001',
          name: 'PathoCare Collection Center - Andheri',
          city: 'Mumbai',
          state: 'Maharashtra',
          isActive: true
        },
        {
          id: 'cc2',
          centerCode: 'CC002',
          name: 'PathoCare Collection Center - Borivali',
          city: 'Mumbai',
          state: 'Maharashtra',
          isActive: true
        },
        {
          id: 'cc3',
          centerCode: 'CC003',
          name: 'PathoCare Collection Center - Thane',
          city: 'Thane',
          state: 'Maharashtra',
          isActive: true
        }
      ];

      // Mock staff assignments
      const mockAssignments: StaffAssignment[] = [
        {
          id: 'assign1',
          userId: 'user2',
          userName: 'Raj Patel',
          userEmail: 'raj.patel@lab.com',
          userRole: 'technician',
          centerId: 'cc1',
          centerName: 'PathoCare Collection Center - Andheri',
          centerCode: 'CC001',
          assignedRole: 'technician',
          isPrimary: true,
          canCollectSamples: true,
          canProcessBilling: true,
          canManageInventory: false,
          canViewReports: true,
          shiftTiming: {
            start: '08:00',
            end: '17:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          },
          assignedFrom: '2024-02-01',
          isActive: true,
          assignedBy: 'admin',
          createdAt: '2024-02-01T09:00:00Z'
        },
        {
          id: 'assign2',
          userId: 'user3',
          userName: 'Sunita Desai',
          userEmail: 'sunita.desai@lab.com',
          userRole: 'collection_agent',
          centerId: 'cc1',
          centerName: 'PathoCare Collection Center - Andheri',
          centerCode: 'CC001',
          assignedRole: 'collection_agent',
          isPrimary: false,
          canCollectSamples: true,
          canProcessBilling: false,
          canManageInventory: false,
          canViewReports: false,
          shiftTiming: {
            start: '09:00',
            end: '18:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          },
          assignedFrom: '2024-02-15',
          isActive: true,
          assignedBy: 'admin',
          createdAt: '2024-02-15T09:00:00Z'
        },
        {
          id: 'assign3',
          userId: 'user5',
          userName: 'Meera Joshi',
          userEmail: 'meera.joshi@lab.com',
          userRole: 'manager',
          centerId: 'cc2',
          centerName: 'PathoCare Collection Center - Borivali',
          centerCode: 'CC002',
          assignedRole: 'center_manager',
          isPrimary: true,
          canCollectSamples: true,
          canProcessBilling: true,
          canManageInventory: true,
          canViewReports: true,
          shiftTiming: {
            start: '08:30',
            end: '18:30',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          },
          assignedFrom: '2024-01-20',
          isActive: true,
          assignedBy: 'admin',
          createdAt: '2024-01-20T09:00:00Z'
        },
        {
          id: 'assign4',
          userId: 'user4',
          userName: 'Amit Kumar',
          userEmail: 'amit.kumar@lab.com',
          userRole: 'data_entry',
          centerId: 'cc3',
          centerName: 'PathoCare Collection Center - Thane',
          centerCode: 'CC003',
          assignedRole: 'data_entry_operator',
          isPrimary: false,
          canCollectSamples: false,
          canProcessBilling: true,
          canManageInventory: false,
          canViewReports: true,
          shiftTiming: {
            start: '10:00',
            end: '19:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          },
          assignedFrom: '2024-03-01',
          isActive: true,
          assignedBy: 'admin',
          createdAt: '2024-03-01T09:00:00Z'
        }
      ];

      setUsers(mockUsers);
      setCenters(mockCenters);
      setAssignments(mockAssignments);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.centerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.assignedRole.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCenter = selectedCenter === 'all' || assignment.centerId === selectedCenter;
    
    return matchesSearch && matchesCenter;
  });

  // Get unassigned users for selected center
  const getUnassignedUsers = () => {
    if (!assignmentForm.centerId) return users.filter(u => u.isActive);
    
    const assignedUserIds = assignments
      .filter(a => a.centerId === assignmentForm.centerId && a.isActive)
      .map(a => a.userId);
    
    return users.filter(u => u.isActive && !assignedUserIds.includes(u.id));
  };

  const handleAssignStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedUser = users.find(u => u.id === assignmentForm.userId);
      const selectedCenterObj = centers.find(c => c.id === assignmentForm.centerId);
      
      if (!selectedUser || !selectedCenterObj) return;

      const newAssignment: StaffAssignment = {
        id: `assign-${Date.now()}`,
        userId: selectedUser.id,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
        userRole: selectedUser.role,
        centerId: selectedCenterObj.id,
        centerName: selectedCenterObj.name,
        centerCode: selectedCenterObj.centerCode,
        assignedRole: assignmentForm.assignedRole,
        isPrimary: assignmentForm.isPrimary,
        canCollectSamples: assignmentForm.canCollectSamples,
        canProcessBilling: assignmentForm.canProcessBilling,
        canManageInventory: assignmentForm.canManageInventory,
        canViewReports: assignmentForm.canViewReports,
        shiftTiming: assignmentForm.shiftTiming,
        assignedFrom: assignmentForm.assignedFrom,
        assignedUntil: assignmentForm.assignedUntil || undefined,
        isActive: true,
        assignedBy: 'current-admin',
        createdAt: new Date().toISOString()
      };

      setAssignments(prev => [...prev, newAssignment]);
      setIsAssignModalOpen(false);
      
      // Reset form
      setAssignmentForm({
        userId: '',
        centerId: selectedCenterId || '',
        assignedRole: 'technician',
        isPrimary: false,
        canCollectSamples: true,
        canProcessBilling: false,
        canManageInventory: false,
        canViewReports: true,
        shiftTiming: {
          start: '09:00',
          end: '18:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        },
        assignedFrom: new Date().toISOString().split('T')[0],
        assignedUntil: ''
      });

    } catch (error) {
      console.error('Error assigning staff:', error);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (window.confirm('Are you sure you want to remove this staff assignment?')) {
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    }
  };

  const toggleAssignmentStatus = (assignmentId: string) => {
    setAssignments(prev => prev.map(assignment =>
      assignment.id === assignmentId 
        ? { ...assignment, isActive: !assignment.isActive }
        : assignment
    ));
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      center_manager: { label: 'Manager', color: 'bg-purple-100 text-purple-800' },
      technician: { label: 'Technician', color: 'bg-blue-100 text-blue-800' },
      collection_agent: { label: 'Collection Agent', color: 'bg-green-100 text-green-800' },
      data_entry_operator: { label: 'Data Entry', color: 'bg-orange-100 text-orange-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPermissionsList = (assignment: StaffAssignment) => {
    const permissions = [];
    if (assignment.canCollectSamples) permissions.push('Sample Collection');
    if (assignment.canProcessBilling) permissions.push('Billing');
    if (assignment.canManageInventory) permissions.push('Inventory');
    if (assignment.canViewReports) permissions.push('Reports');
    return permissions;
  };

  // Summary statistics
  const totalAssignments = assignments.filter(a => a.isActive).length;
  const centersCovered = new Set(assignments.filter(a => a.isActive).map(a => a.centerId)).size;
  const primaryManagers = assignments.filter(a => a.isPrimary && a.isActive).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading staff assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1>Staff Assignment Management</h1>
          <p className="text-muted-foreground">Assign staff to collection centers with role-based permissions</p>
        </div>
        
        <div className="flex gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Back
            </Button>
          )}
          
          <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Assign Staff to Collection Center</DialogTitle>
                <DialogDescription>
                  Assign a staff member to a collection center with specific role and permissions
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAssignStaff} className="space-y-6">
                {/* User and Center Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="centerId">Collection Center *</Label>
                    <Select 
                      value={assignmentForm.centerId} 
                      onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, centerId: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection center" />
                      </SelectTrigger>
                      <SelectContent>
                        {centers.filter(c => c.isActive).map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.centerCode} - {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="userId">Staff Member *</Label>
                    <Select 
                      value={assignmentForm.userId} 
                      onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, userId: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {getUnassignedUsers().map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Role and Primary Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignedRole">Assigned Role *</Label>
                    <Select 
                      value={assignmentForm.assignedRole} 
                      onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, assignedRole: value as StaffAssignment['assignedRole'] }))}
                    >
                      <SelectTrigger>
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
                  
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="isPrimary"
                      checked={assignmentForm.isPrimary}
                      onCheckedChange={(checked) => setAssignmentForm(prev => ({ ...prev, isPrimary: checked }))}
                    />
                    <Label htmlFor="isPrimary">Primary Contact for Center</Label>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canCollectSamples"
                        checked={assignmentForm.canCollectSamples}
                        onCheckedChange={(checked) => setAssignmentForm(prev => ({ ...prev, canCollectSamples: checked }))}
                      />
                      <Label htmlFor="canCollectSamples">Sample Collection</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canProcessBilling"
                        checked={assignmentForm.canProcessBilling}
                        onCheckedChange={(checked) => setAssignmentForm(prev => ({ ...prev, canProcessBilling: checked }))}
                      />
                      <Label htmlFor="canProcessBilling">Process Billing</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageInventory"
                        checked={assignmentForm.canManageInventory}
                        onCheckedChange={(checked) => setAssignmentForm(prev => ({ ...prev, canManageInventory: checked }))}
                      />
                      <Label htmlFor="canManageInventory">Manage Inventory</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canViewReports"
                        checked={assignmentForm.canViewReports}
                        onCheckedChange={(checked) => setAssignmentForm(prev => ({ ...prev, canViewReports: checked }))}
                      />
                      <Label htmlFor="canViewReports">View Reports</Label>
                    </div>
                  </div>
                </div>

                {/* Shift Timing */}
                <div>
                  <Label>Shift Timing</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="shiftStart">Start Time</Label>
                      <Input
                        id="shiftStart"
                        type="time"
                        value={assignmentForm.shiftTiming.start}
                        onChange={(e) => setAssignmentForm(prev => ({
                          ...prev,
                          shiftTiming: { ...prev.shiftTiming, start: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shiftEnd">End Time</Label>
                      <Input
                        id="shiftEnd"
                        type="time"
                        value={assignmentForm.shiftTiming.end}
                        onChange={(e) => setAssignmentForm(prev => ({
                          ...prev,
                          shiftTiming: { ...prev.shiftTiming, end: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Assignment Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignedFrom">Assigned From *</Label>
                    <Input
                      id="assignedFrom"
                      type="date"
                      value={assignmentForm.assignedFrom}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, assignedFrom: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="assignedUntil">Assigned Until (Optional)</Label>
                    <Input
                      id="assignedUntil"
                      type="date"
                      value={assignmentForm.assignedUntil}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, assignedUntil: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Assign Staff
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-semibold">{totalAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Centers Covered</p>
                <p className="text-2xl font-semibold">{centersCovered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Primary Managers</p>
                <p className="text-2xl font-semibold">{primaryManagers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">Staff Assignments</TabsTrigger>
          <TabsTrigger value="centers">By Center</TabsTrigger>
          <TabsTrigger value="users">Unassigned Users</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCenter} onValueChange={setSelectedCenter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Centers</SelectItem>
                {centers.map((center) => (
                  <SelectItem key={center.id} value={center.id}>
                    {center.centerCode} - {center.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignments Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Collection Center</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Shift Timing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{assignment.userName}</p>
                            {assignment.isPrimary && (
                              <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{assignment.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{assignment.centerCode}</p>
                          <p className="text-sm text-muted-foreground">{assignment.centerName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(assignment.assignedRole)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getPermissionsList(assignment).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{assignment.shiftTiming.start} - {assignment.shiftTiming.end}</p>
                          <p className="text-muted-foreground">
                            {assignment.shiftTiming.days.length} days/week
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={assignment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {assignment.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Since: {new Date(assignment.assignedFrom).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleAssignmentStatus(assignment.id)}>
                              <UserCheck className="w-4 h-4 mr-2" />
                              {assignment.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRemoveAssignment(assignment.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Assignment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {centers.map((center) => {
              const centerAssignments = assignments.filter(a => a.centerId === center.id && a.isActive);
              const primaryManager = centerAssignments.find(a => a.isPrimary);
              
              return (
                <Card key={center.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {center.centerCode}
                    </CardTitle>
                    <CardDescription>{center.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Staff Assigned:</span>
                      <span className="font-medium">{centerAssignments.length}</span>
                    </div>
                    
                    {primaryManager && (
                      <div>
                        <p className="text-sm text-muted-foreground">Primary Manager:</p>
                        <p className="font-medium">{primaryManager.userName}</p>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      {centerAssignments.slice(0, 3).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between text-sm">
                          <span>{assignment.userName}</span>
                          {getRoleBadge(assignment.assignedRole)}
                        </div>
                      ))}
                      {centerAssignments.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{centerAssignments.length - 3} more
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              These staff members haven't been assigned to any collection center yet.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.filter(user => {
              const assignedUserIds = assignments.filter(a => a.isActive).map(a => a.userId);
              return user.isActive && !assignedUserIds.includes(user.id);
            }).map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{user.name}</p>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.department}</p>
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={() => {
                        setAssignmentForm(prev => ({ ...prev, userId: user.id }));
                        setIsAssignModalOpen(true);
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign to Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}