'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, FolderOpen, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Topic } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TopicTreeProps {
  topics: Topic[];
  selectedTopicId?: number;
}

interface TopicNodeProps {
  topic: Topic;
  subtopics: Topic[];
  level: number;
  isSelected: boolean;
}

function TopicNode({ topic, subtopics, level, isSelected }: TopicNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasSubtopics = subtopics.length > 0;

  return (
    <div className="space-y-1">
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted transition-colors',
          isSelected && 'bg-primary/10 border-l-4 border-primary'
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        {hasSubtopics ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-muted-foreground/10 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {hasSubtopics ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-primary" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        )}

        <Link
          href={`/dashboard/topics/${topic.id}`}
          className="flex-1 font-medium hover:text-primary transition-colors"
        >
          {topic.name}
        </Link>

        <Link href={`/dashboard/study/${topic.id}`}>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Estudiar
          </Button>
        </Link>
      </div>

      {hasSubtopics && isExpanded && (
        <div className="space-y-1">
          {subtopics.map((subtopic) => (
            <TopicNode
              key={subtopic.id}
              topic={subtopic}
              subtopics={[]}
              level={level + 1}
              isSelected={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TopicTree({ topics, selectedTopicId }: TopicTreeProps) {
  const rootTopics = topics.filter((t) => t.parentId === null);

  const getSubtopics = (parentId: number) => {
    return topics.filter((t) => t.parentId === parentId);
  };

  return (
    <div className="space-y-1">
      {rootTopics.map((topic) => (
        <TopicNode
          key={topic.id}
          topic={topic}
          subtopics={getSubtopics(topic.id)}
          level={0}
          isSelected={topic.id === selectedTopicId}
        />
      ))}
    </div>
  );
}
