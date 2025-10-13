import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { PrintSettings } from './PrintSettings';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  Settings, 
  LogOut, 
  Shield, 
  Camera,
  Printer,
  Bell,
  Lock
} from 'lucide-react';
import { User } from '../types/index';
import { Page } from '../types/index';

export interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateProfile: (userData: Partial<User>) => void;
  onNavigate: (page: Page) => void;
}

export function UserProfile({ user, onLogout, onUpdateProfile, onNavigate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone
  });

  const [printSettings] = useState({
    basicSettings: {
      printEachDepartmentInNewPage: false,
      numberOfLinesInOnePage: 20,
      fontSize: 0.8,
      spaceBetweenLines: 0.0
    },
    letterhead: {
      enabled: false,
      logoUrl: '',
      clinicName: 'PathoSync Laboratory',
      address: '123 Healthcare Street, Medical City, State - 123456',
      phone: '+91-98765-43210',
      email: 'info@pathosync.com',
      website: 'www.pathosync.com',
      registrationNumber: 'REG/2024/001'
    },
    signatures: {
      useSignaturesOnlyInLastPage: false,
      signatures: [
        {
          id: 'sig-1',
          name: 'Dr. Nasrin',
          designation: 'Surgeon',
          signatureUrl: ''
        }
      ]
    },
    billPrint: {
      showHeader: true,
      showFooter: true,
      showBankDetails: true,
      showTermsConditions: true
    }
  });

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'technician': return 'bg-green-100 text-green-800';
      case 'receptionist': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrintSettingsSave = (settings: any) => {
    console.log('Print settings saved:', settings);
    // Here you would typically save to your backend or state management
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>User Profile</h1>
        <Button
          variant="outline"
          onClick={onLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.profile_picture} alt={user.name} />
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <Badge className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.department}
                </p>
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center mt-1 p-2 bg-muted rounded-md">
                      <UserIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      {user.name}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center mt-1 p-2 bg-muted rounded-md">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      {user.email}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center mt-1 p-2 bg-muted rounded-md">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      {user.phone}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Join Date</Label>
                  <div className="flex items-center mt-1 p-2 bg-muted rounded-md">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    {new Date(user.join_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Print Settings */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsPrintSettingsOpen(true)}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Settings
            </Button>

            {/* Notification Settings */}
            <Button variant="outline" className="w-full justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>

            {/* Security Settings */}
            <Button variant="outline" className="w-full justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>

            <Separator />

            {/* Permissions */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Permissions
              </h4>
              <div className="space-y-1">
                {user.features.map((permission, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {permission}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <Button variant="outline" size="sm" className="w-full">
                Download Activity Report
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Export User Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Settings Modal */}
      <PrintSettings
        isOpen={isPrintSettingsOpen}
        onClose={() => setIsPrintSettingsOpen(false)}
        settings={printSettings}
        onSave={handlePrintSettingsSave}
      />
    </div>
  );
}