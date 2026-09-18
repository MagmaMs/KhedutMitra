import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './useAuth';
import { seedPosts } from '../data/community';

export function useCommunity() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            body: d.body,
            authorName: d.author_name,
            authorLocation: d.author_location,
            topic: d.category || 'General',
            crop: d.crop,
            answerCount: d.answer_count,
            isExpert: d.is_expert,
            createdAt: d.created_at,
            timeAgo: 'recently'
          }));
          setPosts(mapped);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Supabase community fetch failed", err);
      }
    }
    
    // Fallback
    setPosts(seedPosts || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = async (title: string, body: string, topic: string) => {
    if (isSupabaseConfigured && supabase && user) {
      const { data, error } = await supabase.from('community_posts').insert({
        author_id: user.id,
        author_name: user.name,
        author_location: user.district,
        title,
        body,
        category: topic,
        crop: null,
      }).select().single();

      if (!error && data) {
        const newPost = {
          id: data.id,
          title: data.title,
          body: data.body,
          authorName: data.author_name,
          authorLocation: data.author_location,
          topic: data.category || 'General',
          crop: data.crop,
          answerCount: data.answer_count,
          isExpert: data.is_expert,
          createdAt: data.created_at,
          timeAgo: 'just now'
        };
        setPosts(current => [newPost, ...current]);
        return newPost;
      }
    }

    // Fallback
    const newPost = {
      id: `mock-${Date.now()}`,
      title,
      body,
      authorName: user?.name || 'Demo Farmer',
      authorLocation: user?.district || 'Demo District',
      topic,
      answerCount: 0,
      isExpert: false,
      timeAgo: 'just now'
    };
    setPosts(current => [newPost, ...current]);
    return newPost;
  };

  return { posts, loading, addPost, fetchPosts };
}
