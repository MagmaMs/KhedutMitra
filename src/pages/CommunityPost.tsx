import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../contexts/ToastContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { MessageSquareIcon, UserIcon, MapPinIcon, BadgeCheckIcon, ArrowLeftIcon, CheckCircle2Icon } from 'lucide-react';

let seedPosts: any[] = [];
let seedAnswers: any[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const data = require('../data/community');
  seedPosts = data.seedPosts || [];
  seedAnswers = data.seedAnswers || [];
} catch (e) {
  seedPosts = [
    {
      id: '1',
      title: 'Best time to sow wheat in Gujarat?',
      body: 'I am planning to sow Lok-1 variety this year. When is the ideal time considering current weather?',
      authorName: 'Ramesh Patel',
      authorLocation: 'Mehsana',
      topic: 'Crop Rotation',
      answerCount: 3,
      isExpert: false,
      timeAgo: '2 hours ago'
    }
  ];
  seedAnswers = [
    {
      id: '1',
      postId: '1',
      body: 'Wait until the temperature drops below 22°C. Usually first week of November is ideal for Lok-1.',
      authorName: 'Dr. Joshi',
      timeAgo: '1 hour ago',
      isExpert: true,
      isAccepted: true
    },
    {
      id: '2',
      postId: '1',
      body: 'I sowed last year in late October and got good yield, but weather was cooler then.',
      authorName: 'Suresh Bhai',
      timeAgo: '30 mins ago',
      isExpert: false,
      isAccepted: false
    }
  ];
}

export function CommunityPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [answers, setAnswers] = useState(seedAnswers.filter(a => a.postId === id));
  const [newAnswer, setNewAnswer] = useState('');

  const post = seedPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="space-y-6">
        <Button variant="quiet" onClick={() => navigate('/community')} className="-ml-4 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {t('common.back', 'Back to Community')}
        </Button>
        <EmptyState 
          title="Post not found" 
          description="This discussion may have been removed." 
        />
      </div>
    );
  }

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      showToast(t('community.error.emptyAnswer', 'Please write an answer'), 'info');
      return;
    }
    const answer = {
      id: String(Date.now()),
      postId: id!,
      body: newAnswer,
      authorName: 'Current User',
      timeAgo: 'Just now',
      isExpert: false,
      isAccepted: false
    };
    setAnswers([...answers, answer]);
    setNewAnswer('');
    showToast(t('community.answerPosted', 'Answer posted successfully'), 'success');
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/community')}
        className="flex items-center text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
        {t('community.backToCommunity', 'Back to Community')}
      </button>

      <Card className="p-5 bg-surface border-line space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-ink">{post.title}</h1>
          <span className="shrink-0 inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
            {post.topic}
          </span>
        </div>
        
        <p className="text-base text-ink whitespace-pre-wrap">
          {post.body}
        </p>

        <div className="flex items-center gap-4 text-sm text-ink-muted pt-4 border-t border-line/50">
          <div className="flex items-center gap-1.5">
            <UserIcon className="h-4 w-4" />
            <span className="font-semibold text-ink">{post.authorName}</span>
            {post.isExpert && (
              <span className="inline-flex items-center gap-1 text-brand bg-brand-soft px-1.5 py-0.5 rounded text-xs font-bold">
                <BadgeCheckIcon className="h-3.5 w-3.5" />
                {t('community.verifiedExpert', 'Verified Expert')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{post.authorLocation}</span>
          </div>
          <span>•</span>
          <span>{post.timeAgo}</span>
        </div>
      </Card>

      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5" />
          {answers.length} {t('community.answers', 'Answers')}
        </h2>

        {answers.map(answer => (
          <Card key={answer.id} className="p-4 bg-surface border-line space-y-3">
            <p className="text-sm text-ink whitespace-pre-wrap">
              {answer.body}
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3 text-xs text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="font-semibold text-ink">{answer.authorName}</span>
                  {answer.isExpert && (
                    <span className="inline-flex items-center gap-1 text-brand bg-brand-soft px-1.5 py-0.5 rounded text-xs font-bold">
                      <BadgeCheckIcon className="h-3.5 w-3.5" />
                      {t('community.verifiedExpert', 'Verified Expert')}
                    </span>
                  )}
                </div>
                <span>•</span>
                <span>{answer.timeAgo}</span>
              </div>
              {answer.isAccepted && (
                <div className="flex items-center gap-1 text-brand text-xs font-bold bg-brand-soft px-2 py-1 rounded-full">
                  <CheckCircle2Icon className="h-3.5 w-3.5" />
                  {t('community.acceptedAnswer', 'Accepted Answer')}
                </div>
              )}
            </div>
          </Card>
        ))}

        {answers.length === 0 && (
          <EmptyState 
            icon={<MessageSquareIcon className="h-8 w-8 text-ink-muted" />}
            title={t('community.noAnswers', 'No answers yet')}
            description={t('community.beFirst', 'Be the first to share your knowledge.')}
          />
        )}
      </div>

      <Card className="p-4 bg-surface border-line mt-6">
        <h3 className="font-semibold text-ink mb-3">{t('community.yourAnswer', 'Your Answer')}</h3>
        <form onSubmit={handleSubmitAnswer} className="space-y-3">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder={t('community.answerPlaceholder', 'Write your answer here...')}
            className="min-h-[100px] w-full rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink outline-none transition-[border-color] duration-150 hover:border-ink-muted/50 focus:border-brand focus:ring-1 focus:ring-brand"
            required
          />
          <div className="flex justify-end">
            <Button type="submit">
              {t('community.submitAnswer', 'Post Answer')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
