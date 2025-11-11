'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, ChevronRight, AlertCircle } from 'lucide-react';
import type { Question } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ExamQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onNext: () => void;
  isLast: boolean;
  showResults?: boolean;
  isCorrect?: boolean;
}

export function ExamQuestion({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  onNext,
  isLast,
  showResults = false,
  isCorrect,
}: ExamQuestionProps) {
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleNext = () => {
    if (userAnswer.trim()) {
      setHasAnswered(true);
      onNext();
    }
  };

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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pregunta {questionNumber} de {totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 dark:bg-purple-400 transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className={cn(
        'border-2',
        showResults && isCorrect && 'border-green-500 dark:border-green-700',
        showResults && !isCorrect && 'border-red-500 dark:border-red-700'
      )}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getDifficultyColor(question.difficulty))}>
                  {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Media' : 'Difícil'}
                </span>
                {question.tags && question.tags.length > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {question.tags[0]}
                  </span>
                )}
              </div>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </div>
            {showResults && (
              <div>
                {isCorrect ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tu Respuesta:</label>
            <Textarea
              value={userAnswer}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onAnswerChange(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="min-h-[120px] resize-none"
              disabled={showResults}
            />
            {!showResults && !userAnswer.trim() && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>Debes escribir una respuesta para continuar</span>
              </div>
            )}
          </div>

          {/* Show correct answer in results mode */}
          {showResults && (
            <div className="space-y-3 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Respuesta Correcta:
                </label>
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm">{question.answer}</p>
                </div>
              </div>

              {question.keyPoints && question.keyPoints.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Puntos Clave:</label>
                  <ul className="space-y-1">
                    {question.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {!showResults && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleNext}
                disabled={!userAnswer.trim()}
                size="lg"
              >
                {isLast ? 'Finalizar Examen' : 'Siguiente Pregunta'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      {!showResults && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Escribe tu respuesta completa antes de continuar</p>
        </div>
      )}
    </div>
  );
}
