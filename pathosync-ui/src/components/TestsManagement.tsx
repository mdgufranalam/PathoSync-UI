import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { SummernoteEditor } from './ui/summernote-editor';
import { mockTestsAPI, mockTestCategories } from '../utils/mockTestsAPI';
import {
    Search,
    Plus,
    Edit,
    Eye,
    Trash2,
    MoreHorizontal,
    FileText,
    List,
    Layers,
    Copy,
    TestTube,
    HelpCircle,
    X,
    Minus
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface ReferenceRange {
    id: string;
    name: string;
    minValue: string;
    maxValue: string;
    unit: string;
}

interface Test {
    id: string;
    testType: 'Normal Test' | 'Descriptive Test' | 'Test Group';
    testName: string;
    shortCode: string;
    price: number;
    unit?: string;
    tag: string;
    method?: string;
    formula?: string;
    notes?: string;
    defaultLabResult?: string;
    referenceRanges?: ReferenceRange[];
    subTests?: Test[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export function TestsManagement() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTestType, setSelectedTestType] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | null>(null);

    const [formData, setFormData] = useState({
        testType: 'Normal Test' as 'Normal Test' | 'Descriptive Test' | 'Test Group',
        testName: '',
        shortCode: '',
        price: 0,
        unit: '',
        tag: '',
        method: '',
        formula: '',
        notes: '',
        defaultLabResult: '',
        referenceRanges: [] as ReferenceRange[],
        subTests: [] as Test[]
    });

    // Load tests from mock API
    useEffect(() => {
        const loadTests = async () => {
            try {
                setLoading(true);
                const data = await mockTestsAPI.getAllTests();
                setTests(data);
            } catch (error) {
                console.error('Error loading tests:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTests();
    }, []);

    const categories = mockTestCategories;

    const filteredTests = tests.filter(test => {
        const matchesSearch =
            test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.tag.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = selectedTestType === 'all' || test.testType === selectedTestType;

        return matchesSearch && matchesType;
    });

    const resetForm = () => {
        setFormData({
            testType: 'Normal Test',
            testName: '',
            shortCode: '',
            price: 0,
            unit: '',
            tag: '',
            method: '',
            formula: '',
            notes: '',
            defaultLabResult: '',
            referenceRanges: [],
            subTests: []
        });
        setEditingTest(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate test group has sub-tests
        if (formData.testType === 'Test Group' && formData.subTests.length === 0) {
            alert('Test Group must have at least one sub-test');
            return;
        }

        try {
            if (editingTest) {
                // Update existing test
                const updatedTest = await mockTestsAPI.updateTest(editingTest.id, formData);
                setTests(prev => prev.map(test =>
                    test.id === editingTest.id ? updatedTest : test
                ));
            } else {
                // Add new test
                const newTest = await mockTestsAPI.createTest(formData);
                setTests(prev => [...prev, newTest]);
            }

            resetForm();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error saving test:', error);
            alert('Error saving test. Please try again.');
        }
    };

    const handleEdit = (test: Test) => {
        setEditingTest(test);
        setFormData({
            testType: test.testType,
            testName: test.testName,
            shortCode: test.shortCode,
            price: test.price,
            unit: test.unit || '',
            tag: test.tag,
            method: test.method || '',
            formula: test.formula || '',
            notes: test.notes || '',
            defaultLabResult: test.defaultLabResult || '',
            referenceRanges: test.referenceRanges || [],
            subTests: test.subTests || []
        });
        setIsAddModalOpen(true);
    };

    const handleDelete = async (testId: string) => {
        if (window.confirm('Are you sure you want to delete this test?')) {
            try {
                await mockTestsAPI.deleteTest(testId);
                setTests(prev => prev.filter(test => test.id !== testId));
            } catch (error) {
                console.error('Error deleting test:', error);
                alert('Error deleting test. Please try again.');
            }
        }
    };

    const toggleTestStatus = async (testId: string) => {
        try {
            const test = tests.find(t => t.id === testId);
            if (test) {
                const updatedTest = await mockTestsAPI.updateTest(testId, { isActive: !test.isActive });
                setTests(prev => prev.map(t => t.id === testId ? updatedTest : t));
            }
        } catch (error) {
            console.error('Error updating test status:', error);
            alert('Error updating test status. Please try again.');
        }
    };

    const addReferenceRange = () => {
        const newRange: ReferenceRange = {
            id: String(Date.now()),
            name: '',
            minValue: '',
            maxValue: '',
            unit: formData.unit
        };
        setFormData(prev => ({
            ...prev,
            referenceRanges: [...prev.referenceRanges, newRange]
        }));
    };

    // Update all reference ranges when main unit changes
    const handleUnitChange = (newUnit: string) => {
        setFormData(prev => ({
            ...prev,
            unit: newUnit,
            referenceRanges: prev.referenceRanges.map(range => ({
                ...range,
                unit: newUnit
            }))
        }));
    };

    const updateReferenceRange = (id: string, field: keyof ReferenceRange, value: string) => {
        setFormData(prev => ({
            ...prev,
            referenceRanges: prev.referenceRanges.map(range =>
                range.id === id ? { ...range, [field]: value } : range
            )
        }));
    };

    const removeReferenceRange = (id: string) => {
        setFormData(prev => ({
            ...prev,
            referenceRanges: prev.referenceRanges.filter(range => range.id !== id)
        }));
    };

    // Sub-tests management for Test Groups
    const [isSubTestModalOpen, setIsSubTestModalOpen] = useState(false);
    const [editingSubTest, setEditingSubTest] = useState<Test | null>(null);
    const [subTestFormData, setSubTestFormData] = useState({
        testType: 'Normal Test' as 'Normal Test' | 'Descriptive Test',
        testName: '',
        shortCode: '',
        price: 0,
        unit: '',
        tag: '',
        method: '',
        formula: '',
        notes: '',
        defaultLabResult: '',
        referenceRanges: [] as ReferenceRange[]
    });

    const resetSubTestForm = () => {
        setSubTestFormData({
            testType: 'Normal Test',
            testName: '',
            shortCode: '',
            price: 0,
            unit: '',
            tag: '',
            method: '',
            formula: '',
            notes: '',
            defaultLabResult: '',
            referenceRanges: []
        });
        setEditingSubTest(null);
    };

    const addSubTest = () => {
        setEditingSubTest(null);
        resetSubTestForm();
        setSubTestFormData(prev => ({ ...prev, tag: formData.tag }));
        setIsSubTestModalOpen(true);
    };

    const editSubTest = (subTest: Test, index: number) => {
        setEditingSubTest(subTest);
        setSubTestFormData({
            testType: subTest.testType as 'Normal Test' | 'Descriptive Test',
            testName: subTest.testName,
            shortCode: subTest.shortCode,
            price: subTest.price,
            unit: subTest.unit || '',
            tag: subTest.tag,
            method: subTest.method || '',
            formula: subTest.formula || '',
            notes: subTest.notes || '',
            defaultLabResult: subTest.defaultLabResult || '',
            referenceRanges: subTest.referenceRanges || []
        });
        setIsSubTestModalOpen(true);
    };

    const saveSubTest = () => {
        const newSubTest: Test = {
            id: editingSubTest?.id || `SUB-TEST-${Date.now()}`,
            ...subTestFormData,
            isActive: true,
            createdAt: editingSubTest?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (editingSubTest) {
            // Update existing sub-test
            setFormData(prev => ({
                ...prev,
                subTests: prev.subTests.map(st => st.id === editingSubTest.id ? newSubTest : st)
            }));
        } else {
            // Add new sub-test
            setFormData(prev => ({
                ...prev,
                subTests: [...prev.subTests, newSubTest]
            }));
        }

        setIsSubTestModalOpen(false);
        resetSubTestForm();
    };

    const removeSubTest = (subTestId: string) => {
        setFormData(prev => ({
            ...prev,
            subTests: prev.subTests.filter(st => st.id !== subTestId)
        }));
    };

    const addSubTestReferenceRange = () => {
        const newRange: ReferenceRange = {
            id: String(Date.now()),
            name: '',
            minValue: '',
            maxValue: '',
            unit: subTestFormData.unit
        };
        setSubTestFormData(prev => ({
            ...prev,
            referenceRanges: [...prev.referenceRanges, newRange]
        }));
    };

    // Update all sub-test reference ranges when sub-test unit changes
    const handleSubTestUnitChange = (newUnit: string) => {
        setSubTestFormData(prev => ({
            ...prev,
            unit: newUnit,
            referenceRanges: prev.referenceRanges.map(range => ({
                ...range,
                unit: newUnit
            }))
        }));
    };

    const updateSubTestReferenceRange = (id: string, field: keyof ReferenceRange, value: string) => {
        setSubTestFormData(prev => ({
            ...prev,
            referenceRanges: prev.referenceRanges.map(range =>
                range.id === id ? { ...range, [field]: value } : range
            )
        }));
    };

    const removeSubTestReferenceRange = (id: string) => {
        setSubTestFormData(prev => ({
            ...prev,
            referenceRanges: prev.referenceRanges.filter(range => range.id !== id)
        }));
    };

    const getTestTypeIcon = (testType: string) => {
        switch (testType) {
            case 'Normal Test': return <TestTube className="w-4 h-4" />;
            case 'Test Group': return <Layers className="w-4 h-4" />;
            case 'Descriptive Test': return <FileText className="w-4 h-4" />;
            default: return <TestTube className="w-4 h-4" />;
        }
    };

    const getTestTypeColor = (testType: string) => {
        switch (testType) {
            case 'Normal Test': return 'bg-blue-100 text-blue-800';
            case 'Test Group': return 'bg-green-100 text-green-800';
            case 'Descriptive Test': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1>Tests Management</h1>
                    <p className="text-muted-foreground">Manage laboratory tests and procedures</p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Test
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTest ? 'Edit Test' : 'Add New Test'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingTest ? 'Update test information' : 'Create a new laboratory test'}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Test Type Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Label>Test Type *</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsHelpModalOpen(true)}
                                        className="h-6 w-6 p-0 rounded-full"
                                    >
                                        <HelpCircle className="w-4 h-4" />
                                    </Button>
                                </div>

                                <RadioGroup
                                    value={formData.testType}
                                    onValueChange={(value: 'Normal Test' | 'Descriptive Test' | 'Test Group') =>
                                        setFormData(prev => ({ ...prev, testType: value }))
                                    }
                                    className="space-y-4"
                                >
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                        <RadioGroupItem value="Normal Test" id="normal" />
                                        <div className="flex-1">
                                            <label htmlFor="normal" className="text-sm font-medium cursor-pointer">
                                                1. Normal Test (Single parameter)
                                            </label>
                                            <p className="text-xs text-muted-foreground italic">
                                                Example: Haemoglobin (HB), White Blood Cells (WBC)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                        <RadioGroupItem value="Test Group" id="group" />
                                        <div className="flex-1">
                                            <label htmlFor="group" className="text-sm font-medium cursor-pointer">
                                                2. Test Group (Multiple parameters)
                                            </label>
                                            <p className="text-xs text-muted-foreground italic">
                                                Example: Complete Blood Count, Blood Group, Lipid Profile
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                        <RadioGroupItem value="Descriptive Test" id="descriptive" />
                                        <div className="flex-1">
                                            <label htmlFor="descriptive" className="text-sm font-medium cursor-pointer">
                                                3. Descriptive Test (Word Document Style)
                                            </label>
                                            <p className="text-xs text-muted-foreground italic">
                                                Example: Scanning, X-Ray, Culture Tests
                                            </p>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="testName">Test Name *</Label>
                                    <Input
                                        id="testName"
                                        value={formData.testName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, testName: e.target.value }))}
                                        placeholder="Enter test name"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="shortCode">Short Code</Label>
                                    <Input
                                        id="shortCode"
                                        value={formData.shortCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, shortCode: e.target.value.toUpperCase() }))}
                                        placeholder="e.g., HB, CBC"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="price">Price (₹) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                        placeholder="Enter price"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="tag">Category *</Label>
                                    <Select value={formData.tag} onValueChange={(value) => setFormData(prev => ({ ...prev, tag: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.testType === 'Normal Test' && (
                                    <div>
                                        <Label htmlFor="unit">Unit</Label>
                                        <Input
                                            id="unit"
                                            value={formData.unit}
                                            onChange={(e) => handleUnitChange(e.target.value)}
                                            placeholder="e.g., mg/dl, g/dl"
                                        />
                                    </div>
                                )}
                            </div>

                            {formData.testType === 'Normal Test' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="method">Method</Label>
                                            <Input
                                                id="method"
                                                value={formData.method}
                                                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                                                placeholder="e.g., Urease - GLDH"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="formula">Formula (use Short Code to refer other test in formula)</Label>
                                            <Input
                                                id="formula"
                                                value={formData.formula}
                                                onChange={(e) => setFormData(prev => ({ ...prev, formula: e.target.value }))}
                                                placeholder="e.g., (HB * 2) + 10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes/Impression (printed below test name in lab report)</Label>
                                        <Textarea
                                            id="notes"
                                            value={formData.notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                            placeholder="Enter test notes or instructions"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Reference Ranges */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <Label>Reference Range</Label>
                                            <Button type="button" onClick={addReferenceRange} size="sm">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Range
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {formData.referenceRanges.map((range) => (
                                                <div key={range.id} className="grid grid-cols-4 gap-2 items-end">
                                                    <div>
                                                        <Label className="text-xs">Name (Eg. Male, Female)</Label>
                                                        <Input
                                                            value={range.name}
                                                            onChange={(e) => updateReferenceRange(range.id, 'name', e.target.value)}
                                                            placeholder="Male/Female"
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Min</Label>
                                                        <div className="flex items-center gap-1">
                                                            <Input
                                                                value={range.minValue}
                                                                onChange={(e) => updateReferenceRange(range.id, 'minValue', e.target.value)}
                                                                placeholder="Min"
                                                                className="text-sm"
                                                            />
                                                            {formData.unit && (
                                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                    {formData.unit}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Max</Label>
                                                        <div className="flex items-center gap-1">
                                                            <Input
                                                                value={range.maxValue}
                                                                onChange={(e) => updateReferenceRange(range.id, 'maxValue', e.target.value)}
                                                                placeholder="Max"
                                                                className="text-sm"
                                                            />
                                                            {formData.unit && (
                                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                    {formData.unit}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeReferenceRange(range.id)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {formData.testType === 'Descriptive Test' && (
                                <div>
                                    <Label>Default Lab Result:</Label>
                                    <div className="mt-2">
                                        <SummernoteEditor
                                            value={formData.defaultLabResult}
                                            onChange={(value) => setFormData(prev => ({ ...prev, defaultLabResult: value }))}
                                            placeholder="Enter default lab result content..."
                                            className="min-h-[300px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.testType === 'Test Group' && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label>Sub Tests *</Label>
                                        <Button type="button" onClick={addSubTest} size="sm" className="bg-green-600 hover:bg-green-700">
                                            <Plus className="w-4 h-4 mr-2" />
                                            ADD SUB TEST
                                        </Button>
                                    </div>

                                    {formData.subTests.length === 0 && (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500 mb-2">No sub-tests added yet</p>
                                            <p className="text-sm text-gray-400">Test Groups must have at least one sub-test</p>
                                        </div>
                                    )}

                                    {formData.subTests.length > 0 && (
                                        <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                                            {formData.subTests.map((subTest, index) => (
                                                <div key={subTest.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-teal-600">
                                                                {subTest.testType === 'Normal Test' ? 'N' : 'D'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{subTest.testName}</p>
                                                            <p className="text-sm text-gray-500">₹{subTest.price}</p>
                                                        </div>
                                                        <Badge className={subTest.testType === 'Normal Test' ? 'bg-teal-100 text-teal-800' : 'bg-pink-100 text-pink-800'}>
                                                            {subTest.testType}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => editSubTest(subTest, index)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeSubTest(subTest.id)}
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                    CANCEL
                                </Button>
                                <Button type="submit">
                                    SAVE
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Help Modal */}
            <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="bg-blue-600 text-white px-4 py-2 rounded-t-lg flex-1 text-center">
                                Select Test Type
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-center text-muted-foreground px-4">
                            Choose the type of laboratory test you want to create
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 p-4">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                                <div>
                                    <p className="font-medium">1. Normal Test (Single parameter)</p>
                                    <p className="text-sm text-muted-foreground italic">
                                        Example: Haemoglobin (HB), White Blood Cells (WBC)
                                    </p>
                                </div>
                            </div>

                            <hr className="my-3" />

                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                                <div>
                                    <p className="font-medium">2. Test Group (Multiple parameters)</p>
                                    <p className="text-sm text-muted-foreground italic">
                                        Example: Complete Blood Count, Blood Group, Lipid Profile
                                    </p>
                                </div>
                            </div>

                            <hr className="my-3" />

                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div>
                                    <p className="font-medium">3. Descriptive Test (Word Document Style)</p>
                                    <p className="text-sm text-muted-foreground italic">
                                        Example: Scanning, X-Ray, Culture Tests
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button className="bg-green-700 hover:bg-green-800" onClick={() => setIsHelpModalOpen(false)}>
                                Select
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Sub Test Modal */}
            <Dialog open={isSubTestModalOpen} onOpenChange={setIsSubTestModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingSubTest ? 'Edit Sub Test' : 'Add Sub Test'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSubTest ? 'Update sub test information' : 'Create a new sub test for this test group'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={(e) => { e.preventDefault(); saveSubTest(); }} className="space-y-6">
                        {/* Test Type Selection */}
                        <div className="space-y-4">
                            <Label>Test Type *</Label>

                            <RadioGroup
                                value={subTestFormData.testType}
                                onValueChange={(value: 'Normal Test' | 'Descriptive Test') =>
                                    setSubTestFormData(prev => ({ ...prev, testType: value }))
                                }
                                className="space-y-4"
                            >
                                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                    <RadioGroupItem value="Normal Test" id="subnormal" />
                                    <div className="flex-1">
                                        <label htmlFor="subnormal" className="text-sm font-medium cursor-pointer">
                                            Normal Test (Single parameter)
                                        </label>
                                        <p className="text-xs text-muted-foreground italic">
                                            Example: Haemoglobin (HB), White Blood Cells (WBC)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                    <RadioGroupItem value="Descriptive Test" id="subdescriptive" />
                                    <div className="flex-1">
                                        <label htmlFor="subdescriptive" className="text-sm font-medium cursor-pointer">
                                            Descriptive Test (Word Document Style)
                                        </label>
                                        <p className="text-xs text-muted-foreground italic">
                                            Example: Scanning, X-Ray, Culture Tests
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="subTestName">Test Name *</Label>
                                <Input
                                    id="subTestName"
                                    value={subTestFormData.testName}
                                    onChange={(e) => setSubTestFormData(prev => ({ ...prev, testName: e.target.value }))}
                                    placeholder="Enter test name"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="subShortCode">Short Code</Label>
                                <Input
                                    id="subShortCode"
                                    value={subTestFormData.shortCode}
                                    onChange={(e) => setSubTestFormData(prev => ({ ...prev, shortCode: e.target.value.toUpperCase() }))}
                                    placeholder="e.g., HB, WBC"
                                />
                            </div>

                            <div>
                                <Label htmlFor="subPrice">Price (₹)</Label>
                                <Input
                                    id="subPrice"
                                    type="number"
                                    value={subTestFormData.price}
                                    onChange={(e) => setSubTestFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                    placeholder="Enter price"
                                />
                            </div>
                        </div>

                        {subTestFormData.testType === 'Normal Test' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="subUnit">Unit</Label>
                                        <Input
                                            id="subUnit"
                                            value={subTestFormData.unit}
                                            onChange={(e) => handleSubTestUnitChange(e.target.value)}
                                            placeholder="e.g., mg/dl, g/dl"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="subMethod">Method</Label>
                                        <Input
                                            id="subMethod"
                                            value={subTestFormData.method}
                                            onChange={(e) => setSubTestFormData(prev => ({ ...prev, method: e.target.value }))}
                                            placeholder="e.g., Urease - GLDH"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="subFormula">Formula (use Short Code to refer other test in formula)</Label>
                                    <Input
                                        id="subFormula"
                                        value={subTestFormData.formula}
                                        onChange={(e) => setSubTestFormData(prev => ({ ...prev, formula: e.target.value }))}
                                        placeholder="e.g., (HB * 2) + 10"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="subNotes">Notes/Impression (printed below test name in lab report)</Label>
                                    <Textarea
                                        id="subNotes"
                                        value={subTestFormData.notes}
                                        onChange={(e) => setSubTestFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Enter test notes or instructions"
                                        rows={3}
                                    />
                                </div>

                                {/* Reference Ranges */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label>Reference Range</Label>
                                        <Button type="button" onClick={addSubTestReferenceRange} size="sm">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Range
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {subTestFormData.referenceRanges.map((range) => (
                                            <div key={range.id} className="grid grid-cols-4 gap-2 items-end">
                                                <div>
                                                    <Label className="text-xs">Name (Eg. Male, Female)</Label>
                                                    <Input
                                                        value={range.name}
                                                        onChange={(e) => updateSubTestReferenceRange(range.id, 'name', e.target.value)}
                                                        placeholder="Male/Female"
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Min</Label>
                                                    <div className="flex items-center gap-1">
                                                        <Input
                                                            value={range.minValue}
                                                            onChange={(e) => updateSubTestReferenceRange(range.id, 'minValue', e.target.value)}
                                                            placeholder="Min"
                                                            className="text-sm"
                                                        />
                                                        {subTestFormData.unit && (
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {subTestFormData.unit}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Max</Label>
                                                    <div className="flex items-center gap-1">
                                                        <Input
                                                            value={range.maxValue}
                                                            onChange={(e) => updateSubTestReferenceRange(range.id, 'maxValue', e.target.value)}
                                                            placeholder="Max"
                                                            className="text-sm"
                                                        />
                                                        {subTestFormData.unit && (
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {subTestFormData.unit}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSubTestReferenceRange(range.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {subTestFormData.testType === 'Descriptive Test' && (
                            <div>
                                <Label>Default Lab Result:</Label>
                                <div className="mt-2">
                                    <SummernoteEditor
                                        value={subTestFormData.defaultLabResult}
                                        onChange={(value) => setSubTestFormData(prev => ({ ...prev, defaultLabResult: value }))}
                                        placeholder="Enter default lab result content..."
                                        className="min-h-[300px]"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsSubTestModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingSubTest ? 'Update' : 'Add'} Sub Test
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <TestTube className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Tests</p>
                                <p className="text-2xl">{tests.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Normal Tests</p>
                                <p className="text-2xl">{tests.filter(t => t.testType === 'Normal Test').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <Layers className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Test Groups</p>
                                <p className="text-2xl">{tests.filter(t => t.testType === 'Test Group').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <List className="w-8 h-8 text-orange-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Active Tests</p>
                                <p className="text-2xl">{tests.filter(t => t.isActive).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Tests Library</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex items-center gap-2 flex-1">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>

                        <Select value={selectedTestType} onValueChange={setSelectedTestType}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Normal Test">Normal Test</SelectItem>
                                <SelectItem value="Test Group">Test Group</SelectItem>
                                <SelectItem value="Descriptive Test">Descriptive Test</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Test Details</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTests.map((test) => (
                                <TableRow key={test.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{test.testName}</p>
                                            {test.shortCode && (
                                                <p className="text-sm text-muted-foreground">Code: {test.shortCode}</p>
                                            )}
                                            {test.unit && (
                                                <p className="text-xs text-muted-foreground">Unit: {test.unit}</p>
                                            )}
                                            {test.testType === 'Test Group' && test.subTests && (
                                                <p className="text-xs text-blue-600">{test.subTests.length} sub-tests</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getTestTypeColor(test.testType)}>
                                            <div className="flex items-center gap-1">
                                                {getTestTypeIcon(test.testType)}
                                                {test.testType}
                                            </div>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{test.tag}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">₹{test.price}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                            onClick={() => toggleTestStatus(test.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {test.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleEdit(test)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(test.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {loading && (
                        <div className="text-center py-8">
                            <TestTube className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                            <p className="text-muted-foreground">Loading tests...</p>
                        </div>
                    )}

                    {!loading && filteredTests.length === 0 && (
                        <div className="text-center py-8">
                            <TestTube className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No tests found</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your search or add a new test</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}