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
import { Bill, LabReport } from '../types';
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
            (reportType === 'completed' && (report.status === 'Completed' || report.status === 'Verified and Signed')) ||
            (reportType === 'pending' && report.status === 'Initial') ||
            (reportType === 'in-progress' && report.status === 'In Progress');

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
            date: format(new Date(), 'yyyy-MM-dd'),
            testResults: [],
            status: 'Pending',
            reportType: 'Normal',
            technician: '',
            verifiedBy: '',
            remarks: '',
            clinicalHistory: '',
            specimenType: '',
            collectionTime: '',
            receivedTime: '',
            reportTime: '',
            createdBy: 'Dr. Admin',
            lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm a')
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
                lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm a')
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
                ? { ...report, status: newStatus, lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm a') }
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
            {/* ... rest of the JSX is the same as before ... */}
        </div>
    );
}
