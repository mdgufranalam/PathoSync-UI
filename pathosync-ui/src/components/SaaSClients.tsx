import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Search, MoreHorizontal, Edit, Trash2, Eye, Link, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { PermissionGate } from './PermissionGate';
import { Badge } from './ui/badge';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
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

export function SaaSClients({ clients, searchTerm, setSearchTerm, selectedClients, setSelectedClients, handleBulkAction, handleEdit, handleDelete }) {

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
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
                    <Button variant="outline" size="sm">Bulk Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <PermissionGate module="SaaS" action="manage_billing">
                      <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                    </PermissionGate>
                    <PermissionGate module="SaaS" action="manage_billing">
                      <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                    </PermissionGate>
                    <PermissionGate module="SaaS" action="manage_billing">
                      <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </PermissionGate>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
                      checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
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
                        <div className="flex items-center gap-2 text-sm">{client.contactPerson}</div>
                        <div className="flex items-center gap-2 text-sm">{client.email}</div>
                        <div className="flex items-center gap-2 text-sm">{client.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge className={getPlanColor(client.subscriptionPlan)}>{client.subscriptionPlan}</Badge>
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
                            <div className="bg-blue-600 h-1 rounded-full" style={{width: `${getUsagePercentage(client.currentUsers, client.maxUsers)}%`}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Tests</span>
                            <span>{client.currentMonthTests.toLocaleString()}/{client.maxTestsPerMonth.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-green-600 h-1 rounded-full" style={{width: `${getUsagePercentage(client.currentMonthTests, client.maxTestsPerMonth)}%`}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Patients</span>
                            <span>{client.currentPatients.toLocaleString()}/{client.maxPatients.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-purple-600 h-1 rounded-full" style={{width: `${getUsagePercentage(client.currentPatients, client.maxPatients)}%`}}></div>
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
                            <Badge className={getStatusColor(client.subscriptionStatus)}>{client.subscriptionStatus}</Badge>
                            <p className="text-xs text-muted-foreground">Last: {formatDate(client.lastActivity)}</p>
                        </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`https://${client.subdomain}.pathosync.com`, '_blank')}><Eye className="w-4 h-4 mr-2" />View Site</DropdownMenuItem>
                          <PermissionGate module="SaaS" action="manage_billing">
                            <DropdownMenuItem onClick={() => handleEdit(client)}><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                          </PermissionGate>
                          <DropdownMenuItem onClick={() => copyToClipboard(`${client.subdomain}.pathosync.com`)}><Link className="w-4 h-4 mr-2" />Copy URL</DropdownMenuItem>
                          <PermissionGate module="SaaS" action="manage_billing">
                            <DropdownMenuItem onClick={() => handleDelete(client.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                          </PermissionGate>
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
    </div>
  );
}
