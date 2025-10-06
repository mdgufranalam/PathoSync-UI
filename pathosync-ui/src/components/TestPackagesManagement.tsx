import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  TestTube,
  DollarSign,
  Calendar,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { Test } from '../types';

interface TestPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  tests: {
    testId: string;
    test: Test;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TestPackagesManagement() {
  // Sample tests data
  const [availableTests] = useState<Test[]>([
    {
          id: 'TEST-001',
          name: 'Complete Blood Count',
      description: 'Comprehensive blood analysis',
      category: 'Hematology',
      price: 300,
      normalRange: 'See individual parameters',
      unit: 'Various',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'TEST-002',
      name: 'Blood Glucose (Fasting)',
      description: 'Fasting blood sugar test',
      category: 'Biochemistry',
      price: 80,
      normalRange: '70-110 mg/dl',
      unit: 'mg/dl',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'TEST-003',
      name: 'Lipid Profile',
      description: 'Comprehensive cholesterol analysis',
      category: 'Biochemistry',
      price: 450,
      normalRange: 'See individual parameters',
      unit: 'mg/dl',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'TEST-004',
      name: 'Thyroid Function Tests',
      description: 'Complete thyroid panel',
      category: 'Endocrinology',
      price: 1200,
      normalRange: 'See individual parameters',
      unit: 'Various',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'TEST-005',
      name: 'Liver Function Tests',
      description: 'Complete liver function assessment',
      category: 'Biochemistry',
      price: 500,
      normalRange: 'See individual parameters',
      unit: 'Various',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [packages, setPackages] = useState<TestPackage[]>([
    {
      id: 'PKG-001',
      name: 'Basic Health Checkup',
      description: 'Essential tests for routine health monitoring',
      price: 1000,
      tests: [
        { testId: 'TEST-001', test: availableTests[0] },
        { testId: 'TEST-002', test: availableTests[1] },
        { testId: 'TEST-003', test: availableTests[2] }
      ],
      isActive: true,
      createdAt: '2024-10-01T10:00:00Z',
      updatedAt: '2024-10-01T10:00:00Z'
    },
    {
      id: 'PKG-002',
      name: 'Comprehensive Health Panel',
      description: 'Complete health assessment with all major parameters',
      price: 2500,
      tests: [
        { testId: 'TEST-001', test: availableTests[0] },
        { testId: 'TEST-002', test: availableTests[1] },
        { testId: 'TEST-003', test: availableTests[2] },
        { testId: 'TEST-004', test: availableTests[3] },
        { testId: 'TEST-005', test: availableTests[4] }
      ],
      isActive: true,
      createdAt: '2024-10-01T11:00:00Z',
      updatedAt: '2024-10-01T11:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TestPackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    selectedTests: [] as string[]
  });

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      selectedTests: []
    });
    setEditingPackage(null);
  };

  const calculateTotalPrice = (selectedTestIds: string[]) => {
    return selectedTestIds.reduce((total, testId) => {
      const test = availableTests.find(t => t.id === testId);
      return total + (test?.price || 0);
    }, 0);
  };

  const handleTestSelection = (testId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedTests: checked
        ? [...prev.selectedTests, testId]
        : prev.selectedTests.filter(id => id !== testId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedTestsWithData = formData.selectedTests.map(testId => ({
      testId,
      test: availableTests.find(t => t.id === testId)!
    }));

    if (editingPackage) {
      // Update existing package
      setPackages(prev => prev.map(pkg =>
        pkg.id === editingPackage.id
          ? {
              ...pkg,
              name: formData.name,
              description: formData.description,
              price: formData.price,
              tests: selectedTestsWithData,
              updatedAt: new Date().toISOString()
            }
          : pkg
      ));
    } else {
      // Add new package
      const newPackage: TestPackage = {
        id: `PKG-${String(packages.length + 1).padStart(3, '0')}`,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        tests: selectedTestsWithData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPackages(prev => [...prev, newPackage]);
    }

    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEdit = (pkg: TestPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      selectedTests: pkg.tests.map(t => t.testId)
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (packageId: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
    }
  };

  const togglePackageStatus = (packageId: string) => {
    setPackages(prev => prev.map(pkg =>
      pkg.id === packageId
        ? { ...pkg, isActive: !pkg.isActive, updatedAt: new Date().toISOString() }
        : pkg
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1>Test Packages</h1>
          <p className="text-muted-foreground">Create and manage test packages for bundled offerings</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </DialogTitle>
              <DialogDescription>
                {editingPackage ? 'Update package information and tests' : 'Create a new test package with bundled tests'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter package name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Package Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter package price"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter package description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Select Tests *</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    {availableTests.map((test) => (
                      <div key={test.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={test.id}
                          checked={formData.selectedTests.includes(test.id)}
                          onCheckedChange={(checked) => handleTestSelection(test.id, checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none flex-1">
                          <label
                            htmlFor={test.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {test.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {test.description} - ₹{test.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {formData.selectedTests.length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Individual Tests Total:</span>
                      <span className="font-medium">₹{calculateTotalPrice(formData.selectedTests)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">Package Price:</span>
                      <span className="font-medium">₹{formData.price}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium">Savings:</span>
                      <span className="font-medium text-green-600">
                        ₹{Math.max(0, calculateTotalPrice(formData.selectedTests) - formData.price)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formData.selectedTests.length === 0}>
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Packages</p>
                <p className="text-2xl">{packages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TestTube className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Packages</p>
                <p className="text-2xl">{packages.filter(p => p.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Package Price</p>
                <p className="text-2xl">
                  ₹{packages.length > 0 ? Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl">
                  {packages.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Test Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Details</TableHead>
                <TableHead>Tests Included</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {pkg.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {pkg.tests.slice(0, 3).map((test) => (
                        <div key={test.testId} className="text-sm">
                          {test.test.name}
                        </div>
                      ))}
                      {pkg.tests.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{pkg.tests.length - 3} more tests
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Total: {pkg.tests.length} tests
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{pkg.price}</p>
                      <p className="text-xs text-muted-foreground">
                        Individual: ₹{pkg.tests.reduce((sum, t) => sum + t.test.price, 0)}
                      </p>
                      <p className="text-xs text-green-600">
                        Save: ₹{Math.max(0, pkg.tests.reduce((sum, t) => sum + t.test.price, 0) - pkg.price)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      onClick={() => togglePackageStatus(pkg.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{format(new Date(pkg.createdAt), 'MMM dd, yyyy')}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(pkg.createdAt), 'HH:mm')}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(pkg)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPackages.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No packages found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or create a new package</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}