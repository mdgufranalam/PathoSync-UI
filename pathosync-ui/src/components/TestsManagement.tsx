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
import {
    Search,
    Plus,
    Edit,
    Trash2,
    MoreHorizontal,
    FileText,
    List,
    Layers,
    Copy,
    TestTube,
    HelpCircle,
    Minus
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { apiClient } from '../utils/apiClient';
import { useAuthContext } from '../contexts/AuthContext';
import { PermissionGate } from './PermissionGate';
import { Test, TestCategory } from '../types';

type TestFormData = Partial<Omit<Test, 'id' | 'created_at' | 'updated_at'>
>;

export function TestsManagement() {
    const { hasPermission } = useAuthContext();
    const [tests, setTests] = useState<Test[]>([]);
    const [categories, setCategories] = useState<TestCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTestType, setSelectedTestType] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | null>(null);

    const [formData, setFormData] = useState<TestFormData>({
        tenant_id: 'a22a9e89-12f7-443b-9635-6af203657723',
        test_code: '',
        name: '',
        test_type: 'normal',
        price: 0,
        description: '',
        category: '',
        unit: '',
        method: '',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [testsResponse, categoriesResponse] = await Promise.all([
                    apiClient.get('/tests'),
                    apiClient.get('/test-categories'),
                ]);

                if (testsResponse.success) {
                    setTests(testsResponse.data as Test[]);
                }

                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data as TestCategory[]);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const filteredTests = tests.filter(test => {
        const matchesSearch =
            test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (test.test_code && test.test_code.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = selectedTestType === 'all' || test.test_type === selectedTestType;

        return matchesSearch && matchesType;
    });

    const resetForm = () => {
        setFormData({
            tenant_id: 'a22a9e89-12f7-443b-9635-6af203657723',
            test_code: '',
            name: '',
            test_type: 'normal',
            price: 0,
            description: '',
            category: '',
            unit: '',
            method: '',
        });
        setEditingTest(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingTest) {
                const response = await apiClient.put(`/tests/${editingTest.id}`, formData);
                if (response.success) {
                  const updatedTest = response.data as Test;
                  setTests(prev => prev.map(test =>
                      test.id === editingTest.id ? updatedTest : test
                  ));
                }
            } else {
                const response = await apiClient.post('/tests', formData);
                if (response.success) {
                  const newTest = response.data as Test;
                  setTests(prev => [...prev, newTest]);
                }
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
            tenant_id: test.tenant_id,
            test_code: test.test_code,
            name: test.name,
            test_type: test.test_type,
            price: test.price,
            description: test.description,
            category: test.category,
            unit: test.unit,
            method: test.method,
        });
        setIsAddModalOpen(true);
    };

    const handleDelete = async (testId: string) => {
        if (window.confirm('Are you sure you want to delete this test?')) {
            try {
                const response = await apiClient.delete(`/tests/${testId}`);
                if (response.success) {
                    setTests(prev => prev.filter(test => test.id !== testId));
                }
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
                const response = await apiClient.patch(`/tests/${testId}/status`, { is_active: !test.is_active });
                if (response.success) {
                  const updatedTest = response.data as Test;
                  setTests(prev => prev.map(t => t.id === testId ? updatedTest : t));
                }
            }
        } catch (error) {
            console.error('Error updating test status:', error);
            alert('Error updating test status. Please try again.');
        }
    }; 

    return (
      <PermissionGate module="Tests" action="view">
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1>Tests Management</h1>
                    <p className="text-muted-foreground">Manage laboratory tests and procedures</p>
                </div>

                <PermissionGate module="Tests" action="create">
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={resetForm}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Test
                            </Button>
                        </DialogTrigger>
                        {/* ... (DialogContent for add/edit test) */}
                    </Dialog>
                </PermissionGate>
            </div>

            {/* ... (Rest of the JSX) */}

            <Card>
                {/* ... (CardHeader and search/filters) */}
                <CardContent>
                    {/* ... */}
                    <Table>
                        <TableHeader>
                           {/* ... */}
                        </TableHeader>
                        <TableBody>
                            {filteredTests.map((test) => (
                                <TableRow key={test.id}>
                                   {/* ... (TableCells) */}
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <PermissionGate module="Tests" action="edit">
                                                    <DropdownMenuItem onClick={() => handleEdit(test)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </PermissionGate>
                                                <DropdownMenuItem>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <PermissionGate module="Tests" action="delete">
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(test.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </PermissionGate>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* ... (Loading and empty state) */}
                </CardContent>
            </Card>
        </div>
      </PermissionGate>
    );
}
