import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../contexts/ToastContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { EmptyState } from '../components/EmptyState';
import { MessageSquareIcon, UserIcon, MapPinIcon, PlusIcon, BadgeCheckIcon, SearchIcon } from 'lucide-react';

import { useCommunity } from "../hooks/useCommunity";
const CATEGORIES = ['All', 'Crop Rotation', 'Pest Control', 'Irrigation', 'Soil Health', 'Market', 'Weather', 'Organic'];

export function Community() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const { posts, loading, addPost } = useCommunity();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTopic, setNewTopic] = useState('Crop Rotation');

  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.body.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || post.topic === category;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      showToast(t('community.error.empty', 'Please fill all fields'), 'info');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addPost(newTitle, newBody, newTopic);
      setShowForm(false);
      setNewTitle('');
      setNewBody('');
      showToast(t('community.success', 'Question posted successfully'), 'success');
    } catch (err) {
      console.error(err);
      showToast(t('community.error', 'Failed to post question'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-ink">{t('community.title', 'Farmer Community')}</h1>
        <p className="text-sm text-ink-muted">{t('community.subtitle', 'Ask questions, share knowledge, and connect with experts.')}</p>
      </header>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
          <Input 
            label={t('community.searchLabel', 'Search Questions')}
            hideLabel
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('community.search', 'Search discussions...')}
            type="search"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="h-[48px]">
          <PlusIcon className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('community.askQuestion', 'Ask')}</span>
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-surface border-line space-y-4">
          <h2 className="font-semibold text-ink">{t('community.form.title', 'Ask a Question')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label={t('community.form.questionTitle', 'Title')}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t('community.form.titlePlaceholder', 'What is your question?')}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-ink">{t('community.form.body', 'Details')}</label>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="min-h-[96px] w-full rounded-lg border border-line bg-white px-3.5 py-2 text-base text-ink outline-none transition-[border-color] duration-150 hover:border-ink-muted/50 focus:border-brand focus:ring-1 focus:ring-brand"
                rows={4}
                required
              />
            </div>
            <Select 
              label={t('community.form.topic', 'Topic')}
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              options={CATEGORIES.filter(c => c !== 'All').map(c => ({ value: c, label: c }))}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit">
                {t('community.form.submit', 'Post Question')}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors border ${category === cat ? 'bg-brand text-white border-brand' : 'bg-canvas text-ink-muted hover:bg-surface hover:text-ink border-line'}`}
          >
            {t(`community.category.${cat.replace(/\s+/g, '')}`, cat)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <EmptyState 
            icon={<MessageSquareIcon className="h-8 w-8 text-ink-muted" />}
            title={t('community.empty.title', 'No questions found')}
            description={t('community.empty.desc', 'Try adjusting your search or category filter.')}
          />
        ) : (
          filteredPosts.map(post => (
            <Card key={post.id} className="p-4 bg-surface hover:border-brand-soft transition-colors cursor-pointer group" onClick={() => navigate(`/community/${post.id}`)}>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-lg text-ink group-hover:text-brand line-clamp-2">
                    {post.title}
                  </h3>
                  <span className="shrink-0 inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
                    {post.topic}
                  </span>
                </div>
                
                <p className="text-sm text-ink-muted line-clamp-2">
                  {post.body}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-line/50">
                  <div className="flex items-center gap-3 text-xs text-ink-muted mt-2">
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" />
                      <span className="font-semibold text-ink">{post.authorName}</span>
                      {post.isExpert && (
                        <BadgeCheckIcon className="h-4 w-4 text-brand" />
                      )}
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <MapPinIcon className="h-3.5 w-3.5" />
                      <span>{post.authorLocation}</span>
                    </div>
                    <span>•</span>
                    <span>{post.timeAgo}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-muted mt-2">
                    <MessageSquareIcon className="h-4 w-4" />
                    <span>{post.answerCount} {t('community.answers', 'Answers')}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
