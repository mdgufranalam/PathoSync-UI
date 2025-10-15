import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  UserCheck, 
  UserX,
  MoreHorizontal,
  Shield,
  Eye,
  EyeOff,
  Building2,
  UserPlus,
  Lock,
  Filter
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Role, User, FilterTemplate } from '../types/index';
import { PermissionDisplay, PermissionCheckboxes } from './PermissionDisplay';
import { useAuthContext } from '../contexts/AuthContext';
import { PermissionGate } from './PermissionGate';
import { Progress } from './ui/progress';

// ... (interface definitions)

export function UserManagement() {
  const { hasPermission } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', role: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [filterTemplates, setFilterTemplates] = useState<FilterTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);



  // ... (other state variables)

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchFilterTemplates();
  }, [filters]);

  const fetchUsers = async () => {
    const response = await apiClient.get('/users', { params: { ...filters, search: searchTerm } });
    if(response.success) {
      setUsers(response.data as User[]);
    }
  };

  const fetchRoles = async () => {
    const response = await apiClient.get('/roles');
    if(response.success) {
      setRoles(response.data as Role[]);
    }
  };

  const fetchFilterTemplates = async () => {
    const response = await apiClient..get('/filter-templates');
    if(response.success) {
      setFilterTemplates(response.data as FilterTemplate[]);
    }
  };

  const handleSaveFilterTemplate = async () => {
    const response = await apiClient.post('/filter-templates', { name: newTemplateName, filters });
    if(response.success) {
      fetchFilterTemplates();
      setNewTemplateName('');
    }
  };

  const handleBulkDelete = async () => {
    await apiClient.post('/users/bulk-delete', { userIds: selectedUsers });
    fetchUsers();
    setSelectedUsers([]);
  };


  // ... (other handlers)

  return (
    <PermissionGate module="Users" action="list">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
          <PermissionGate module="Users" action="create">
            <Button onClick={() => setIsAddUserModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </PermissionGate>
        </div>

        {/* ... (stats) */}
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
            <Card className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Select value={filters.status} onValueChange={(value) => setFilters(f => ({...f, status: value}))}>
                        <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.role} onValueChange={(value) => setFilters(f => ({...f, role: value}))}>
                        <SelectTrigger><SelectValue placeholder="Filter by role" /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">All Roles</SelectItem>
                             {roles.map(role => (
                               <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                             ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Input value={newTemplateName} onChange={e => setNewTemplateName(e.target.value)} placeholder="New template name"/>
                    <Button onClick={handleSaveFilterTemplate}>Save as Template</Button>
                </div>
                <div className="flex items-center gap-2">
                    <Select onValueChange={templateId => {
                        const template = filterTemplates.find(t => t.id === templateId);
                        if(template) setFilters(template.filters);
                    }}>
                        <SelectTrigger><SelectValue placeholder="Load template" /></SelectTrigger>
                        <SelectContent>
                            {filterTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </Card>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PermissionGate module="Users" action="delete">
              <Button variant="destructive" disabled={selectedUsers.length === 0} onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedUsers.length})
              </Button>
            </PermissionGate>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers(users.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <PermissionGate module="Users" action="edit">
                          <DropdownMenuItem onClick={() => {
                            setEditingUser(user);
                            setIsEditUserModalOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </PermissionGate>
                        <PermissionGate module="Users" action="delete">
                          <DropdownMenuItem onClick={() => handleBulkDelete()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </PermissionGate>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Add/Edit Modals Here */}
      </div>
    </PermissionGate>
  );
}
