import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  MoreHorizontal,
  MapPin,
  Building2,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Activity,
  UserPlus
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { CollectionCenterStaffAssignment } from './CollectionCenterStaffAssignment';

interface CollectionCenter {
  id: string;
  centerCode: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  email: string;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  services: string[];
  commissionPercentage: number;
  isActive: boolean;
  assignedStaff: number;
  totalSamples: number;
  pendingSamples: number;
  monthlyRevenue: number;
  createdAt: string;
  lastActivity: string;
}

interface SampleMovement {
  id: string;
  sampleId: string;
  patientName: string;
  testNames: string[];
  fromCenter: string;
  status: 'collected' | 'in_transit' | 'received' | 'processing' | 'completed';
  collectedAt: string;
  expectedArrival: string;
  actualArrival?: string;
  priority: 'normal' | 'urgent' | 'emergency';
}

export function CollectionCentersManagement() {
  const [centers, setCenters] = useState<CollectionCenter[]>([]);
  const [sampleMovements, setSampleMovements] = useState<SampleMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<CollectionCenter | null>(null);
  const [activeTab, setActiveTab] = useState('centers');
  const [showStaffAssignment, setShowStaffAssignment] = useState(false);
  const [selectedCenterForStaff, setSelectedCenterForStaff] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState({
    centerCode: '',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    phone: '',
    email: '',
    workingHours: {
      start: '09:00',
      end: '18:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    services: [] as string[],
    commissionPercentage: 0,
    isActive: true
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Mock collection centers
      const mockCenters: CollectionCenter[] = [
        {
          id: '1',
          centerCode: 'CC001',
          name: 'PathoCare Collection Center - Andheri',
          address: '123, S.V. Road, Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400058',
          contactPerson: 'Priya Sharma',
          phone: '+91-9876543210',
          email: 'andheri@pathocare.com',
          workingHours: {
            start: '08:00',
            end: '20:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          },
          services: ['Blood Collection', 'Urine Collection', 'Home Collection'],
          commissionPercentage: 15,
          isActive: true,
          assignedStaff: 4,
          totalSamples: 1250,
          pendingSamples: 8,
          monthlyRevenue: 125000,
          createdAt: '2024-01-15',
          lastActivity: '2024-12-01 14:30'
        },
        {
          id: '2',
          centerCode: 'CC002',
          name: 'PathoCare Collection Center - Borivali',
          address: '456, Link Road, Borivali East',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400066',
          contactPerson: 'Raj Patel',
          phone: '+91-9876543211',
          email: 'borivali@pathocare.com',
          workingHours: {
            start: '09:00',
            end: '19:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          },
          services: ['Blood Collection', 'Urine Collection'],
          commissionPercentage: 12,
          isActive: true,
          assignedStaff: 3,
          totalSamples: 890,
          pendingSamples: 5,
          monthlyRevenue: 89000,
          createdAt: '2024-02-20',
          lastActivity: '2024-12-01 16:45'
        },
        {
          id: '3',
          centerCode: 'CC003',
          name: 'PathoCare Collection Center - Thane',
          address: '789, Ghodbunder Road, Thane West',
          city: 'Thane',
          state: 'Maharashtra',
          pincode: '400601',
          contactPerson: 'Sunita Desai',
          phone: '+91-9876543212',
          email: 'thane@pathocare.com',
          workingHours: {
            start: '08:30',
            end: '18:30',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          },
          services: ['Blood Collection', 'Urine Collection', 'ECG'],
          commissionPercentage: 18,
          isActive: false,
          assignedStaff: 2,
          totalSamples: 650,
          pendingSamples: 0,
          monthlyRevenue: 45000,
          createdAt: '2024-03-10',
          lastActivity: '2024-11-28 10:15'
        }
      ];

      // Mock sample movements
      const mockMovements: SampleMovement[] = [
        {
          id: '1',
          sampleId: 'SAM-001',
          patientName: 'Amit Kumar',
          testNames: ['CBC', 'Blood Glucose'],
          fromCenter: 'CC001',
          status: 'in_transit',
          collectedAt: '2024-12-01 10:30',
          expectedArrival: '2024-12-01 16:00',
          priority: 'normal'
        },
        {
          id: '2',
          sampleId: 'SAM-002',
          patientName: 'Meera Joshi',
          testNames: ['Lipid Profile', 'HbA1c'],
          fromCenter: 'CC002',
          status: 'received',
          collectedAt: '2024-12-01 09:15',
          expectedArrival: '2024-12-01 15:00',
          actualArrival: '2024-12-01 14:45',
          priority: 'urgent'
        },
        {
          id: '3',
          sampleId: 'SAM-003',
          patientName: 'Ravi Singh',
          testNames: ['Thyroid Profile'],
          fromCenter: 'CC001',
          status: 'collected',
          collectedAt: '2024-12-01 12:00',
          expectedArrival: '2024-12-01 18:00',
          priority: 'normal'
        }
      ];

      setCenters(mockCenters);
      setSampleMovements(mockMovements);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredCenters = centers.filter(center => {
    const matchesSearch = 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.centerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && center.isActive) ||
      (selectedStatus === 'inactive' && !center.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      centerCode: '',
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      contactPerson: '',
      phone: '',
      email: '',
      workingHours: {
        start: '09:00',
        end: '18:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      services: [],
      commissionPercentage: 0,
      isActive: true
    });
    setEditingCenter(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCenter) {
        // Update existing center
        const updatedCenter = {
          ...editingCenter,
          ...formData,
          lastActivity: new Date().toISOString()
        };
        setCenters(prev => prev.map(center =>
          center.id === editingCenter.id ? updatedCenter : center
        ));
      } else {
        // Add new center
        const newCenter: CollectionCenter = {
          id: String(Date.now()),
          ...formData,
          assignedStaff: 0,
          totalSamples: 0,
          pendingSamples: 0,
          monthlyRevenue: 0,
          createdAt: new Date().toISOString().split('T')[0],
          lastActivity: new Date().toISOString()
        };
        setCenters(prev => [...prev, newCenter]);
      }

      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving center:', error);
    }
  };

  const handleEdit = (center: CollectionCenter) => {
    setEditingCenter(center);
    setFormData({
      centerCode: center.centerCode,
      name: center.name,
      address: center.address,
      city: center.city,
      state: center.state,
      pincode: center.pincode,
      contactPerson: center.contactPerson,
      phone: center.phone,
      email: center.email,
      workingHours: center.workingHours,
      services: center.services,
      commissionPercentage: center.commissionPercentage,
      isActive: center.isActive
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (centerId: string) => {
    if (window.confirm('Are you sure you want to delete this collection center?')) {
      setCenters(prev => prev.filter(center => center.id !== centerId));
    }
  };

  const toggleCenterStatus = (centerId: string) => {
    setCenters(prev => prev.map(center =>
      center.id === centerId ? { ...center, isActive: !center.isActive } : center
    ));
  };

  const getStatusBadge = (status: SampleMovement['status']) => {
    const statusConfig = {
      collected: { label: 'Collected', color: 'bg-blue-100 text-blue-800' },
      in_transit: { label: 'In Transit', color: 'bg-yellow-100 text-yellow-800' },
      received: { label: 'Received', color: 'bg-green-100 text-green-800' },
      processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: SampleMovement['priority']) => {
    const priorityConfig = {
      normal: { label: 'Normal', color: 'bg-gray-100 text-gray-800' },
      urgent: { label: 'Urgent', color: 'bg-orange-100 text-orange-800' },
      emergency: { label: 'Emergency', color: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig[priority];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Summary statistics
  const totalCenters = centers.length;
  const activeCenters = centers.filter(c => c.isActive).length;
  const totalSamples = centers.reduce((sum, c) => sum + c.totalSamples, 0);
  const pendingSamples = centers.reduce((sum, c) => sum + c.pendingSamples, 0);
  const totalRevenue = centers.reduce((sum, c) => sum + c.monthlyRevenue, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading collection centers...</p>
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
          <h1>Collection Centers Management</h1>
          <p className="text-muted-foreground">Manage collection centers and sample movements</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Collection Center
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCenter ? 'Edit Collection Center' : 'Add New Collection Center'}
              </DialogTitle>
              <DialogDescription>
                {editingCenter ? 'Update collection center information' : 'Create a new collection center'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="centerCode">Center Code *</Label>
                  <Input
                    id="centerCode"
                    value={formData.centerCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, centerCode: e.target.value.toUpperCase() }))}
                    placeholder="e.g., CC001"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="name">Center Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter center name"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91-9876543210"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="center@example.com"
                />
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="Enter state"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                    placeholder="400001"
                    required
                  />
                </div>
              </div>

              {/* Commission */}
              <div>
                <Label htmlFor="commission">Commission Percentage (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.commissionPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, commissionPercentage: parseFloat(e.target.value) || 0 }))}
                  placeholder="15"
                />
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active Status</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCenter ? 'Update' : 'Create'} Center
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Centers</p>
                <p className="text-2xl font-semibold">{totalCenters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Centers</p>
                <p className="text-2xl font-semibold">{activeCenters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Samples</p>
                <p className="text-2xl font-semibold">{totalSamples.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Samples</p>
                <p className="text-2xl font-semibold">{pendingSamples}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-semibold">₹{(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="centers">Collection Centers</TabsTrigger>
          <TabsTrigger value="movements">Sample Movements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="centers" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search centers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Centers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Centers Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Center Details</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCenters.map((center) => (
                    <TableRow key={center.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{center.name}</p>
                            <Badge variant="secondary">{center.centerCode}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Commission: {center.commissionPercentage}%
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{center.contactPerson}</p>
                          <p className="text-sm text-muted-foreground">{center.phone}</p>
                          {center.email && (
                            <p className="text-sm text-muted-foreground">{center.email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{center.city}, {center.state}</p>
                          <p className="text-sm text-muted-foreground">{center.pincode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Samples:</span>
                            <span className="font-medium">{center.totalSamples}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Pending:</span>
                            <span className="font-medium text-orange-600">{center.pendingSamples}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Revenue:</span>
                            <span className="font-medium text-green-600">₹{(center.monthlyRevenue / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={center.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {center.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Staff: {center.assignedStaff}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(center)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleCenterStatus(center.id)}>
                              <Activity className="w-4 h-4 mr-2" />
                              {center.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(center.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
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

        <TabsContent value="movements" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Track sample movements from collection centers to the main laboratory in real-time.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Sample Movement Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample Details</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>From Center</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Timeline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{movement.sampleId}</p>
                          <p className="text-sm text-muted-foreground">
                            Collected: {new Date(movement.collectedAt).toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{movement.patientName}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {movement.testNames.map((test, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{movement.fromCenter}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(movement.status)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(movement.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Expected: {new Date(movement.expectedArrival).toLocaleTimeString()}</p>
                          {movement.actualArrival && (
                            <p className="text-green-600">
                              Arrived: {new Date(movement.actualArrival).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Center Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centers.filter(c => c.isActive).map((center) => (
                    <div key={center.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{center.name}</p>
                        <p className="text-sm text-muted-foreground">{center.centerCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(center.monthlyRevenue / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-muted-foreground">{center.totalSamples} samples</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['collected', 'in_transit', 'received', 'processing'].map((status) => {
                    const count = sampleMovements.filter(m => m.status === status).length;
                    const percentage = sampleMovements.length ? (count / sampleMovements.length) * 100 : 0;
                    
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                          <span>{count} samples ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}