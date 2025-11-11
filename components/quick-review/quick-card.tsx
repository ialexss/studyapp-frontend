'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import type { Question } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuickCardProps {
  question: Question;
  index: number;
  isReviewed: boolean;
  onMarkReviewed: () => void;
}

export function QuickCard({ question, index, isReviewed, onMarkReviewed }: QuickCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Media';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 cursor-pointer',
        isReviewed 
          ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' 
          : 'hover:shadow-md'
      )}
      onClick={onMarkReviewed}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-muted-foreground">
                #{index + 1}
              </span>
              <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getDifficultyColor(question.difficulty))}>
                {getDifficultyLabel(question.difficulty)}
              </span>
              {question.tags && question.tags.length > 0 && (
                <span className="text-xs px-2 py-1 rounded-full bg-muted">
                  {question.tags[0]}
                </span>
              )}
            </div>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </div>
          {isReviewed && (
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Answer */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm leading-relaxed">{question.answer}</p>
        </div>

        {/* Key Points */}
        {question.keyPoints && question.keyPoints.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Lightbulb className="h-4 w-4" />
              <span>Puntos Clave</span>
            </div>
            <ul className="space-y-1.5">
              {question.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Review Hint */}
        {!isReviewed && (
          <p className="text-xs text-center text-muted-foreground pt-2 border-t">
            Toca para marcar como revisado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
