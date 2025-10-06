import React from 'react';
import { Role, ROLE_PERMISSIONS, MODULES } from '../types/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Check, X, Eye, Edit, Trash2, Plus, UserCheck, BarChart3 } from 'lucide-react';

interface PermissionDisplayProps {
  userRole: Role;
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export function PermissionDisplay({ 
  userRole, 
  className = '', 
  showTitle = true, 
  compact = false 
}: PermissionDisplayProps) {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  
  if (!rolePermissions) {
    return <div className="text-red-500">Invalid role specified</div>;
  }

  const getPermissionIcon = (action: string) => {
    switch (action) {
      case 'view':
      case 'view_own':
      case 'view_assigned':
      case 'view_center':
      case 'summary_only':
        return <Eye className="h-3 w-3" />;
      case 'edit':
        return <Edit className="h-3 w-3" />;
      case 'delete':
        return <Trash2 className="h-3 w-3" />;
      case 'create':
      case 'generate_bills':
        return <Plus className="h-3 w-3" />;
      case 'approve':
        return <UserCheck className="h-3 w-3" />;
      case 'all_centers':
      case 'own_center':
        return <BarChart3 className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getPermissionsByModule = () => {
    const modulePermissions: Record<string, any[]> = {};
    
    rolePermissions.permissions.forEach(permission => {
      if (!modulePermissions[permission.module]) {
        modulePermissions[permission.module] = [];
      }
      modulePermissions[permission.module].push(permission);
    });
    
    return modulePermissions;
  };

  const modulePermissions = getPermissionsByModule();

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {showTitle && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{userRole}</Badge>
            <span className="text-sm text-muted-foreground">Permissions</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(modulePermissions).map(([module, permissions]) => {
            const hasAnyPermission = permissions.some(p => p.allowed);
            return (
              <div key={module} className="flex items-center gap-2">
                <Checkbox 
                  checked={hasAnyPermission} 
                  disabled 
                  className="h-3 w-3" 
                />
                <span className={hasAnyPermission ? 'text-foreground' : 'text-muted-foreground'}>
                  {module}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">{userRole}</Badge>
            Role Permissions
          </CardTitle>
          <CardDescription>
            {rolePermissions.description}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {Object.entries(modulePermissions).map(([module, permissions]) => (
          <div key={module} className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              {module}
              <Badge variant="outline" className="text-xs">
                {permissions.filter(p => p.allowed).length}/{permissions.length}
              </Badge>
            </h4>
            
            <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-muted">
              {permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    {permission.allowed ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    {getPermissionIcon(permission.action)}
                  </div>
                  
                  <Checkbox 
                    checked={permission.allowed} 
                    disabled 
                    className="h-3 w-3" 
                  />
                  
                  <span className={`flex-1 ${permission.allowed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {permission.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  
                  {permission.description && (
                    <span className="text-xs text-muted-foreground">
                      ({permission.description})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Component for displaying permissions in user creation/editing forms
export function PermissionCheckboxes({ 
  selectedRole, 
  onChange, 
  disabled = false 
}: { 
  selectedRole: Role; 
  onChange?: (role: Role) => void; 
  disabled?: boolean;
}) {
  const roles: Role[] = ['Admin', 'Manager', 'Technician', 'Collection Agent', 'Data Entry', 'Viewer'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {roles.map((role) => {
          const rolePermissions = ROLE_PERMISSIONS[role];
          const isSelected = selectedRole === role;
          
          return (
            <div key={role} className="space-y-2">
              <div 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && onChange?.(role)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={isSelected} 
                    disabled={disabled}
                    onChange={() => !disabled && onChange?.(role)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role}</span>
                      <Badge variant="outline" className="text-xs">
                        {rolePermissions.permissions.filter(p => p.allowed).length} permissions
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rolePermissions.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="ml-8 p-3 bg-muted/50 rounded-lg">
                  <PermissionDisplay 
                    userRole={role} 
                    showTitle={false} 
                    compact={true}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Matrix view showing all roles and their permissions
export function PermissionMatrix() {
  const roles: Role[] = ['Admin', 'Manager', 'Technician', 'Collection Agent', 'Data Entry', 'Viewer'];
  const modules = Object.values(MODULES);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Permission Matrix</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Feature / Module</th>
              {roles.map(role => (
                <th key={role} className="border border-border p-2 text-center min-w-[120px]">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map(module => (
              <tr key={module}>
                <td className="border border-border p-2 font-medium">
                  {module}
                </td>
                {roles.map(role => {
                  const rolePermissions = ROLE_PERMISSIONS[role];
                  const modulePerms = rolePermissions.permissions.filter(p => p.module === module);
                  const hasPermissions = modulePerms.some(p => p.allowed);
                  const permissionCount = modulePerms.filter(p => p.allowed).length;
                  
                  return (
                    <td key={role} className="border border-border p-2 text-center">
                      {hasPermissions ? (
                        <div className="flex flex-col items-center gap-1">
                          <Check className="h-4 w-4 text-green-600" />
                          <Badge variant="outline" className="text-xs">
                            {permissionCount}
                          </Badge>
                        </div>
                      ) : (
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PermissionDisplay;