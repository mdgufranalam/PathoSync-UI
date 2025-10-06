import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { RichTextEditor } from './ui/rich-text-editor';
import { DescriptiveTestEditor } from './DescriptiveTestEditor';
import { TestGroupRenderer } from './TestGroupRenderer';
import { mockTestsAPI } from '../utils/mockTestsAPI';
import {
    ArrowLeft,
    Edit,
    Save,
    Printer,
    Send,
    CheckCircle,
    FileText,
    MessageSquare,
    Phone,
    Plus,
    AlertCircle,
    Users,
    Calendar,
    Clock,
    Settings,
    Beaker
} from 'lucide-react';
import { format } from 'date-fns';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface TestResult {
    id?: string;
    testName: string;
    result: string;
    referenceRange: string;
    unit: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
    method?: string;
}

interface LabReport {
    id: string;
    reportNo: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
    patientPhone?: string;
    doctorName: string;
    date: string;
    testResults: TestResult[];
    status: 'Initial' | 'In Progress' | 'Completed' | 'Verified and Signed' | 'Printed' | 'Delivered';
    reportType: 'Normal' | 'Descriptive' | 'Group';
    technician: string;
    verifiedBy: string;
    remarks?: string;
    impression?: string;
    clinicalHistory?: string;
    specimenType: string;
    collectionTime: string;
    receivedTime: string;
    reportTime: string;
    createdBy: string;
    lastUpdated: string;
}

import { Bill } from '../types';

interface ReportDetailsProps {
    reportId: string;
    onBack: () => void;
    bill?: Bill;
    onUpdateBill?: (updates: Partial<Bill>) => void;
}

export function ReportDetails({ reportId, onBack, bill, onUpdateBill }: ReportDetailsProps) {
    const [report, setReport] = useState<LabReport | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingResults, setEditingResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isImpressionModalOpen, setIsImpressionModalOpen] = useState(false);
    const [impression, setImpression] = useState('');
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [sendMethod, setSendMethod] = useState<'whatsapp' | 'sms'>('whatsapp');
    const [sendMessage, setSendMessage] = useState('');
    const [isDescriptiveEditorOpen, setIsDescriptiveEditorOpen] = useState(false);
    const [editingDescriptiveTest, setEditingDescriptiveTest] = useState<any>(null);

    // CKEditor state for descriptive tests
    const [descriptiveContent, setDescriptiveContent] = useState('');

    // Process bill data immediately when bill prop changes
    useEffect(() => {
        if (bill) {
            // Handle both Simple Billing and Enhanced Billing data structures
            const patientName = bill.patient?.name || (bill as any).patientName || 'Unknown Patient';
            const patientPhone = bill.patient?.phone || (bill as any).patientPhone || '';
            const patientGender = bill.patient?.gender || 'Unknown';
            const doctorName = bill.doctor?.name || (bill as any).doctorName || 'Unknown Doctor';

            // Calculate age safely
            let patientAge = 25; // default age
            if (bill.patient?.dateOfBirth) {
                try {
                    patientAge = new Date().getFullYear() - new Date(bill.patient.dateOfBirth).getFullYear();
                } catch (e) {
                    patientAge = 25; // fallback
                }
            }

            const billReport: LabReport = {
                id: bill.id,
                reportNo: bill.id.replace('BILL-', 'LAB-'),
                patientName,
                patientAge,
                patientGender: patientGender.charAt(0).toUpperCase() + patientGender.slice(1),
                patientPhone,
                doctorName,
                date: (() => {
                    try {
                        if (bill.sampleDate) {
                            return bill.sampleDate;
                        }
                        if (bill.createdAt) {
                            return bill.createdAt.split('T')[0];
                        }
                        return new Date().toISOString().split('T')[0];
                    } catch (e) {
                        return new Date().toISOString().split('T')[0];
                    }
                })(),
                testResults: (() => {
                    // If bill has testResults (Enhanced Billing), use them
                    if (bill.testResults && bill.testResults.length > 0) {
                        return bill.testResults.map(tr => {
                            const test = bill.tests?.find(t => t.testId === tr.testId || t.id === tr.testId);
                            const testName = test?.test?.name || test?.name || 'Unknown Test';
                            const referenceRange = test?.test?.normalRange || test?.referenceRange || '';
                            const unit = test?.test?.unit || test?.unit || '';

                            return {
                                id: tr.testId,
                                testName,
                                result: tr.result || '',
                                referenceRange,
                                unit,
                                status: tr.isAbnormal ? 'High' : 'Normal' as 'Normal' | 'High' | 'Low' | 'Critical',
                                method: 'Standard'
                            };
                        });
                    }
                    // If no testResults but has tests (Simple Billing), create test results from tests
                    else if (bill.tests && bill.tests.length > 0) {
                        const baseTests = bill.tests.map((test, index) => ({
                            id: test.id || `test-${index}`,
                            testName: test.test?.name || test.name || 'Unknown Test',
                            result: '',
                            referenceRange: test.test?.normalRange || test.referenceRange || '',
                            unit: test.test?.unit || test.unit || '',
                            status: 'Normal' as 'Normal' | 'High' | 'Low' | 'Critical',
                            method: 'Standard'
                        }));

                        // Add some sample descriptive and normal tests for demonstration
                        const additionalTests = [
                            {
                                id: 'chest-xray',
                                testName: 'Chest XRay PA View',
                                result: '',
                                referenceRange: '',
                                unit: '',
                                status: 'Normal' as 'Normal' | 'High' | 'Low' | 'Critical',
                                method: 'Radiology'
                            },
                            {
                                id: 'urine-culture',
                                testName: 'Urine Culture & Sensitivity',
                                result: '',
                                referenceRange: '',
                                unit: '',
                                status: 'Normal' as 'Normal' | 'High' | 'Low' | 'Critical',
                                method: 'Microbiology'
                            },
                            {
                                id: 'hemoglobin',
                                testName: 'Haemoglobin (HB)',
                                result: '14.2',
                                referenceRange: 'Male : 13.5 to 16.5\nFemale : 12.5 to 14.5\nChildren : 1 - 2 yrs : 10.5 to 14.0\nChildren : 2 - 9 yrs : 11.5 to 14.5',
                                unit: 'gms/dl',
                                status: 'Normal' as 'Normal' | 'High' | 'Low' | 'Critical',
                                method: 'Automated cell counter'
                            },
                            {
                                id: 'wbc-count',
                                testName: 'White Blood cell count (WBC)',
                                result: '7200',
                                referenceRange: '4000 to 11000\nChildren : 30 to 60',
                                unit: 'Cells/cumm',
                                status: 'Normal' as 'Normal' | 'High' | 'Low' | 'Critical',
                                method: 'Automated cell counter'
                            }
                        ];

                        return [...baseTests, ...additionalTests];
                    }
                    return [];
                })(),
                status: bill.reportStatus || 'Initial',
                reportType: 'Normal' as 'Normal' | 'Descriptive' | 'Group',
                technician: 'Lab Tech',
                verifiedBy: 'Dr. Admin',
                remarks: bill.clinicalRemarks || '',
                impression: '',
                clinicalHistory: '',
                specimenType: 'Blood',
                collectionTime: bill.sampleTime || '09:00',
                receivedTime: bill.sampleTime || '09:00',
                reportTime: bill.sampleTime || '09:00',
                createdBy: 'System',
                lastUpdated: (() => {
                    try {
                        return bill.updatedAt || bill.createdAt || new Date().toISOString();
                    } catch (e) {
                        return new Date().toISOString();
                    }
                })()
            };

            setReport(billReport);
            setEditingResults(billReport.testResults);
            setImpression(billReport.impression || '');
            setDescriptiveContent('');
            setLoading(false);
        } else {
            // Only fetch from server if no bill is provided
            fetchReport();
        }
    }, [bill]);

    useEffect(() => {
        if (!bill) {
            fetchReport();
        }
    }, [reportId]);

    const fetchReport = async () => {
        try {
            setLoading(true);

            // Add timeout to prevent long waits
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

            console.log(`Fetching report with ID: ${reportId}`);

            // Use mock data for now - API endpoints not implemented yet
            clearTimeout(timeoutId);

            console.log('Using mock data for report:', reportId);

            // Mock successful response
            const result = {
                success: true,
                data: {
                    id: reportId,
                    patientName: 'Mock Patient',
                    reportType: 'Lab Report',
                    status: 'Pending',
                    tests: [],
                    createdAt: new Date().toISOString()
                }
            };

            if (result.success && result.data) {
                console.log('Report loaded successfully:', result.data.report_no);
                setReport(result.data);
                setEditingResults(result.data.test_results || []);
                setImpression(result.data.impression || '');
                setDescriptiveContent(result.data.descriptive_content || '');
            } else {
                console.error('Report not found or API error:', result.error || 'Unknown error');
                setReport(null);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Request timed out after 8 seconds');
            } else {
                console.error('Network or parsing error:', error);
            }
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveResults = async () => {
        if (!report) return;

        try {
            setSaving(true);

            // If this is a bill-based report, update the bill data
            if (bill && onUpdateBill) {
                const updatedTestResults = editingResults.map(result => ({
                    testId: result.id || '',
                    result: result.result,
                    isAbnormal: result.status !== 'Normal'
                }));

                onUpdateBill({
                    testResults: updatedTestResults,
                    clinicalRemarks: report.remarks || '',
                    reportStatus: report.status
                });

                setReport({ ...report, testResults: editingResults });
                setIsEditing(false);
                setSaving(false);
                return;
            }

            // Use mock update for now - API endpoints not implemented yet
            console.log('Mock saving report:', report.id);

            // Simulate successful save
            const response = { ok: true };

            const result = await response.json();
            if (result.success) {
                setReport({ ...report, testResults: editingResults });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving results:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: LabReport['status']) => {
        if (!report) return;

        try {
            // If this is a bill-based report, update the bill data
            if (bill && onUpdateBill) {
                onUpdateBill({ reportStatus: newStatus });
                setReport({ ...report, status: newStatus });
                return;
            }

            // Use mock update for now - API endpoints not implemented yet
            console.log('Mock updating report status:', report.id, newStatus);

            // Simulate successful update
            setReport({ ...report, status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSaveImpression = async () => {
        if (!report) return;

        try {
            // Use mock update for now - API endpoints not implemented yet
            console.log('Mock saving impression for report:', report.id);

            // Simulate successful save
            setReport({ ...report, impression });
            setIsImpressionModalOpen(false);
        } catch (error) {
            console.error('Error saving impression:', error);
        }
    };

    const handlePrintReport = () => {
        if (!report) return;

        const printContent = generatePrintContent(report);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();

            // Update status to printed
            handleStatusChange('Printed');
        }
    };

    const generatePrintContent = (report: LabReport) => {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Lab Report - ${report.reportNo}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            line-height: 1.4;
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #333; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .patient-info { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .section { 
            margin-bottom: 20px; 
        }
        .section h3 { 
            color: #333; 
            border-bottom: 1px solid #ddd; 
            padding-bottom: 5px; 
            margin-bottom: 10px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
        }
        th { 
            background-color: #f8f9fa; 
            font-weight: bold;
        }
        .abnormal { 
            font-weight: bold; 
            color: #dc2626;
        }
        .high { 
            font-weight: bold; 
            color: #dc2626;
        }
        .low { 
            font-weight: bold; 
            color: #ea580c;
        }
        .critical { 
            font-weight: bold; 
            color: #dc2626; 
            background-color: #fef2f2;
        }
        .normal { 
            color: #166534; 
        }
        .page-break { 
            page-break-before: always; 
        }
        .test-group {
            margin-bottom: 30px;
        }
        .test-title {
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0 10px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-left: 4px solid #2563eb;
        }
        .method {
            font-style: italic;
            font-size: 12px;
            color: #666;
        }
        .impression-section {
            margin-top: 30px;
            padding: 15px;
            border: 2px solid #ddd;
            background-color: #f9f9f9;
        }
        .signatures {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            margin-top: 40px;
            padding-bottom: 5px;
        }
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
    
    <div class="patient-info">
        <div>
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${report.patientName}</p>
            <p><strong>Age:</strong> ${report.patientAge} years</p>
            <p><strong>Gender:</strong> ${report.patientGender}</p>
            <p><strong>Phone:</strong> ${report.patientPhone || 'N/A'}</p>
            <p><strong>Clinical History:</strong> ${report.clinicalHistory || 'Not provided'}</p>
        </div>
        <div>
            <h3>Report Information</h3>
            <p><strong>Report Date:</strong> ${(() => {
                try {
                    const date = new Date(report.date);
                    return isNaN(date.getTime()) ? new Date().toLocaleDateString() : format(date, 'PPP');
                } catch (e) {
                    return new Date().toLocaleDateString();
                }
            })()}</p>
            <p><strong>Referring Doctor:</strong> ${report.doctorName}</p>
            <p><strong>Specimen Type:</strong> ${report.specimenType}</p>
            <p><strong>Collection Time:</strong> ${report.collectionTime}</p>
            <p><strong>Received Time:</strong> ${report.receivedTime}</p>
            <p><strong>Report Time:</strong> ${report.reportTime || 'Pending'}</p>
        </div>
    </div>
    
    ${generateTestResultsHTML(report)}
    
    ${report.impression ? `
    <div class="impression-section">
        <h3>Clinical Impression</h3>
        <p>${report.impression}</p>
    </div>
    ` : ''}
    
    <div class="section">
        <h3>Remarks</h3>
        <p>${report.remarks || 'No specific remarks'}</p>
    </div>
    
    <div class="signatures">
        <div>
            <p><strong>Technician:</strong></p>
            <div class="signature-line"></div>
            <p>${report.technician}</p>
        </div>
        <div>
            <p><strong>Pathologist:</strong></p>
            <div class="signature-line"></div>
            <p>${report.verifiedBy}</p>
        </div>
    </div>
    
    <div style="margin-top: 30px; font-size: 12px; color: #666;">
        <p><strong>Report ID:</strong> ${report.id}</p>
        <p><strong>Generated on:</strong> ${(() => {
                try {
                    return format(new Date(), 'PPP p');
                } catch (e) {
                    return new Date().toLocaleString();
                }
            })()}</p>
    </div>
</body>
</html>
    `;
    };

    const generateTestResultsHTML = (report: LabReport) => {
        // Group tests by category for better organization
        const testsByCategory: Record<string, TestResult[]> = {};

        report.testResults.forEach(test => {
            const category = test.method || 'General Tests';
            if (!testsByCategory[category]) {
                testsByCategory[category] = [];
            }
            testsByCategory[category].push(test);
        });

        let html = '';

        Object.entries(testsByCategory).forEach(([category, tests], categoryIndex) => {
            if (categoryIndex > 0) {
                html += '<div class="page-break"></div>';
            }

            html += `
        <div class="test-group">
          <div class="test-title">${category}</div>
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
      `;

            tests.forEach(test => {
                const resultClass = test.status === 'Normal' ? 'normal' :
                    test.status === 'High' ? 'high' :
                        test.status === 'Low' ? 'low' : 'critical';

                html += `
          <tr>
            <td>
              <strong>${test.testName}</strong>
              ${test.method ? `<br><span class="method">Method: ${test.method}</span>` : ''}
            </td>
            <td class="${resultClass}">${test.result}</td>
            <td>${test.referenceRange}</td>
            <td>${test.unit}</td>
            <td class="${resultClass}">${test.status}</td>
          </tr>
        `;
            });

            html += `
            </tbody>
          </table>
        </div>
      `;
        });

        return html;
    };

    const handleSendReport = async () => {
        if (!report || !report.patientPhone) return;

        try {
            const endpoint = sendMethod === 'whatsapp' ? 'send-whatsapp' : 'send-sms';
            const message = sendMessage || getDefaultMessage(sendMethod, report);

            // Use mock for now - API endpoints not implemented yet
            console.log(`Mock sending ${sendMethod} to:`, report.patientPhone);
            console.log('Message:', message);

            // Simulate successful send
            const result = { success: true };
            if (result.success) {
                setIsSendModalOpen(false);
                // Update status to delivered
                handleStatusChange('Delivered');
            }
        } catch (error) {
            console.error(`Error sending ${sendMethod}:`, error);
        }
    };

    const getDefaultMessage = (method: 'whatsapp' | 'sms', report: LabReport) => {
        const clinicName = 'HealthCare SaaS Laboratory';
        const baseMessage = `Hello ${report.patientName}, your lab report ${report.reportNo} is ready. Thank you for choosing ${clinicName}.`;

        if (method === 'whatsapp') {
            return `${baseMessage} Please find your detailed report attached.`;
        } else {
            return `${baseMessage} Please visit our clinic to collect your report or download it from: https://clinic.example.com/reports/${report.id}`;
        }
    };

    const updateTestResult = (index: number, field: keyof TestResult, value: string) => {
        const updated = [...editingResults];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-determine status based on result and reference range
        if (field === 'result' && updated[index].referenceRange) {
            updated[index].status = determineTestStatus(value, updated[index].referenceRange);
        }

        setEditingResults(updated);
    };

    const determineTestStatus = (result: string, referenceRange: string): TestResult['status'] => {
        const numResult = parseFloat(result);
        if (isNaN(numResult)) return 'Normal';

        // Parse reference range (e.g., "10 - 50", "< 6.5", "> 18")
        const range = referenceRange.toLowerCase();

        if (range.includes(' - ') || range.includes(' to ')) {
            const [min, max] = range.split(/ - | to /).map(s => parseFloat(s.trim()));
            if (!isNaN(min) && !isNaN(max)) {
                if (numResult < min) return 'Low';
                if (numResult > max) return 'High';
                return 'Normal';
            }
        } else if (range.startsWith('<')) {
            const maxVal = parseFloat(range.substring(1).trim());
            if (!isNaN(maxVal)) {
                return numResult >= maxVal ? 'High' : 'Normal';
            }
        } else if (range.startsWith('>')) {
            const minVal = parseFloat(range.substring(1).trim());
            if (!isNaN(minVal)) {
                return numResult <= minVal ? 'Low' : 'Normal';
            }
        }

        return 'Normal';
    };

    const getStatusColor = (status: LabReport['status']) => {
        switch (status) {
            case 'Initial': return 'bg-gray-100 text-gray-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Verified and Signed': return 'bg-purple-100 text-purple-800';
            case 'Printed': return 'bg-orange-100 text-orange-800';
            case 'Delivered': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getResultStatusColor = (status: TestResult['status']) => {
        switch (status) {
            case 'Normal': return 'text-green-600';
            case 'High': return 'text-red-600 font-semibold';
            case 'Low': return 'text-orange-600 font-semibold';
            case 'Critical': return 'text-red-800 font-bold bg-red-50';
            default: return 'text-gray-600';
        }
    };

    const handleDescriptiveTestEdit = (testName: string) => {
        const testData = {
            testName,
            testType: 'culture' as const,
            specimen: report?.specimenType || 'Urine',
            findings: descriptiveContent || '',
            impression: report?.impression || '',
            recommendations: report?.remarks || '',
            antibiotics: undefined,
            customTables: undefined
        };
        setEditingDescriptiveTest(testData);
        setIsDescriptiveEditorOpen(true);
    };

    const handleDescriptiveTestSave = (data: any) => {
        setDescriptiveContent(data.findings);
        setImpression(data.impression);
        // Update the report with descriptive data
        if (report) {
            setReport({ ...report, impression: data.impression, remarks: data.recommendations });
        }
    };

    const groupTestsByCategory = () => {
        const categories: Record<string, TestResult[]> = {
            'Radiology': [],
            'Haematology': [],
            'Biochemistry': [],
            'Microbiology': [],
            'General Tests': []
        };

        (isEditing ? editingResults : report.testResults).forEach(test => {
            // Categorize tests based on test name patterns
            if (test.testName.toLowerCase().includes('xray') || test.testName.toLowerCase().includes('scan')) {
                categories['Radiology'].push(test);
            } else if (test.testName.toLowerCase().includes('hemoglobin') ||
                test.testName.toLowerCase().includes('blood count') ||
                test.testName.toLowerCase().includes('platelet') ||
                test.testName.toLowerCase().includes('wbc') ||
                test.testName.toLowerCase().includes('rbc')) {
                categories['Haematology'].push(test);
            } else if (test.testName.toLowerCase().includes('culture') ||
                test.testName.toLowerCase().includes('sensitivity')) {
                categories['Microbiology'].push(test);
            } else {
                categories['General Tests'].push(test);
            }
        });

        return categories;
    };

    const renderDescriptiveTest = (test: TestResult, index: number) => {
        const isDescriptive = test.testName.toLowerCase().includes('culture') ||
            test.testName.toLowerCase().includes('sensitivity') ||
            test.testName.toLowerCase().includes('microscopy');

        return (
            <TableRow key={test.id || index} className="border-l-4 border-l-blue-200">
                <TableCell>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{test.testName}</span>
                        {isDescriptive && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDescriptiveTestEdit(test.testName)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                                EDITOR
                            </Button>
                        )}
                    </div>
                </TableCell>
                <TableCell colSpan={4} className="text-gray-500">
                    {isDescriptive ? (
                        <div className="text-sm italic">
                            Click EDITOR to add detailed findings and analysis
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>Test completed</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                    )}
                </TableCell>
            </TableRow>
        );
    };

    const renderNormalTest = (test: TestResult, index: number) => {
        const hasValidResult = test.result && test.result.trim() !== '';

        return (
            <TableRow key={test.id || index}>
                <TableCell>
                    <div>
                        <p className="font-medium">{test.testName}</p>
                        {test.method && (
                            <p className="text-sm text-gray-500 italic">Method: {test.method}</p>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                    {isEditing ? (
                        <Input
                            value={test.result}
                            onChange={(e) => updateTestResult(index, 'result', e.target.value)}
                            className="w-32"
                            placeholder="Enter result"
                        />
                    ) : (
                        <span className={hasValidResult ? getResultStatusColor(test.status) : 'text-gray-400'}>
                            {test.result || 'Pending'}
                        </span>
                    )}
                </TableCell>
                <TableCell>
                    <div className="text-sm">
                        <div className="mb-1">{test.referenceRange}</div>
                        {/* Additional reference ranges for different age groups */}
                        {test.testName.toLowerCase().includes('hemoglobin') && (
                            <div className="text-xs text-gray-500 space-y-1">
                                <div>Male: 13.5 to 16.5</div>
                                <div>Female: 12.5 to 14.5</div>
                                <div>Children: 1-2 yrs: 10.5 to 14.0</div>
                                <div>Children: 2-9 yrs: 11.5 to 14.5</div>
                            </div>
                        )}
                    </div>
                </TableCell>
                <TableCell>{test.unit}</TableCell>
                <TableCell>
                    {hasValidResult && (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <Badge
                                variant={
                                    test.status === 'Normal' ? 'default' :
                                        test.status === 'High' || test.status === 'Low' ? 'secondary' :
                                            'destructive'
                                }
                                className={getResultStatusColor(test.status)}
                            >
                                {test.status}
                            </Badge>
                        </div>
                    )}
                </TableCell>
            </TableRow>
        );
    };

    const renderTestsByCategory = () => {
        const categories = groupTestsByCategory();

        return (
            <div className="space-y-6">
                {Object.entries(categories).map(([categoryName, tests]) => {
                    if (tests.length === 0) return null;

                    return (
                        <div key={categoryName} className="space-y-2">
                            {/* Category Header */}
                            <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                    {categoryName === 'Radiology' && <Settings className="w-4 h-4" />}
                                    {categoryName === 'Haematology' && <Beaker className="w-4 h-4" />}
                                    {categoryName === 'Microbiology' && <FileText className="w-4 h-4" />}
                                    {categoryName === 'General Tests' && <FileText className="w-4 h-4" />}
                                    {categoryName}
                                </h4>
                            </div>

                            {/* Category Tests */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test Name</TableHead>
                                        <TableHead>Result</TableHead>
                                        <TableHead>Ref Range</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests.map((test, index) => {
                                        const isDescriptive = test.testName.toLowerCase().includes('culture') ||
                                            test.testName.toLowerCase().includes('sensitivity') ||
                                            test.testName.toLowerCase().includes('microscopy');

                                        return isDescriptive
                                            ? renderDescriptiveTest(test, index)
                                            : renderNormalTest(test, index);
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>Loading report...</div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>Loading report...</div>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>Report not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={onBack} className="bg-white text-blue-600 hover:bg-blue-50">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl">Report Details</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Patient and Report Info */}
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Patient Info */}
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm text-gray-500">Patient</Label>
                                <p className="font-medium text-lg">{report.patientName}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">Sex / Age</Label>
                                <p className="font-medium">{report.patientGender} / {report.patientAge} Years</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">Referred By</Label>
                                <p className="font-medium">{report.doctorName}</p>
                            </div>
                        </div>

                        {/* Report Info */}
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm text-gray-500">Sampling Date</Label>
                                <p className="font-medium">{format(new Date(report.date), 'M/d/yyyy h:mm a')}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">Report Date</Label>
                                <p className="font-medium">{format(new Date(report.lastUpdated), 'M/d/yyyy h:mm a')}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">Report ID</Label>
                                <p className="font-medium">{report.id}</p>
                            </div>
                        </div>

                        {/* Status Info */}
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm text-gray-500">Due Amount</Label>
                                <Badge className="bg-green-100 text-green-800 px-2 py-1">₹0</Badge>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">Report Status</Label>
                                <Select
                                    value={report.status}
                                    onValueChange={(value: LabReport['status']) => handleStatusChange(value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Initial">Initial</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Verified and Signed">Verified & Signed</SelectItem>
                                        <SelectItem value="Printed">Printed</SelectItem>
                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Test Results */}
                <Card className="p-0 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5" />
                                <h3 className="text-lg font-medium">Test Results</h3>
                                <Badge variant="secondary" className="bg-white text-blue-600">
                                    {report.reportType}
                                </Badge>
                            </div>

                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} variant="secondary">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Results
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveResults} disabled={saving} variant="secondary">
                                            <Save className="w-4 h-4 mr-2" />
                                            {saving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-white text-blue-600">
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {renderTestsByCategory()}

                        {/* Add Impression Button */}
                        <div className="mt-6 pt-4 border-t">
                            <Button
                                onClick={() => setIsImpressionModalOpen(true)}
                                variant="outline"
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                ADD IMPRESSION
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Remarks and Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h4 className="mb-3">Clinical Remarks</h4>
                        <p className="text-gray-700">{report.remarks || 'No specific remarks'}</p>

                        {report.impression && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <h5 className="font-medium text-blue-800 mb-2">Clinical Impression</h5>
                                <p className="text-blue-700">{report.impression}</p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h4 className="mb-4">Actions</h4>
                        <div className="space-y-3">
                            <Button
                                onClick={handlePrintReport}
                                className="w-full justify-start"
                                variant="outline"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print Report
                            </Button>

                            <Button
                                onClick={() => setIsSendModalOpen(true)}
                                className="w-full justify-start"
                                variant="outline"
                                disabled={!report.patientPhone}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Report
                            </Button>

                            <Button
                                onClick={() => setIsImpressionModalOpen(true)}
                                className="w-full justify-start"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Impression
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Impression Modal */}
            <Dialog open={isImpressionModalOpen} onOpenChange={setIsImpressionModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Clinical Impression</DialogTitle>
                        <DialogDescription>
                            Enter your clinical interpretation and recommendations
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Textarea
                            value={impression}
                            onChange={(e) => setImpression(e.target.value)}
                            placeholder="Enter clinical impression, interpretation, and recommendations..."
                            rows={6}
                        />

                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsImpressionModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveImpression}>
                                Save Impression
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Send Report Modal */}
            <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Send Report</DialogTitle>
                        <DialogDescription>
                            Send the lab report to patient via WhatsApp or SMS
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Send Method</Label>
                            <Select value={sendMethod} onValueChange={(value: 'whatsapp' | 'sms') => setSendMethod(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="whatsapp">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            WhatsApp (with PDF)
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="sms">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            SMS (with link)
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Phone Number</Label>
                            <Input value={report.patientPhone || ''} disabled />
                        </div>

                        <div>
                            <Label>Message</Label>
                            <Textarea
                                value={sendMessage}
                                onChange={(e) => setSendMessage(e.target.value)}
                                placeholder={getDefaultMessage(sendMethod, report)}
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsSendModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSendReport}>
                                <Send className="w-4 h-4 mr-2" />
                                Send {sendMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Descriptive Test Editor */}
            <DescriptiveTestEditor
                isOpen={isDescriptiveEditorOpen}
                onClose={() => setIsDescriptiveEditorOpen(false)}
                testData={editingDescriptiveTest}
                onSave={handleDescriptiveTestSave}
            />
        </div>
    );
}