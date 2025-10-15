import React, { useState, useEffect } from 'react';
import { Doctor } from '../types/index';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { apiClient } from '../utils/apiClient';
import { useAuthContext } from '../contexts/AuthContext';
import { PermissionGate } from './PermissionGate';

export function DoctorsManagement() {
  const { hasPermission } = useAuthContext();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    specialization: '',
    email: '',
    phone: '',
    license_number: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await apiClient.get('/doctors');
      if (response.success) {
        setDoctors(response.data as Doctor[]);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDoctor) {
      const response = await apiClient.put(`/doctors/${editingDoctor.id}`, formData);
      if (response.success) {
        setDoctors(prev => prev.map(d => d.id === editingDoctor.id ? response.data : d));
      }
    } else {
      const response = await apiClient.post('/doctors', formData);
      if (response.success) {
        setDoctors(prev => [...prev, response.data]);
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      specialization: '',
      email: '',
      phone: '',
      license_number: ''
    });
    setEditingDoctor(null);
    setDialogOpen(false);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      license_number: doctor.license_number
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      const response = await apiClient.delete(`/doctors/${id}`);
      if (response.success) {
        setDoctors(prev => prev.filter(doctor => doctor.id !== id));
      }
    }
  };

  const toggleStatus = async (id: string) => {
    const doctor = doctors.find(doc => doc.id === id);
    if (doctor) {
      const response = await apiClient.patch(`/doctors/${id}`, { is_active: !doctor.is_active });
      if (response.success) {
        setDoctors(prev => prev.map(doc => 
          doc.id === id ? { ...doc, is_active: !doc.is_active } : doc
        ));
      }
    }
  };

  return (
    <PermissionGate module="Doctors" action="view">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Doctors Management</h1>
            <p className="text-muted-foreground">Manage doctor profiles and information</p>
          </div>
          
          <PermissionGate module="Doctors" action="create">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </DialogTrigger>
              <DialogContent> 
                  {/* ... (form) ... */}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>

        {/* ... (Search) */}

        <Card>
          <CardHeader>
            <CardTitle>All Doctors ({filteredDoctors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    {/* ... (table header) */}
                </TableHeader>
                <TableBody>
                {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                    {/* ... (table cells) */}
                    <TableCell>
                        <div className="flex gap-2">
                        <PermissionGate module="Doctors" action="edit">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(doctor)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                        </PermissionGate>
                        <PermissionGate module="Doctors" action="delete">
                            <Button variant="outline" size="sm" onClick={() => handleDelete(doctor.id)} className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </PermissionGate>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}
