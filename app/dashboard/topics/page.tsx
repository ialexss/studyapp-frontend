'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TopicCard } from '@/components/topics/topic-card';
import { TopicTree } from '@/components/topics/topic-tree';
import { topicsApi } from '@/lib/api/topics';
import { questionsApi } from '@/lib/api/questions';
import { progressApi } from '@/lib/api/progress';
import type { Topic, Question } from '@/lib/types';
import { Search, LayoutGrid, List, Filter } from 'lucide-react';

type ViewMode = 'grid' | 'list' | 'tree';

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<Record<number, any>>({});

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [searchQuery, topics]);

  const loadTopics = async () => {
    try {
      const data = await topicsApi.getAll();
      setTopics(data);
      setFilteredTopics(data);
      
      // Load progress for each topic
      const progress: Record<number, any> = {};
      const allProgress = await progressApi.getMyProgress().catch(() => []);
      
      for (const topic of data) {
        try {
          // Get questions for this topic
          const topicQuestions = await questionsApi.getAll(topic.id);
          const questionIds = topicQuestions.map((q: Question) => q.id);
          
          // Filter progress for this topic's questions
          const topicProgress = allProgress.filter((p: any) => 
            questionIds.includes(p.questionId)
          );
          
          progress[topic.id] = {
            totalQuestions: topicQuestions.length,
            masteredQuestions: topicProgress.filter((p: any) => p.easeFactor >= 2.5).length,
            dueToday: topicProgress.filter((p: any) => {
              const dueDate = new Date(p.nextReviewDate);
              const today = new Date();
              return dueDate <= today;
            }).length,
          };
        } catch (error) {
          // No progress yet for this topic
          progress[topic.id] = {
            totalQuestions: 0,
            masteredQuestions: 0,
            dueToday: 0,
          };
        }
      }
      setProgressData(progress);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = () => {
    if (!searchQuery.trim()) {
      setFilteredTopics(topics);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query) ||
        topic.description?.toLowerCase().includes(query)
    );
    setFilteredTopics(filtered);
  };

  const rootTopics = filteredTopics.filter((t) => t.parentId === null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Biblioteca de Temas</h1>
        <p className="text-muted-foreground mt-2">
          Explora y estudia todos los temas disponibles
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar temas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tree' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('tree')}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Temas</CardDescription>
            <CardTitle className="text-3xl">{topics.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Temas Principales</CardDescription>
            <CardTitle className="text-3xl">{rootTopics.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Preguntas Totales</CardDescription>
            <CardTitle className="text-3xl">
              {Object.values(progressData).reduce((sum: number, p: any) => sum + p.totalQuestions, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Topics Display */}
      {viewMode === 'tree' ? (
        <Card>
          <CardHeader>
            <CardTitle>Vista de Árbol</CardTitle>
            <CardDescription>
              Navega por la estructura jerárquica de temas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopicTree topics={filteredTopics} />
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {rootTopics.map((topic) => {
            const hasSubtopics = topics.some(t => t.parentId === topic.id);
            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                hasSubtopics={hasSubtopics}
                progress={progressData[topic.id]}
              />
            );
          })}
        </div>
      )}

      {filteredTopics.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No se encontraron temas que coincidan con tu búsqueda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
