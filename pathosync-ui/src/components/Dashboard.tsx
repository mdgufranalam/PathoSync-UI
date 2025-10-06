import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, FileText, Users, UserCheck, TestTube, Package, BarChart3, Building2, Crown, Lock, ArrowRight } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  subscriptionPlan: 'basic' | 'starter' | 'professional' | 'enterprise';
  organizationName: string;
  permissions: string[];
}

interface DashboardProps {
  onNavigate: (page: string) => void;
  user: User;
}

export function Dashboard({ onNavigate, user }: DashboardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Check subscription access
  const hasCollectionCentersAccess = user.subscriptionPlan === 'professional' || user.subscriptionPlan === 'enterprise';
  
  const getNavigationTiles = () => {
    const baseTiles = [
      {
        title: 'Bills',
        icon: FileText,
        color: 'bg-blue-500',
        description: 'Manage invoices and payments',
        onClick: () => onNavigate('billing')
      },
      {
        title: 'Reports',
        icon: BarChart3,
        color: 'bg-green-500',
        description: 'View analytical reports',
        onClick: () => onNavigate('reports')
      },
      {
        title: 'Patients',
        icon: Users,
        color: 'bg-purple-500',
        description: 'Patient management',
        onClick: () => onNavigate('patients')
      },
      {
        title: 'Doctors',
        icon: UserCheck,
        color: 'bg-orange-500',
        description: 'Doctor profiles',
        onClick: () => onNavigate('doctors')
      },
      {
        title: 'Tests',
        icon: TestTube,
        color: 'bg-red-500',
        description: 'Laboratory tests',
        onClick: () => onNavigate('tests')
      },
      {
        title: 'Test Package',
        icon: Package,
        color: 'bg-indigo-500',
        description: 'Test packages and bundles',
        onClick: () => onNavigate('packages')
      }
    ];

    // Add Collection Centers for Professional/Enterprise users
    if (hasCollectionCentersAccess) {
      baseTiles.push({
        title: 'Collection Centers',
        icon: Building2,
        color: 'bg-teal-500',
        description: 'Manage collection centers',
        onClick: () => onNavigate('collection-centers')
      });
    }

    return baseTiles;
  };

  const navigationTiles = getNavigationTiles();

  // Subscription-based stats
  const getQuickStats = () => {
    const baseStats = [
      { label: 'Today\'s Bills', value: '24', change: '+12%' },
      { label: 'Total Revenue', value: '₹45,230', change: '+8%' },
      { label: 'Pending Reports', value: '7', change: '-3%' },
      { label: 'Active Patients', value: '156', change: '+15%' }
    ];

    // Add collection center stats for Professional/Enterprise users
    if (hasCollectionCentersAccess) {
      baseStats.push(
        { label: 'Collection Centers', value: '8', change: '+2%' },
        { label: 'Pending Samples', value: '13', change: '-5%' }
      );
    }

    return baseStats;
  };

  const quickStats = getQuickStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-slate-800">
            {getGreeting()}, {user.name}! 👋
          </h1>
          <p className="text-slate-600 mt-1">
            Here's what's happening at {user.organizationName} today
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={
              user.subscriptionPlan === 'basic' ? 'bg-gray-100 text-gray-800' :
              user.subscriptionPlan === 'starter' ? 'bg-blue-100 text-blue-800' :
              user.subscriptionPlan === 'professional' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }>
              {user.subscriptionPlan === 'professional' && <Crown className="w-3 h-3 mr-1" />}
              {user.subscriptionPlan === 'enterprise' && <Crown className="w-3 h-3 mr-1" />}
              {user.subscriptionPlan.charAt(0).toUpperCase() + user.subscriptionPlan.slice(1)} Plan
            </Badge>
          </div>
        </div>
        
        <Button 
          onClick={() => onNavigate('billing')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Lab Bill
        </Button>
      </div>

      {/* Upgrade Banner for Basic/Starter Users */}
      {!hasCollectionCentersAccess && (
        <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <Crown className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <strong className="text-orange-800">Unlock Multi-Location Management!</strong>
                <p className="text-orange-700 mt-1">
                  Upgrade to Professional plan to manage collection centers, track samples across locations, and scale your laboratory operations.
                </p>
              </div>
              <Button 
                onClick={() => onNavigate('upgrade-plan')}
                className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl mt-1">{stat.value}</p>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.change.startsWith('+') 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation Tiles */}
      <div>
        <h2 className="text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationTiles.map((tile, index) => (
            <Card 
              key={index}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-transparent hover:border-l-blue-500"
              onClick={tile.onClick}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${tile.color}`}>
                  <tile.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-1">{tile.title}</h3>
                  <p className="text-sm text-slate-500">{tile.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg mb-4">Recent Activity</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New bill created', patient: 'Rahul Sharma', time: '5 minutes ago', amount: '₹1,250' },
              { action: 'Report generated', patient: 'Priya Patel', time: '15 minutes ago', amount: '₹890' },
              { action: 'Payment received', patient: 'Amit Kumar', time: '1 hour ago', amount: '₹2,100' },
              { action: 'Test completed', patient: 'Sneha Singh', time: '2 hours ago', amount: '₹650' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.patient} • {activity.time}</p>
                  </div>
                </div>
                <div className="text-sm">{activity.amount}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}