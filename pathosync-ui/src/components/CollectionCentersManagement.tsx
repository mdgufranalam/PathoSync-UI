import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Role } from '../types/permissions';
import { apiClient } from '../utils/apiClient';

interface CollectionCenter {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  phone: string;
}

interface CollectionCentersManagementProps {
  currentUser?: {
    role: string;
    id: string;
  };
}

export function CollectionCentersManagement({ currentUser: propCurrentUser }: CollectionCentersManagementProps = {}) {
  const currentUser = propCurrentUser || {
    role: 'admin' as Role,
    id: 'current-user-id'
  };

  const { permissions } = usePermissions({
    userRole: currentUser.role as Role,
    userId: currentUser.id
  });

  const [collectionCenters, setCollectionCenters] = useState<CollectionCenter[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<CollectionCenter | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_person: '',
    phone: ''
  });

  useEffect(() => {
    const fetchCollectionCenters = async () => {
      const response = await apiClient.get('/collection-centers');
      if (response.success) {
        setCollectionCenters(response.data);
      }
    };
    if (permissions.collectionCenters.canView) {
      fetchCollectionCenters();
    }
  }, [permissions.collectionCenters.canView]);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      contact_person: '',
      phone: ''
    });
    setEditingCenter(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCenter) {
      if (!permissions.collectionCenters.canEdit) return;
      const response = await apiClient.put(`/collection-centers/${editingCenter.id}`, formData);
      if (response.success) {
        setCollectionCenters(prev => prev.map(center =>
          center.id === editingCenter.id
            ? { ...center, ...formData }
            : center
        ));
      }
    } else {
      if (!permissions.collectionCenters.canCreate) return;
      const response = await apiClient.post('/collection-centers', formData);
      if (response.success) {
        setCollectionCenters(prev => [...prev, response.data]);
      }
    }

    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEdit = (center: CollectionCenter) => {
    if (!permissions.collectionCenters.canEdit) return;
    setEditingCenter(center);
    setFormData({
      name: center.name,
      address: center.address,
      contact_person: center.contact_person,
      phone: center.phone
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (centerId: string) => {
    if (!permissions.collectionCenters.canDelete) return;
    if (window.confirm('Are you sure you want to delete this collection center?')) {
      const response = await apiClient.delete(`/collection-centers/${centerId}`);
      if (response.success) {
        setCollectionCenters(prev => prev.filter(center => center.id !== centerId));
      }
    }
  };

  if (!permissions.collectionCenters.canView) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>You don't have permission to manage collection centers.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Collection Center Management</h1>
          <p className="text-muted-foreground">Manage sample collection centers</p>
        </div>
        {permissions.collectionCenters.canCreate && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Center
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCenter ? 'Edit Center' : 'Add New Center'}</DialogTitle>
                <DialogDescription>
                  {editingCenter ? 'Update center information' : 'Add a new collection center to the system'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Center Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input id="contact_person" value={formData.contact_person} onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingCenter ? 'Update Center' : 'Add Center'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Centers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectionCenters.map((center) => (
                <TableRow key={center.id}>
                  <TableCell>{center.name}</TableCell>
                  <TableCell>{center.address}</TableCell>
                  <TableCell>{center.contact_person}</TableCell>
                  <TableCell>{center.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {permissions.collectionCenters.canEdit && (
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(center)}><Edit className="w-4 h-4" /></Button>
                      )}
                      {permissions.collectionCenters.canDelete && (
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(center.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
