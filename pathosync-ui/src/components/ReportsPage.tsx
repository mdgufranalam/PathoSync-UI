import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ReportDetails } from './ReportDetails';
import { useReports } from '../hooks/useReports';
import { Bill, LabReport } from '../types/index';
import {
    Search,
    Download,
    Calendar as CalendarIcon,
    FileText,
    TrendingUp,
    Clock,
    Users,
    Eye,
    Edit,
    Plus,
    Printer,
    MoreHorizontal,
    CheckCircle,
    AlertCircle,
    XCircle,
    Settings,
    MessageSquare
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { GlobalPrintManager } from './GlobalPrintManager';
import { format } from 'date-fns';

export function ReportsPage() {
    const { reports, loading, error, setReports } = useReports();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [reportType, setReportType] = useState('all');
    const [activeTab, setActiveTab] = useState('daily');
    const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPrintManagerOpen, setIsPrintManagerOpen] = useState(false);
    const [printingReport, setPrintingReport] = useState<LabReport | null>(null);
    const [editingReport, setEditingReport] = useState<LabReport | null>(null);
    const [viewingReportId, setViewingReportId] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    const dailyStats = {
        totalReports: 24,
        completedReports: 20,
        pendingReports: 4,
        abnormalResults: 7
    };

    const monthlyStats = {
        totalReports: 742,
        completedReports: 710,
        pendingReports: 32,
        abnormalResults: 156
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reportNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = reportType === 'all' ||
            (reportType === 'completed' && (report.overallStatus === 'Completed' || report.overallStatus === 'Verified and Signed')) ||
            (reportType === 'pending' && report.overallStatus === 'Initial') ||
            (reportType === 'in-progress' && report.overallStatus === 'In Progress');

        return matchesSearch && matchesType;
    });

    // View report details
    const handleViewReport = (report: LabReport) => {
        setViewingReportId(report.id);
    };

    // Edit report
    const handleEditReport = (report: LabReport) => {
        setEditingReport({ ...report });
        setIsEditModalOpen(true);
    };

    // Create new report
    const handleCreateReport = () => {
        setEditingReport({
            id: '',
            reportNo: '',
            patientName: '',
            patientAge: 0,
            patientGender: 'Male',
            doctorName: '',
            collectionDate: format(new Date(), 'yyyy-MM-dd'),
            reportDate: format(new Date(), 'yyyy-MM-dd'),
            tests: [],
            overallStatus: 'Pending',
            notes: '',
            labInfo: {
                name: 'PathoSync Labs',
                address: '123 Health St, Wellness City',
                logoUrl: '',
            },
            tenant_id: '',
            report_number: '',
            bill_id: '',
            patient_id: '',
            doctor_id: '',
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm a'),
            updated_at: format(new Date(), 'yyyy-MM-dd HH:mm a'),
        });
        setIsCreateModalOpen(true);
    };

    // Save report
    const handleSaveReport = () => {
        if (!editingReport) return;

        if (editingReport.id) {
            // Update existing report
            setReports(prev => prev.map(report =>
                report.id === editingReport.id ? editingReport : report
            ));
        } else {
            // Create new report
            const newReport = {
                ...editingReport,
                id: Date.now().toString(),
                reportNo: `LAB${String(reports.length + 1).padStart(3, '0')}`,
                updated_at: format(new Date(), 'yyyy-MM-dd HH:mm a'),
            };
            setReports(prev => [...prev, newReport]);
        }

        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setEditingReport(null);
    };

    // Change report status
    const handleStatusChange = (reportId: string, newStatus: 'Initial' | 'In Progress' | 'Completed' | 'Verified and Signed' | 'Printed' | 'Delivered') => {
        setReports(prev => prev.map(report =>
            report.id === reportId
                ? { ...report, overallStatus: newStatus, updated_at: format(new Date(), 'yyyy-MM-dd HH:mm a') }
                : report
        ));
    };

    // Download individual report as PDF
    const handleDownloadReport = (report: LabReport) => {
        const content = `...`; // Same as before
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Lab_Report_${report.reportNo}_${report.patientName.replace(/\s+/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Print individual report
    const handlePrintReport = (report: LabReport) => {
        const printContent = `...`; // Same as before
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();

            // Update report status to printed
            handleStatusChange(report.id, 'Printed');
        }
    };

    // Download all reports as CSV
    const handleDownload = (format: 'pdf' | 'excel') => {
        if (format === 'excel') {
            const csvContent = `...`; // Same as before
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lab_reports_${format(new Date(), 'yyyy-MM-dd')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            console.log(`Downloading ${filteredReports.length} reports in ${format} format`);
        }
    };

    if (viewingReportId) {
        return <ReportDetails
            reportId={viewingReportId}
            onBack={() => {
                setViewingReportId(null);
            }}
        />;
    }

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Reports</h1>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => handleDownload('excel')}><Download className="mr-2 h-4 w-4" /> Download All</Button>
                    <Button onClick={handleCreateReport}><Plus className="mr-2 h-4 w-4" /> Create Report</Button>
                </div>
            </header>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                    placeholder="Search by Patient, Report ID, Doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:col-span-2"
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
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
                <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="daily">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Reports</p>
                                <p className="text-2xl font-bold">{dailyStats.totalReports}</p>
                            </div>
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{dailyStats.completedReports}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{dailyStats.pendingReports}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Abnormal Results</p>
                                <p className="text-2xl font-bold">{dailyStats.abnormalResults}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="monthly">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Reports</p>
                                <p className="text-2xl font-bold">{monthlyStats.totalReports}</p>
                            </div>
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{monthlyStats.completedReports}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{monthlyStats.pendingReports}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Abnormal Results</p>
                                <p className="text-2xl font-bold">{monthlyStats.abnormalResults}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Reports Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Report ID</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.reportNo}</TableCell>
                                <TableCell>{report.patientName}</TableCell>
                                <TableCell>{report.doctorName}</TableCell>
                                <TableCell>{report.reportDate}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={report.overallStatus === 'Completed' ? 'default' : report.overallStatus === 'Pending' ? 'secondary' : 'outline'}
                                        className={report.overallStatus === 'Completed' ? 'bg-green-500' : report.overallStatus === 'Pending' ? 'bg-orange-500' : ''}
                                    >
                                        {report.overallStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleViewReport(report)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditReport(report)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePrintReport(report)}><Printer className="mr-2 h-4 w-4" />Print</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDownloadReport(report)}><Download className="mr-2 h-4 w-4" />Download</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { /* Implement communication logic */ }}><MessageSquare className="mr-2 h-4 w-4" />Communicate</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Edit/Create Report Modal */}
            <Dialog open={isEditModalOpen || isCreateModalOpen} onOpenChange={isEditModalOpen ? setIsEditModalOpen : setIsCreateModalOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{editingReport?.id ? 'Edit Report' : 'Create Report'}</DialogTitle>
                        <DialogDescription>Fill in the details of the report.</DialogDescription>
                    </DialogHeader>
                    {editingReport && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            {/* ... Form fields ... */}
                            <div className="space-y-2">
                                <Label htmlFor="patientName">Patient Name</Label>
                                <Input id="patientName" value={editingReport.patientName} onChange={(e) => setEditingReport({ ...editingReport, patientName: e.target.value })} />
                            </div>
                            {/* ... more fields ... */}
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => isEditModalOpen ? setIsEditModalOpen(false) : setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveReport}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <GlobalPrintManager reports={reports} isOpen={isPrintManagerOpen} onOpenChange={setIsPrintManagerOpen} />

        </div>
    );
}
