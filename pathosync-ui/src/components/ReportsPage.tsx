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
import { useBills } from '../hooks/useBills';
import { Bill } from '../types';
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

// Using built-in date formatting instead of date-fns with validation
const formatDate = (dateString: string) => {
    try {
        if (!dateString) {
            return new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        console.error('Error formatting date:', e, dateString);
        return new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    }
};

interface TestResult {
    testName: string;
    result: string;
    referenceRange: string;
    unit: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
}

interface LabReport {
    id: string;
    reportNo: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
    doctorName: string;
    date: string;
    testResults: TestResult[];
    status: 'Initial' | 'In Progress' | 'Completed' | 'Verified and Signed' | 'Printed' | 'Delivered';
    reportType: 'Normal' | 'Descriptive' | 'Group';
    technician: string;
    verifiedBy: string;
    remarks?: string;
    clinicalHistory?: string;
    specimenType: string;
    collectionTime: string;
    receivedTime: string;
    reportTime: string;
    createdBy: string;
    lastUpdated: string;
}

export function ReportsPage() {
    const { bills, updateBill } = useBills();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [reportType, setReportType] = useState('all');
    const [activeTab, setActiveTab] = useState('daily');
    const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPrintManagerOpen, setIsPrintManagerOpen] = useState(false);
    const [printingReport, setPrintingReport] = useState<LabReport | null>(null);
    const [editingReport, setEditingReport] = useState<LabReport | null>(null);
    const [viewingReportId, setViewingReportId] = useState<string | null>(null);

    // Convert bills to lab reports format
    const convertBillsToReports = (bills: Bill[]): LabReport[] => {
        return bills.filter(bill => bill.patient && bill.doctor).map(bill => {
            // Safe age calculation
            let patientAge = 0;
            try {
                if (bill.patient?.dateOfBirth) {
                    const birthDate = new Date(bill.patient.dateOfBirth);
                    if (!isNaN(birthDate.getTime())) {
                        patientAge = new Date().getFullYear() - birthDate.getFullYear();
                    }
                }
            } catch (e) {
                console.error('Error calculating age:', e);
            }

            // Safe date handling  
            let reportDate = new Date().toISOString().split('T')[0];
            try {
                if (bill.sampleDate) {
                    reportDate = bill.sampleDate;
                } else if (bill.createdAt) {
                    reportDate = bill.createdAt.split('T')[0];
                }
            } catch (e) {
                console.error('Error handling date:', e);
            }

            // Safe lastUpdated handling
            let lastUpdated = new Date().toISOString().split('T')[0];
            try {
                if (bill.updatedAt) {
                    lastUpdated = bill.updatedAt.split('T')[0];
                }
            } catch (e) {
                console.error('Error handling lastUpdated:', e);
            }

            return {
                id: bill.id,
                reportNo: bill.id.replace('BILL-', 'LAB-'),
                patientName: bill.patient?.name || bill.patientName || 'Unknown Patient',
                patientAge,
                patientGender: bill.patient?.gender
                    ? bill.patient.gender.charAt(0).toUpperCase() + bill.patient.gender.slice(1)
                    : 'Unknown',
                doctorName: bill.doctor?.name || bill.doctorName || 'Unknown Doctor',
                date: reportDate,
                testResults: bill.testResults?.map(tr => {
                    const test = bill.tests?.find(t => t.testId === tr.testId);
                    return {
                        testName: test?.test?.testName || test?.test?.name || 'Unknown Test',
                        result: tr.result || '',
                        referenceRange: test?.test?.referenceRanges?.[0]
                            ? `${test.test.referenceRanges[0].minValue}-${test.test.referenceRanges[0].maxValue} ${test.test.referenceRanges[0].unit}`
                            : '',
                        unit: test?.test?.unit || '',
                        status: tr.isAbnormal ? 'High' : 'Normal' as 'Normal' | 'High' | 'Low' | 'Critical'
                    };
                }) || [],
                status: bill.reportStatus || 'Initial',
                reportType: 'Normal' as 'Normal' | 'Descriptive' | 'Group',
                technician: 'Tech. Admin',
                verifiedBy: 'Dr. Lab Head',
                remarks: bill.clinicalRemarks || '',
                clinicalHistory: bill.notes || '',
                priority: 'Normal',
                specimenType: 'Blood',
                collectionTime: bill.sampleTime || '09:00',
                receivedTime: bill.sampleTime || '09:00',
                reportTime: bill.sampleTime || '09:00',
                createdBy: 'Dr. Admin',
                lastUpdated
            };
        });
    };

    // Safety check for bills loading
    if (!bills || !Array.isArray(bills)) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading reports...</p>
                </div>
            </div>
        );
    }

    // Get reports from bills
    const reportsFromBills = convertBillsToReports(bills);

    // Combine sample reports with bills-based reports
    const sampleReports: LabReport[] = [
        {
            id: '1',
            reportNo: 'LAB001',
            patientName: 'Rahul Sharma',
            patientAge: 35,
            patientGender: 'Male',
            doctorName: 'Dr. Patel',
            date: '2024-10-03',
            testResults: [
                {
                    testName: 'Hemoglobin',
                    result: '14.2',
                    referenceRange: '13.5 - 17.5',
                    unit: 'g/dl',
                    status: 'Normal'
                },
                {
                    testName: 'Total RBC Count',
                    result: '4.8',
                    referenceRange: '4.5 - 5.5',
                    unit: 'mill/cumm',
                    status: 'Normal'
                },
                {
                    testName: 'Platelet Count',
                    result: '180',
                    referenceRange: '150 - 450',
                    unit: 'thousand/cumm',
                    status: 'Normal'
                }
            ],
            status: 'Verified and Signed',
            reportType: 'Normal',
            technician: 'Tech. Amit',
            verifiedBy: 'Dr. Lab Head',
            remarks: 'All parameters within normal limits',
            clinicalHistory: 'Routine health checkup',
            specimenType: 'Whole Blood (EDTA)',
            collectionTime: '2024-10-03 09:00 AM',
            receivedTime: '2024-10-03 09:15 AM',
            reportTime: '2024-10-03 02:30 PM',
            createdBy: 'Dr. Admin',
            lastUpdated: '2024-10-03 02:30 PM'
        },
        {
            id: '2',
            reportNo: 'LAB002',
            patientName: 'Priya Patel',
            patientAge: 28,
            patientGender: 'Female',
            doctorName: 'Dr. Kumar',
            date: '2024-10-03',
            testResults: [
                {
                    testName: 'TSH',
                    result: '8.5',
                    referenceRange: '0.27 - 4.20',
                    unit: 'mIU/L',
                    status: 'High'
                },
                {
                    testName: 'Free T4',
                    result: '10.2',
                    referenceRange: '12 - 22',
                    unit: 'pmol/L',
                    status: 'Low'
                },
                {
                    testName: 'Free T3',
                    result: '2.8',
                    referenceRange: '3.1 - 6.8',
                    unit: 'pmol/L',
                    status: 'Low'
                }
            ],
            status: 'Completed',
            reportType: 'Descriptive',
            technician: 'Tech. Priya',
            verifiedBy: 'Dr. Lab Head',
            remarks: 'Suggestive of hypothyroidism. Clinical correlation advised.',
            clinicalHistory: 'Fatigue, weight gain, cold intolerance',
            specimenType: 'Serum',
            collectionTime: '2024-10-03 08:30 AM',
            receivedTime: '2024-10-03 08:45 AM',
            reportTime: '2024-10-03 04:15 PM',
            createdBy: 'Dr. Kumar',
            lastUpdated: '2024-10-03 04:15 PM'
        },
        {
            id: '3',
            reportNo: 'LAB003',
            patientName: 'Amit Kumar',
            patientAge: 45,
            patientGender: 'Male',
            doctorName: 'Dr. Singh',
            date: '2024-10-02',
            testResults: [
                {
                    testName: 'Iron',
                    result: '45',
                    referenceRange: '50 - 190',
                    unit: 'mg/dL',
                    status: 'Low'
                },
                {
                    testName: 'TIBC',
                    result: '480',
                    referenceRange: '250 - 450',
                    unit: 'mg/dL',
                    status: 'High'
                },
                {
                    testName: 'Ferritin',
                    result: '8',
                    referenceRange: '10 - 160',
                    unit: 'ng/mL',
                    status: 'Low'
                }
            ],
            status: 'Printed',
            reportType: 'Group',
            technician: 'Tech. Raj',
            verifiedBy: 'Dr. Lab Head',
            remarks: 'Iron deficiency anemia pattern. Iron supplementation recommended.',
            clinicalHistory: 'Weakness, pallor, shortness of breath',
            specimenType: 'Serum',
            collectionTime: '2024-10-02 10:00 AM',
            receivedTime: '2024-10-02 10:20 AM',
            reportTime: '2024-10-02 06:00 PM',
            createdBy: 'Dr. Singh',
            lastUpdated: '2024-10-02 06:00 PM'
        },
        {
            id: '4',
            reportNo: 'LAB004',
            patientName: 'Sneha Singh',
            patientAge: 32,
            patientGender: 'Female',
            doctorName: 'Dr. Patel',
            date: '2024-10-02',
            testResults: [
                {
                    testName: 'Glucose (Fasting)',
                    result: '140',
                    referenceRange: '70 - 110',
                    unit: 'mg/dl',
                    status: 'High'
                },
                {
                    testName: 'HbA1c',
                    result: '8.2',
                    referenceRange: '< 6.5',
                    unit: '%',
                    status: 'High'
                }
            ],
            status: 'In Progress',
            reportType: 'Normal',
            technician: 'Tech. Suresh',
            verifiedBy: 'Pending',
            remarks: 'Results pending verification',
            clinicalHistory: 'Diabetes mellitus follow-up',
            specimenType: 'Serum/Whole Blood',
            collectionTime: '2024-10-02 09:00 AM',
            receivedTime: '2024-10-02 09:15 AM',
            reportTime: 'Pending',
            createdBy: 'Dr. Patel',
            lastUpdated: '2024-10-02 11:20 AM'
        }
    ];

    // Combine sample reports with bills-based reports
    const allReports = [...sampleReports, ...reportsFromBills];
    const [reports, setReports] = useState<LabReport[]>(allReports);

    // Update reports when bills change
    React.useEffect(() => {
        const updatedReports = [...sampleReports, ...convertBillsToReports(bills)];
        setReports(updatedReports);
    }, [bills]);

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
        // Check if this is a bill-based report
        const correspondingBill = bills.find(bill => bill.id === report.id);
        if (correspondingBill) {
            setSelectedBill(correspondingBill);
        }
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

        // If this is a bill-based report, also update the corresponding bill
        const correspondingBill = bills.find(bill => bill.id === reportId);
        if (correspondingBill) {
            updateBill(reportId, { reportStatus: newStatus });
        }
    };

    // Download individual report as PDF
    const handleDownloadReport = (report: LabReport) => {
        const content = `
<!DOCTYPE html>
<html>
<head>
    <title>Lab Report - ${report.reportNo}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .status { padding: 4px 12px; border-radius: 4px; display: inline-block; }
        .completed { background-color: #dcfce7; color: #166534; }
        .pending { background-color: #fef3c7; color: #92400e; }
        .in-progress { background-color: #dbeafe; color: #1d4ed8; }
        .normal { color: #166534; }
        .high { color: #dc2626; font-weight: bold; }
        .low { color: #ea580c; font-weight: bold; }
        .critical { color: #dc2626; font-weight: bold; background-color: #fef2f2; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        <h1>HealthCare SaaS</h1>
        <h2>Laboratory Report</h2>
        <p>Report No: ${report.reportNo}</p>
    </div>
    
    <div class="info-grid">
        <div>
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${report.patientName}</p>
            <p><strong>Age:</strong> ${report.patientAge} years</p>
            <p><strong>Gender:</strong> ${report.patientGender}</p>
            <p><strong>Clinical History:</strong> ${report.clinicalHistory || 'Not provided'}</p>
        </div>
        <div>
            <h3>Report Information</h3>
            <p><strong>Date:</strong> ${format(new Date(report.date), 'PPP')}</p>
            <p><strong>Doctor:</strong> ${report.doctorName}</p>
            <p><strong>Status:</strong> <span class="status ${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span></p>
            <p><strong>Report Type:</strong> ${report.reportType}</p>
        </div>
    </div>
    
    <div class="section">
        <h3>Specimen Information</h3>
        <p><strong>Specimen Type:</strong> ${report.specimenType}</p>
        <p><strong>Collection Time:</strong> ${report.collectionTime}</p>
        <p><strong>Received Time:</strong> ${report.receivedTime}</p>
        <p><strong>Report Time:</strong> ${report.reportTime}</p>
    </div>
    
    <div class="section">
        <h3>Test Results</h3>
        <table>
            <thead>
                <tr>
                    <th>Test Name</th>
                    <th>Result</th>
                    <th>Reference Range</th>
                    <th>Unit</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${report.testResults.map(result => `
                    <tr>
                        <td>${result.testName}</td>
                        <td class="${result.status.toLowerCase()}">${result.result}</td>
                        <td>${result.referenceRange}</td>
                        <td>${result.unit}</td>
                        <td class="${result.status.toLowerCase()}">${result.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h3>Clinical Remarks</h3>
        <p>${report.remarks || 'No remarks'}</p>
    </div>
    
    <div class="section">
        <h3>Laboratory Information</h3>
        <p><strong>Technician:</strong> ${report.technician}</p>
        <p><strong>Verified by:</strong> ${report.verifiedBy}</p>
        <p><strong>Report ID:</strong> ${report.id}</p>
    </div>
</body>
</html>
    `;

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
        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Lab Report - ${report.reportNo}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.4; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .high { font-weight: bold; color: #dc2626; }
        .low { font-weight: bold; color: #ea580c; }
        .critical { font-weight: bold; color: #dc2626; background-color: #fef2f2; }
        .normal { color: #166534; }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>HealthCare SaaS Laboratory</h1>
        <h2>Laboratory Report</h2>
        <p><strong>Report No:</strong> ${report.reportNo}</p>
    </div>
    
    <div class="info-grid">
        <div>
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${report.patientName}</p>
            <p><strong>Age:</strong> ${report.patientAge} years</p>
            <p><strong>Gender:</strong> ${report.patientGender}</p>
            <p><strong>Clinical History:</strong> ${report.clinicalHistory || 'Not provided'}</p>
        </div>
        <div>
            <h3>Report Information</h3>
            <p><strong>Report Date:</strong> ${formatDate(report.date)}</p>
            <p><strong>Referring Doctor:</strong> ${report.doctorName}</p>
            <p><strong>Specimen Type:</strong> ${report.specimenType}</p>
            <p><strong>Report Status:</strong> ${report.status}</p>
        </div>
    </div>
    
    <div class="section">
        <h3>Test Results</h3>
        <table>
            <thead>
                <tr>
                    <th style="width: 30%;">Test Name</th>
                    <th style="width: 15%;">Result</th>
                    <th style="width: 25%;">Reference Range</th>
                    <th style="width: 10%;">Unit</th>
                    <th style="width: 20%;">Status</th>
                </tr>
            </thead>
            <tbody>
                ${report.testResults.map(result => `
                    <tr>
                        <td><strong>${result.testName}</strong></td>
                        <td class="${result.status.toLowerCase()}">${result.result}</td>
                        <td>${result.referenceRange}</td>
                        <td>${result.unit}</td>
                        <td class="${result.status.toLowerCase()}">${result.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h3>Clinical Remarks</h3>
        <p>${report.remarks || 'No specific remarks'}</p>
    </div>
    
    <div style="margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
        <div>
            <p><strong>Technician:</strong></p>
            <div style="border-bottom: 1px solid #000; margin-top: 40px; padding-bottom: 5px;"></div>
            <p>${report.technician}</p>
        </div>
        <div>
            <p><strong>Pathologist:</strong></p>
            <div style="border-bottom: 1px solid #000; margin-top: 40px; padding-bottom: 5px;"></div>
            <p>${report.verifiedBy}</p>
        </div>
    </div>
    
    <div style="margin-top: 30px; font-size: 12px; color: #666;">
        <p><strong>Report Generated on:</strong> ${new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
    </div>
</body>
</html>
    `;

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
            const csvContent = [
                ['Report No', 'Patient Name', 'Doctor', 'Date', 'Status', 'Type', 'Technician', 'Verified By'].join(','),
                ...filteredReports.map(report => [
                    report.reportNo,
                    report.patientName,
                    report.doctorName,
                    report.date,
                    report.status,
                    report.reportType,
                    report.technician,
                    report.verifiedBy
                ].join(','))
            ].join('\n');

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

    // Show report details if viewing a specific report
    if (viewingReportId) {
        return <ReportDetails
            reportId={viewingReportId}
            bill={selectedBill}
            onBack={() => {
                setViewingReportId(null);
                setSelectedBill(null);
            }}
            onUpdateBill={selectedBill ? (updates) => updateBill(selectedBill.id, updates) : undefined}
        />;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl">Lab Reports</h1>
                    <p className="text-slate-600">View and manage laboratory test reports</p>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleCreateReport}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Report
                    </Button>
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

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search by patient name, report number, or doctor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Reports</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Initial</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {selectedDate ? format(selectedDate, 'PPP') : 'Select Date'}
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
            </Card>

            {/* Report Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-6">
                    {/* Daily Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Today's Reports</p>
                                    <p className="text-xl">{dailyStats.totalReports}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Completed</p>
                                    <p className="text-xl">{dailyStats.completedReports}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Pending</p>
                                    <p className="text-xl">{dailyStats.pendingReports}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Abnormal Results</p>
                                    <p className="text-xl">{dailyStats.abnormalResults}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Daily Reports Table */}
                    <Card>
                        <div className="p-4 border-b">
                            <h3>Today's Lab Reports</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Report No.</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Tests</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{report.reportNo}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{report.patientName}</p>
                                                <p className="text-sm text-slate-500">{report.patientAge}Y, {report.patientGender}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{report.doctorName}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {report.testResults.slice(0, 2).map((test, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {test.testName}
                                                    </Badge>
                                                ))}
                                                {report.testResults.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{report.testResults.length - 2} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    report.status === 'Completed' || report.status === 'Verified and Signed' || report.status === 'Printed' || report.status === 'Delivered' ? 'default' :
                                                        report.status === 'In Progress' ? 'secondary' :
                                                            'destructive'
                                                }
                                            >
                                                {report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleViewReport(report)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleEditReport(report)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handlePrintReport(report)}
                                                >
                                                    <Printer className="w-4 h-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="sm" variant="ghost">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => handleDownloadReport(report)}>
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download PDF
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'Completed')}>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Mark Completed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'Verified and Signed')}>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Mark Verified
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'In Progress')}>
                                                            <AlertCircle className="w-4 h-4 mr-2" />
                                                            Mark In Progress
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'Initial')}>
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Mark Initial
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-6">
                    {/* Monthly Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Monthly Reports</p>
                                    <p className="text-xl">{monthlyStats.totalReports}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Completed</p>
                                    <p className="text-xl">{monthlyStats.completedReports}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Pending</p>
                                    <p className="text-xl">{monthlyStats.pendingReports}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Users className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Abnormal Results</p>
                                    <p className="text-xl">{monthlyStats.abnormalResults}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card className="p-6">
                        <h3 className="mb-4">Monthly Summary</h3>
                        <p className="text-slate-600">
                            Detailed monthly analytics and trends for laboratory reports.
                        </p>
                    </Card>
                </TabsContent>

                <TabsContent value="pending" className="space-y-6">
                    <Card>
                        <div className="p-4 border-b">
                            <h3>Pending Reports</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Report No.</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Age Due</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReports.filter(r => r.status === 'Initial' || r.status === 'In Progress').map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{report.reportNo}</TableCell>
                                        <TableCell>{report.patientName}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">2 hours</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={report.status === 'In Progress' ? 'default' : 'destructive'}>
                                                {report.status === 'In Progress' ? 'Normal' : 'High'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleViewReport(report)}>
                                                    Process
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusChange(report.id, 'Completed')}
                                                >
                                                    Complete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <Card className="p-6">
                        <h3 className="mb-4">Lab Analytics</h3>
                        <p className="text-slate-600">
                            Comprehensive analytics and insights for laboratory operations.
                        </p>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* View Report Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Lab Report - {selectedReport?.reportNo}</DialogTitle>
                        <DialogDescription>
                            Complete laboratory test report details
                        </DialogDescription>
                    </DialogHeader>

                    {selectedReport && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-4">
                                    <h4 className="mb-3">Patient Information</h4>
                                    <div className="space-y-2">
                                        <p><strong>Name:</strong> {selectedReport.patientName}</p>
                                        <p><strong>Age:</strong> {selectedReport.patientAge} years</p>
                                        <p><strong>Gender:</strong> {selectedReport.patientGender}</p>
                                        <p><strong>Clinical History:</strong> {selectedReport.clinicalHistory}</p>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <h4 className="mb-3">Report Information</h4>
                                    <div className="space-y-2">
                                        <p><strong>Date:</strong> {format(new Date(selectedReport.date), 'PPP')}</p>
                                        <p><strong>Doctor:</strong> {selectedReport.doctorName}</p>
                                        <p><strong>Status:</strong>
                                            <Badge
                                                className="ml-2"
                                                variant={
                                                    selectedReport.status === 'Completed' ? 'default' :
                                                        selectedReport.status === 'In Progress' ? 'secondary' :
                                                            'destructive'
                                                }
                                            >
                                                {selectedReport.status}
                                            </Badge>
                                        </p>
                                        <p><strong>Report Type:</strong> {selectedReport.reportType}</p>
                                    </div>
                                </Card>
                            </div>

                            <Card className="p-4">
                                <h4 className="mb-3">Specimen Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><strong>Specimen Type:</strong> {selectedReport.specimenType}</p>
                                    <p><strong>Collection Time:</strong> {selectedReport.collectionTime}</p>
                                    <p><strong>Received Time:</strong> {selectedReport.receivedTime}</p>
                                    <p><strong>Report Time:</strong> {selectedReport.reportTime}</p>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <h4 className="mb-3">Test Results</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Test Name</TableHead>
                                            <TableHead>Result</TableHead>
                                            <TableHead>Reference Range</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedReport.testResults.map((result, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{result.testName}</TableCell>
                                                <TableCell
                                                    className={
                                                        result.status === 'High' || result.status === 'Critical' ? 'text-red-600 font-medium' :
                                                            result.status === 'Low' ? 'text-orange-600 font-medium' :
                                                                'text-green-600'
                                                    }
                                                >
                                                    {result.result}
                                                </TableCell>
                                                <TableCell>{result.referenceRange}</TableCell>
                                                <TableCell>{result.unit}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            result.status === 'Normal' ? 'default' :
                                                                result.status === 'High' || result.status === 'Low' ? 'secondary' :
                                                                    'destructive'
                                                        }
                                                    >
                                                        {result.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>

                            <Card className="p-4">
                                <h4 className="mb-3">Clinical Remarks</h4>
                                <p className="text-slate-700">{selectedReport.remarks || 'No remarks'}</p>
                            </Card>

                            <Card className="p-4">
                                <h4 className="mb-3">Laboratory Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><strong>Technician:</strong> {selectedReport.technician}</p>
                                    <p><strong>Verified by:</strong> {selectedReport.verifiedBy}</p>
                                    <p><strong>Created by:</strong> {selectedReport.createdBy}</p>
                                    <p><strong>Last Updated:</strong> {selectedReport.lastUpdated}</p>
                                </div>
                            </Card>

                            <div className="flex gap-2 pt-4">
                                <Button onClick={() => handleEditReport(selectedReport)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Report
                                </Button>
                                <Button variant="outline" onClick={() => handlePrintReport(selectedReport)}>
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print
                                </Button>
                                <Button variant="outline" onClick={() => handleDownloadReport(selectedReport)}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create/Edit Report Modal */}
            <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditingReport(null);
                }
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isCreateModalOpen ? 'Create New Lab Report' : 'Edit Lab Report'}
                        </DialogTitle>
                        <DialogDescription>
                            {isCreateModalOpen ? 'Enter details for the new laboratory report' : 'Update the report information'}
                        </DialogDescription>
                    </DialogHeader>

                    {editingReport && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="patientName">Patient Name</Label>
                                    <Input
                                        id="patientName"
                                        value={editingReport.patientName}
                                        onChange={(e) => setEditingReport(prev => prev ? { ...prev, patientName: e.target.value } : null)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="doctorName">Doctor Name</Label>
                                    <Input
                                        id="doctorName"
                                        value={editingReport.doctorName}
                                        onChange={(e) => setEditingReport(prev => prev ? { ...prev, doctorName: e.target.value } : null)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="patientAge">Patient Age</Label>
                                    <Input
                                        id="patientAge"
                                        type="number"
                                        value={editingReport.patientAge}
                                        onChange={(e) => setEditingReport(prev => prev ? { ...prev, patientAge: parseInt(e.target.value) || 0 } : null)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="patientGender">Patient Gender</Label>
                                    <Select
                                        value={editingReport.patientGender}
                                        onValueChange={(value) => setEditingReport(prev => prev ? { ...prev, patientGender: value } : null)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={editingReport.date}
                                        onChange={(e) => setEditingReport(prev => prev ? { ...prev, date: e.target.value } : null)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={editingReport.status}
                                        onValueChange={(value: 'Completed' | 'Pending' | 'In Progress') => setEditingReport(prev => prev ? { ...prev, status: value } : null)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reportType">Report Type</Label>
                                    <Select
                                        value={editingReport.reportType}
                                        onValueChange={(value: 'Normal' | 'Descriptive' | 'Group') => setEditingReport(prev => prev ? { ...prev, reportType: value } : null)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Normal">Normal</SelectItem>
                                            <SelectItem value="Descriptive">Descriptive</SelectItem>
                                            <SelectItem value="Group">Group</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="technician">Technician</Label>
                                    <Input
                                        id="technician"
                                        value={editingReport.technician}
                                        onChange={(e) => setEditingReport(prev => prev ? { ...prev, technician: e.target.value } : null)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="verifiedBy">Verified By</Label>
                                    <Input
                                        id="verifiedBy"
                                        value={editingReport.verifiedBy}
                                        onChange={(e) => setEditingReport(prev => prev ? { ...prev, verifiedBy: e.target.value } : null)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specimenType">Specimen Type</Label>
                                    <Input
                                        id="specimenType"
                                        value={editingReport.specimenType}
                                        onChange={(e) => setEditingReport(prev => prev ? { ...prev, specimenType: e.target.value } : null)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="clinicalHistory">Clinical History</Label>
                                <Textarea
                                    id="clinicalHistory"
                                    value={editingReport.clinicalHistory || ''}
                                    onChange={(e) => setEditingReport(prev => prev ? { ...prev, clinicalHistory: e.target.value } : null)}
                                    placeholder="Enter clinical history..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remarks">Clinical Remarks</Label>
                                <Textarea
                                    id="remarks"
                                    value={editingReport.remarks || ''}
                                    onChange={(e) => setEditingReport(prev => prev ? { ...prev, remarks: e.target.value } : null)}
                                    placeholder="Enter clinical remarks and interpretation..."
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button onClick={handleSaveReport}>
                                    {isCreateModalOpen ? 'Create Report' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={() => {
                                    setIsEditModalOpen(false);
                                    setIsCreateModalOpen(false);
                                    setEditingReport(null);
                                }}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Print Manager */}
            {isPrintManagerOpen && printingReport && (
                <GlobalPrintManager
                    reportData={printingReport}
                    documentType="report"
                    patientName={printingReport.patientName}
                    onClose={() => {
                        setIsPrintManagerOpen(false);
                        setPrintingReport(null);
                    }}
                />
            )}
        </div>
    );
}