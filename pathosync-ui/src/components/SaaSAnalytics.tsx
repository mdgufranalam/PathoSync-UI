import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PermissionGate } from './PermissionGate';

const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'standard': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'enterprise': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export function SaaSAnalytics({ clients, subscriptionPlans }) {

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
    averageRevenuePerClient: clients.length > 0 ? clients.reduce((sum, c) => sum + c.totalRevenue, 0) / clients.length : 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>

        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>

        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionGate module="SaaS" action="view-all-data">
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
        </PermissionGate>

        <PermissionGate module="SaaS" action="view-all-data">
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
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Average Revenue per Client</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalStats.averageRevenuePerClient)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Client Retention Rate</p>
                    <p className="text-2xl font-bold text-purple-600">94.2%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGate>
      </div>
    </div>
  );
}
