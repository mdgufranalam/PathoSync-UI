import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PermissionGateProps {
  children: ReactNode;
  module: string;
  action: string;
  fallback?: ReactNode;
}

export function PermissionGate({ children, module, action, fallback = null }: PermissionGateProps) {
  const { hasPermission } = useAuth();

  if (hasPermission(module, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
