import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building, 
  Users, 
  TestTube, 
  FileText, 
  CreditCard, 
  Settings, 
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  MessageSquare,
  Wifi
} from 'lucide-react';
// Using built-in date formatting instead of date-fns
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface Client {
  id: string;
  name: string;
  subdomain: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  licenseNumber: string;
  subscriptionPlan: 'basic' | 'standard' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'suspended' | 'expired';
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  maxUsers: number;
  maxPatients: number;
  maxTestsPerMonth: number;
  currentUsers: number;
  currentPatients: number;
  currentMonthTests: number;
  totalRevenue: number;
  features: string[];
  createdAt: string;
  lastActivity: string;
}

interface ClientAdmin {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  permissions: string[];
}

export function SaaSPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([
    {
      id: 'CLIENT-001',
      name: 'Apollo Diagnostics Mumbai',
      subdomain: 'apollo-mumbai',
      contactPerson: 'Dr. Rajesh Sharma',
      email: 'admin@apollo-mumbai.com',
      phone: '+91-9876543210',
      address: '123 Healthcare Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      gstNumber: '27AABCU9603R1ZM',
      licenseNumber: 'LAB/MH/2024/001',
      subscriptionPlan: 'premium',
      subscriptionStatus: 'active',
      subscriptionStartDate: '2024-01-01',
      subscriptionEndDate: '2024-12-31',
      maxUsers: 20,
      maxPatients: 10000,
      maxTestsPerMonth: 5000,
      currentUsers: 15,
      currentPatients: 7500,
      currentMonthTests: 3200,
      totalRevenue: 89500,
      features: ['WhatsApp Reports', 'SMS Alerts', 'Advanced Analytics', 'API Access'],
      createdAt: '2024-01-01T00:00:00Z',
      lastActivity: '2024-10-04T08:30:00Z'
    },
    {
      id: 'CLIENT-002',
      name: 'LifeCare Labs Delhi',
      subdomain: 'lifecare-delhi',
      contactPerson: 'Dr. Priya Gupta',
      email: 'admin@lifecare-delhi.com',
      phone: '+91-9876543211',
      address: '456 Medical Complex',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      gstNumber: '07AABCU9603R1ZN',
      licenseNumber: 'LAB/DL/2024/002',
      subscriptionPlan: 'standard',
      subscriptionStatus: 'active',
      subscriptionStartDate: '2024-02-01',
      subscriptionEndDate: '2024-12-31',
      maxUsers: 10,
      maxPatients: 5000,
      maxTestsPerMonth: 2000,
      currentUsers: 8,
      currentPatients: 3200,
      currentMonthTests: 1800,
      totalRevenue: 45000,
      features: ['WhatsApp Reports', 'SMS Alerts'],
      createdAt: '2024-02-01T00:00:00Z',
      lastActivity: '2024-10-04T10:15:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    licenseNumber: '',
    subscriptionPlan: 'basic' as 'basic' | 'standard' | 'premium' | 'enterprise',
    maxUsers: 5,
    maxPatients: 1000,
    maxTestsPerMonth: 500,
    features: [] as string[]
  });

  const subscriptionPlans = {
    basic: { price: 2999, users: 5, patients: 1000, tests: 500 },
    standard: { price: 7999, users: 10, patients: 5000, tests: 2000 },
    premium: { price: 15999, users: 20, patients: 10000, tests: 5000 },
    enterprise: { price: 49999, users: 50, patients: 50000, tests: 20000 }
  };

  const availableFeatures = [
    'WhatsApp Reports',
    'SMS Alerts', 
    'Email Reports',
    'Advanced Analytics',
    'API Access',
    'Multi-location Support',
    'Custom Branding',
    'Telemedicine Integration',
    'Government Reporting',
    'Insurance Integration'
  ];

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.subscriptionStatus === 'active').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
    totalUsers: clients.reduce((sum, c) => sum + c.currentUsers, 0),
    totalPatients: clients.reduce((sum, c) => sum + c.currentPatients, 0),
    totalTests: clients.reduce((sum, c) => sum + c.currentMonthTests, 0)
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subdomain: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstNumber: '',
      licenseNumber: '',
      subscriptionPlan: 'basic',
      maxUsers: 5,
      maxPatients: 1000,
      maxTestsPerMonth: 500,
      features: []
    });
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      // Update existing client
      setClients(prev => prev.map(client =>
        client.id === editingClient.id
          ? {
              ...client,
              ...formData,
              totalRevenue: client.totalRevenue,
              currentUsers: client.currentUsers,
              currentPatients: client.currentPatients,
              currentMonthTests: client.currentMonthTests,
              createdAt: client.createdAt,
              lastActivity: new Date().toISOString()
            }
          : client
      ));
    } else {
      // Add new client
      const newClient: Client = {
        id: `CLIENT-${String(clients.length + 1).padStart(3, '0')}`,
        ...formData,
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date().toISOString().split('T')[0],
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currentUsers: 0,
        currentPatients: 0,
        currentMonthTests: 0,
        totalRevenue: 0,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      setClients(prev => [...prev, newClient]);
    }

    resetForm();
    setIsAddClientModalOpen(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      subdomain: client.subdomain,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      state: client.state,
      pincode: client.pincode,
      gstNumber: client.gstNumber,
      licenseNumber: client.licenseNumber,
      subscriptionPlan: client.subscriptionPlan,
      maxUsers: client.maxUsers,
      maxPatients: client.maxPatients,
      maxTestsPerMonth: client.maxTestsPerMonth,
      features: client.features
    });
    setIsAddClientModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1>SaaS Portal - Multi-Tenant Management</h1>
          <p className="text-muted-foreground">Manage laboratory clients, subscriptions and analytics</p>
        </div>
        
        <Dialog open={isAddClientModalOpen} onOpenChange={setIsAddClientModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </DialogTitle>
              <DialogDescription>
                {editingClient ? 'Update client information and settings' : 'Create a new laboratory client with subscription details'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Lab/Clinic Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter lab/clinic name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subdomain">Subdomain *</Label>
                    <div className="flex">
                      <Input
                        id="subdomain"
                        value={formData.subdomain}
                        onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                        placeholder="clinic-name"
                        required
                      />
                      <span className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                        .pathosync.com
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Dr. John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@clinic.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91-9876543210"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value.toUpperCase() }))}
                      placeholder="27AABCU9603R1ZM"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Complete address"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Mumbai"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="400001"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="LAB/MH/2024/001"
                  />
                </div>
              </div>

              {/* Subscription Plan */}
              <div className="space-y-4">
                <h3 className="font-medium">Subscription Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(subscriptionPlans).map(([key, plan]) => (
                    <Card 
                      key={key} 
                      className={`cursor-pointer transition-colors ${
                        formData.subscriptionPlan === key ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        subscriptionPlan: key as any,
                        maxUsers: plan.users,
                        maxPatients: plan.patients,
                        maxTestsPerMonth: plan.tests
                      }))}
                    >
                      <CardContent className="p-4 text-center">
                        <h4 className="font-medium capitalize">{key}</h4>
                        <p className="text-2xl font-bold text-blue-600">₹{plan.price}</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                        <div className="mt-2 space-y-1 text-xs">
                          <p>{plan.users} Users</p>
                          <p>{plan.patients.toLocaleString()} Patients</p>
                          <p>{plan.tests.toLocaleString()} Tests/month</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="font-medium">Features & Add-ons</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ ...prev, features: [...prev.features, feature] }));
                          } else {
                            setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }));
                          }
                        }}
                      />
                      <label htmlFor={feature} className="text-sm">{feature}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddClientModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClient ? 'Update Client' : 'Create Client'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Building className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Clients</p>
                    <p className="text-2xl font-bold">{totalStats.totalClients}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Clients</p>
                    <p className="text-2xl font-bold">{totalStats.activeClients}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{totalStats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{totalStats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold">{totalStats.totalPatients.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TestTube className="w-8 h-8 text-teal-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Tests</p>
                    <p className="text-2xl font-bold">{totalStats.totalTests.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Client Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Last active: {formatDateTime(client.lastActivity)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(client.subscriptionStatus)}>
                      {client.subscriptionStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name, contact person, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Details</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.subdomain}.pathosync.com</p>
                          <p className="text-xs text-muted-foreground">ID: {client.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3 h-3" />
                            {client.contactPerson}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getPlanColor(client.subscriptionPlan)}>
                            {client.subscriptionPlan}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            ₹{subscriptionPlans[client.subscriptionPlan].price}/month
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Expires: {formatDate(client.subscriptionEndDate)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div>Users: {client.currentUsers}/{client.maxUsers}</div>
                          <div>Patients: {client.currentPatients.toLocaleString()}/{client.maxPatients.toLocaleString()}</div>
                          <div>Tests: {client.currentMonthTests.toLocaleString()}/{client.maxTestsPerMonth.toLocaleString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">₹{client.totalRevenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.subscriptionStatus)}>
                          {client.subscriptionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(client)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{totalStats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground">Total Monthly Recurring Revenue</p>
                  
                  <div className="space-y-2">
                    {Object.entries(subscriptionPlans).map(([plan, details]) => {
                      const planClients = clients.filter(c => c.subscriptionPlan === plan && c.subscriptionStatus === 'active');
                      const planRevenue = planClients.length * details.price;
                      return (
                        <div key={plan} className="flex justify-between items-center">
                          <span className="capitalize">{plan} ({planClients.length} clients)</span>
                          <span className="font-medium">₹{planRevenue.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalStats.totalUsers}</div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalStats.totalPatients.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground">Total Patients</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{totalStats.totalTests.toLocaleString()}</div>
                    <p className="text-muted-foreground">Tests This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Global Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default WhatsApp API Configuration</Label>
                  <Input placeholder="WhatsApp Business API URL" className="mt-1" />
                </div>
                
                <div>
                  <Label>Default SMS Gateway</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SMS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="textlocal">TextLocal</SelectItem>
                      <SelectItem value="msg91">MSG91</SelectItem>
                      <SelectItem value="twilio">Twilio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Default Email Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select email provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button>Save Global Settings</Button>
              </CardContent>
            </Card>

            {/* Subscription Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(subscriptionPlans).map(([plan, details]) => (
                  <div key={plan} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{plan}</p>
                      <p className="text-sm text-muted-foreground">
                        {details.users} users, {details.patients.toLocaleString()} patients, {details.tests.toLocaleString()} tests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{details.price}</p>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}