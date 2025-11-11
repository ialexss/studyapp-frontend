'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flashcard } from '@/components/study/flashcard';
import { SessionSummary } from '@/components/study/session-summary';
import { topicsApi } from '@/lib/api/topics';
import { questionsApi } from '@/lib/api/questions';
import { sessionsApi } from '@/lib/api/sessions';
import type { Topic, Question, StudyMode } from '@/lib/types';
import { BookOpen, Zap, GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = parseInt(params.topicId as string);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedMode, setSelectedMode] = useState<StudyMode | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; wasCorrect: boolean; timeSpent: number }[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopicAndQuestions();
  }, [topicId]);

  const loadTopicAndQuestions = async () => {
    try {
      const [topicData, questionsData] = await Promise.all([
        topicsApi.getById(topicId),
        questionsApi.getAll(topicId),
      ]);
      setTopic(topicData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (mode: StudyMode) => {
    try {
      const session = await sessionsApi.create(topicId, mode);
      setSessionId(session.id);
      setSelectedMode(mode);
      setSessionStartTime(Date.now());
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleAnswer = async (wasCorrect: boolean) => {
    if (!sessionId) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      await sessionsApi.addAnswer(sessionId, {
        questionId: currentQuestion.id,
        wasCorrect,
        timeSpent,
      });

      setAnswers([...answers, {
        questionId: currentQuestion.id,
        wasCorrect,
        timeSpent,
      }]);
    } catch (error) {
      console.error('Error recording answer:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    if (!sessionId) return;

    try {
      await sessionsApi.endSession(sessionId);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const handleRestart = () => {
    setSelectedMode(null);
    setSessionId(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
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
            <p className="text-muted-foreground">
              No hay preguntas disponibles para este tema.
            </p>
            <Link href="/dashboard">
              <Button className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mode Selection
  if (!selectedMode) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{topic.name}</h1>
          <p className="text-muted-foreground">{topic.description}</p>
          <p className="text-sm text-muted-foreground">
            {questions.length} preguntas disponibles
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
                onClick={() => startSession('flashcard' as StudyMode)}>
            <CardHeader>
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-center">Flashcards</CardTitle>
              <CardDescription className="text-center">
                Modo clásico de tarjetas con autoevaluación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Comenzar</Button>
            </CardContent>
          </Card>

          <Link href={`/dashboard/quick-review/${topicId}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-yellow-500">
            <CardHeader>
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-center">Repaso Rápido</CardTitle>
              <CardDescription className="text-center">
                Solo conceptos clave para repasar rápidamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Comenzar</Button>
            </CardContent>
          </Card>
        </Link>

          <Link href={`/dashboard/exam/${topicId}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
              <CardHeader>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-center">Modo Examen</CardTitle>
                <CardDescription className="text-center">
                  Practica como si fuera un examen real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Comenzar</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  // Session Summary
  if (isCompleted) {
    const correctAnswers = answers.filter(a => a.wasCorrect).length;
    const incorrectAnswers = answers.filter(a => !a.wasCorrect).length;
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);

    return (
      <SessionSummary
        totalQuestions={questions.length}
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        duration={duration}
        onRestart={handleRestart}
      />
    );
  }

  // Flashcard Study Mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Salir
        </Button>
        <div className="text-sm text-muted-foreground">
          {topic.name}
        </div>
      </div>

      <Flashcard
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        onNext={handleNext}
        isLast={currentQuestionIndex === questions.length - 1}
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />
    </div>
  );
}
