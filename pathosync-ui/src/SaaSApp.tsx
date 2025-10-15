import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  Plus, 
  Building, 
  Users, 
  Settings, 
  Shield,
  Download,
  RefreshCw,
  Activity
} from 'lucide-react';
import { SaaSDashboard } from './components/SaaSDashboard';
import { SaaSClients } from './components/SaaSClients';
import { SaaSAnalytics } from './components/SaaSAnalytics';
import { SaaSSettings } from './components/SaaSSettings';
import { apiClient } from './utils/apiClient';
import { useAuthContext } from './contexts/AuthContext';
import { PermissionGate } from './components/PermissionGate';

function SaaSPortalApp() {
  const { user } = useAuthContext();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState({});
  const [systemSettings, setSystemSettings] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchSubscriptionPlans();
    fetchSystemSettings();
  }, []);

  const fetchClients = async () => {
    const response = await apiClient.get('/saas/clients');
    if (response.success) {
      setClients(response.data);
    }
  };

  const fetchSubscriptionPlans = async () => {
    const response = await apiClient.get('/saas/subscription-plans');
    if (response.success) {
      setSubscriptionPlans(response.data);
    }
  };

  const fetchSystemSettings = async () => {
    const response = await apiClient.get('/saas/system-settings');
    if (response.success) {
      setSystemSettings(response.data);
    }
  };

  const handleBulkAction = async (action: string) => {
    await apiClient.post(`/saas/clients/bulk-action`, { action, clientIds: selectedClients });
    fetchClients();
    setSelectedClients([]);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsAddClientModalOpen(true);
  };

  const handleDelete = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      await apiClient.delete(`/saas/clients/${clientId}`);
      fetchClients();
    }
  };

  const handleUpdateSettings = async () => {
    await apiClient.put('/saas/system-settings', systemSettings);
  };

  const handleUpdateLimits = async () => {
    await apiClient.put('/saas/subscription-plans', subscriptionPlans);
  };

  return (
    <div className="min-h-screen bg-background">
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
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">SaaS Dashboard</h1>
            <p className="text-muted-foreground">Manage laboratory clients and subscriptions across India</p>
          </div>
          
          <div className="flex items-center gap-2">
            <PermissionGate module="SaaS" action="manage_billing">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </PermissionGate>
            <Button variant="outline" size="sm" onClick={fetchClients}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <PermissionGate module="SaaS" action="manage_billing">
              <Dialog open={isAddClientModalOpen} onOpenChange={setIsAddClientModalOpen}>
                <DialogTrigger asChild>
                  <Button>
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
                  {/* Add client form will go here */}
                </DialogContent>
              </Dialog>
            </PermissionGate>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SaaSDashboard clients={clients} subscriptionPlans={subscriptionPlans} />
          </TabsContent>
          <TabsContent value="clients">
            <SaaSClients 
              clients={clients} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              selectedClients={selectedClients} 
              setSelectedClients={setSelectedClients} 
              handleBulkAction={handleBulkAction} 
              handleEdit={handleEdit} 
              handleDelete={handleDelete} 
            />
          </TabsContent>
          <TabsContent value="analytics">
            <SaaSAnalytics clients={clients} subscriptionPlans={subscriptionPlans} />
          </TabsContent>
          <TabsContent value="settings">
            <SaaSSettings 
              systemSettings={systemSettings} 
              clients={clients} 
              handleUpdateSettings={handleUpdateSettings} 
              handleUpdateLimits={handleUpdateLimits} 
            />
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
