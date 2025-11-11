'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkUploadCSV } from '@/components/content-management/bulk-upload-csv';
import { TopicFormDialog } from '@/components/content-management/topic-form-dialog';
import { QuestionFormDialog } from '@/components/content-management/question-form-dialog';
import { topicsApi } from '@/lib/api/topics';
import { questionsApi } from '@/lib/api/questions';
import type { Topic, Question } from '@/lib/types';
import { Plus, BookOpen, FileQuestion, Pencil, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function MyContentPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [topicsData, questionsData] = await Promise.all([
        topicsApi.getMyTopics(),
        questionsApi.getMyQuestions(),
      ]);
      setTopics(topicsData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este tema?')) return;
    
    try {
      await topicsApi.delete(id);
      setTopics(topics.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Error al eliminar el tema');
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;
    
    try {
      await questionsApi.delete(id);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error al eliminar la pregunta');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mi Contenido</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tus temas y preguntas personalizados
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="topics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="topics">
            <BookOpen className="h-4 w-4 mr-2" />
            Mis Temas ({topics.length})
          </TabsTrigger>
          <TabsTrigger value="questions">
            <FileQuestion className="h-4 w-4 mr-2" />
            Mis Preguntas ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <Upload className="h-4 w-4 mr-2" />
            Carga Masiva
          </TabsTrigger>
        </TabsList>

        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-4">
          <div className="flex justify-end">
            <TopicFormDialog
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Tema
                </Button>
              }
              onSuccess={loadData}
            />
          </div>

          {topics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">
                  No tienes temas personalizados aún
                </p>
                <TopicFormDialog
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear tu primer tema
                    </Button>
                  }
                  onSuccess={loadData}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <Card key={topic.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <TopicFormDialog
                        topic={topic}
                        trigger={
                          <Button variant="outline" size="sm" className="flex-1">
                            <Pencil className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        }
                        onSuccess={loadData}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTopic(topic.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-end">
            <QuestionFormDialog
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Pregunta
                </Button>
              }
              onSuccess={loadData}
            />
          </div>

          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileQuestion className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">
                  No tienes preguntas personalizadas aún
                </p>
                <QuestionFormDialog
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear tu primera pregunta
                    </Button>
                  }
                  onSuccess={loadData}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {questions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.question}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {question.answer}
                        </p>
                        <div className="flex gap-2 mt-3">
                          {question.tags?.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full bg-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <QuestionFormDialog
                          question={question}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          }
                          onSuccess={loadData}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Bulk Upload Tab */}
        <TabsContent value="bulk" className="space-y-4">
          <div className="max-w-2xl mx-auto">
            {topics.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    Primero debes crear un tema para poder cargar preguntas
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Tema
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Seleccionar Tema</CardTitle>
                    <CardDescription>
                      Elige el tema donde se cargarán las preguntas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopic(topic.id)}
                          className={`p-4 text-left rounded-lg border-2 transition-colors ${
                            selectedTopic === topic.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-medium">{topic.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {topic.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedTopic && (
                  <BulkUploadCSV
                    topicId={selectedTopic}
                    onSuccess={() => {
                      loadData();
                      setSelectedTopic(null);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
