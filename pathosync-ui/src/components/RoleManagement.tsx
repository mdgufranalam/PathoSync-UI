import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    const response = await apiClient.get('/roles');
    setRoles(response.data);
  };

  const fetchPermissions = async () => {
    const response = await apiClient.get('/permissions');
    setPermissions(response.data);
  };

  const handleCreateRole = async () => {
    const response = await apiClient.post('/roles', { name: newRoleName, description: newRoleDescription });
    setRoles([...roles, response.data]);
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const handleUpdateRole = async (roleId: string, updatedPermissions: string[]) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      const response = await apiClient.put(`/roles/${roleId}`, { ...role, permissions: updatedPermissions });
      fetchRoles();
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

  const handlePermissionChange = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const handleSave = () => {
    onSave(role.id, selectedPermissions);
  };

  return (
    <div className="space-y-4">
      {permissions.map(permission => (
        <div key={permission.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`perm-${permission.id}`}
            checked={selectedPermissions.includes(permission.id)}
            onChange={() => handlePermissionChange(permission.id)}
          />
          <label htmlFor={`perm-${permission.id}`}>{permission.module} - {permission.action}</label>
        </div>
      ))}
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
