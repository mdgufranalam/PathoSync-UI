import React, { useState, useEffect } from 'react';
import { Bill, Patient, Doctor, Test, Lab } from '../types';
import { mockTestsAPI } from '../utils/mockTestsAPI';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { BillPDF } from './BillPDF';
import { ArrowLeft, ArrowRight, Search, X, Plus, Minus, FileText, Receipt } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBills } from '../hooks/useBills';
import { toast } from 'sonner';
import { Page } from '../App';

export interface EnhancedBillingProcessProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

export function EnhancedBillingProcess({ onBack, onNavigate }: EnhancedBillingProcessProps) {
  const { hasPermission } = useAuth();
  const { addBill } = useBills();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTests, setSelectedTests] = useState<{test: Test, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'insurance'>('cash');
  const [showBillPDF, setShowBillPDF] = useState(false);
  const [generatedBill, setGeneratedBill] = useState<Bill | null>(null);
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  
  // Collection Center selection
  const [selectedCollectionCenter, setSelectedCollectionCenter] = useState<string>('main-lab');
  const [isHomeCollection, setIsHomeCollection] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState('');
  const [collectionCharges, setCollectionCharges] = useState(0);
  
  // Sample date and time (default to current)
  const [sampleDate, setSampleDate] = useState(new Date().toISOString().split('T')[0]);
  const [sampleTime, setSampleTime] = useState(new Date().toTimeString().slice(0, 5));

  // Mock data
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-234-567-8901',
      address: '123 Main St, City, State 12345',
      dateOfBirth: '1985-05-15',
      gender: 'male',
      emergencyContact: '+1-234-567-8999',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-234-567-8902',
      address: '456 Oak Ave, City, State 12345',
      dateOfBirth: '1990-03-22',
      gender: 'female',
      emergencyContact: '+1-234-567-8998',
      createdAt: '2024-01-02T00:00:00Z'
    }
  ];

  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Michael Smith',
      specialization: 'Cardiology',
      email: 'michael.smith@hospital.com',
      phone: '+1-234-567-9001',
      licenseNumber: 'MD-12345',
      isActive: true,
    },
    {
      id: '2',
      name: 'Dr. Emily Davis',
      specialization: 'General Medicine',
      email: 'emily.davis@hospital.com',
      phone: '+1-234-567-9002',
      licenseNumber: 'MD-12346',
      isActive: true,
    }
  ];

  // Mock Collection Centers
  const mockCollectionCenters = [
    {
      id: 'main-lab',
      code: 'MAIN',
      name: 'Main Laboratory',
      address: '123 Medical Center Dr, Health City, HC 12345',
      charges: 0
    },
    {
      id: 'cc1',
      code: 'CC001',
      name: 'PathoCare Collection Center - Andheri',
      address: '123, S.V. Road, Andheri West, Mumbai - 400058',
      charges: 50
    },
    {
      id: 'cc2',
      code: 'CC002', 
      name: 'PathoCare Collection Center - Borivali',
      address: '456, Link Road, Borivali East, Mumbai - 400066',
      charges: 50
    },
    {
      id: 'cc3',
      code: 'CC003',
      name: 'PathoCare Collection Center - Thane',
      address: '789, Ghodbunder Road, Thane West - 400601',
      charges: 75
    },
    {
      id: 'home-collection',
      code: 'HOME',
      name: 'Home Collection Service',
      address: 'Patient\'s Address',
      charges: 150
    }
  ];

  // Load tests from API
  useEffect(() => {
    const loadTests = async () => {
      try {
        const tests = await mockTestsAPI.getAllTests();
        setAvailableTests(tests);
      } catch (error) {
        console.error('Error loading tests:', error);
      }
    };
    loadTests();
  }, []);

  const mockLab: Lab = {
    name: 'HealthCare SaaS Lab',
    address: '123 Medical Center Dr, Health City, HC 12345',
    phone: '+1-800-123-4567',
    email: 'info@healthcarelab.com',
    licenseNumber: 'LAB-2024-001'
  };

  const filteredPatients = mockPatients.filter(p => 
    p.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(patientSearchTerm.toLowerCase())
  );

  const filteredDoctors = mockDoctors.filter(d => 
    d.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(doctorSearchTerm.toLowerCase())
  );

  const filteredTests = availableTests.filter(t => 
    t.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = selectedTests.reduce((sum, item) => sum + (item.test.price * item.quantity), 0);
  const subtotalWithCollection = subtotal + collectionCharges;
  const tax = subtotalWithCollection * 0.18; // 18% GST
  const total = subtotalWithCollection + tax - discount;

  const addTest = (test: Test) => {
    const existingIndex = selectedTests.findIndex(item => item.test.id === test.id);
    if (existingIndex >= 0) {
      const updated = [...selectedTests];
      updated[existingIndex].quantity += 1;
      setSelectedTests(updated);
    } else {
      setSelectedTests([...selectedTests, { test, quantity: 1 }]);
    }
  };

  const removeTest = (testId: string) => {
    setSelectedTests(selectedTests.filter(item => item.test.id !== testId));
  };

  const updateQuantity = (testId: string, quantity: number) => {
    if (quantity <= 0) {
      removeTest(testId);
    } else {
      setSelectedTests(selectedTests.map(item => 
        item.test.id === testId ? { ...item, quantity } : item
      ));
    }
  };

  const selectSelf = () => {
    // Set the current user as the doctor (from App.tsx user data)
    const selfDoctor: Doctor = {
      id: 'self-1',
      name: 'Dr. Admin',
      specialization: 'Administrator',
      email: 'admin@pathosync.com',
      phone: '+91-9876543210',
      licenseNumber: 'ADMIN-001',
      isActive: true,
    };
    setSelectedDoctor(selfDoctor);
    setDoctorSearchTerm('');
  };

  const generateBill = () => {
    if (!selectedPatient || !selectedDoctor || selectedTests.length === 0) {
      alert('Please complete all required fields');
      return;
    }

    const selectedCenter = mockCollectionCenters.find(c => c.id === selectedCollectionCenter);
    
    const bill: Bill = {
      id: `BILL-${Date.now()}`,
      patient: selectedPatient,
      doctor: selectedDoctor,
      tests: selectedTests,
      subtotal: subtotalWithCollection,
      tax,
      discount,
      total,
      finalAmount: total, // Assuming finalAmount is the same as total for now
      status: 'pending',
      paymentMethod,
      notes,
      sampleDate,
      sampleTime,
      collectionCenter: selectedCenter ? {
        id: selectedCenter.id,
        code: selectedCenter.code,
        name: selectedCenter.name,
        address: selectedCenter.address
      } : undefined,
      isHomeCollection,
      collectionAddress: isHomeCollection ? collectionAddress : undefined,
      collectionCharges,
      reportStatus: 'Initial',
      testResults: selectedTests.map(item => ({
        testId: item.test.id,
        result: '',
        isAbnormal: false
      })),
      clinicalRemarks: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save the bill to persistent storage
    addBill(bill);
    setGeneratedBill(bill);
    setCurrentStep(5);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Patient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={patientSearchTerm}
                  onChange={(e) => setPatientSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4>{patient.name}</h4>
                        <p className="text-muted-foreground">{patient.email}</p>
                        <p className="text-muted-foreground">{patient.phone}</p>
                      </div>
                      <Badge variant="outline">{patient.gender}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedPatient && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p><strong>Selected:</strong> {selectedPatient.name}</p>
                  <p>{selectedPatient.email} | {selectedPatient.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Select Doctor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 mb-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedDoctor(null);
                    setDoctorSearchTerm('');
                  }}
                >
                  Search Doctor
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1"
                  onClick={selectSelf}
                >
                  Select Self
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors..."
                  value={doctorSearchTerm}
                  onChange={(e) => setDoctorSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4>{doctor.name}</h4>
                        <p className="text-muted-foreground">{doctor.specialization}</p>
                        <p className="text-muted-foreground">{doctor.email}</p>
                      </div>
                      <Badge variant="outline">{doctor.licenseNumber}</Badge>
                    </div>
                  </div>
                ))}
                {doctorSearchTerm && filteredDoctors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No doctors found matching your search.
                  </div>
                )}
              </div>
              
              {selectedDoctor && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p><strong>Selected:</strong> {selectedDoctor.name}</p>
                  <p>{selectedDoctor.specialization} | {selectedDoctor.email}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Select Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4>{test.testName}</h4>
                          <p className="text-muted-foreground">{test.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{test.category}</Badge>
                            <span>₹{test.price}</span>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => addTest(test)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No tests selected</p>
                ) : (
                  <div className="space-y-3">
                    {selectedTests.map((item) => (
                      <div key={item.test.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h5>{item.test.testName}</h5>
                          <p className="text-muted-foreground">₹{item.test.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.test.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.test.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeTest(item.test.id)}
                            className="text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Payment & Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bill Summary */}
              <div className="space-y-4">
                <h3>Bill Summary</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTests.map((item) => (
                      <TableRow key={item.test.id}>
                        <TableCell>{item.test.testName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.test.price}</TableCell>
                        <TableCell>₹{item.quantity * item.test.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Collection Center Selection */}
              <div className="space-y-4">
                <h3>Collection Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="collectionCenter">Collection Center</Label>
                    <Select 
                      value={selectedCollectionCenter} 
                      onValueChange={(value) => {
                        setSelectedCollectionCenter(value);
                        const center = mockCollectionCenters.find(c => c.id === value);
                        if (center) {
                          setCollectionCharges(center.charges);
                          setIsHomeCollection(value === 'home-collection');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection center" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCollectionCenters.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            <div className="flex justify-between items-center w-full">
                              <div>
                                <span className="font-medium">{center.code}</span> - {center.name}
                              </div>
                              {center.charges > 0 && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  +₹{center.charges}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCollectionCenter && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {mockCollectionCenters.find(c => c.id === selectedCollectionCenter)?.address}
                      </p>
                    )}
                  </div>

                  {isHomeCollection && (
                    <div>
                      <Label htmlFor="collectionAddress">Collection Address</Label>
                      <Textarea
                        id="collectionAddress"
                        placeholder="Enter complete address for home collection"
                        value={collectionAddress}
                        onChange={(e) => setCollectionAddress(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  {collectionCharges > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">Collection Charges:</span>
                        <span className="font-semibold text-blue-800">₹{collectionCharges}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Information */}
              <div className="space-y-4">
                <h3>Sample Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sampleDate">Sample Date</Label>
                    <Input
                      id="sampleDate"
                      type="date"
                      value={sampleDate}
                      onChange={(e) => setSampleDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sampleTime">Sample Time</Label>
                    <Input
                      id="sampleTime"
                      type="time"
                      value={sampleTime}
                      onChange={(e) => setSampleTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="discount">Discount (₹)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      min="0"
                      max={subtotal}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'insurance') => setPaymentMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tests Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {collectionCharges > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Collection Charges:</span>
                      <span>+₹{collectionCharges.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotalWithCollection.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Bill Generated Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-green-600">
                  <Receipt className="w-16 h-16 mx-auto mb-4" />
                  <p>Bill has been generated successfully</p>
                  <p>Bill ID: {generatedBill?.id}</p>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Dialog open={showBillPDF} onOpenChange={setShowBillPDF}>
                    <DialogTrigger asChild>
                      <Button>
                        <FileText className="w-4 h-4 mr-2" />
                        View/Print Bill
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Bill Preview</DialogTitle>
                        <DialogDescription>
                          Review the bill details before printing or saving.
                        </DialogDescription>
                      </DialogHeader>
                      {generatedBill && (
                        <BillPDF bill={generatedBill} lab={mockLab} />
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" onClick={() => {
                    setCurrentStep(1);
                    setSelectedPatient(null);
                    setSelectedDoctor(null);
                    setSelectedTests([]);
                    setDiscount(0);
                    setNotes('');
                    setGeneratedBill(null);
                    setPatientSearchTerm('');
                    setDoctorSearchTerm('');
                    setSearchTerm('');
                  }}>
                    Create New Bill
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (!hasPermission('manage_billing')) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>You don't have permission to manage billing.</p>
            <Button onClick={() => onNavigate('dashboard')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1>Enhanced Billing Process</h1>
          <p className="text-muted-foreground">Create comprehensive bills with patient, doctor, and test information</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step}
            </div>
            {step < 5 && (
              <div className={`w-12 h-1 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as Step)}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={() => {
                if (currentStep === 1 && !selectedPatient) {
                  alert('Please select a patient');
                  return;
                }
                if (currentStep === 2 && !selectedDoctor) {
                  alert('Please select a doctor');
                  return;
                }
                if (currentStep === 3 && selectedTests.length === 0) {
                  alert('Please select at least one test');
                  return;
                }
                setCurrentStep(Math.min(5, currentStep + 1) as Step);
              }}
              disabled={
                (currentStep === 1 && !selectedPatient) ||
                (currentStep === 2 && !selectedDoctor) ||
                (currentStep === 3 && selectedTests.length === 0)
              }
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={generateBill}>
              Generate Bill
              <Receipt className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}