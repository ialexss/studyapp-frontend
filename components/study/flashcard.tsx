'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, X } from 'lucide-react';
import type { Question } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  question: Question;
  onAnswer: (wasCorrect: boolean) => void;
  onNext: () => void;
  isLast: boolean;
  currentIndex: number;
  totalQuestions: number;
}

export function Flashcard({
  question,
  onAnswer,
  onNext,
  isLast,
  currentIndex,
  totalQuestions,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (wasCorrect: boolean) => {
    setAnswered(true);
    onAnswer(wasCorrect);
    
    // Auto avanzar después de 1 segundo
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setAnswered(false);
    onNext();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'hard':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
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
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pregunta {currentIndex + 1} de {totalQuestions}</span>
          <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <Card
          className={cn(
            'relative min-h-[400px] cursor-pointer transition-all duration-500 transform-style-3d',
            isFlipped && 'rotate-y-180',
            answered && 'opacity-75'
          )}
          onClick={!answered ? handleFlip : undefined}
        >
          {/* Front Side */}
          <div className={cn(
            'absolute inset-0 backface-hidden',
            isFlipped && 'invisible'
          )}>
            <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="space-y-6 w-full">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    getDifficultyColor(question.difficulty)
                  )}>
                    {getDifficultyLabel(question.difficulty)}
                  </span>
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    {question.question}
                  </h2>
                  
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-muted rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  Toca para ver la respuesta
                </p>
              </div>
            </CardContent>
          </div>

          {/* Back Side */}
          <div className={cn(
            'absolute inset-0 backface-hidden rotate-y-180',
            !isFlipped && 'invisible'
          )}>
            <CardContent className="flex flex-col h-full p-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    getDifficultyColor(question.difficulty)
                  )}>
                    Respuesta
                  </span>
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    {question.answer}
                  </p>

                  {question.keyPoints && question.keyPoints.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        Puntos Clave:
                      </h3>
                      <ul className="space-y-2">
                        {question.keyPoints.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="text-primary mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Answer Buttons */}
              {!answered && (
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(false);
                    }}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Necesito Repasar
                  </Button>
                  <Button
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(true);
                    }}
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Entendido
                  </Button>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Evalúa tu comprensión después de ver la respuesta</p>
      </div>
    </div>
  );
}
