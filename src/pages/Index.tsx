
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/ArticleCard';
import FeaturedArticle from '@/components/FeaturedArticle';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { fetchFeaturedArticles, fetchArticles, SupabaseArticle } from '@/services/articleService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: featuredArticles, isLoading: featuredLoading } = useQuery({
    queryKey: ['featuredArticles'],
    queryFn: fetchFeaturedArticles
  });

  const { data: recentArticles, isLoading: recentLoading } = useQuery({
    queryKey: ['recentArticles'], 
    queryFn: fetchArticles
  });

  // Map Supabase article to the format expected by our components
  const mapArticleFormat = (article: SupabaseArticle) => {
    return {
      id: article.id,
      title: article.title,
      subtitle: article.excerpt || '',
      content: article.content,
      slug: article.slug,
      imageUrl: article.cover_image || '/placeholder.svg',
      authorId: article.author_id || '',
      category: article.category || '',
      tags: article.tags || [],
      featured: article.is_featured,
      publishedDate: article.published_at || article.created_at,
      readTime: Math.max(1, Math.round(article.content.length / 1000)) // Rough estimate
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Dive into stories that matter</h1>
            <p className="text-xl text-gray-700 mb-8">Discover thoughtful writing on technology, travel, business, and culture from diverse perspectives.</p>
          </div>
        </section>
        
        {/* Featured Articles */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-serif font-bold mb-8">Featured Stories</h2>
          {featuredLoading ? (
            <div className="space-y-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid md:grid-cols-2 gap-8">
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredArticles && featuredArticles.length > 0 ? (
            <div className="space-y-16">
              {featuredArticles.map(article => (
                <FeaturedArticle key={article.id} article={mapArticleFormat(article)} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured articles yet.</p>
          )}
        </section>
        
        {/* Recent Articles */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-serif font-bold mb-8">Recent Stories</h2>
          {recentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : recentArticles && recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.slice(0, 6).map(article => (
                <ArticleCard key={article.id} article={mapArticleFormat(article)} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No recent articles yet.</p>
          )}
        </section>
        
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
