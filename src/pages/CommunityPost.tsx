import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { useCommunityPost } from '../hooks/useCommunity';
import { timeAgo } from '../utils/format';
import {
  MessageSquareIcon,
  BadgeCheckIcon,
  CheckCircle2Icon,
  ArrowLeftIcon
} from 'lucide-react';

export function CommunityPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const { post, answers, loading, addAnswer } = useCommunityPost(id);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return <div className="p-4 text-center">{t('common.loading')}</div>;
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <Button variant="quiet" onClick={() => navigate('/community')} className="-ml-4 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <EmptyState 
          title="Post not found"
          body="This discussion may have been removed." 
        />
      </div>
    );
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      showToast(t('community.error.emptyAnswer'));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addAnswer(newAnswer);
      setNewAnswer('');
      showToast(t('community.answerPosted'));
    } catch (err) {
      console.error(err);
      showToast("Failed to post answer", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/community')}
        className="flex items-center text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
        {t('community.backToCommunity')}
      </button>

      <Card className="p-5 bg-surface border-line space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-ink">{post.title}</h1>
            <div className="inline-block bg-surface-alt px-2.5 py-1 rounded text-xs font-bold text-ink-muted mt-1 uppercase tracking-wider">
              {post.category}
            </div>
          </div>
        </div>
        
        <p className="text-ink text-base whitespace-pre-wrap">{post.body}</p>

        <div className="pt-4 mt-2 border-t border-line flex flex-wrap gap-4 justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand-soft text-brand-deep flex items-center justify-center font-bold">
              {post.authorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-ink">{post.authorName}</span>
                {post.isExpert && (
                  <span className="inline-flex items-center gap-1 text-brand bg-brand-soft px-1.5 py-0.5 rounded text-xs font-bold">
                    <BadgeCheckIcon className="h-3.5 w-3.5" />
                    {t('community.verifiedExpert')}
                  </span>
                )}
              </div>
              <div className="text-xs text-ink-muted flex items-center gap-2 mt-0.5">
                <span>{post.authorLocation}</span>
                <span>•</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5" />
          {answers.length} {t('community.answers')}
        </h2>

        {answers.map(answer => (
          <Card key={answer.id} className="p-4 bg-surface border-line space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-surface-alt text-ink flex items-center justify-center font-bold text-sm">
                  {answer.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-ink text-sm">{answer.authorName}</span>
                    {answer.isExpert && (
                      <span className="inline-flex items-center gap-1 text-brand bg-brand-soft px-1.5 py-0.5 rounded text-xs font-bold">
                        <BadgeCheckIcon className="h-3.5 w-3.5" />
                        {t('community.verifiedExpert')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-muted flex items-center gap-2 mt-0.5">
                    <span>{answer.authorLocation}</span>
                    <span>•</span>
                    <span>{timeAgo(answer.createdAt)}</span>
                  </div>
                </div>
              </div>
              {answer.isAccepted && (
                <div className="flex items-center gap-1 text-brand text-xs font-bold bg-brand-soft px-2 py-1 rounded-full">
                  <CheckCircle2Icon className="h-3.5 w-3.5" />
                  {t('community.acceptedAnswer')}
                </div>
              )}
            </div>
            <p className="text-sm text-ink pl-10 whitespace-pre-wrap">{answer.body}</p>
          </Card>
        ))}

        {answers.length === 0 && (
          <EmptyState 
            icon={MessageSquareIcon}
            title={t('community.noAnswers')}
            body={t('community.beFirst')}
          />
        )}
      </div>

      <Card className="p-4 bg-surface border-line mt-6">
        <h3 className="font-semibold text-ink mb-3">{t('community.yourAnswer')}</h3>
        <form onSubmit={handleSubmitAnswer} className="space-y-3">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder={t('community.answerPlaceholder')}
            className="min-h-[100px] w-full rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink outline-none transition-[border-color] duration-150 hover:border-ink-muted/50 focus:border-brand focus:ring-1 focus:ring-brand"
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('community.submitAnswer')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
