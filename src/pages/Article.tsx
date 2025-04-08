
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ArticleCard from '@/components/ArticleCard';
import { fetchArticleBySlug, fetchArticles, SupabaseArticle } from '@/services/articleService';
import { fetchProfile, Profile } from '@/services/profileService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: article, isLoading: articleLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => slug ? fetchArticleBySlug(slug) : Promise.resolve(null),
    enabled: !!slug
  });
  
  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ['author', article?.author_id],
    queryFn: () => article?.author_id ? fetchProfile(article.author_id) : Promise.resolve(null),
    enabled: !!article?.author_id
  });
  
  const { data: recentArticles, isLoading: recentLoading } = useQuery({
    queryKey: ['recentArticles'],
    queryFn: fetchArticles
  });

  useEffect(() => {
    // Scroll to top when article loads
    window.scrollTo(0, 0);
  }, [slug]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (articleLoading || authorLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-4/5 mb-4" />
            <Skeleton className="h-8 w-3/5 mb-6" />
            <div className="flex items-center space-x-4 mb-8">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-1" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full rounded-lg mb-10" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">Article not found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="text-primary font-medium hover:underline">Return to homepage</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = article.published_at ? formatDate(article.published_at) : formatDate(article.created_at);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{article.title}</h1>
              {article.excerpt && <p className="text-xl text-gray-700 mb-6">{article.excerpt}</p>}
              
              <div className="flex items-center space-x-4">
                {author ? (
                  <Link to={`/author/${author.id}`} className="flex items-center group">
                    <img 
                      src={author.avatar_url || '/placeholder.svg'} 
                      alt={author.name || 'Author'} 
                      className="w-12 h-12 rounded-full mr-3 object-cover" 
                    />
                    <div>
                      <p className="font-medium group-hover:underline">{author.name || author.username || 'Anonymous'}</p>
                      <div className="text-sm text-gray-500">
                        <span>{formattedDate}</span>
                        <span> · </span>
                        <span>{Math.max(1, Math.round(article.content.length / 1000))} min read</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center">
                    <img 
                      src="/placeholder.svg" 
                      alt="Anonymous" 
                      className="w-12 h-12 rounded-full mr-3" 
                    />
                    <div>
                      <p className="font-medium">Anonymous</p>
                      <div className="text-sm text-gray-500">
                        <span>{formattedDate}</span>
                        <span> · </span>
                        <span>{Math.max(1, Math.round(article.content.length / 1000))} min read</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </header>
            
            {/* Featured Image */}
            {article.cover_image && (
              <figure className="mb-10">
                <img 
                  src={article.cover_image} 
                  alt={article.title} 
                  className="w-full h-auto rounded-lg" 
                />
              </figure>
            )}
            
            {/* Article Content */}
            <div 
              className="article-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>
        
        {/* More Articles */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-8">More Articles</h2>
            {recentLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col space-y-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : recentArticles && recentArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentArticles
                  .filter(a => a.id !== article.id)
                  .slice(0, 3)
                  .map(article => (
                    <ArticleCard key={article.id} article={mapArticleFormat(article)} />
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No other articles available.</p>
            )}
          </div>
        </section>
        
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
