import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { PermissionGate } from './PermissionGate';

export function SaaSSettings({ systemSettings, clients, handleUpdateSettings, handleUpdateLimits }) {

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionGate module="SaaS" action="manage_billing">
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
              
              <Button className="w-full" onClick={handleUpdateSettings}>Save Settings</Button>
            </CardContent>
          </Card>
        </PermissionGate>

        <PermissionGate module="SaaS" action="manage_billing">
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
              
              <Button className="w-full mt-4" onClick={handleUpdateLimits}>Update Limits</Button>
            </CardContent>
          </Card>
        </PermissionGate>
      </div>
    </div>
  );
}
