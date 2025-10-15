import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface Permission {
  id: string;
  module: string;
  action: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    const response = await apiClient.get('/roles');
    if (response.success) {
      setRoles(response.data);
    }
  };

  const fetchPermissions = async () => {
    const response = await apiClient.get('/roles/permissions');
    if (response.success) {
      setPermissions(response.data);
    }
  };

  const handleCreateRole = async () => {
    const response = await apiClient.post('/roles', { name: newRoleName, description: newRoleDescription });
    if (response.success) {
      fetchRoles();
      setNewRoleName('');
      setNewRoleDescription('');
    }
  };

  const handleUpdateRole = async (roleId: string, updatedPermissions: string[]) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      const response = await apiClient.put(`/roles/${roleId}`, { ...role, permissions: updatedPermissions });
      if (response.success) {
        fetchRoles();
      }
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    await apiClient.delete(`/roles/${roleId}`);
    setRoles(roles.filter(r => r.id !== roleId));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl">Role Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl mb-4">Create New Role</h2>
          <div className="space-y-4">
            <Input
              placeholder="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <Input
              placeholder="Role Description"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
            />
            <Button onClick={handleCreateRole}>Create Role</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl mb-4">Manage Roles</h2>
          <div className="space-y-4">
            {roles.map(role => (
              <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">{role.name}</p>
                  <p className="text-sm text-slate-500">{role.description}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Role: {role.name}</DialogTitle>
                      </DialogHeader>
                      <RolePermissionsEditor role={role} permissions={permissions} onSave={handleUpdateRole} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

interface RolePermissionsEditorProps {
  role: Role;
  permissions: Permission[];
  onSave: (roleId: string, updatedPermissions: string[]) => void;
}

function RolePermissionsEditor({ role, permissions, onSave }: RolePermissionsEditorProps) {
  const [selectedPermissions, setSelectedPermissions] = useState(role.permissions.map(p => p.id));

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId) 
        : [...prev, permissionId]
    );
  };

  const handleSelectAllModule = (module: string, isSelected: boolean) => {
    const modulePermissionIds = groupedPermissions[module].map(p => p.id);
    setSelectedPermissions(prev => {
      const otherPermissions = prev.filter(id => !modulePermissionIds.includes(id));
      return isSelected ? [...otherPermissions, ...modulePermissionIds] : otherPermissions;
    });
  };

  const handleSave = () => {
    onSave(role.id, selectedPermissions);
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedPermissions).map(([module, modulePermissions]) => {
        const allSelected = modulePermissions.every(p => selectedPermissions.includes(p.id));
        return (
          <div key={module} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{module}</h3>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id={`select-all-${module}`}
                  checked={allSelected} 
                  onCheckedChange={(checked) => handleSelectAllModule(module, !!checked)} 
                />
                <label htmlFor={`select-all-${module}`}>Select All</label>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {modulePermissions.map(permission => (
                <div key={permission.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`perm-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionChange(permission.id)}
                  />
                  <label htmlFor={`perm-${permission.id}`}>{permission.action}</label>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
