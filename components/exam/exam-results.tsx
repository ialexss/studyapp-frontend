'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Clock, TrendingUp, CheckCircle2, XCircle, Award } from 'lucide-react';
import Link from 'next/link';
import type { Question } from '@/lib/types';

interface ExamAnswer {
  questionId: number;
  userAnswer: string;
  wasCorrect: boolean;
}

interface ExamResultsProps {
  questions: Question[];
  answers: ExamAnswer[];
  duration: number;
  topicId: number;
  onReview: () => void;
  onRetry: () => void;
}

export function ExamResults({
  questions,
  answers,
  duration,
  topicId,
  onReview,
  onRetry,
}: ExamResultsProps) {
  const correctAnswers = answers.filter(a => a.wasCorrect).length;
  const incorrectAnswers = answers.filter(a => !a.wasCorrect).length;
  const score = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600 dark:text-green-400', message: '¡Excelente!' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600 dark:text-blue-400', message: '¡Muy bien!' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400', message: 'Buen trabajo' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-600 dark:text-orange-400', message: 'Puedes mejorar' };
    return { grade: 'F', color: 'text-red-600 dark:text-red-400', message: 'Necesitas estudiar más' };
  };

  const gradeInfo = getGrade(score);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Score Card */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Trophy className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="text-4xl mb-2">Examen Completado</CardTitle>
          <p className={`text-3xl font-bold ${gradeInfo.color}`}>
            Calificación: {gradeInfo.grade}
          </p>
          <p className="text-lg text-muted-foreground mt-1">{gradeInfo.message}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{score}%</div>
              <div className="text-xs text-muted-foreground mt-1">Puntuación</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</div>
              <div className="text-xs text-muted-foreground mt-1">Correctas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{incorrectAnswers}</div>
              <div className="text-xs text-muted-foreground mt-1">Incorrectas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold">{formatDuration(duration)}</div>
              <div className="text-xs text-muted-foreground mt-1">Tiempo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Precisión</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasa de Acierto</span>
                <span className="font-semibold">{score}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-base">Tiempo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Promedio por pregunta</span>
                <span className="font-semibold">
                  {questions.length > 0 ? Math.round(duration / questions.length) : 0}s
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">{formatDuration(duration)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <CardTitle className="text-base">Rendimiento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nivel</span>
                <span className={`font-semibold ${gradeInfo.color}`}>{gradeInfo.grade}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estado</span>
                <span className="font-semibold">
                  {score >= 70 ? 'Aprobado' : 'Reprobado'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question by Question Results */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados por Pregunta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              return (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-muted-foreground w-8">
                      #{index + 1}
                    </span>
                    <p className="flex-1 text-sm line-clamp-1">{question.question}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {answer?.wasCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onReview} variant="outline" className="flex-1">
          <TrendingUp className="h-4 w-4 mr-2" />
          Revisar Respuestas
        </Button>
        <Button onClick={onRetry} variant="outline" className="flex-1">
          Intentar de Nuevo
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
