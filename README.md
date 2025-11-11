# 🎨 StudyApp Frontend - Aplicación Web

Frontend del sistema StudyApp construido con Next.js 16, TypeScript, Tailwind CSS y shadcn/ui.

## 🔗 Repositorios Relacionados

- **🔧 Backend**: [StudyApp Backend](https://github.com/ialexss/studyapp-backend) - API REST con NestJS

> **Nota**: Este es el repositorio del frontend. Para ejecutar la aplicación completa, necesitas también el backend corriendo.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes](#componentes)
- [Rutas](#rutas)
- [Estado Global](#estado-global)
- [Hooks Personalizados](#hooks-personalizados)
- [Estilos](#estilos)

## ✨ Características

- ✅ **Next.js 16** con App Router
- ✅ **TypeScript** para tipado estático
- ✅ **Tailwind CSS** para estilos
- ✅ **shadcn/ui** componentes accesibles
- ✅ **Radix UI** primitivas de UI
- ✅ **Zustand** para estado global
- ✅ **Axios** cliente HTTP
- ✅ **Sistema de autorización** basado en roles
- ✅ **Tema claro/oscuro** con next-themes
- ✅ **Responsive design**
- ✅ **Carga masiva CSV**
- ✅ **Formularios dinámicos**

## 📦 Requisitos

- Node.js >= 18.x
- npm >= 9.x
- Backend API corriendo en `http://localhost:3000`

## 🚀 Instalación

```bash
# Instalar dependencias
npm install
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

### Build para Producción

```bash
# Compilar
npm run build

# Ejecutar
npm run start
```

### Otros Comandos

```bash
npm run lint          # Ejecutar linter
npm run type-check    # Verificar tipos TypeScript
```

## 📁 Estructura del Proyecto

```
front-studyapp/
├── app/                          # Rutas de la aplicación (App Router)
│   ├── (auth)/                  # Grupo de rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/               # Dashboard principal
│   │   ├── topics/             # Vista de temas
│   │   ├── study/[topicId]/    # Modo estudio
│   │   ├── exam/[topicId]/     # Modo examen
│   │   ├── quick-review/[topicId]/  # Repaso rápido
│   │   ├── my-content/         # Gestión de contenido
│   │   └── admin/              # Panel de administración
│   │       └── users/          # Gestión de usuarios
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página de inicio
│   └── globals.css             # Estilos globales
│
├── components/                  # Componentes reutilizables
│   ├── auth/                   # Componentes de autorización
│   │   ├── protected-route.tsx # Protección de rutas
│   │   └── can.tsx             # Renderizado condicional
│   ├── content-management/     # Gestión de contenido
│   │   ├── topic-form-dialog.tsx
│   │   ├── question-form-dialog.tsx
│   │   └── bulk-upload-csv.tsx
│   ├── layout/                 # Componentes de layout
│   │   └── navbar.tsx
│   ├── quick-review/           # Componentes de repaso
│   │   └── quick-card.tsx
│   ├── ui/                     # Componentes UI (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   └── theme-toggle.tsx        # Toggle de tema
│
├── lib/                         # Utilidades y configuración
│   ├── api/                    # Clientes API
│   │   ├── client.ts           # Cliente Axios configurado
│   │   ├── auth.ts             # API de autenticación
│   │   ├── topics.ts           # API de temas
│   │   ├── questions.ts        # API de preguntas
│   │   └── users.ts            # API de usuarios
│   ├── hooks/                  # Custom hooks
│   │   └── use-authorization.ts # Hook de autorización
│   ├── stores/                 # Estado global (Zustand)
│   │   └── auth-store.ts       # Store de autenticación
│   ├── types/                  # Tipos TypeScript
│   │   └── index.ts
│   └── utils.ts                # Utilidades
│
├── public/                      # Archivos estáticos
├── .env.local                   # Variables de entorno
├── next.config.js              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias
```

## 🧩 Componentes Principales

### Autenticación

#### ProtectedRoute
Protege rutas completas basado en roles/permisos:

```tsx
<ProtectedRoute requireAdmin>
  <AdminPanel />
</ProtectedRoute>

<ProtectedRoute requireRole="moderator">
  <ModeratorPanel />
</ProtectedRoute>

<ProtectedRoute requirePermission={{ resource: 'users', action: 'create' }}>
  <CreateUserForm />
</ProtectedRoute>
```

#### Can
Renderizado condicional basado en permisos:

```tsx
<Can admin>
  <AdminButton />
</Can>

<Can role="moderator">
  <ModeratorTools />
</Can>

<Can permission={{ resource: 'users', action: 'delete' }}>
  <DeleteButton />
</Can>
```

### Gestión de Contenido

#### TopicFormDialog
Formulario modal para crear/editar temas:

```tsx
<TopicFormDialog
  trigger={<Button>Crear Tema</Button>}
  topic={existingTopic}  // Opcional para edición
  onSuccess={() => loadTopics()}
/>
```

#### QuestionFormDialog
Formulario modal para crear/editar preguntas:

```tsx
<QuestionFormDialog
  trigger={<Button>Crear Pregunta</Button>}
  question={existingQuestion}  // Opcional
  onSuccess={() => loadQuestions()}
/>
```

#### BulkUploadCSV
Componente para carga masiva de preguntas:

```tsx
<BulkUploadCSV onSuccess={() => loadQuestions()} />
```

### UI Components (shadcn/ui)

Todos los componentes UI están en `components/ui/` y siguen el patrón de shadcn/ui:

- `Button` - Botones con variantes
- `Card` - Tarjetas de contenido
- `Dialog` - Modales
- `Input` - Campos de texto
- `Select` - Selectores
- `Switch` - Toggles
- `Tabs` - Pestañas
- `Textarea` - Áreas de texto
- Y más...

## 🛣️ Rutas

### Públicas

- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro

### Protegidas (Requieren autenticación)

- `/dashboard` - Dashboard principal
- `/dashboard/topics` - Lista de temas
- `/dashboard/topics/[id]` - Detalle de tema
- `/dashboard/study/[topicId]` - Modo estudio
- `/dashboard/exam/[topicId]` - Modo examen
- `/dashboard/quick-review/[topicId]` - Repaso rápido
- `/dashboard/my-content` - Gestión de contenido personal

### Admin (Solo administradores)

- `/dashboard/admin/users` - Gestión de usuarios

## 🔄 Estado Global

### Auth Store (Zustand)

```typescript
import { useAuthStore } from '@/lib/stores/auth-store';

function MyComponent() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  
  // Usar estado
  if (isAuthenticated) {
    console.log('Usuario:', user);
  }
}
```

**Persistencia**: El estado se guarda en `localStorage` automáticamente.

## 🪝 Hooks Personalizados

### useAuthorization

Hook principal para verificar permisos y roles:

```typescript
import { useAuthorization } from '@/lib/hooks/use-authorization';

function MyComponent() {
  const {
    hasRole,
    hasPermission,
    isAdmin,
    getUserRoles,
    user
  } = useAuthorization();
  
  if (isAdmin()) {
    // Usuario es admin
  }
  
  if (hasRole('moderator')) {
    // Usuario es moderador
  }
  
  if (hasPermission('users', 'create')) {
    // Usuario puede crear usuarios
  }
}
```

**Métodos disponibles**:

- `hasRole(role)` - Verifica un rol
- `hasAnyRole(roles)` - Verifica al menos un rol
- `hasAllRoles(roles)` - Verifica todos los roles
- `hasPermission(resource, action)` - Verifica permiso específico
- `hasAnyPermission(permissions)` - Al menos un permiso
- `hasAllPermissions(permissions)` - Todos los permisos
- `isAdmin()` - Es admin o superadmin
- `isSuperAdmin()` - Es superadmin
- `getUserRoles()` - Obtiene roles del usuario
- `getUserPermissions()` - Obtiene permisos del usuario

## 🎨 Estilos

### Tailwind CSS

Todos los estilos usan Tailwind CSS. Configuración en `tailwind.config.ts`.

### Tema Claro/Oscuro

Implementado con `next-themes`:

```tsx
import { ThemeToggle } from '@/components/theme-toggle';

<ThemeToggle />
```

### Variables CSS

Definidas en `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}
```

## 📡 API Client

### Configuración

El cliente Axios está configurado en `lib/api/client.ts`:

```typescript
import { apiClient } from '@/lib/api/client';

// El token se agrega automáticamente
const response = await apiClient.get('/users');
```

### APIs Disponibles

```typescript
import { authApi } from '@/lib/api/auth';
import { topicsApi } from '@/lib/api/topics';
import { questionsApi } from '@/lib/api/questions';
import { usersApi } from '@/lib/api/users';

// Ejemplo
const topics = await topicsApi.getAll();
const myTopics = await topicsApi.getMyTopics();
```

## 🔐 Seguridad

- ✅ Tokens JWT en localStorage
- ✅ Interceptores para agregar token automáticamente
- ✅ Protección de rutas en frontend
- ✅ Validación de permisos en componentes
- ✅ Redirección automática si no autenticado

## 📱 Responsive Design

La aplicación es completamente responsive:

- Mobile first
- Breakpoints de Tailwind: `sm`, `md`, `lg`, `xl`, `2xl`
- Navegación adaptativa
- Componentes optimizados para móvil

## 🧪 Testing

```bash
# Tests (cuando estén configurados)
npm run test
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recomendado)

1. Push a GitHub
2. Importar en Vercel
3. Configurar variables de entorno
4. Deploy automático

### Otras Plataformas

```bash
npm run build
npm run start
```

## 🐛 Troubleshooting

### Error de conexión al backend

```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000

# Verificar NEXT_PUBLIC_API_URL en .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Problemas con tipos TypeScript

```bash
npm run type-check
```

### Problemas con estilos

```bash
# Limpiar cache de Next.js
rm -rf .next
npm run dev
```

## 📝 Convenciones de Código

- Usar TypeScript para todo
- Componentes en PascalCase
- Archivos en kebab-case
- Hooks empiezan con `use`
- Tipos en `lib/types/index.ts`
- Componentes de UI en `components/ui/`

## 🤝 Contribuir

1. Crear rama feature
2. Implementar cambios
3. Verificar tipos y lint
4. Crear PR

---

Desarrollado con Next.js ❤️
