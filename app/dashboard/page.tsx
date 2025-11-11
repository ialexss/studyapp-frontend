'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { topicsApi } from '@/lib/api/topics';
import { statisticsApi } from '@/lib/api/statistics';
import { progressApi } from '@/lib/api/progress';
import { sessionsApi } from '@/lib/api/sessions';
import type { Topic, Statistics, StudySession, UserStreak } from '@/lib/types';
import { Flame, Target, Clock, TrendingUp, BookOpen, Brain, Calendar, Award, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);
  const [dueToday, setDueToday] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, streakData, topicsData, sessionsData, dueData] = await Promise.all([
        statisticsApi.getOverview(),
        progressApi.getStreak(),
        topicsApi.getAll(),
        sessionsApi.getAll().catch(() => []),
        progressApi.getDueToday().catch(() => []),
      ]);
      
      setStats(statsData);
      setStreak(streakData);
      setTopics(topicsData.slice(0, 6)); // Top 6 topics
      setRecentSessions(sessionsData.slice(0, 5)); // Last 5 sessions
      setDueToday(dueData.length);
    } catch (error) {
      console.error('Error loading dashboard:', error);
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

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return '¡Comienza tu racha hoy!';
    if (streak === 1) return '¡Buen comienzo!';
    if (streak < 7) return '¡Sigue así!';
    if (streak < 30) return '¡Excelente consistencia!';
    return '¡Eres imparable! 🔥';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen de tu progreso y actividad de estudio
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Streak Card */}
        <Card className="border-2 border-orange-200 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
            <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {streak?.currentStreak || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getStreakMessage(streak?.currentStreak || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Récord: {streak?.longestStreak || 0} días
            </p>
          </CardContent>
        </Card>

        {/* Success Rate Card */}
        <Card className="border-2 border-green-200 dark:border-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <Target className="h-5 w-5 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats?.successRate.toFixed(0) || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.totalCorrect || 0} correctas de {stats?.totalReviews || 0}
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 dark:bg-green-400 transition-all"
                style={{ width: `${stats?.successRate || 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Due Today Card */}
        <Card className="border-2 border-blue-200 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes Hoy</CardTitle>
            <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {dueToday}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dueToday > 0 ? 'Preguntas para repasar' : '¡Todo al día!'}
            </p>
            {dueToday > 0 && (
              <Link href="/dashboard/topics">
                <Button variant="link" className="h-auto p-0 mt-2 text-xs">
                  Comenzar repaso →
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Total Progress Card */}
        <Card className="border-2 border-purple-200 dark:border-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Total</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats?.totalMastered || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Preguntas dominadas
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              De {stats?.totalQuestions || 0} totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Tus últimas sesiones de estudio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => {
                  const date = new Date(session.startedAt);
                  const successRate = session.questionsReviewed > 0
                    ? Math.round((session.questionsCorrect / session.questionsReviewed) * 100)
                    : 0;

                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Sesión de {session.mode === 'flashcard' ? 'Flashcards' : session.mode}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {date.toLocaleDateString()} - {session.questionsReviewed} preguntas
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          successRate >= 70 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {successRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.duration ? `${Math.floor(session.duration / 60)}m` : '-'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay sesiones recientes</p>
                <Link href="/dashboard/topics">
                  <Button className="mt-4" size="sm">
                    Comenzar a estudiar
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Rendimiento
            </CardTitle>
            <CardDescription>
              Estadísticas de tu desempeño
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preguntas Revisadas</span>
                <span className="font-semibold">{stats?.totalReviews || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Respuestas Correctas</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats?.totalCorrect || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Respuestas Incorrectas</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {(stats?.totalReviews || 0) - (stats?.totalCorrect || 0)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Nivel de Dominio</span>
                <span className="text-sm font-semibold text-primary">
                  {stats && stats.totalQuestions > 0
                    ? Math.round(((stats.totalMastered || 0) / stats.totalQuestions) * 100)
                    : 0}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${stats && stats.totalQuestions > 0
                      ? ((stats.totalMastered || 0) / stats.totalQuestions) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Temas de Estudio
              </CardTitle>
              <CardDescription>
                Explora los temas disponibles
              </CardDescription>
            </div>
            <Link href="/dashboard/topics">
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <Link key={topic.id} href={`/dashboard/study/${topic.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      {topic.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {topic.description}
                    </p>
                    <Button className="w-full mt-4" size="sm">
                      Estudiar
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/topics">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Explorar Temas</h3>
                <p className="text-sm text-muted-foreground">
                  Navega por todos los temas disponibles
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-yellow-500">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold">Repaso Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Revisa conceptos clave rápidamente
              </p>
              <Link href="/dashboard/topics" className="w-full">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Seleccionar Tema
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Link href="/dashboard/topics">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-500">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold">Repasar Pendientes</h3>
                <p className="text-sm text-muted-foreground">
                  {dueToday} preguntas esperando revisión
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
