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
import { usePermissions } from '../hooks/usePermissions';
import { Role } from '../types/permissions';
import { Test, TestCategory, ReferenceRange } from '../types';

interface TestsManagementProps {
  currentUser?: {
    role: string;
    id: string;
  };
}

export function TestsManagement({ currentUser: propCurrentUser }: TestsManagementProps = {}) {
    const currentUser = propCurrentUser || {
        role: 'admin' as Role,
        id: 'current-user-id'
    };

    const { permissions } = usePermissions({
        userRole: currentUser.role as Role,
        userId: currentUser.id
    });

    const [tests, setTests] = useState<Test[]>([]);
    const [categories, setCategories] = useState<TestCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTestType, setSelectedTestType] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | null>(null);

    const [formData, setFormData] = useState<Omit<Test, 'id' | 'is_active' | 'created_at' | 'updated_at'>>({
        tenant_id: 'a22a9e89-12f7-443b-9635-6af203657723', // Add tenant_id
        test_code: '',
        name: '',
        test_type: 'normal',
        price: 0,
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
                    setTests(testsResponse.data);
                }

                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (permissions.tests.canView) {
            loadData();
        }
    }, [permissions.tests.canView]);

    const filteredTests = tests.filter(test => {
        const matchesSearch =
            test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (test.test_code && test.test_code.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = selectedTestType === 'all' || test.test_type === selectedTestType;

        return matchesSearch && matchesType;
    });

    const resetForm = () => {
        setFormData({
            tenant_id: 'a22a9e89-12f7-443b-9635-6af203657723', // Reset tenant_id
            test_code: '',
            name: '',
            test_type: 'normal',
            price: 0,
        });
        setEditingTest(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingTest) {
                if (!permissions.tests.canEdit) return;
                const response = await apiClient.put(`/tests/${editingTest.id}`, formData);
                if (response.success) {
                  const updatedTest = response.data;
                  setTests(prev => prev.map(test =>
                      test.id === editingTest.id ? updatedTest : test
                  ));
                }
            } else {
                if (!permissions.tests.canCreate) return;
                const response = await apiClient.post('/tests', formData);
                if (response.success) {
                  const newTest = response.data;
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
        if (!permissions.tests.canEdit) return;
        setEditingTest(test);
        setFormData({
            tenant_id: test.tenant_id,
            test_code: test.test_code,
            name: test.name,
            test_type: test.test_type,
            price: test.price,
        });
        setIsAddModalOpen(true);
    };

    const handleDelete = async (testId: string) => {
        if (!permissions.tests.canDelete) return;
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
        if (!permissions.tests.canEdit) return;
        try {
            const test = tests.find(t => t.id === testId);
            if (test) {
                const response = await apiClient.patch(`/tests/${testId}/status`, { is_active: !test.is_active });
                if (response.success) {
                  const updatedTest = response.data;
                  setTests(prev => prev.map(t => t.id === testId ? updatedTest : t));
                }
            }
        } catch (error) {
            console.error('Error updating test status:', error);
            alert('Error updating test status. Please try again.');
        }
    }; 

    if (!permissions.tests.canView) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p>You don't have permission to manage tests.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1>Tests Management</h1>
                    <p className="text-muted-foreground">Manage laboratory tests and procedures</p>
                </div>

                {permissions.tests.canCreate && (
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={resetForm}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Test
                            </Button>
                        </DialogTrigger>
                        {/* ... (DialogContent for add/edit test) */}
                    </Dialog>
                )}
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
                                                {permissions.tests.canEdit && (
                                                    <DropdownMenuItem onClick={() => handleEdit(test)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                {permissions.tests.canDelete && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(test.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
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
    );
}