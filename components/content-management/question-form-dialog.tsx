'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { questionsApi } from '@/lib/api/questions';
import { topicsApi } from '@/lib/api/topics';
import { AlertCircle, Loader2, Plus, X } from 'lucide-react';
import type { Question, Topic, QuestionDifficulty } from '@/lib/types';

interface QuestionFormDialogProps {
  question?: Question;
  trigger: React.ReactNode;
  onSuccess: () => void;
}

export function QuestionFormDialog({ question, trigger, onSuccess }: QuestionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  
  const [formData, setFormData] = useState({
    topicId: question?.topicId || 0,
    question: question?.question || '',
    answer: question?.answer || '',
    keyPoints: question?.keyPoints || [],
    difficulty: question?.difficulty || 'medium' as QuestionDifficulty,
    tags: question?.tags || [],
  });

  const [keyPointInput, setKeyPointInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (open) {
      loadTopics();
    }
  }, [open]);

  const loadTopics = async () => {
    try {
      const myTopics = await topicsApi.getMyTopics();
      setTopics(myTopics);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.topicId) {
      setError('Debes seleccionar un tema');
      return;
    }

    setLoading(true);

    try {
      if (question) {
        await questionsApi.update(question.id, formData);
      } else {
        await questionsApi.create(formData);
      }
      
      setOpen(false);
      onSuccess();
      
      // Reset form
      setFormData({
        topicId: 0,
        question: '',
        answer: '',
        keyPoints: [],
        difficulty: 'medium' as QuestionDifficulty,
        tags: [],
      });
      setKeyPointInput('');
      setTagInput('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la pregunta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addKeyPoint = () => {
    if (keyPointInput.trim()) {
      setFormData({
        ...formData,
        keyPoints: [...formData.keyPoints, keyPointInput.trim()],
      });
      setKeyPointInput('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setFormData({
      ...formData,
      keyPoints: formData.keyPoints.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}</DialogTitle>
          <DialogDescription>
            {question ? 'Modifica los datos de la pregunta' : 'Completa los datos para crear una nueva pregunta'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!question && (
            <div className="space-y-2">
              <Label htmlFor="topicId">Tema *</Label>
              <Select
                value={formData.topicId.toString()}
                onValueChange={(value: string) => handleChange('topicId', parseInt(value))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tema" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="question">Pregunta *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => handleChange('question', e.target.value)}
              placeholder="¿Cuál es tu pregunta?"
              className="min-h-[80px]"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Respuesta *</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              placeholder="Escribe la respuesta completa..."
              className="min-h-[120px]"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Dificultad</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value: string) => handleChange('difficulty', value as QuestionDifficulty)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Puntos Clave (opcional)</Label>
            <div className="flex gap-2">
              <Input
                value={keyPointInput}
                onChange={(e) => setKeyPointInput(e.target.value)}
                placeholder="Agregar punto clave"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyPoint())}
                disabled={loading}
              />
              <Button type="button" onClick={addKeyPoint} disabled={loading} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.keyPoints.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
                  >
                    <span>{point}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyPoint(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Etiquetas (opcional)</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Agregar etiqueta"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                disabled={loading}
              />
              <Button type="button" onClick={addTag} disabled={loading} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                question ? 'Actualizar' : 'Crear Pregunta'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
