'use client';

import { useAuthorization } from '@/lib/hooks/use-authorization';

interface CanProps {
  children: React.ReactNode;
  role?: string | string[];
  permission?: { resource: string; action: string };
  admin?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Componente para renderizar condicionalmente basado en permisos/roles
 * 
 * Ejemplos:
 * <Can role="admin">Contenido solo para admin</Can>
 * <Can permission={{ resource: 'users', action: 'create' }}>Crear usuario</Can>
 * <Can admin>Panel de administración</Can>
 */
export function Can({ children, role, permission, admin = false, fallback = null }: CanProps) {
  const { hasRole, hasPermission, isAdmin } = useAuthorization();

  // Verificar admin
  if (admin && !isAdmin()) {
    return <>{fallback}</>;
  }

  // Verificar rol
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Verificar permiso
  if (permission && !hasPermission(permission.resource, permission.action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
