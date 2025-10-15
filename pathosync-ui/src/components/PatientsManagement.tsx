import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { Patient } from '../types/index';
import { useAuthContext } from '../contexts/AuthContext';
import { PermissionGate } from './PermissionGate';
import { apiClient } from '../utils/apiClient';

export function PatientsManagement() {
  const { hasPermission } = useAuthContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other', // Default value
    emergencyContact: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await apiClient.get('/patients');
      if (response.success) {
        setPatients(response.data as Patient[]);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    patient.phone?.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: 'male',
      emergencyContact: ''
    });
    setEditingPatient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      const response = await apiClient.put<Patient>(`/patients/${editingPatient.id}`, formData);
      if (response.success) {
        setPatients(prev => prev.map(p => p.id === editingPatient.id ? response.data as Patient : p));
      }
    } else {
      const response = await apiClient.post<Patient>('/patients', formData);
      if (response.success) {
        setPatients(prev => [...prev, response.data as Patient]);
      }
    }

    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
        name: patient.name,
        email: patient.email || '',
        phone: patient.phone || '',
        address: patient.address || '',
        dateOfBirth: patient.date_of_birth || '',
        gender: patient.gender || 'male',
        emergencyContact: patient.emergency_contact || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      const response = await apiClient.delete(`/patients/${patientId}`);
      if (response.success) {
        setPatients(prev => prev.filter(patient => patient.id !== patientId));
      }
    }
  };

  // ... (calculateAge, getGenderColor functions)

  return (
    <PermissionGate module="Patients" action="view">
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1>Patient Management</h1>
              <p className="text-muted-foreground">Manage patient records and information</p>
            </div>
            <PermissionGate module="Patients" action="create">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent> 
                  {/* ... (form) ... */}
                </DialogContent>
              </Dialog>
            </PermissionGate>
        </div>

        {/* ... (Stats Cards, Search) */}

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Details</TableHead>
                <TableHead>Contact Information</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  {/* ... (table cells) */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PermissionGate module="Patients" action="edit">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(patient)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </PermissionGate>
                      <PermissionGate module="Patients" action="delete">
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(patient.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </PermissionGate>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PermissionGate>
  );
}
