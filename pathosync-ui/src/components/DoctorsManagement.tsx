import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { apiClient } from '../utils/apiClient';
import { usePermissions } from '../hooks/usePermissions';
import { Role } from '../types/permissions';

interface DoctorsManagementProps {
  currentUser?: {
    role: string;
    id: string;
  };
}

export function DoctorsManagement({ currentUser: propCurrentUser }: DoctorsManagementProps = {}) {
  const currentUser = propCurrentUser || {
    role: 'admin' as Role,
    id: 'current-user-id'
  };

  const { permissions } = usePermissions({
    userRole: currentUser.role as Role,
    userId: currentUser.id
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    licenseNumber: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await apiClient.get('/doctors');
      if (response.success) {
        setDoctors(response.data);
      }
    };
    if (permissions.doctors.canView) {
      fetchDoctors();
    }
  }, [permissions.doctors.canView]);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDoctor) {
      if (!permissions.doctors.canEdit) return;
      const response = await apiClient.put(`/doctors/${editingDoctor.id}`, formData);
      if (response.success) {
        setDoctors(prev => prev.map(doctor => 
          doctor.id === editingDoctor.id 
            ? { ...doctor, ...formData, updatedAt: new Date().toISOString() }
            : doctor
        ));
      }
    } else {
      if (!permissions.doctors.canCreate) return;
      const response = await apiClient.post('/doctors', formData);
      if (response.success) {
        const newDoctor: Doctor = {
            id: response.data.id,
            ...formData,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setDoctors(prev => [...prev, newDoctor]);
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      licenseNumber: ''
    });
    setEditingDoctor(null);
    setDialogOpen(false);
  };

  const handleEdit = (doctor: Doctor) => {
    if (!permissions.doctors.canEdit) return;
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      licenseNumber: doctor.licenseNumber
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!permissions.doctors.canDelete) return;
    if (confirm('Are you sure you want to delete this doctor?')) {
      const response = await apiClient.delete(`/doctors/${id}`);
      if (response.success) {
        setDoctors(prev => prev.filter(doctor => doctor.id !== id));
      }
    }
  };

  const toggleStatus = async (id: string) => {
    if (!permissions.doctors.canEdit) return;
    const doctor = doctors.find(doc => doc.id === id);
    if (doctor) {
      const response = await apiClient.patch(`/doctors/${id}`, { isActive: !doctor.isActive });
      if (response.success) {
        setDoctors(prev => prev.map(doc => 
          doc.id === id 
            ? { ...doc, isActive: !doc.isActive, updatedAt: new Date().toISOString() }
            : doc
        ));
      }
    }
  };

  if (!permissions.doctors.canView) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>You don't have permission to manage doctors.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Doctors Management</h1>
          <p className="text-muted-foreground">Manage doctor profiles and information</p>
        </div>
        
        {permissions.doctors.canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
                <DialogDescription>
                  {editingDoctor ? 'Update the doctor information below.' : 'Fill in the details to add a new doctor to the system.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name">Full Name</label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="specialization">Specialization</label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone">Phone</label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="licenseNumber">License Number</label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Doctors ({filteredDoctors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>{doctor.licenseNumber}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={doctor.isActive ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(doctor.id)}
                    >
                      {doctor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {permissions.doctors.canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(doctor)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {permissions.doctors.canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doctor.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDoctors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No doctors found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
