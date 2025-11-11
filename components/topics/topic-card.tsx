'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Topic } from '@/lib/types';

interface TopicCardProps {
  topic: Topic;
  hasSubtopics?: boolean;
  progress?: {
    totalQuestions: number;
    masteredQuestions: number;
    dueToday: number;
  };
}

export function TopicCard({ topic, hasSubtopics = false, progress }: TopicCardProps) {
  const completionRate = progress
    ? Math.round((progress.masteredQuestions / progress.totalQuestions) * 100)
    : 0;

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 50) return 'text-blue-600 dark:text-blue-400';
    if (rate >= 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {topic.name}
            </CardTitle>
            <CardDescription className="mt-2">
              {topic.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Stats */}
        {progress && (
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className={`font-semibold ${getProgressColor(completionRate)}`}>
                  {completionRate}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-muted-foreground">
                  {progress.masteredQuestions}/{progress.totalQuestions} dominadas
                </span>
              </div>
              {progress.dueToday > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-muted-foreground">
                    {progress.dueToday} pendientes
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/dashboard/study/${topic.id}`} className="flex-1">
            <Button className="w-full">
              Estudiar
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          {hasSubtopics && (
            <Link href={`/dashboard/topics/${topic.id}`}>
              <Button variant="outline">
                Ver Detalles
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
