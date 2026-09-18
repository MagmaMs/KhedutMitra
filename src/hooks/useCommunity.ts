import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './useAuth';
import { seedPosts, seedAnswers } from '../data/community';
import type { CommunityPost } from '../types';

export function useCommunity() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
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
          const mapped: CommunityPost[] = data.map((d: any) => ({
            id: d.id,
            authorId: d.author_id,
            title: d.title,
            body: d.body,
            authorName: d.author_name,
            authorLocation: d.author_location,
            category: d.category || 'General',
            crop: d.crop,
            answerCount: d.answer_count,
            isExpert: d.is_expert,
            createdAt: d.created_at,
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
    setPosts((seedPosts as any) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = useCallback(async (title: string, body: string, topic: string) => {
    if (isSupabaseConfigured && supabase && user) {
      const { data, error } = await supabase.from('community_posts').insert({
        author_id: user.id,
        author_name: user.name,
        author_location: user.district,
        title,
        body,
        category: topic,
        answer_count: 0
      }).select().single();

      if (error) {
        throw new Error('Failed to create post');
      }

      if (data) {
        const newPost: CommunityPost = {
          id: data.id,
          authorId: data.author_id,
          title: data.title,
          body: data.body,
          authorName: data.author_name,
          authorLocation: data.author_location,
          category: data.category || 'General',
          crop: data.crop,
          answerCount: data.answer_count,
          isExpert: data.is_expert,
          createdAt: data.created_at,
        };
        setPosts(current => [newPost, ...current]);
        return newPost;
      }
    }

    // Fallback
    const newPost: CommunityPost = {
      id: `mock-${Date.now()}`,
      authorId: user?.id || 'demo-user',
      title,
      body,
      authorName: user?.name || 'Demo Farmer',
      authorLocation: user?.district || 'Demo District',
      category: topic,
      answerCount: 0,
      isExpert: false,
      createdAt: new Date().toISOString()
    };
    setPosts(current => [newPost, ...current]);
    return newPost;
  }, [user]);

  return { posts, loading, addPost, fetchPosts };
}

export function useCommunityPost(id: string | undefined) {
  const { user } = useAuth();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const [postRes, answersRes] = await Promise.all([
          supabase.from('community_posts').select('*').eq('id', id).single(),
          supabase.from('community_answers').select('*').eq('post_id', id).order('created_at', { ascending: true })
        ]);

        if (!postRes.error && postRes.data) {
          const d = postRes.data;
          setPost({
            id: d.id,
            authorId: d.author_id,
            title: d.title,
            body: d.body,
            authorName: d.author_name,
            authorLocation: d.author_location,
            category: d.category || 'General',
            crop: d.crop,
            answerCount: d.answer_count,
            isExpert: d.is_expert,
            createdAt: d.created_at,
          } as CommunityPost);
        }
        
        if (!answersRes.error && answersRes.data) {
          setAnswers(answersRes.data.map(a => ({
            id: a.id,
            postId: a.post_id,
            authorId: a.author_id,
            authorName: a.author_name,
            authorLocation: a.author_location,
            isExpert: a.is_expert,
            body: a.body,
            isAccepted: a.is_accepted,
            createdAt: a.created_at
          })));
        }
        
        if (!postRes.error) {
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    }
    
    // Fallback
    const p = seedPosts.find(x => x.id === id);
    if (p) setPost(p as any);
    
    // Fallback for answers
    
    const fallbackAnswers = (seedAnswers as Record<string, any>)[id] || [];
    setAnswers(fallbackAnswers);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const addAnswer = useCallback(async (body: string) => {
    if (!id) return;
    if (isSupabaseConfigured && supabase && user) {
      const { data, error } = await supabase.from('community_answers').insert({
        post_id: id,
        author_id: user.id,
        author_name: user.name,
        author_location: user.district,
        body
      }).select().single();

      if (error) {
        throw new Error('Failed to create answer');
      }

      if (data) {
        await fetchPost();
        return;
      }
    }
    
    // Fallback
    const newAnswer = {
      id: `ans-${Date.now()}`,
      postId: id,
      authorId: user?.id || 'demo',
      authorName: user?.name || 'You',
      authorLocation: user?.district || 'Your Location',
      body,
      isExpert: false,
      isAccepted: false,
      createdAt: new Date().toISOString()
    };
    setAnswers(current => [...current, newAnswer]);
    
    if (post) {
      setPost({ ...post, answerCount: post.answerCount + 1 });
    }
  }, [id, user, fetchPost, post]);

  return { post, answers, loading, addAnswer };
}
