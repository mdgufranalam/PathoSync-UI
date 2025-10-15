import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { Bill, BillStatus, ReportStatus } from '../types/index';
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
import { useAuthContext } from '../contexts/AuthContext';
import { PermissionGate } from './PermissionGate';

export function BillsManagement() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [reportStatusFilter, setReportStatusFilter] = useState<ReportStatus | 'all'>('all');
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [viewingReportId, setViewingReportId] = useState<string | null>(null);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        setIsLoading(true);
        const response = await apiClient.get('/bills');
        if (response.success) {
            setBills(response.data as Bill[]);
        }
        setIsLoading(false);
    };

    const updateBill = async (billId: string, updates: Partial<Bill>) => {
        const response = await apiClient.put(`/bills/${billId}`, updates);
        if (response.success) {
            fetchBills();
        }
    };

    const filteredBills = bills.filter(bill => {
        const patientName = `${bill.patient?.first_name} ${bill.patient?.last_name}` || '';
        const doctorName = `${bill.doctor?.first_name} ${bill.doctor?.last_name}` || '';

        const matchesSearch =
            patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctorName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || bill.payment_status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || bill.payment_method === paymentFilter;
        const matchesReportStatus = reportStatusFilter === 'all' || bill.status === reportStatusFilter;

        const matchesDate = !selectedDate ||
            new Date(bill.created_at).toDateString() === selectedDate.toDateString();

        return matchesSearch && matchesStatus && matchesPayment && matchesReportStatus && matchesDate;
    });

    const handleStatusChange = (billId: string, newStatus: BillStatus) => {
        updateBill(billId, { payment_status: newStatus });
    };

    const handleReportStatusChange = (billId: string, newReportStatus: ReportStatus) => {
        updateBill(billId, { status: newReportStatus });
    };

    const handleViewReport = (bill: Bill) => {
        setSelectedBill(bill);
        setViewingReportId(bill.id);
    };

    // ... (utility functions like getStatusColor, getReportStatusColor, getStatusIcon)

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
      <PermissionGate module="Bills" action="view">
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1>Bills Management</h1>
                    <p className="text-slate-600">Manage bills, payments, and report status</p>
                </div>
                <div className="flex gap-2">
                  <PermissionGate module="Bills" action="view">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Bills</Button>
                  </PermissionGate>
                </div>
            </div>

            {/* ... (Stats Cards) */}

            <Card>
                {/* ... (Filters & Search) */}
            </Card>

            <Card>
                <CardHeader><CardTitle>Bills ({filteredBills.length})</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            {/* ... (Table Head) */}
                        </TableHeader>
                        <TableBody>
                            {filteredBills.map((bill) => (
                                <TableRow key={bill.id}>
                                    {/* ... (Table Cells) */}
                                    <TableCell>
                                      <PermissionGate module="Reports" action="view">
                                        <Button size="sm" variant="ghost" onClick={() => handleViewReport(bill)}><Eye className="w-4 h-4 mr-2" />View Report</Button>
                                      </PermissionGate>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <PermissionGate module="Bills" action="edit">
                                                  <DropdownMenuItem onClick={() => handleStatusChange(bill.id, 'paid')}><CheckCircle className="w-4 h-4 mr-2" />Mark Paid</DropdownMenuItem>
                                                </PermissionGate>
                                                <PermissionGate module="Reports" action="edit">
                                                  <DropdownMenuItem onClick={() => handleReportStatusChange(bill.id, 'generated')}><CheckCircle className="w-4 h-4 mr-2" />Mark Report Generated</DropdownMenuItem>
                                                </PermissionGate>
                                                <PermissionGate module="Reports" action="deliver">
                                                  <DropdownMenuItem onClick={() => handleReportStatusChange(bill.id, 'delivered')}><CheckCircle className="w-4 h-4 mr-2" />Mark Delivered</DropdownMenuItem>
                                                </PermissionGate>
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
      </PermissionGate>
    );
}
