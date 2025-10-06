import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  Plus,
  Trash2,
  Download
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'whatsapp' | 'sms' | 'email';
  subject?: string;
  message: string;
  variables: string[];
  isActive: boolean;
}

interface NotificationLog {
  id: string;
  patientName: string;
  phone: string;
  email?: string;
  type: 'whatsapp' | 'sms' | 'email';
  message: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: string;
  deliveredAt?: string;
  cost: number;
}

export function NotificationCenter() {
  const [activeTab, setActiveTab] = useState('send');
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [notificationType, setNotificationType] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');

  const [templates] = useState<NotificationTemplate[]>([
    {
      id: 'whatsapp-report-ready',
      name: 'Lab Report Ready - WhatsApp',
      type: 'whatsapp',
      message: `🔬 *Lab Report Ready*

Hi {{patientName}},

Your lab report is now ready! 📊

📋 *Report Details:*
• Report ID: {{reportId}}
• Date: {{reportDate}}
• Tests: {{testNames}}

📱 Download your report: {{downloadLink}}

For any queries, call us at +91-{{clinicPhone}}

🏥 {{clinicName}}
📍 {{clinicAddress}}

Thank you for choosing us! 🙏`,
      variables: ['patientName', 'reportId', 'reportDate', 'testNames', 'downloadLink', 'clinicPhone', 'clinicName', 'clinicAddress'],
      isActive: true
    },
    {
      id: 'sms-appointment-reminder',
      name: 'Appointment Reminder - SMS',
      type: 'sms',
      message: 'Dear {{patientName}}, your appointment is scheduled for {{appointmentDate}} at {{appointmentTime}} at {{clinicName}}. Please bring your ID and previous reports. Call {{clinicPhone}} for any changes.',
      variables: ['patientName', 'appointmentDate', 'appointmentTime', 'clinicName', 'clinicPhone'],
      isActive: true
    },
    {
      id: 'email-bill-invoice',
      name: 'Bill Invoice - Email',
      type: 'email',
      subject: 'Invoice for Lab Tests - {{billNumber}}',
      message: `Dear {{patientName}},

Thank you for visiting {{clinicName}}. Please find your invoice details below:

Invoice Number: {{billNumber}}
Date: {{billDate}}
Total Amount: ₹{{totalAmount}}

Tests Performed:
{{testDetails}}

Payment Status: {{paymentStatus}}

For any billing queries, please contact us at:
Phone: +91-{{clinicPhone}}
Email: {{clinicEmail}}

Best regards,
{{clinicName}} Team`,
      variables: ['patientName', 'clinicName', 'billNumber', 'billDate', 'totalAmount', 'testDetails', 'paymentStatus', 'clinicPhone', 'clinicEmail'],
      isActive: true
    }
  ]);

  const [notificationLogs] = useState<NotificationLog[]>([
    {
      id: 'log-1',
      patientName: 'Rajesh Kumar',
      phone: '+91-9876543210',
      email: 'rajesh@email.com',
      type: 'whatsapp',
      message: 'Lab report ready for download',
      status: 'delivered',
      sentAt: '2024-10-04T09:30:00Z',
      deliveredAt: '2024-10-04T09:31:00Z',
      cost: 0.02
    },
    {
      id: 'log-2',
      patientName: 'Priya Sharma',
      phone: '+91-9876543211',
      type: 'sms',
      message: 'Appointment reminder for tomorrow',
      status: 'sent',
      sentAt: '2024-10-04T18:00:00Z',
      cost: 0.05
    },
    {
      id: 'log-3',
      patientName: 'Amit Patel',
      phone: '+91-9876543212',
      email: 'amit@email.com',
      type: 'email',
      message: 'Invoice for recent lab tests',
      status: 'failed',
      sentAt: '2024-10-04T10:15:00Z',
      cost: 0.01
    }
  ]);

  const handleSendNotification = () => {
    console.log('Sending notification:', {
      type: notificationType,
      recipient: notificationType === 'email' ? recipientEmail : recipientPhone,
      message: customMessage,
      template: selectedTemplate?.id
    });
    
    // Here you would integrate with actual WhatsApp Business API, SMS gateway, or email service
    alert(`${notificationType.toUpperCase()} notification sent successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'sent': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'sms': return <Phone className="w-4 h-4 text-blue-600" />;
      case 'email': return <Mail className="w-4 h-4 text-purple-600" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const totalCost = notificationLogs.reduce((sum, log) => sum + log.cost, 0);
  const successRate = (notificationLogs.filter(log => log.status === 'delivered').length / notificationLogs.length) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1>Notification Center</h1>
          <p className="text-muted-foreground">Send WhatsApp, SMS, and Email notifications to patients</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{notificationLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
                <p className="text-2xl font-bold">{notificationLogs.filter(l => l.type === 'whatsapp').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">₹</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">₹{totalCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="send">Send Message</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Message Composer */}
            <Card>
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Notification Type</Label>
                  <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                          WhatsApp
                        </div>
                      </SelectItem>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          SMS
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-purple-600" />
                          Email
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Use Template</Label>
                  <Select onValueChange={(value) => {
                    const template = templates.find(t => t.id === value);
                    setSelectedTemplate(template || null);
                    setCustomMessage(template?.message || '');
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a template (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter(t => t.type === notificationType)
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Recipient Phone</Label>
                  <Input
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+91-9876543210"
                    className="mt-1"
                  />
                </div>

                {notificationType === 'email' && (
                  <div>
                    <Label>Recipient Email</Label>
                    <Input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="patient@email.com"
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={8}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Characters: {customMessage.length} | Cost: ₹{(customMessage.length / 160 * 0.05).toFixed(2)}
                  </p>
                </div>

                <Button onClick={handleSendNotification} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send {notificationType.charAt(0).toUpperCase() + notificationType.slice(1)}
                </Button>
              </CardContent>
            </Card>

            {/* Template Variables */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>Template Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Available variables for {selectedTemplate.name}:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Preview:</p>
                      <p className="text-xs text-blue-600 mt-1 whitespace-pre-wrap">
                        {selectedTemplate.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Message Templates</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">Edit</Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {template.message}
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {template.variables.slice(0, 4).map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                      {template.variables.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.variables.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.patientName}</p>
                          <p className="text-sm text-muted-foreground">{log.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(log.type)}
                          <span className="capitalize">{log.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm truncate max-w-xs">{log.message}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(log.status)}
                            <span className="capitalize">{log.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(log.sentAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">₹{log.cost.toFixed(2)}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}