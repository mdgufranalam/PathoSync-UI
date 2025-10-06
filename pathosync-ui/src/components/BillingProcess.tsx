import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, Search, X, Plus, Minus } from 'lucide-react';
import { mockTestsAPI, mockTestsData } from '../utils/mockTestsAPI';
import { useBills } from '../hooks/useBills';
import { toast } from 'sonner';

interface BillingProcessProps {
  onBack: () => void;
}

type Step = 1 | 2 | 3 | 4;

interface Patient {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  age: number;
  mobile: string;
  email: string;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  isOrganization: boolean;
}

interface Test {
  id: string;
  testName: string;
  tag: string;
  price: number;
}

export function BillingProcess({ onBack }: BillingProcessProps) {
  const { addBill } = useBills();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [patient, setPatient] = useState<Partial<Patient>>({});
  const [doctor, setDoctor] = useState<Partial<Doctor>>({});
  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [amountReceived, setAmountReceived] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'rupees' | 'percentage'>('rupees');
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  
  // Collection Center support
  const [selectedCollectionCenter, setSelectedCollectionCenter] = useState<string>('main-lab');
  const [isHomeCollection, setIsHomeCollection] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState('');
  const [collectionCharges, setCollectionCharges] = useState(0);

  // Load tests from API
  useEffect(() => {
    const loadTests = async () => {
      try {
        const tests = await mockTestsAPI.getAllTests();
        const formattedTests = tests.map(test => ({
          id: test.id,
          testName: test.testName,
          tag: test.tag,
          price: test.price
        }));
        setAvailableTests(formattedTests);
      } catch (error) {
        console.error('Error loading tests:', error);
        toast.error('Failed to load tests');
      }
    };
    loadTests();
  }, []);

  // Mock data
  const mockPatients = [
    { id: '1', title: 'Mr.', firstName: 'Rahul', lastName: 'Sharma', mobile: '9876543210' },
    { id: '2', title: 'Mrs.', firstName: 'Priya', lastName: 'Patel', mobile: '9876543211' },
    { id: '3', title: 'Mr.', firstName: 'Amit', lastName: 'Kumar', mobile: '9876543212' }
  ];

  const mockDoctors = [
    { id: '1', firstName: 'Dr. John', lastName: 'Smith', specialization: 'Cardiology', licenseNumber: 'MD-12345' },
    { id: '2', firstName: 'Dr. Sarah', lastName: 'Johnson', specialization: 'Neurology', licenseNumber: 'MD-12346' },
    { id: '3', firstName: 'Dr. Michael', lastName: 'Brown', specialization: 'General Medicine', licenseNumber: 'MD-12347' },
    { id: '4', firstName: 'Dr. Emily', lastName: 'Davis', specialization: 'Dermatology', licenseNumber: 'MD-12348' }
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

  const filteredTests = availableTests.filter(test =>
    test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = mockPatients.filter(p =>
    p.firstName.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    p.mobile.includes(patientSearchTerm)
  );

  const filteredDoctors = mockDoctors.filter(d =>
    d.firstName.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    d.lastName.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(doctorSearchTerm.toLowerCase())
  );

  const testsTotal = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const billTotal = testsTotal + collectionCharges;
  const discountAmount = discountType === 'percentage' 
    ? (billTotal * discount) / 100 
    : discount;
  const finalAmount = billTotal - discountAmount;
  const amountDue = finalAmount - amountReceived;

  const addTest = (test: Test) => {
    if (!selectedTests.find(t => t.id === test.id)) {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const removeTest = (testId: string) => {
    setSelectedTests(selectedTests.filter(t => t.id !== testId));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const selectSelf = () => {
    // Set the current user as the doctor (from App.tsx user data)
    setDoctor({
      firstName: 'Dr.',
      lastName: 'Admin',
      gender: 'male',
      isOrganization: false
    });
    setDoctorSearchTerm('');
  };

  const createBill = async () => {
    if (!patient.firstName || !patient.lastName || selectedTests.length === 0) {
      toast.error('Please fill all required fields and select at least one test');
      return;
    }

    setIsCreatingBill(true);
    try {
      const billData = {
        id: `BILL-${Date.now()}`,
        patientName: `${patient.title || ''} ${patient.firstName} ${patient.lastName}`.trim(),
        patientPhone: patient.mobile || '',
        patientEmail: patient.email || '',
        patientAddress: patient.address || '',
        doctorName: `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim(),
        tests: selectedTests.map(test => ({
          id: test.id,
          name: test.testName,
          price: test.price,
          category: test.tag
        })),
        billTotal,
        discount: discountAmount,
        finalAmount,
        paymentMethod: paymentMode,
        amountReceived,
        amountDue,
        status: amountDue <= 0 ? 'Paid' : 'Partial',
        reportStatus: 'Initial', // Add default report status
        createdAt: new Date().toISOString(),
        notes: ''
      };

      await addBill(billData);
      toast.success('Bill created successfully!');
      
      // Reset form
      setCurrentStep(1);
      setPatient({});
      setDoctor({});
      setSelectedTests([]);
      setDiscount(0);
      setAmountReceived(0);
      setSearchTerm('');
      setPatientSearchTerm('');
      setDoctorSearchTerm('');
      
      // Go back to dashboard
      onBack();
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill');
    } finally {
      setIsCreatingBill(false);
    }
  };

  const stepTitles = {
    1: 'Patient Information',
    2: 'Doctor Information',
    3: 'Test Selection',
    4: 'Charges Summary'
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl">Create Lab Bill</h1>
          <p className="text-slate-500">Step {currentStep} of 4: {stepTitles[currentStep]}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-slate-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6">
        {/* Step 1: Patient Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setPatient({});
                  setPatientSearchTerm('');
                }}
              >
                New Patient
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1"
                onClick={() => {
                  // Focus on search input
                  const searchInput = document.querySelector('input[placeholder*="Search by mobile"]') as HTMLInputElement;
                  if (searchInput) searchInput.focus();
                }}
              >
                Search Patient
              </Button>
            </div>

            {/* Patient Search */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by mobile number or name"
                  value={patientSearchTerm}
                  onChange={(e) => setPatientSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {patientSearchTerm && (
                <div className="border rounded-lg p-4 space-y-2">
                  {filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => {
                        setPatient({
                          title: p.title,
                          firstName: p.firstName,
                          lastName: p.lastName,
                          mobile: p.mobile
                        });
                        setPatientSearchTerm('');
                      }}
                    >
                      <p>{p.title} {p.firstName} {p.lastName}</p>
                      <p className="text-sm text-slate-500">{p.mobile}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Patient Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Select value={patient.title} onValueChange={(value) => setPatient({...patient, title: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={patient.firstName || ''}
                  onChange={(e) => setPatient({...patient, firstName: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={patient.lastName || ''}
                  onChange={(e) => setPatient({...patient, lastName: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={patient.gender} onValueChange={(value) => setPatient({...patient, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={patient.age || ''}
                  onChange={(e) => setPatient({...patient, age: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={patient.mobile || ''}
                  onChange={(e) => setPatient({...patient, mobile: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={patient.email || ''}
                  onChange={(e) => setPatient({...patient, email: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={patient.address || ''}
                  onChange={(e) => setPatient({...patient, address: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Doctor Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setDoctor({});
                  setDoctorSearchTerm('');
                }}
              >
                New Doctor
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1"
                onClick={selectSelf}
              >
                Select Self
              </Button>
            </div>

            {/* Doctor Search */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search doctor by name or specialization"
                  value={doctorSearchTerm}
                  onChange={(e) => setDoctorSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {doctorSearchTerm && (
                <div className="border rounded-lg p-4 space-y-2">
                  {filteredDoctors.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => {
                        setDoctor({
                          firstName: d.firstName,
                          lastName: d.lastName,
                          gender: 'male', // default
                          isOrganization: false
                        });
                        setDoctorSearchTerm('');
                      }}
                    >
                      <p>{d.firstName} {d.lastName}</p>
                      <p className="text-sm text-slate-500">{d.specialization} | {d.licenseNumber}</p>
                    </div>
                  ))}
                  {filteredDoctors.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-2">No doctors found</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doctorFirstName">First Name</Label>
                <Input
                  id="doctorFirstName"
                  value={doctor.firstName || ''}
                  onChange={(e) => setDoctor({...doctor, firstName: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="doctorLastName">Last Name</Label>
                <Input
                  id="doctorLastName"
                  value={doctor.lastName || ''}
                  onChange={(e) => setDoctor({...doctor, lastName: e.target.value})}
                />
              </div>

              {!doctor.isOrganization && (
                <div>
                  <Label htmlFor="doctorGender">Gender</Label>
                  <Select value={doctor.gender} onValueChange={(value) => setDoctor({...doctor, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOrganization"
                  checked={doctor.isOrganization}
                  onCheckedChange={(checked) => setDoctor({...doctor, isOrganization: !!checked, gender: checked ? undefined : doctor.gender})}
                />
                <Label htmlFor="isOrganization">Organization/Clinic</Label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Test Selection */}
        {currentStep === 3 && (
          <div className="space-y-6">
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
                    <Input
                      id="collectionAddress"
                      placeholder="Enter complete address for home collection"
                      value={collectionAddress}
                      onChange={(e) => setCollectionAddress(e.target.value)}
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

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Tests */}
            {selectedTests.length > 0 && (
              <div>
                <h3 className="mb-3">Selected Tests ({selectedTests.length})</h3>
                <div className="space-y-2 mb-4">
                  {selectedTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p>{test.testName}</p>
                        <p className="text-sm text-slate-500">{test.tag}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">₹{test.price}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTest(test.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Tests */}
            <div>
              <h3 className="mb-3">Available Tests</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer"
                    onClick={() => addTest(test)}
                  >
                    <div>
                      <p>{test.testName}</p>
                      <p className="text-sm text-slate-500">{test.tag}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">₹{test.price}</Badge>
                      {selectedTests.find(t => t.id === test.id) ? (
                        <Badge variant="default">Added</Badge>
                      ) : (
                        <Button size="sm" variant="ghost">
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Charges Summary */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bill Summary */}
              <div>
                <h3 className="mb-4">Bill Summary</h3>
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Tests Total:</span>
                    <span>₹{testsTotal}</span>
                  </div>
                  {collectionCharges > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Collection Charges:</span>
                      <span>+₹{collectionCharges}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Bill Total:</span>
                    <span>₹{billTotal}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Final Amount:</span>
                    <span>₹{finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Received:</span>
                    <span>₹{amountReceived}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Amount Due:</span>
                    <span className={amountDue > 0 ? 'text-red-600' : 'text-green-600'}>
                      ₹{amountDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="mb-4">Payment Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Payment Mode</Label>
                    <RadioGroup value={paymentMode} onValueChange={setPaymentMode}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi">UPI</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Card</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="amountReceived">Amount Received</Label>
                    <Input
                      id="amountReceived"
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Discount</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        placeholder="Enter discount"
                      />
                      <Select value={discountType} onValueChange={(value: 'rupees' | 'percentage') => setDiscountType(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rupees">₹</SelectItem>
                          <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={createBill}
                disabled={isCreatingBill || selectedTests.length === 0}
              >
                {isCreatingBill ? 'Creating...' : 'Create Bill'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}