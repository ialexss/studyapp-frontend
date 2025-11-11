'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExamQuestion } from '@/components/exam/exam-question';
import { ExamResults } from '@/components/exam/exam-results';
import { topicsApi } from '@/lib/api/topics';
import { questionsApi } from '@/lib/api/questions';
import { sessionsApi } from '@/lib/api/sessions';
import type { Topic, Question } from '@/lib/types';
import { ArrowLeft, GraduationCap, Clock } from 'lucide-react';
import Link from 'next/link';

interface ExamAnswer {
  questionId: number;
  userAnswer: string;
  wasCorrect: boolean;
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = parseInt(params.topicId as string);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamData();
  }, [topicId]);

  useEffect(() => {
    if (!isCompleted && startTime > 0) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCompleted, startTime]);

  const loadExamData = async () => {
    try {
      const [topicData, questionsData] = await Promise.all([
        topicsApi.getById(topicId),
        questionsApi.getAll(topicId),
      ]);

      setTopic(topicData);
      setQuestions(questionsData);

      // Create exam session
      const session = await sessionsApi.create(topicId, 'exam' as any);
      setSessionId(session.id);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error loading exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    // Simple evaluation: check if key words from correct answer are in user answer
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const correctWords = correctAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matchCount = correctWords.filter(word => 
      userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
    ).length;
    
    // Consider correct if at least 50% of key words match
    return matchCount >= correctWords.length * 0.5;
  };

  const handleNext = async () => {
    if (!sessionId) return;

    const currentQuestion = questions[currentQuestionIndex];
    const wasCorrect = evaluateAnswer(currentAnswer, currentQuestion.answer);

    // Save answer
    const newAnswer: ExamAnswer = {
      questionId: currentQuestion.id,
      userAnswer: currentAnswer,
      wasCorrect,
    };

    setAnswers([...answers, newAnswer]);

    // Record in backend
    try {
      await sessionsApi.addAnswer(sessionId, {
        questionId: currentQuestion.id,
        wasCorrect,
        userAnswer: currentAnswer,
        timeSpent: Math.floor((Date.now() - startTime) / 1000) - elapsedTime,
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      await completeExam();
    }
  };

  const completeExam = async () => {
    if (!sessionId) return;

    try {
      await sessionsApi.endSession(sessionId);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing exam:', error);
    }
  };

  const handleReview = () => {
    setShowReview(true);
    setCurrentQuestionIndex(0);
  };

  const handleRetry = () => {
    router.push(`/dashboard/study/${topicId}`);
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
            <p className="text-muted-foreground mb-4">
              No hay preguntas disponibles para este examen.
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

  // Show results
  if (isCompleted && !showReview) {
    return (
      <ExamResults
        questions={questions}
        answers={answers}
        duration={elapsedTime}
        topicId={topicId}
        onReview={handleReview}
        onRetry={handleRetry}
      />
    );
  }

  // Show review mode
  if (showReview) {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswerData = answers.find(a => a.questionId === currentQuestion.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setShowReview(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Resultados
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Siguiente
            </Button>
          </div>
        </div>

        <ExamQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          userAnswer={currentAnswerData?.userAnswer || ''}
          onAnswerChange={() => {}}
          onNext={() => {}}
          isLast={false}
          showResults={true}
          isCorrect={currentAnswerData?.wasCorrect}
        />
      </div>
    );
  }

  // Show exam in progress
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Modo Examen</h1>
            <p className="text-sm text-muted-foreground">{topic.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-semibold">
            {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Question */}
      <ExamQuestion
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        userAnswer={currentAnswer}
        onAnswerChange={setCurrentAnswer}
        onNext={handleNext}
        isLast={currentQuestionIndex === questions.length - 1}
      />
    </div>
  );
}
