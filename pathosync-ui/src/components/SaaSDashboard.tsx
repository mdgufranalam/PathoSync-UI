import React from 'react';
import { Card, CardContent } from './components/ui/card';
import { Building, TrendingUp, DollarSign, Users, TestTube, User, BarChart3 } from 'lucide-react';
import { useAuthContext } from './contexts/AuthContext';
import { PermissionGate } from './components/PermissionGate';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export function SaaSDashboard({ clients, subscriptionPlans }) {
  const { hasPermission } = useAuthContext();

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

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>

        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>

        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>

        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>

        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>

        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>
      </div>
    </div>
  );
}
