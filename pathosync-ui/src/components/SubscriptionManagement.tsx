import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Check, X, Crown, Zap, Shield, Users, Calendar, CreditCard } from 'lucide-react';

export function SubscriptionManagement() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlan = {
    name: 'Demo Account',
    type: 'trial',
    daysLeft: 12,
    totalDays: 15,
    features: [
      'Up to 50 patients',
      'Basic reporting',
      'Email support',
      'Single user access'
    ],
    limitations: [
      'Limited to 100 bills per month',
      'No advanced analytics',
      'No API access'
    ]
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for small clinics',
      icon: Users,
      color: 'blue',
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      yearlyDiscount: 17,
      features: [
        'Up to 500 patients',
        'Unlimited bills',
        'Basic reports',
        'Email support',
        'Single user',
        'Data backup',
        'Mobile app access'
      ],
      limitations: [
        'No advanced analytics',
        'No API access',
        'Standard support only'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For growing medical practices',
      icon: Crown,
      color: 'purple',
      monthlyPrice: 3999,
      yearlyPrice: 39990,
      yearlyDiscount: 17,
      features: [
        'Up to 2,000 patients',
        'Unlimited bills',
        'Advanced analytics',
        'Priority support',
        'Up to 3 users',
        'Data backup',
        'Mobile app access',
        'Custom reports',
        'API access',
        'Patient portal'
      ],
      limitations: [
        'Limited integrations'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large healthcare facilities',
      icon: Shield,
      color: 'green',
      monthlyPrice: 7999,
      yearlyPrice: 79990,
      yearlyDiscount: 17,
      features: [
        'Unlimited patients',
        'Unlimited bills',
        'Advanced analytics',
        'Dedicated support',
        'Unlimited users',
        'Data backup',
        'Mobile app access',
        'Custom reports',
        'Full API access',
        'Patient portal',
        'Custom integrations',
        'White-label options',
        'Advanced security'
      ],
      limitations: [],
      popular: false
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingCycle === 'yearly') {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = monthlyCost - plan.yearlyPrice;
      return savings;
    }
    return 0;
  };

  const usageStats = [
    { label: 'Patients', current: 45, limit: 50, percentage: 90 },
    { label: 'Bills this month', current: 78, limit: 100, percentage: 78 },
    { label: 'Users', current: 1, limit: 1, percentage: 100 },
    { label: 'Storage', current: 2.3, limit: 5, percentage: 46, unit: 'GB' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl">Subscription Management</h1>
          <p className="text-slate-600">Manage your clinic's subscription and billing</p>
        </div>
      </div>

      {/* Current Plan Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl">Current Plan: {currentPlan.name}</h2>
                <p className="text-slate-600">Your trial period is active</p>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Trial
              </Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Trial Progress</span>
                <span className="text-sm">{currentPlan.daysLeft} days left</span>
              </div>
              <Progress 
                value={((currentPlan.totalDays - currentPlan.daysLeft) / currentPlan.totalDays) * 100} 
                className="mb-2"
              />
              <p className="text-xs text-slate-500">
                Trial expires on {new Date(Date.now() + currentPlan.daysLeft * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-3">Included Features</h3>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3">Limitations</h3>
                <ul className="space-y-2">
                  {currentPlan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-500">
                      <X className="w-4 h-4 text-red-400" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Usage Statistics */}
        <Card className="p-6">
          <h3 className="mb-4">Usage Statistics</h3>
          <div className="space-y-4">
            {usageStats.map((stat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{stat.label}</span>
                  <span className="text-sm">
                    {stat.current}{stat.unit || ''} / {stat.limit}{stat.unit || ''}
                  </span>
                </div>
                <Progress value={stat.percentage} className="h-2" />
                {stat.percentage > 80 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Approaching limit
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Billing Cycle Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className={billingCycle === 'monthly' ? '' : 'text-slate-500'}>Monthly</span>
          <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <span className={billingCycle === 'yearly' ? '' : 'text-slate-500'}>
            Yearly 
            <Badge variant="secondary" className="ml-2">Save 17%</Badge>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`p-6 relative ${plan.popular ? 'border-purple-200 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-lg mb-3 ${
                  plan.color === 'blue' ? 'bg-blue-100' :
                  plan.color === 'purple' ? 'bg-purple-100' : 'bg-green-100'
                }`}>
                  <plan.icon className={`w-6 h-6 ${
                    plan.color === 'blue' ? 'text-blue-600' :
                    plan.color === 'purple' ? 'text-purple-600' : 'text-green-600'
                  }`} />
                </div>
                <h3 className="text-xl mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl">₹{getPrice(plan).toLocaleString()}</span>
                    <span className="text-slate-500">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ₹{getSavings(plan).toLocaleString()} per year
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-slate-500">{limitation}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.id === 'basic' ? 'Upgrade to Basic' :
                 plan.id === 'professional' ? 'Upgrade to Pro' :
                 'Contact Sales'}
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <h3 className="mb-4">Billing History</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm">Trial Started</p>
                <p className="text-xs text-slate-500">September 18, 2024</p>
              </div>
            </div>
            <Badge variant="secondary">Free</Badge>
          </div>

          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No billing history yet</p>
            <p className="text-sm">Your billing history will appear here after your first payment</p>
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card className="p-6">
        <h3 className="mb-4">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="mb-2">Contact Sales</h4>
            <p className="text-sm text-slate-600 mb-3">
              Have questions about our plans? Our sales team is here to help.
            </p>
            <Button variant="outline" size="sm">
              Talk to Sales
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="mb-2">Support Center</h4>
            <p className="text-sm text-slate-600 mb-3">
              Get help with billing, account management, and technical support.
            </p>
            <Button variant="outline" size="sm">
              Get Support
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}