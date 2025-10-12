import React, { useState } from 'react';
import { useBills } from '../hooks/useBills';
import { Bill, BillStatus, ReportStatus } from '../types';
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

    React.useEffect(() => {
        if (bills.length >= 0) {
            setIsLoading(false);
        }
    }, [bills]);

    const [selectedDate, setSelectedDate] = useState<Date>();
    const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [reportStatusFilter, setReportStatusFilter] = useState<ReportStatus | 'all'>('all');
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [viewingReportId, setViewingReportId] = useState<string | null>(null);

    const filteredBills = bills.filter(bill => {
        const patientName = bill.patient?.name || (bill as any).patientName || '';
        const doctorName = bill.doctor?.name || (bill as any).doctorName || '';

        const matchesSearch =
            patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctorName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || bill.paymentMethod === paymentFilter;
        const matchesReportStatus = reportStatusFilter === 'all' || bill.reportStatus === reportStatusFilter;

        const matchesDate = !selectedDate ||
            new Date(bill.createdAt).toDateString() === selectedDate.toDateString();

        return matchesSearch && matchesStatus && matchesPayment && matchesReportStatus && matchesDate;
    });

    const handleStatusChange = (billId: string, newStatus: BillStatus) => {
        updateBill(billId, { status: newStatus });
    };

    const handleReportStatusChange = (billId: string, newReportStatus: ReportStatus) => {
        updateBill(billId, { reportStatus: newReportStatus });
    };

    const handleViewReport = (bill: Bill) => {
        setSelectedBill(bill);
        setViewingReportId(bill.id);
    };

    const getStatusColor = (status: BillStatus) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'unpaid':
            case 'partially-paid': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getReportStatusColor = (status: ReportStatus) => {
        switch (status) {
            case 'pending': return 'bg-gray-100 text-gray-800';
            case 'generated': return 'bg-blue-100 text-blue-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: ReportStatus) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'generated': return <FileText className="w-4 h-4" />;
            case 'delivered': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const stats = {
        total: bills.length,
        paid: bills.filter(b => b.status === 'paid').length,
        pending: bills.filter(b => b.status === 'unpaid' || b.status === 'partially-paid').length,
        cancelled: bills.filter(b => b.status === 'cancelled').length,
        totalAmount: bills.reduce((sum, bill) => sum + (bill.total || bill.finalAmount || 0), 0),
        reportsPending: bills.filter(b => b.reportStatus === 'pending').length,
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1>Bills Management</h1>
                    <p className="text-slate-600">Manage bills, payments, and report status</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Bills</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Stats Cards */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" />Filters & Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <Input placeholder="Search bills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BillStatus | 'all')}>
                            <SelectTrigger><SelectValue placeholder="Payment Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payments</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="partially-paid">Partially Paid</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={reportStatusFilter} onValueChange={(value) => setReportStatusFilter(value as ReportStatus | 'all')}>
                            <SelectTrigger><SelectValue placeholder="Report Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reports</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="generated">Generated</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setReportStatusFilter('all'); setSelectedDate(undefined); }}>Clear Filters</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Bills ({filteredBills.length})</CardTitle></CardHeader>
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
                                    <TableCell>{bill.id}</TableCell>
                                    <TableCell>{bill.patient?.name || (bill as any).patientName}</TableCell>
                                    <TableCell>{bill.doctor?.name || (bill as any).doctorName}</TableCell>
                                    <TableCell>
                                        {(bill.tests || []).map(t => ('test' in t ? t.test.name : t.name)).join(', ')}
                                    </TableCell>
                                    <TableCell>₹{(bill.total || bill.finalAmount || 0).toFixed(2)}</TableCell>
                                    <TableCell><Badge className={getStatusColor(bill.status)}>{bill.status}</Badge></TableCell>
                                    <TableCell><Badge className={getReportStatusColor(bill.reportStatus)}>{bill.reportStatus}</Badge></TableCell>
                                    <TableCell>{format(new Date(bill.createdAt), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost" onClick={() => handleViewReport(bill)}><Eye className="w-4 h-4 mr-2" />View Report</Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleStatusChange(bill.id, 'paid')}><CheckCircle className="w-4 h-4 mr-2" />Mark Paid</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleReportStatusChange(bill.id, 'generated')}><CheckCircle className="w-4 h-4 mr-2" />Mark Report Generated</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleReportStatusChange(bill.id, 'delivered')}><CheckCircle className="w-4 h-4 mr-2" />Mark Delivered</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredBills.length === 0 && <div className="text-center py-8">No bills found</div>}
                </CardContent>
            </Card>
        </div>
    );
}