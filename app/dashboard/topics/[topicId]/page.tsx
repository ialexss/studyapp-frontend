'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TopicCard } from '@/components/topics/topic-card';
import { topicsApi } from '@/lib/api/topics';
import { questionsApi } from '@/lib/api/questions';
import { progressApi } from '@/lib/api/progress';
import type { Topic, Question } from '@/lib/types';
import { ArrowLeft, BookOpen, Brain, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = parseInt(params.topicId as string);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [subtopics, setSubtopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopicData();
  }, [topicId]);

  const loadTopicData = async () => {
    try {
      const [topicData, questionsData, subtopicsData] = await Promise.all([
        topicsApi.getById(topicId),
        questionsApi.getAll(topicId),
        topicsApi.getSubtopics(topicId),
      ]);

      setTopic(topicData);
      setQuestions(questionsData);
      setSubtopics(subtopicsData);

      // Load progress
      try {
        const progressData = await progressApi.getMyProgress(topicId);
        setProgress(progressData);
      } catch (error) {
        // No progress yet
        setProgress([]);
      }
    } catch (error) {
      console.error('Error loading topic:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Tema no encontrado</p>
        <Link href="/dashboard/topics">
          <Button className="mt-4">Volver a Temas</Button>
        </Link>
      </div>
    );
  }

  const masteredQuestions = progress.filter((p) => p.easeFactor >= 2.5).length;
  const dueQuestions = progress.filter((p) => {
    const dueDate = new Date(p.nextReviewDate);
    const today = new Date();
    return dueDate <= today;
  }).length;
  const completionRate = questions.length > 0
    ? Math.round((masteredQuestions / questions.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/topics">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Temas
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{topic.name}</h1>
        <p className="text-muted-foreground mt-2">{topic.description}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <CardDescription>Total Preguntas</CardDescription>
            </div>
            <CardTitle className="text-3xl">{questions.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <CardDescription>Dominadas</CardDescription>
            </div>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">
              {masteredQuestions}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <CardDescription>Pendientes Hoy</CardDescription>
            </div>
            <CardTitle className="text-3xl text-orange-600 dark:text-orange-400">
              {dueQuestions}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <CardDescription>Progreso</CardDescription>
            </div>
            <CardTitle className="text-3xl text-primary">
              {completionRate}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Tu Progreso</CardTitle>
          <CardDescription>
            {masteredQuestions} de {questions.length} preguntas dominadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link href={`/dashboard/study/${topicId}`} className="flex-1">
          <Button className="w-full" size="lg">
            <BookOpen className="h-5 w-5 mr-2" />
            Comenzar Estudio
          </Button>
        </Link>
        {dueQuestions > 0 && (
          <Link href={`/dashboard/study/${topicId}`} className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              <Clock className="h-5 w-5 mr-2" />
              Repasar Pendientes ({dueQuestions})
            </Button>
          </Link>
        )}
      </div>

      {/* Subtopics */}
      {subtopics.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Subtemas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subtopics.map((subtopic) => (
              <TopicCard key={subtopic.id} topic={subtopic} />
            ))}
          </div>
        </div>
      )}

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>Preguntas del Tema</CardTitle>
          <CardDescription>
            {questions.length} preguntas disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {questions.map((question, index) => {
              const questionProgress = progress.find((p) => p.questionId === question.id);
              const isMastered = questionProgress && questionProgress.easeFactor >= 2.5;

              return (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-muted-foreground w-8">
                      #{index + 1}
                    </span>
                    <p className="flex-1">{question.question}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isMastered && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      question.difficulty === 'easy'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : question.difficulty === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Media' : 'Difícil'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
