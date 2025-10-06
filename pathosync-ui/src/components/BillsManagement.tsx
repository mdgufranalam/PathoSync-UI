import React, { useState } from 'react';
import { useBills } from '../hooks/useBills';
import { Bill } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ReportDetails } from './ReportDetails';
import { 
  Search, 
  Download, 
  Calendar as CalendarIcon, 
  FileText, 
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  Receipt,
  Clock,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function BillsManagement() {
  const { bills, updateBill } = useBills();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if bills are loaded
  React.useEffect(() => {
    if (bills.length >= 0) {
      setIsLoading(false);
    }
  }, [bills]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [reportStatusFilter, setReportStatusFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

  // Filter bills based on search and filters
  const filteredBills = bills.filter(bill => {
    // Handle both Simple Billing and Enhanced Billing data structures
    const patientName = bill.patient?.name || (bill as any).patientName || '';
    const doctorName = bill.doctor?.name || (bill as any).doctorName || '';
    
    const matchesSearch = 
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      bill.status === statusFilter || 
      (statusFilter === 'paid' && bill.status === 'Paid') ||
      (statusFilter === 'pending' && bill.status === 'Partial');
    const matchesPayment = paymentFilter === 'all' || bill.paymentMethod === paymentFilter;
    const matchesReportStatus = reportStatusFilter === 'all' || bill.reportStatus === reportStatusFilter;
    
    const matchesDate = !selectedDate || 
      new Date(bill.createdAt).toDateString() === selectedDate.toDateString();
    
    return matchesSearch && matchesStatus && matchesPayment && matchesReportStatus && matchesDate;
  });

  const handleStatusChange = (billId: string, newStatus: Bill['status']) => {
    updateBill(billId, { status: newStatus });
  };

  const handleReportStatusChange = (billId: string, newReportStatus: Bill['reportStatus']) => {
    updateBill(billId, { reportStatus: newReportStatus });
  };

  const handleViewReport = (bill: Bill) => {
    setSelectedBill(bill);
    setViewingReportId(bill.id);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': 
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportStatusColor = (status: Bill['reportStatus']) => {
    switch (status) {
      case 'Initial': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Verified and Signed': return 'bg-purple-100 text-purple-800';
      case 'Printed': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Bill['reportStatus']) => {
    switch (status) {
      case 'Initial': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <AlertCircle className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Verified and Signed': return <CheckCircle className="w-4 h-4" />;
      case 'Printed': return <FileText className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Stats
  const stats = {
    total: bills.length,
    paid: bills.filter(b => b.status === 'paid' || b.status === 'Paid').length,
    pending: bills.filter(b => b.status === 'pending' || b.status === 'Partial').length,
    cancelled: bills.filter(b => b.status === 'cancelled' || b.status === 'Cancelled').length,
    totalAmount: bills.reduce((sum, bill) => sum + (bill.total || bill.finalAmount || 0), 0),
    reportsPending: bills.filter(b => b.reportStatus === 'Initial' || b.reportStatus === 'In Progress').length,
  };

  // Show loading state while bills are being loaded
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg">Loading bills...</div>
            <div className="text-sm text-slate-500 mt-2">Please wait while we load your data</div>
          </div>
        </div>
      </div>
    );
  }

  // Show report details if viewing a specific report
  if (viewingReportId && selectedBill) {
    return (
      <ReportDetails 
        reportId={viewingReportId} 
        bill={selectedBill}
        onBack={() => {
          setViewingReportId(null);
          setSelectedBill(null);
        }} 
        onUpdateBill={(updates) => updateBill(selectedBill.id, updates)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1>Bills Management</h1>
          <p className="text-slate-600">Manage bills, payments, and report status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Bills
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-slate-600">Total Bills</p>
              <p className="text-2xl">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-slate-600">Paid</p>
              <p className="text-2xl">{stats.paid}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl">{stats.pending}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-slate-600">Cancelled</p>
              <p className="text-2xl">{stats.cancelled}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">₹</span>
            <div>
              <p className="text-sm text-slate-600">Total Amount</p>
              <p className="text-2xl">₹{stats.totalAmount.toFixed(0)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-slate-600">Reports Pending</p>
              <p className="text-2xl">{stats.reportsPending}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Input
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={reportStatusFilter} onValueChange={setReportStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="Initial">Initial</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Verified and Signed">Verified & Signed</SelectItem>
                  <SelectItem value="Printed">Printed</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                  setReportStatusFilter('all');
                  setSelectedDate(undefined);
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bills ({filteredBills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Report Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono text-sm">{bill.id.replace('BILL-', 'B-')}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{bill.patient?.name || (bill as any).patientName || 'Unknown Patient'}</p>
                      <p className="text-sm text-slate-500">{bill.patient?.phone || (bill as any).patientPhone || 'No phone'}</p>
                    </div>
                  </TableCell>
                  <TableCell>{bill.doctor?.name || (bill as any).doctorName || 'Unknown Doctor'}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {(bill.tests || []).slice(0, 2).map((test, index) => (
                          <div key={test.testId || test.id || index} className="text-sm">
                              {test.test?.testName || test.testName || 'Unknown Test'} 
                          {test.quantity && ` (x${test.quantity})`}
                        </div>
                      ))}
                      {(bill.tests || []).length > 2 && (
                        <div className="text-sm text-slate-500">
                          +{bill.tests.length - 2} more
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{(bill.total || bill.finalAmount || 0).toFixed(2)}</p>
                      {(bill.discount || 0) > 0 && (
                        <p className="text-sm text-green-600">-₹{(bill.discount || 0).toFixed(2)} discount</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bill.status)}>
                      {(bill.status || 'Unknown').charAt(0).toUpperCase() + (bill.status || 'Unknown').slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getReportStatusColor(bill.reportStatus || 'Initial')}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(bill.reportStatus || 'Initial')}
                        {bill.reportStatus || 'Initial'}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{format(new Date(bill.createdAt), 'MMM dd, yyyy')}</p>
                      <p className="text-xs text-slate-500">{format(new Date(bill.createdAt), 'HH:mm')}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewReport(bill)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(bill.id, 'paid')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReportStatusChange(bill.id, 'Completed')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Report Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReportStatusChange(bill.id, 'Delivered')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Delivered
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredBills.length === 0 && (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No bills found matching your criteria</p>
              <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}