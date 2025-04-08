
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/data/articles';

export interface SupabaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  author_id: string | null;
  category: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export const fetchArticles = async (): Promise<SupabaseArticle[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }

  return data || [];
};

export const fetchFeaturedArticles = async (): Promise<SupabaseArticle[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured articles:', error);
    throw error;
  }

  return data || [];
};

export const fetchArticleBySlug = async (slug: string): Promise<SupabaseArticle | null> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching article by slug:', error);
    throw error;
  }

  return data;
};

export const fetchArticlesByAuthor = async (authorId: string): Promise<SupabaseArticle[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('author_id', authorId)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles by author:', error);
    throw error;
  }

  return data || [];
};

// Admin functions
export const fetchAllArticles = async (): Promise<SupabaseArticle[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all articles:', error);
    throw error;
  }

  return data || [];
};

export const createArticle = async (article: Omit<SupabaseArticle, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseArticle> => {
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    throw error;
  }

  return data;
};

export const updateArticle = async (id: string, updates: Partial<SupabaseArticle>): Promise<SupabaseArticle> => {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    throw error;
  }

  return data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};
