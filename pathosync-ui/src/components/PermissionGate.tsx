import React from 'react';
import { Role, MODULES, ACTIONS, PermissionService } from '../types/permissions';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PermissionGateProps {
  userRole: Role;
  module?: string;
  action?: string;
  permissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // Require all permissions vs any permission
}

export function PermissionGate({
  userRole,
  module,
  action,
  permissions = [],
  children,
  fallback,
  requireAll = false
}: PermissionGateProps) {
  
  // Check module/action based permission
  const hasModulePermission = module && action 
    ? PermissionService.hasPermission(userRole, module, action)
    : true;

  // Check custom permissions
  const hasCustomPermissions = permissions.length === 0 || 
    (requireAll 
      ? permissions.every(permission => {
          const [permModule, permAction] = permission.split(':');
          return PermissionService.hasPermission(userRole, permModule, permAction);
        })
      : permissions.some(permission => {
          const [permModule, permAction] = permission.split(':');
          return PermissionService.hasPermission(userRole, permModule, permAction);
        })
    );

  const hasPermission = hasModulePermission && hasCustomPermissions;

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. Contact your administrator for access.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

// Specific permission gates for common use cases
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGate 
      userRole="Admin" 
      children={children} 
      fallback={fallback}
    />
  );
}

export function ManagerOrAdmin({ 
  userRole, 
  children, 
  fallback 
}: { 
  userRole: Role; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const hasPermission = userRole === 'Admin' || userRole === 'Manager';
  
  if (!hasPermission) {
    return fallback ? <>{fallback}</> : (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Manager or Admin access required.
        </AlertDescription>
      </Alert>
    );
  }
  
  return <>{children}</>;
}

export function ViewOnlyWrapper({ 
  userRole, 
  children, 
  viewOnlyChildren 
}: { 
  userRole: Role; 
  children: React.ReactNode; 
  viewOnlyChildren?: React.ReactNode;
}) {
  const isViewOnly = PermissionService.isViewOnlyRole(userRole);
  
  if (isViewOnly && viewOnlyChildren) {
    return <>{viewOnlyChildren}</>;
  }
  
  return <>{children}</>;
}

// Higher-order component for permission-based rendering
export function withPermissions<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermissions: {
    userRole: Role;
    module?: string;
    action?: string;
    permissions?: string[];
  }
) {
  return function PermissionWrappedComponent(props: T) {
    return (
      <PermissionGate {...requiredPermissions}>
        <Component {...props} />
      </PermissionGate>
    );
  };
}

export default PermissionGate;