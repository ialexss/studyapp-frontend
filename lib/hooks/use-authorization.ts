import { useAuthStore } from '@/lib/stores/auth-store';
import type { User, Permission } from '@/lib/types';

export interface AuthorizationHook {
  // Verificar roles
  hasRole: (roleName: string | string[]) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  hasAllRoles: (roleNames: string[]) => boolean;
  
  // Verificar permisos
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (permissions: Array<{ resource: string; action: string }>) => boolean;
  hasAllPermissions: (permissions: Array<{ resource: string; action: string }>) => boolean;
  
  // Verificar por nombre de permiso
  hasPermissionByName: (permissionName: string | string[]) => boolean;
  
  // Verificar si es admin
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  
  // Obtener información
  getUserRoles: () => string[];
  getUserPermissions: () => Permission[];
  
  // Usuario actual
  user: User | null;
}

export function useAuthorization(): AuthorizationHook {
  const user = useAuthStore((state) => state.user);

  // Verificar si tiene un rol específico
  const hasRole = (roleName: string | string[]): boolean => {
    if (!user || !user.roles) return false;
    
    const roleNames = Array.isArray(roleName) ? roleName : [roleName];
    return user.roles.some(role => roleNames.includes(role.name));
  };

  // Verificar si tiene al menos uno de los roles
  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => roleNames.includes(role.name));
  };

  // Verificar si tiene todos los roles
  const hasAllRoles = (roleNames: string[]): boolean => {
    if (!user || !user.roles) return false;
    return roleNames.every(roleName => 
      user.roles.some(role => role.name === roleName)
    );
  };

  // Verificar si tiene un permiso específico (por recurso y acción)
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    // Obtener permisos desde user.permissions o desde roles
    const permissions = user.permissions || 
      user.roles?.flatMap(role => role.permissions || []) || [];
    
    return permissions.some(
      permission => 
        permission.resource === resource && 
        permission.action === action
    );
  };

  // Verificar si tiene al menos uno de los permisos
  const hasAnyPermission = (
    permissions: Array<{ resource: string; action: string }>
  ): boolean => {
    return permissions.some(({ resource, action }) => 
      hasPermission(resource, action)
    );
  };

  // Verificar si tiene todos los permisos
  const hasAllPermissions = (
    permissions: Array<{ resource: string; action: string }>
  ): boolean => {
    return permissions.every(({ resource, action }) => 
      hasPermission(resource, action)
    );
  };

  // Verificar permiso por nombre
  const hasPermissionByName = (permissionName: string | string[]): boolean => {
    if (!user) return false;
    
    const permissions = user.permissions || 
      user.roles?.flatMap(role => role.permissions || []) || [];
    
    const names = Array.isArray(permissionName) ? permissionName : [permissionName];
    return permissions.some(permission => names.includes(permission.name));
  };

  // Verificar si es admin
  const isAdmin = (): boolean => {
    return hasRole(['admin', 'superadmin']);
  };

  // Verificar si es superadmin
  const isSuperAdmin = (): boolean => {
    return hasRole('superadmin');
  };

  // Obtener nombres de roles del usuario
  const getUserRoles = (): string[] => {
    if (!user || !user.roles) return [];
    return user.roles.map(role => role.name);
  };

  // Obtener todos los permisos del usuario
  const getUserPermissions = (): Permission[] => {
    if (!user) return [];
    
    return user.permissions || 
      user.roles?.flatMap(role => role.permissions || []) || [];
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionByName,
    isAdmin,
    isSuperAdmin,
    getUserRoles,
    getUserPermissions,
    user,
  };
}
