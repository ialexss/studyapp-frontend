'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { topicsApi } from '@/lib/api/topics';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { Topic } from '@/lib/types';

interface TopicFormDialogProps {
  topic?: Topic;
  trigger: React.ReactNode;
  onSuccess: () => void;
}

export function TopicFormDialog({ topic, trigger, onSuccess }: TopicFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: topic?.name || '',
    description: topic?.description || '',
    icon: topic?.icon || '',
    color: topic?.color || '',
    isPublic: topic?.isPublic || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (topic) {
        await topicsApi.update(topic.id, formData);
      } else {
        await topicsApi.create(formData);
      }
      
      setOpen(false);
      onSuccess();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        icon: '',
        color: '',
        isPublic: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el tema');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{topic ? 'Editar Tema' : 'Crear Nuevo Tema'}</DialogTitle>
          <DialogDescription>
            {topic ? 'Modifica los datos del tema' : 'Completa los datos para crear un nuevo tema'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Tema *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Ingeniería de Software"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe brevemente el tema..."
              className="min-h-[100px]"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icono (opcional)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                placeholder="BookOpen"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Nombre del icono de Lucide
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color (opcional)</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="blue"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Ej: blue, red, green
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic">Tema Público</Label>
              <p className="text-xs text-muted-foreground">
                Permitir que otros usuarios vean este tema
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked: boolean) => handleChange('isPublic', checked)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                topic ? 'Actualizar' : 'Crear Tema'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
