'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authApi } from '@/lib/api/auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { Can } from '@/components/auth/can';
import { BookOpen, BarChart3, Library, LogOut, User, Shield } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    authApi.logout();
    clearAuth();
    router.push('/login');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="h-6 w-6 text-primary" />
              <span>StudyApp</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/topics">
                <Button variant="ghost" size="sm">
                  <Library className="h-4 w-4 mr-2" />
                  Temas
                </Button>
              </Link>
              <Link href="/dashboard/my-content">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Mi Contenido
                </Button>
              </Link>
              <Can admin>
                <Link href="/dashboard/admin/users">
                  <Button variant="ghost" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Usuarios
                  </Button>
                </Link>
              </Can>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-sm mr-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{user?.firstName} {user?.lastName}</span>
            </div>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
