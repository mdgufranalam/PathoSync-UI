import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Textarea } from './components/ui/textarea';
import { Checkbox } from './components/ui/checkbox';
import { Separator } from './components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import ErrorBoundary from './components/ErrorBoundary';
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
  Wifi,
  Globe,
  BarChart3,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  MoreHorizontal,
  Download,
  RefreshCw,
  Eye,
  Link,
  Copy
} from 'lucide-react';

// Types
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
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  customBranding: boolean;
  apiAccess: boolean;
}

interface Usage {
  clientId: string;
  date: string;
  tests: number;
  users: number;
  patients: number;
  revenue: number;
}

interface SystemSettings {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  taxRate: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxClientsPerPlan: Record<string, number>;
}

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

function SaaSPortalApp() {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([
    {
      id: 'CLIENT-001',
      name: 'Apollo Diagnostics Mumbai',
      subdomain: 'apollo-mumbai',
      contactPerson: 'Dr. Rajesh Sharma',
      email: 'admin@apollo-mumbai.com',
      phone: '+91-9876543210',
      address: '123 Healthcare Street, Andheri West',
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
      totalRevenue: 189500,
      features: ['WhatsApp Reports', 'SMS Alerts', 'Advanced Analytics', 'API Access', 'Custom Branding'],
      createdAt: '2024-01-01T00:00:00Z',
      lastActivity: '2024-10-04T08:30:00Z',
      billingCycle: 'yearly',
      customBranding: true,
      apiAccess: true
    },
    {
      id: 'CLIENT-002',
      name: 'LifeCare Labs Delhi',
      subdomain: 'lifecare-delhi',
      contactPerson: 'Dr. Priya Gupta',
      email: 'admin@lifecare-delhi.com',
      phone: '+91-9876543211',
      address: '456 Medical Complex, CP',
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
      totalRevenue: 75000,
      features: ['WhatsApp Reports', 'SMS Alerts'],
      createdAt: '2024-02-01T00:00:00Z',
      lastActivity: '2024-10-04T10:15:00Z',
      billingCycle: 'monthly',
      customBranding: false,
      apiAccess: false
    },
    {
      id: 'CLIENT-003',
      name: 'MedCheck Bangalore',
      subdomain: 'medcheck-blr',
      contactPerson: 'Dr. Arjun Kumar',
      email: 'admin@medcheck-blr.com',
      phone: '+91-9876543212',
      address: '789 Tech Park, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      gstNumber: '29AABCU9603R1ZO',
      licenseNumber: 'LAB/KA/2024/003',
      subscriptionPlan: 'enterprise',
      subscriptionStatus: 'active',
      subscriptionStartDate: '2024-03-01',
      subscriptionEndDate: '2025-02-28',
      maxUsers: 50,
      maxPatients: 50000,
      maxTestsPerMonth: 20000,
      currentUsers: 35,
      currentPatients: 25000,
      currentMonthTests: 12000,
      totalRevenue: 599999,
      features: ['WhatsApp Reports', 'SMS Alerts', 'Advanced Analytics', 'API Access', 'Custom Branding', 'Multi-location Support', 'Telemedicine Integration'],
      createdAt: '2024-03-01T00:00:00Z',
      lastActivity: '2024-10-04T14:22:00Z',
      billingCycle: 'yearly',
      customBranding: true,
      apiAccess: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

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
    billingCycle: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    maxUsers: 5,
    maxPatients: 1000,
    maxTestsPerMonth: 500,
    features: [] as string[],
    customBranding: false,
    apiAccess: false
  });

  const [systemSettings] = useState<SystemSettings>({
    platformName: 'PathoSync SaaS',
    supportEmail: 'support@pathosync.com',
    supportPhone: '+91-9876543200',
    defaultCurrency: 'INR',
    taxRate: 18,
    maintenanceMode: false,
    allowRegistration: true,
    maxClientsPerPlan: {
      basic: 100,
      standard: 50,
      premium: 25,
      enterprise: 10
    }
  });

  // Configuration
  const subscriptionPlans = {
    basic: { 
      price: 2999, 
      users: 5, 
      patients: 1000, 
      tests: 500,
      monthlyPrice: 2999,
      quarterlyPrice: 8999,
      yearlyPrice: 29999
    },
    standard: { 
      price: 7999, 
      users: 10, 
      patients: 5000, 
      tests: 2000,
      monthlyPrice: 7999,
      quarterlyPrice: 22999,
      yearlyPrice: 79999
    },
    premium: { 
      price: 15999, 
      users: 20, 
      patients: 10000, 
      tests: 5000,
      monthlyPrice: 15999,
      quarterlyPrice: 45999,
      yearlyPrice: 159999
    },
    enterprise: { 
      price: 49999, 
      users: 50, 
      patients: 50000, 
      tests: 20000,
      monthlyPrice: 49999,
      quarterlyPrice: 149999,
      yearlyPrice: 499999
    }
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
    'Insurance Integration',
    'Mobile App Access',
    'Cloud Backup',
    'Priority Support',
    '24/7 Support'
  ];

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  // Computed values
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.subscriptionStatus === 'active').length,
    suspendedClients: clients.filter(c => c.subscriptionStatus === 'suspended').length,
    expiredClients: clients.filter(c => c.subscriptionStatus === 'expired').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
    monthlyRecurringRevenue: clients.filter(c => c.subscriptionStatus === 'active').reduce((sum, c) => {
      const plan = subscriptionPlans[c.subscriptionPlan];
      return sum + (c.billingCycle === 'monthly' ? plan.monthlyPrice : 
                   c.billingCycle === 'quarterly' ? plan.quarterlyPrice / 3 :
                   plan.yearlyPrice / 12);
    }, 0),
    totalUsers: clients.reduce((sum, c) => sum + c.currentUsers, 0),
    totalPatients: clients.reduce((sum, c) => sum + c.currentPatients, 0),
    totalTests: clients.reduce((sum, c) => sum + c.currentMonthTests, 0),
    averageRevenuePerClient: clients.length > 0 ? clients.reduce((sum, c) => sum + c.totalRevenue, 0) / clients.length : 0
  };

  // Helper functions
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
      billingCycle: 'monthly',
      maxUsers: 5,
      maxPatients: 1000,
      maxTestsPerMonth: 500,
      features: [],
      customBranding: false,
      apiAccess: false
    });
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
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
      billingCycle: client.billingCycle,
      maxUsers: client.maxUsers,
      maxPatients: client.maxPatients,
      maxTestsPerMonth: client.maxTestsPerMonth,
      features: client.features,
      customBranding: client.customBranding,
      apiAccess: client.apiAccess
    });
    setIsAddClientModalOpen(true);
  };

  const handleDelete = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      setClients(prev => prev.filter(client => client.id !== clientId));
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'suspend':
        setClients(prev => prev.map(client =>
          selectedClients.includes(client.id)
            ? { ...client, subscriptionStatus: 'suspended' as const }
            : client
        ));
        break;
      case 'activate':
        setClients(prev => prev.map(client =>
          selectedClients.includes(client.id)
            ? { ...client, subscriptionStatus: 'active' as const }
            : client
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedClients.length} clients?`)) {
          setClients(prev => prev.filter(client => !selectedClients.includes(client.id)));
        }
        break;
    }
    setSelectedClients([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'standard': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'enterprise': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    return Math.min(Math.round((current / max) * 100), 100);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-blue-600">PathoSync SaaS</h1>
                <p className="text-xs text-muted-foreground">Multi-Tenant Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <Activity className="w-3 h-3" />
              {totalStats.activeClients} Active Clients
            </Badge>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem className="text-red-600">
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">SaaS Dashboard</h1>
            <p className="text-muted-foreground">Manage laboratory clients and subscriptions across India</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
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
                    <h3 className="font-medium text-lg">Basic Information</h3>
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
                    <h3 className="font-medium text-lg">Subscription Plan</h3>
                    
                    <div>
                      <Label>Billing Cycle</Label>
                      <Select value={formData.billingCycle} onValueChange={(value: any) => setFormData(prev => ({ ...prev, billingCycle: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly (Save 5%)</SelectItem>
                          <SelectItem value="yearly">Yearly (Save 15%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(subscriptionPlans).map(([key, plan]) => {
                        const price = formData.billingCycle === 'monthly' ? plan.monthlyPrice :
                                     formData.billingCycle === 'quarterly' ? plan.quarterlyPrice :
                                     plan.yearlyPrice;
                        
                        return (
                          <Card 
                            key={key} 
                            className={`cursor-pointer transition-all hover:shadow-md ${
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
                            <CardContent className="p-6 text-center">
                              <h4 className="font-medium capitalize text-lg">{key}</h4>
                              <p className="text-3xl font-bold text-blue-600 my-2">{formatCurrency(price)}</p>
                              <p className="text-xs text-muted-foreground mb-4">
                                per {formData.billingCycle === 'yearly' ? 'year' : formData.billingCycle === 'quarterly' ? 'quarter' : 'month'}
                              </p>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{plan.users} Users</span>
                                </div>
                                <div className="flex items-center justify-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{plan.patients.toLocaleString()} Patients</span>
                                </div>
                                <div className="flex items-center justify-center gap-1">
                                  <TestTube className="w-4 h-4" />
                                  <span>{plan.tests.toLocaleString()} Tests/month</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Features & Add-ons</h3>
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
                          <label htmlFor={feature} className="text-sm cursor-pointer">{feature}</label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="customBranding"
                          checked={formData.customBranding}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, customBranding: !!checked }))}
                        />
                        <label htmlFor="customBranding" className="text-sm cursor-pointer">Custom Branding</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="apiAccess"
                          checked={formData.apiAccess}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, apiAccess: !!checked }))}
                        />
                        <label htmlFor="apiAccess" className="text-sm cursor-pointer">API Access</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-6 border-t">
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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                      <p className="text-3xl font-bold">{totalStats.totalClients}</p>
                      <p className="text-xs text-muted-foreground">
                        {totalStats.activeClients} active
                      </p>
                    </div>
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                      <p className="text-3xl font-bold">{formatCurrency(totalStats.monthlyRecurringRevenue)}</p>
                      <p className="text-xs text-green-600">
                        +12.5% from last month
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold">{formatCurrency(totalStats.totalRevenue)}</p>
                      <p className="text-xs text-muted-foreground">
                        Lifetime value
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-3xl font-bold">{totalStats.totalUsers}</p>
                      <p className="text-xs text-muted-foreground">
                        Across all clients
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-indigo-600" />
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
                    <BarChart3 className="w-8 h-8 text-pink-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Revenue/Client</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalStats.averageRevenuePerClient)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Top Clients */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Client Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients
                      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
                      .slice(0, 5)
                      .map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(client.lastActivity)}
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

              <Card>
                <CardHeader>
                  <CardTitle>Top Revenue Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients
                      .sort((a, b) => b.totalRevenue - a.totalRevenue)
                      .slice(0, 5)
                      .map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPlanColor(client.subscriptionPlan)}`}>
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {client.subscriptionPlan} plan
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(client.totalRevenue)}</p>
                          <p className="text-xs text-muted-foreground">lifetime</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clients by name, contact person, email, or subdomain..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  
                  {selectedClients.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedClients.length} selected
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Bulk Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Clients Table */}
            <Card>
              <CardHeader>
                <CardTitle>Client Management ({filteredClients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedClients.length === filteredClients.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedClients(filteredClients.map(c => c.id));
                              } else {
                                setSelectedClients([]);
                              }
                            }}
                          />
                        </TableHead>
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
                            <Checkbox
                              checked={selectedClients.includes(client.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedClients(prev => [...prev, client.id]);
                                } else {
                                  setSelectedClients(prev => prev.filter(id => id !== client.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Globe className="w-3 h-3" />
                                <span className="cursor-pointer hover:text-blue-600" onClick={() => copyToClipboard(`${client.subdomain}.pathosync.com`)}>
                                  {client.subdomain}.pathosync.com
                                </span>
                                <Button variant="ghost" size="icon" className="w-4 h-4" onClick={() => copyToClipboard(`${client.subdomain}.pathosync.com`)}>
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
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
                            <div className="space-y-2">
                              <Badge className={getPlanColor(client.subscriptionPlan)}>
                                {client.subscriptionPlan}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                <p>Expires: {formatDate(client.subscriptionEndDate)}</p>
                                <p className="capitalize">{client.billingCycle} billing</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2 text-xs">
                              <div>
                                <div className="flex justify-between">
                                  <span>Users</span>
                                  <span>{client.currentUsers}/{client.maxUsers}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-blue-600 h-1 rounded-full" 
                                    style={{width: `${getUsagePercentage(client.currentUsers, client.maxUsers)}%`}}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between">
                                  <span>Tests</span>
                                  <span>{client.currentMonthTests.toLocaleString()}/{client.maxTestsPerMonth.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-green-600 h-1 rounded-full" 
                                    style={{width: `${getUsagePercentage(client.currentMonthTests, client.maxTestsPerMonth)}%`}}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between">
                                  <span>Patients</span>
                                  <span>{client.currentPatients.toLocaleString()}/{client.maxPatients.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-purple-600 h-1 rounded-full" 
                                    style={{width: `${getUsagePercentage(client.currentPatients, client.maxPatients)}%`}}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(client.totalRevenue)}</p>
                              <p className="text-xs text-muted-foreground">lifetime</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge className={getStatusColor(client.subscriptionStatus)}>
                                {client.subscriptionStatus}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                Last: {formatDate(client.lastActivity)}
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
                                <DropdownMenuItem onClick={() => window.open(`https://${client.subdomain}.pathosync.com`, '_blank')}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Site
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(client)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyToClipboard(`${client.subdomain}.pathosync.com`)}>
                                  <Link className="w-4 h-4 mr-2" />
                                  Copy URL
                                </DropdownMenuItem>
                                <Separator />
                                <DropdownMenuItem onClick={() => handleDelete(client.id)} className="text-red-600">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.keys(subscriptionPlans).map(plan => {
                      const count = clients.filter(c => c.subscriptionPlan === plan).length;
                      const percentage = clients.length > 0 ? (count / clients.length) * 100 : 0;
                      return (
                        <div key={plan} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getPlanColor(plan).replace('bg-', 'bg-').replace('text-', 'bg-').split(' ')[0]}`}></div>
                            <span className="capitalize">{plan}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{count}</span>
                            <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { status: 'active', count: totalStats.activeClients, color: 'bg-green-500' },
                      { status: 'suspended', count: totalStats.suspendedClients, color: 'bg-red-500' },
                      { status: 'expired', count: totalStats.expiredClients, color: 'bg-orange-500' },
                      { status: 'inactive', count: totalStats.totalClients - totalStats.activeClients - totalStats.suspendedClients - totalStats.expiredClients, color: 'bg-gray-500' }
                    ].map(item => {
                      const percentage = totalStats.totalClients > 0 ? (item.count / totalStats.totalClients) * 100 : 0;
                      return (
                        <div key={item.status} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="capitalize">{item.status}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.count}</span>
                            <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      clients.reduce((acc, client) => {
                        acc[client.state] = (acc[client.state] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([state, count]) => {
                      const percentage = (count / clients.length) * 100;
                      return (
                        <div key={state} className="flex items-center justify-between">
                          <span>{state}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{count}</span>
                            <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.keys(subscriptionPlans).map(plan => {
                      const planClients = clients.filter(c => c.subscriptionPlan === plan);
                      const revenue = planClients.reduce((sum, c) => sum + c.totalRevenue, 0);
                      const percentage = totalStats.totalRevenue > 0 ? (revenue / totalStats.totalRevenue) * 100 : 0;
                      
                      return (
                        <div key={plan} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="capitalize font-medium">{plan}</span>
                            <span className="font-bold">{formatCurrency(revenue)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getPlanColor(plan).replace('bg-', 'bg-').replace('text-', 'bg-').split(' ')[0]}`}
                              style={{width: `${percentage}%`}}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {planClients.length} clients • {percentage.toFixed(1)}% of total revenue
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Monthly Recurring Revenue</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalStats.monthlyRecurringRevenue)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Average Revenue per Client</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalStats.averageRevenuePerClient)}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-green-600" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Client Retention Rate</p>
                        <p className="text-2xl font-bold text-purple-600">94.2%</p>
                      </div>
                      <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input id="platformName" defaultValue={systemSettings.platformName} />
                  </div>
                  
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" type="email" defaultValue={systemSettings.supportEmail} />
                  </div>
                  
                  <div>
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input id="supportPhone" defaultValue={systemSettings.supportPhone} />
                  </div>
                  
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" defaultValue={systemSettings.taxRate} />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="maintenanceMode" defaultChecked={systemSettings.maintenanceMode} />
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allowRegistration" defaultChecked={systemSettings.allowRegistration} />
                    <Label htmlFor="allowRegistration">Allow New Client Registration</Label>
                  </div>
                  
                  <Button className="w-full">Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(systemSettings.maxClientsPerPlan).map(([plan, limit]) => (
                      <div key={plan} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">{plan}</p>
                          <p className="text-sm text-muted-foreground">
                            {clients.filter(c => c.subscriptionPlan === plan).length} / {limit} clients
                          </p>
                        </div>
                        <Input
                          type="number"
                          defaultValue={limit}
                          className="w-20"
                          min="1"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4">Update Limits</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">Database</p>
                      <p className="text-sm text-green-600">Healthy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">API Services</p>
                      <p className="text-sm text-green-600">Online</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-medium">Backup</p>
                      <p className="text-sm text-yellow-600">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function SaaSApp() {
  return (
    <ThemeProvider>
      <SaaSPortalApp />
    </ThemeProvider>
  );
}