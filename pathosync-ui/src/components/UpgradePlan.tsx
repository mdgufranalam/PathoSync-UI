import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Lock, 
  Building2, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Crown,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

interface UpgradePlanProps {
  currentPlan: 'basic' | 'starter' | 'professional' | 'enterprise';
  onNavigate: (page: string) => void;
  restrictedFeature?: string;
}

export function UpgradePlan({ currentPlan, onNavigate, restrictedFeature }: UpgradePlanProps) {
  const planFeatures = {
    basic: {
      name: 'Basic',
      price: '₹2,999',
      period: '/month',
      color: 'bg-gray-100 text-gray-800',
      icon: Shield,
      features: [
        'Single Location Lab',
        'Up to 100 patients/month',
        'Basic Test Management',
        'Simple Billing',
        'Email Support'
      ]
    },
    starter: {
      name: 'Starter',
      price: '₹4,999',
      period: '/month',
      color: 'bg-blue-100 text-blue-800',
      icon: Zap,
      features: [
        'Single Location Lab',
        'Up to 500 patients/month',
        'Advanced Test Management',
        'Enhanced Billing with GST',
        'WhatsApp Integration',
        'Basic Reports',
        'Phone Support'
      ]
    },
    professional: {
      name: 'Professional',
      price: '₹9,999',
      period: '/month',
      color: 'bg-green-100 text-green-800',
      icon: Building2,
      features: [
        '✨ Multi-Location Management',
        '✨ Collection Centers',
        'Up to 2,000 patients/month',
        'Advanced Analytics',
        'Sample Movement Tracking',
        'Staff Management',
        'Custom Reports',
        'SMS & WhatsApp Integration',
        'Priority Support'
      ],
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      price: '₹19,999',
      period: '/month',
      color: 'bg-purple-100 text-purple-800',
      icon: Crown,
      features: [
        '✨ Unlimited Collection Centers',
        '✨ Advanced Analytics Dashboard',
        '✨ AI-Powered Insights',
        'Unlimited Patients',
        'Custom Integrations',
        'API Access',
        'Multi-tenant Support',
        'Dedicated Account Manager',
        '24/7 Premium Support'
      ]
    }
  };

  const getCurrentPlanInfo = () => planFeatures[currentPlan];
  const getRecommendedPlan = () => {
    if (currentPlan === 'basic' || currentPlan === 'starter') {
      return planFeatures.professional;
    }
    return planFeatures.enterprise;
  };

  const currentPlanInfo = getCurrentPlanInfo();
  const recommendedPlan = getRecommendedPlan();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-6xl mb-4">
          <Lock className="w-16 h-16 text-muted-foreground" />
          <Building2 className="w-16 h-16 text-muted-foreground opacity-50" />
        </div>
        
        <h1 className="text-3xl font-bold">Feature Locked</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {restrictedFeature ? `${restrictedFeature} is` : 'Collection Centers are'} available in Professional and Enterprise plans. 
          Upgrade now to manage multiple collection centers and scale your laboratory operations.
        </p>

        {/* Current Plan Badge */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground">Current Plan:</span>
          <Badge className={currentPlanInfo.color}>
            <currentPlanInfo.icon className="w-4 h-4 mr-1" />
            {currentPlanInfo.name}
          </Badge>
        </div>
      </div>

      {/* Locked Feature Alert */}
      <Alert className="max-w-2xl mx-auto border-orange-200 bg-orange-50">
        <Lock className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Collection Centers Management</strong> includes multi-location operations, 
          sample movement tracking, staff assignment, and performance analytics. 
          Upgrade to Professional plan to unlock these powerful features.
        </AlertDescription>
      </Alert>

      {/* Feature Highlights */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-6">What you'll unlock with Collection Centers:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Multi-Location</h3>
              <p className="text-sm text-muted-foreground">Manage multiple collection centers from one dashboard</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Staff Management</h3>
              <p className="text-sm text-muted-foreground">Assign staff to centers with role-based access</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Analytics</h3>
              <p className="text-sm text-muted-foreground">Track performance across all locations</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Sample Tracking</h3>
              <p className="text-sm text-muted-foreground">Real-time sample movement monitoring</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(planFeatures).map(([key, plan]) => {
            const isCurrentPlan = key === currentPlan;
            const isRecommended = key === 'professional' && (currentPlan === 'basic' || currentPlan === 'starter');
            const PlanIcon = plan.icon;
            
            return (
              <Card 
                key={key} 
                className={`relative ${isRecommended ? 'ring-2 ring-green-500 scale-105' : ''} ${isCurrentPlan ? 'opacity-60' : ''}`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-3">
                    <Badge className={currentPlanInfo.color}>Current</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PlanIcon className="w-6 h-6 text-primary" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className={feature.startsWith('✨') ? 'font-medium text-green-700' : ''}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {!isCurrentPlan && (
                    <Button 
                      className="w-full" 
                      variant={isRecommended ? "default" : "outline"}
                      onClick={() => onNavigate('subscription')}
                    >
                      {key === 'professional' || key === 'enterprise' ? 'Upgrade Now' : 'Downgrade'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  
                  {isCurrentPlan && (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-2">Ready to Scale Your Laboratory?</h3>
          <p className="text-muted-foreground mb-4">
            Join hundreds of laboratories using our multi-location management platform 
            to expand their reach and increase revenue.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              onClick={() => onNavigate('subscription')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Professional
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-green-600" />
          <span>30-day money-back guarantee • Cancel anytime • No setup fees</span>
        </div>
      </div>
    </div>
  );
}