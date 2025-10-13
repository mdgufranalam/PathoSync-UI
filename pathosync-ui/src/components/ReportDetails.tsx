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
import { Bill, LabReport, TestResult } from '../types/index';

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
            const patientName = bill.patient?.name || 'Unknown Patient';
            const patientPhone = bill.patient?.phone || '';
            const patientGender = bill.patient?.gender || 'Unknown';
            const doctorName = bill.doctor?.name || 'Unknown Doctor';

            let patientAge = 25; // default age
            if (bill.patient?.date_of_birth) {
                try {
                    const birthDate = new Date(bill.patient.date_of_birth);
                    if (!isNaN(birthDate.getTime())) {
                        patientAge = new Date().getFullYear() - birthDate.getFullYear();
                    }
                } catch (e) {
                    console.error('Error calculating age:', e);
                    patientAge = 25; // fallback
                }
            }

            const billReport: LabReport = {
                id: bill.id,
                reportNo: bill.id.replace('BILL-', 'LAB-'),
                patientName,
                patientAge,
                patientGender: patientGender.charAt(0).toUpperCase() + patientGender.slice(1),
                doctorName,
                collectionDate: bill.sample_collection_date || new Date().toISOString(),
                reportDate: bill.updated_at || new Date().toISOString(),
                tests: bill.tests.map(test => ({
                    testId: test.id,
                    name: test.name,
                    value: '',
                    unit: test.unit || '',
                    referenceRange: test.reference_ranges ? JSON.stringify(test.reference_ranges) : '',
                    isAbnormal: false,
                })),
                overallStatus: bill.reportStatus,
                notes: bill.notes,
                labInfo: {
                    name: 'PathoSync Labs',
                    address: '123 Health St, Wellness City',
                    logoUrl: '',
                },
                tenant_id: bill.tenant_id,
                report_number: bill.bill_number,
                bill_id: bill.id,
                patient_id: bill.patient_id,
                doctor_id: bill.doctor_id,
                created_at: bill.created_at,
                updated_at: bill.updated_at,
            };

            setReport(billReport);
            setEditingResults(billReport.tests);
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

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            console.log(`Fetching report with ID: ${reportId}`);

            clearTimeout(timeoutId);

            console.log('Using mock data for report:', reportId);

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
                console.log('Report loaded successfully:', result.data.reportNo);
                setReport(result.data as any);
                setEditingResults((result.data as any).tests || []);
                setImpression((result.data as any).impression || '');
                setDescriptiveContent((result.data as any).descriptive_content || '');
            } else {
                console.error('Report not found or API error:', (result as any).error || 'Unknown error');
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

            if (bill && onUpdateBill) {
                const updatedTestResults = editingResults.map(result => ({
                    testId: result.testId,
                    result: String(result.value),
                    isAbnormal: result.isAbnormal
                }));

                onUpdateBill({
                    tests: editingResults as any[],
                    notes: report.notes || '',
                    reportStatus: report.overallStatus
                });

                setReport({ ...report, tests: editingResults });
                setIsEditing(false);
                setSaving(false);
                return;
            }

            console.log('Mock saving report:', report.id);

            const response = { ok: true, json: () => Promise.resolve({ success: true }) };

            const result = await response.json();
            if (result.success) {
                setReport({ ...report, tests: editingResults });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving results:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: ReportStatus) => {
        if (!report) return;

        try {
            if (bill && onUpdateBill) {
                onUpdateBill({ reportStatus: newStatus });
                setReport({ ...report, overallStatus: newStatus });
                return;
            }

            console.log('Mock updating report status:', report.id, newStatus);

            setReport({ ...report, overallStatus: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // ... (the rest of the file remains the same for now)
}
