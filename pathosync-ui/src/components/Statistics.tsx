import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, TrendingDown, FileText, DollarSign, Users, TestTube, Calendar, RefreshCw } from 'lucide-react';
import { apiClient } from '../utils/apiClient';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '../hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function Statistics() {
  const { hasPermission } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [statisticsData, setStatisticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/statistics?period=${selectedPeriod}`);
      setStatisticsData(response.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    try {
      const response = await apiClient.get(`/export?format=${format}&period=${selectedPeriod}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `statistics.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error(`Error exporting ${format} file:`, error);
    }
    setIsExporting(false);
  };

  if (loading) {
    return <Skeleton className="h-screen w-full" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { dailyRevenueData, monthlyData, testCategoryData, topTests, keyMetrics, billStatusDistribution, patientAgeDistribution } = statisticsData;

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
          
          {hasPermission('export') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Statistics</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => handleExport('pdf')} disabled={isExporting}>
                    PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('excel')} disabled={isExporting}>
                    Excel
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('csv')} disabled={isExporting}>
                    CSV
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <Button variant="outline" onClick={fetchStatistics}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasPermission('statistics_bills') && <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Bills</p>
              <p className="text-2xl">{keyMetrics.totalbills}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>}

        {hasPermission('statistics_revenue') && <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl">₹{(keyMetrics.totalrevenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>}

        {hasPermission('statistics_revenue') && <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Discount</p>
              <p className="text-2xl">₹{(keyMetrics.totaldiscount / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>}

        {hasPermission('statistics_revenue') && <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Net Revenue</p>
              <p className="text-2xl">₹{(keyMetrics.netrevenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>}

        {hasPermission('statistics_bills') && <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg. Bill Value</p>
              <p className="text-2xl">₹{keyMetrics.avgbillvalue}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>}

        {hasPermission('statistics_patients') && <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Patients</p>
              <p className="text-2xl">{keyMetrics.totalpatients}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>}

        {hasPermission('statistics_patients') && <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Repeat Patients</p>
              <p className="text-2xl">{keyMetrics.repeatpatients}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>}

        {hasPermission('statistics_tests') && <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Tests</p>
              <p className="text-2xl">{keyMetrics.totaltests}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TestTube className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          {hasPermission('statistics_revenue') && <TabsTrigger value="revenue">Revenue</TabsTrigger>}
          {hasPermission('statistics_bills') && <TabsTrigger value="bills">Bills</TabsTrigger>}
          {hasPermission('statistics_tests') && <TabsTrigger value="tests">Tests</TabsTrigger>}
          {hasPermission('statistics_patients') && <TabsTrigger value="patients">Patients</TabsTrigger>}
        </TabsList>

        {hasPermission('statistics_revenue') && <TabsContent value="revenue" className="space-y-6">
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
        </TabsContent>}

        {hasPermission('statistics_bills') && <TabsContent value="bills" className="space-y-6">
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
                {billStatusDistribution.map((status, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg bg-${status.status === 'paid' ? 'green' : status.status === 'pending' ? 'orange' : 'red'}-50`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 bg-${status.status === 'paid' ? 'green' : status.status === 'pending' ? 'orange' : 'red'}-500 rounded`}></div>
                      <span>{status.status.charAt(0).toUpperCase() + status.status.slice(1)} Bills</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg">{status.count}</p>
                      <p className="text-sm text-slate-500">{status.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>}

        {hasPermission('statistics_tests') && <TabsContent value="tests" className="space-y-6">
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
        </TabsContent>}

        {hasPermission('statistics_patients') && <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Statistics */}
            <Card className="p-6">
              <h3 className="mb-4">Patient Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">Total Patients</p>
                    <p className="text-2xl">{keyMetrics.totalpatients}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">Repeat Patients</p>
                    <p className="text-2xl">{keyMetrics.repeatpatients}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {((keyMetrics.repeatpatients / keyMetrics.totalpatients) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">New Patients (This Month)</p>
                    <p className="text-2xl">{keyMetrics.totalpatients - keyMetrics.repeatpatients}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </Card>

            {/* Patient Age Distribution */}
            <Card className="p-6">
              <h3 className="mb-4">Patient Age Distribution</h3>
              <div className="space-y-3">
                {patientAgeDistribution.map((group, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{group.range} years</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(group.count / keyMetrics.totalpatients) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm w-12 text-right">{group.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>}
      </Tabs>
    </div>
  );
}