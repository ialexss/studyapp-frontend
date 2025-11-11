'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuickCard } from '@/components/quick-review/quick-card';
import { topicsApi } from '@/lib/api/topics';
import { questionsApi } from '@/lib/api/questions';
import type { Topic, Question } from '@/lib/types';
import { ArrowLeft, Zap, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function QuickReviewPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = parseInt(params.topicId as string);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reviewedQuestions, setReviewedQuestions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    loadData();
    setStartTime(Date.now());
  }, [topicId]);

  const loadData = async () => {
    try {
      const [topicData, questionsData] = await Promise.all([
        topicsApi.getById(topicId),
        questionsApi.getAll(topicId),
      ]);

      setTopic(topicData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading quick review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = (questionId: number) => {
    setReviewedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topic || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <Card>
          <CardContent className="pt-6">
            <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              No hay preguntas disponibles para repaso rápido en este tema.
            </p>
            <Link href="/dashboard/topics">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Temas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionRate = questions.length > 0
    ? Math.round((reviewedQuestions.size / questions.length) * 100)
    : 0;
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const estimatedTimeLeft = questions.length > 0
    ? Math.ceil(((questions.length - reviewedQuestions.size) * 30) / 60)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/topics">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Repaso Rápido</h1>
            <p className="text-muted-foreground">{topic.name}</p>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Progreso</CardDescription>
            <CardTitle className="text-2xl">
              {reviewedQuestions.size}/{questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completado</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {completionRate}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Tiempo Transcurrido</CardDescription>
            <CardTitle className="text-2xl">
              {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Tiempo Estimado</CardDescription>
            <CardTitle className="text-2xl">
              ~{estimatedTimeLeft}min
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="border-2 border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            Modo Repaso Rápido
          </CardTitle>
          <CardDescription>
            Revisa rápidamente los conceptos clave de cada pregunta. Toca cada tarjeta para marcarla como revisada.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Questions Grid */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuickCard
            key={question.id}
            question={question}
            index={index}
            isReviewed={reviewedQuestions.has(question.id)}
            onMarkReviewed={() => handleMarkReviewed(question.id)}
          />
        ))}
      </div>

      {/* Completion Actions */}
      {reviewedQuestions.size === questions.length && (
        <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                  ¡Repaso Completado!
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Has revisado todas las {questions.length} preguntas en {Math.floor(elapsedTime / 60)} minutos
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <Button onClick={handleComplete}>
                  Volver al Dashboard
                </Button>
                <Link href={`/dashboard/study/${topicId}`}>
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Estudiar con Flashcards
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Actions */}
      {reviewedQuestions.size < questions.length && (
        <div className="flex justify-between items-center sticky bottom-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
          <div className="text-sm text-muted-foreground">
            {questions.length - reviewedQuestions.size} preguntas restantes
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setReviewedQuestions(new Set())}>
              Reiniciar
            </Button>
            <Button onClick={handleComplete}>
              Finalizar Repaso
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
