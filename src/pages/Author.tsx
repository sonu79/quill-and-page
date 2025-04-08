
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { fetchArticlesByAuthor, SupabaseArticle } from '@/services/articleService';
import { fetchProfile } from '@/services/profileService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const Author = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ['author', id],
    queryFn: () => id ? fetchProfile(id) : Promise.resolve(null),
    enabled: !!id
  });
  
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['authorArticles', id],
    queryFn: () => id ? fetchArticlesByAuthor(id) : Promise.resolve([]),
    enabled: !!id
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

  if (authorLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
              <Skeleton className="w-24 h-24 rounded-full mb-4" />
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-20 w-full max-w-2xl" />
              <div className="flex gap-4 mt-6">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">Author not found</h1>
            <p className="text-gray-600 mb-6">The author you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="text-primary font-medium hover:underline">Return to homepage</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
              <img 
                src={author.avatar_url || '/placeholder.svg'} 
                alt={author.name || author.username || 'Anonymous'} 
                className="w-24 h-24 rounded-full mb-4 object-cover" 
              />
              <h1 className="text-3xl font-serif font-bold mb-4">
                {author.name || author.username || 'Anonymous'}
              </h1>
              {author.bio && <p className="text-gray-600 max-w-2xl">{author.bio}</p>}
              
              <div className="flex gap-4 mt-6">
                <Link to="/" className="text-sm text-primary hover:underline">Twitter</Link>
                <Link to="/" className="text-sm text-primary hover:underline">LinkedIn</Link>
                <Link to="/" className="text-sm text-primary hover:underline">Website</Link>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-8">
                Stories by {author.name || author.username || 'Anonymous'}
              </h2>
              
              {articlesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col space-y-4">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : articles && articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {articles.map(article => (
                    <ArticleCard key={article.id} article={mapArticleFormat(article)} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">This author hasn't published any articles yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Author;
