
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/ArticleCard';
import FeaturedArticle from '@/components/FeaturedArticle';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { getFeaturedArticles, getRecentArticles } from '@/data/articles';

const Index = () => {
  const featuredArticles = getFeaturedArticles();
  const recentArticles = getRecentArticles();

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
          <div className="space-y-16">
            {featuredArticles.map(article => (
              <FeaturedArticle key={article.id} article={article} />
            ))}
          </div>
        </section>
        
        {/* Recent Articles */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-serif font-bold mb-8">Recent Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
        
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
