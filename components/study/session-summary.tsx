'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface SessionSummaryProps {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  duration: number;
  onRestart?: () => void;
}

export function SessionSummary({
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  duration,
  onRestart,
}: SessionSummaryProps) {
  const successRate = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = (rate: number) => {
    if (rate >= 90) return { text: '¡Excelente trabajo!', color: 'text-green-600 dark:text-green-400' };
    if (rate >= 70) return { text: '¡Buen trabajo!', color: 'text-blue-600 dark:text-blue-400' };
    if (rate >= 50) return { text: 'Sigue practicando', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Necesitas más práctica', color: 'text-red-600 dark:text-red-400' };
  };

  const performance = getPerformanceMessage(successRate);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">¡Sesión Completada!</CardTitle>
          <p className={`text-xl font-semibold ${performance.color}`}>
            {performance.text}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {successRate}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Tasa de Éxito
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {correctAnswers}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Correctas
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {incorrectAnswers}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                A Repasar
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {formatDuration(duration)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Tiempo Total
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium">Preguntas Entendidas</span>
              </div>
              <span className="font-bold text-green-600 dark:text-green-400">
                {correctAnswers}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="font-medium">Preguntas para Repasar</span>
              </div>
              <span className="font-bold text-red-600 dark:text-red-400">
                {incorrectAnswers}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">Tiempo Promedio</span>
              </div>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {totalQuestions > 0 ? Math.round(duration / totalQuestions) : 0}s
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Volver al Dashboard
              </Button>
            </Link>
            {onRestart && (
              <Button onClick={onRestart} className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                Estudiar de Nuevo
              </Button>
            )}
          </div>

          {/* Tip */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>
              💡 Las preguntas que necesitas repasar aparecerán más frecuentemente
              según el algoritmo de repetición espaciada
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
