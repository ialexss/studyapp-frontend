'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthorization } from '@/lib/hooks/use-authorization';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string | string[];
  requirePermission?: { resource: string; action: string };
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireRole,
  requirePermission,
  requireAdmin = false,
  fallback,
  redirectTo = '/dashboard',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { hasRole, hasPermission, isAdmin, user } = useAuthorization();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Verificar si requiere admin
    if (requireAdmin && !isAdmin()) {
      router.push(redirectTo);
      return;
    }

    // Verificar rol requerido
    if (requireRole && !hasRole(requireRole)) {
      router.push(redirectTo);
      return;
    }

    // Verificar permiso requerido
    if (requirePermission && !hasPermission(requirePermission.resource, requirePermission.action)) {
      router.push(redirectTo);
      return;
    }
  }, [user, requireRole, requirePermission, requireAdmin, router, redirectTo, hasRole, hasPermission, isAdmin]);

  // Si no está autenticado
  if (!user) {
    return fallback || null;
  }

  // Si requiere admin y no lo es
  if (requireAdmin && !isAdmin()) {
    return fallback || null;
  }

  // Si requiere rol y no lo tiene
  if (requireRole && !hasRole(requireRole)) {
    return fallback || null;
  }

  // Si requiere permiso y no lo tiene
  if (requirePermission && !hasPermission(requirePermission.resource, requirePermission.action)) {
    return fallback || null;
  }

  return <>{children}</>;
}
