import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, TrendingDown, FileText, DollarSign, Users, TestTube, Calendar } from 'lucide-react';

export function Statistics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  // Mock data for charts
  const dailyRevenueData = [
    { date: 'Mon', revenue: 15000, bills: 45 },
    { date: 'Tue', revenue: 18000, bills: 52 },
    { date: 'Wed', revenue: 22000, bills: 61 },
    { date: 'Thu', revenue: 19000, bills: 48 },
    { date: 'Fri', revenue: 25000, bills: 67 },
    { date: 'Sat', revenue: 28000, bills: 72 },
    { date: 'Sun', revenue: 16000, bills: 38 }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 450000, bills: 1200 },
    { month: 'Feb', revenue: 520000, bills: 1350 },
    { month: 'Mar', revenue: 480000, bills: 1180 },
    { month: 'Apr', revenue: 610000, bills: 1520 },
    { month: 'May', revenue: 580000, bills: 1460 },
    { month: 'Jun', revenue: 720000, bills: 1750 }
  ];

  const testCategoryData = [
    { name: 'Biochemistry', value: 35, color: '#3B82F6' },
    { name: 'Hematology', value: 25, color: '#10B981' },
    { name: 'Cardiology', value: 15, color: '#F59E0B' },
    { name: 'Radiology', value: 12, color: '#EF4444' },
    { name: 'Pathology', value: 8, color: '#8B5CF6' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ];

  const topTests = [
    { name: 'Complete Blood Count', count: 156, revenue: 46800 },
    { name: 'Blood Sugar (Fasting)', count: 134, revenue: 20100 },
    { name: 'Lipid Profile', count: 89, revenue: 44500 },
    { name: 'Thyroid Function Test', count: 67, revenue: 53600 },
    { name: 'Liver Function Test', count: 56, revenue: 33600 }
  ];

  const keyMetrics = {
    totalBills: 1847,
    totalRevenue: 3650000,
    totalDiscount: 142000,
    netRevenue: 3508000,
    avgBillValue: 1976,
    totalPatients: 1234,
    repeatPatients: 456,
    totalTests: 3421
  };

  const handleDownload = (format: 'pdf' | 'excel') => {
    console.log(`Downloading statistics in ${format} format`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl">Statistics & Analytics</h1>
          <p className="text-slate-600">Comprehensive insights into your clinic performance</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => handleDownload('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleDownload('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Bills</p>
              <p className="text-2xl">{keyMetrics.totalBills.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+12% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl">₹{(keyMetrics.totalRevenue / 100000).toFixed(1)}L</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+8% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Discount</p>
              <p className="text-2xl">₹{(keyMetrics.totalDiscount / 1000).toFixed(0)}K</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-red-600" />
                <span className="text-xs text-red-600">3.9% of revenue</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg. Bill Value</p>
              <p className="text-2xl">₹{keyMetrics.avgBillValue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+5% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Revenue Chart */}
            <Card className="p-6">
              <h3 className="mb-4">Daily Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Monthly Revenue Chart */}
            <Card className="p-6">
              <h3 className="mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bills Count Chart */}
            <Card className="p-6">
              <h3 className="mb-4">Daily Bills Count</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bills" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Bill Status */}
            <Card className="p-6">
              <h3 className="mb-4">Bill Status Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Paid Bills</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg">1,547</p>
                    <p className="text-sm text-slate-500">83.7%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Pending Bills</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg">234</p>
                    <p className="text-sm text-slate-500">12.7%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Due Bills</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg">66</p>
                    <p className="text-sm text-slate-500">3.6%</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Category Distribution */}
            <Card className="p-6">
              <h3 className="mb-4">Test Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={testCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {testCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Tests */}
            <Card className="p-6">
              <h3 className="mb-4">Top Performing Tests</h3>
              <div className="space-y-3">
                {topTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm">{test.name}</p>
                      <p className="text-xs text-slate-500">{test.count} tests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">₹{test.revenue.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Statistics */}
            <Card className="p-6">
              <h3 className="mb-4">Patient Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">Total Patients</p>
                    <p className="text-2xl">{keyMetrics.totalPatients.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">Repeat Patients</p>
                    <p className="text-2xl">{keyMetrics.repeatPatients}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {((keyMetrics.repeatPatients / keyMetrics.totalPatients) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">New Patients (This Month)</p>
                    <p className="text-2xl">89</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </Card>

            {/* Patient Age Distribution */}
            <Card className="p-6">
              <h3 className="mb-4">Patient Age Distribution</h3>
              <div className="space-y-3">
                {[
                  { range: '0-18', count: 156, percentage: 12.6 },
                  { range: '19-30', count: 298, percentage: 24.1 },
                  { range: '31-45', count: 387, percentage: 31.4 },
                  { range: '46-60', count: 278, percentage: 22.5 },
                  { range: '60+', count: 115, percentage: 9.3 }
                ].map((group, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{group.range} years</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${group.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm w-12 text-right">{group.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}