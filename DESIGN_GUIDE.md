# Guía de Diseño - StudyApp

## 🎨 Sistema de Temas

La aplicación soporta **modo claro y oscuro** con transición automática.

### Configuración

- **Provider**: `ThemeProvider` de `next-themes`
- **Persistencia**: LocalStorage automático
- **Detección**: Sistema operativo por defecto
- **Toggle**: Componente `ThemeToggle` en navbar

### Variables CSS

Todas las variables de color están definidas en `app/globals.css`:

#### Modo Claro
```css
--background: oklch(1 0 0)           /* Blanco */
--foreground: oklch(0.141 0.005 285.823)  /* Negro */
--card: oklch(1 0 0)                 /* Blanco */
--primary: oklch(0.21 0.006 285.885) /* Azul oscuro */
```

#### Modo Oscuro
```css
--background: oklch(0.141 0.005 285.823)  /* Negro */
--foreground: oklch(0.985 0 0)            /* Blanco */
--card: oklch(0.21 0.006 285.885)         /* Gris oscuro */
--primary: oklch(0.92 0.004 286.32)       /* Azul claro */
```

## 🎯 Paleta de Colores

### Colores Principales

| Uso | Clase Tailwind | Variable CSS |
|-----|---------------|--------------|
| Fondo principal | `bg-background` | `--background` |
| Texto principal | `text-foreground` | `--foreground` |
| Cards/Superficies | `bg-card` | `--card` |
| Texto en cards | `text-card-foreground` | `--card-foreground` |
| Color primario | `bg-primary` | `--primary` |
| Texto en primario | `text-primary-foreground` | `--primary-foreground` |

### Colores Semánticos

| Uso | Clase | Descripción |
|-----|-------|-------------|
| Éxito | `text-green-600 dark:text-green-400` | Respuestas correctas |
| Error | `text-red-600 dark:text-red-400` | Respuestas incorrectas |
| Advertencia | `text-yellow-600 dark:text-yellow-400` | Alertas |
| Info | `text-blue-600 dark:text-blue-400` | Información |

### Colores por Tema

Para los 7 temas de estudio, usar estos colores:

```typescript
const topicColors = {
  'Ingeniería de Software': 'blue',
  'Bases de Datos': 'green',
  'Redes': 'purple',
  'Seguridad Informática': 'red',
  'Arquitectura de Computadoras': 'orange',
  'Gestión de Proyectos': 'yellow',
  'Inteligencia Artificial': 'pink',
};
```

## 📐 Espaciado y Tamaños

### Contenedores
```tsx
<div className="container mx-auto px-4 py-8">
  {/* Contenido */}
</div>
```

### Cards
```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Contenido */}
  </CardContent>
</Card>
```

### Grids Responsive
```tsx
{/* 1 columna en móvil, 2 en tablet, 3 en desktop */}
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id}>...</Card>)}
</div>
```

## 🔘 Componentes UI

### Botones

```tsx
{/* Variantes */}
<Button variant="default">Primario</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructivo</Button>

{/* Tamaños */}
<Button size="sm">Pequeño</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grande</Button>
<Button size="icon">Icono</Button>
```

### Inputs

```tsx
<div className="space-y-2">
  <label htmlFor="field" className="text-sm font-medium">
    Label
  </label>
  <Input
    id="field"
    type="text"
    placeholder="Placeholder"
  />
</div>
```

## 🎭 Iconos

Usar **Lucide React** para todos los iconos:

```tsx
import { BookOpen, BarChart3, Library, User, LogOut } from 'lucide-react';

<BookOpen className="h-4 w-4" />  {/* Pequeño */}
<BookOpen className="h-5 w-5" />  {/* Mediano */}
<BookOpen className="h-6 w-6" />  {/* Grande */}
```

### Iconos Comunes

| Uso | Icono |
|-----|-------|
| Dashboard | `BarChart3` |
| Temas | `Library` |
| Estudio | `BookOpen` |
| Usuario | `User` |
| Configuración | `Settings` |
| Cerrar sesión | `LogOut` |
| Racha | `Flame` |
| Éxito | `Target` |
| Tiempo | `Clock` |
| Progreso | `TrendingUp` |
| Reproducir | `Play` |
| Pausar | `Pause` |
| Siguiente | `ChevronRight` |
| Anterior | `ChevronLeft` |

## 📱 Responsive Design

### Breakpoints

| Tamaño | Clase | Ancho |
|--------|-------|-------|
| Móvil | (default) | < 768px |
| Tablet | `md:` | ≥ 768px |
| Desktop | `lg:` | ≥ 1024px |
| XL | `xl:` | ≥ 1280px |

### Patrones Comunes

```tsx
{/* Ocultar en móvil */}
<div className="hidden md:block">...</div>

{/* Mostrar solo en móvil */}
<div className="md:hidden">...</div>

{/* Stack en móvil, row en desktop */}
<div className="flex flex-col md:flex-row gap-4">...</div>
```

## 🎨 Animaciones

### Transiciones
```tsx
{/* Hover suave */}
<div className="transition-colors hover:bg-accent">...</div>

{/* Sombra en hover */}
<Card className="hover:shadow-lg transition-shadow">...</Card>

{/* Escala en hover */}
<button className="transition-transform hover:scale-105">...</button>
```

### Loading States
```tsx
{/* Spinner */}
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />

{/* Skeleton */}
<div className="animate-pulse bg-muted rounded h-4 w-full" />
```

## 📝 Tipografía

### Jerarquía

```tsx
<h1 className="text-3xl font-bold">Título Principal</h1>
<h2 className="text-2xl font-bold">Título Secundario</h2>
<h3 className="text-xl font-semibold">Título Terciario</h3>
<p className="text-base">Texto normal</p>
<p className="text-sm text-muted-foreground">Texto secundario</p>
<p className="text-xs text-muted-foreground">Texto pequeño</p>
```

## ✅ Checklist para Nuevos Componentes

Al crear un nuevo componente, asegúrate de:

- [ ] Soporta modo claro y oscuro
- [ ] Usa variables CSS (`bg-background`, `text-foreground`, etc.)
- [ ] Es responsive (móvil, tablet, desktop)
- [ ] Tiene estados de hover/focus/active
- [ ] Incluye estados de loading si aplica
- [ ] Usa iconos de Lucide React
- [ ] Sigue la guía de espaciado
- [ ] Tiene transiciones suaves
- [ ] Es accesible (labels, aria-labels, etc.)

## 🚀 Ejemplo Completo

```tsx
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function ExampleComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Título</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Acción
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

**Última actualización**: 2025-11-10  
**Versión**: 1.0
