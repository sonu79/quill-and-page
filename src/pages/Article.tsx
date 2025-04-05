
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ArticleCard from '@/components/ArticleCard';
import { getArticleBySlug, getAuthorForArticle, getRecentArticles } from '@/data/articles';

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const author = article ? getAuthorForArticle(article) : undefined;
  const recentArticles = getRecentArticles().slice(0, 3);

  useEffect(() => {
    // Scroll to top when article loads
    window.scrollTo(0, 0);
  }, [slug]);

  const formattedDate = article
    ? new Date(article.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  if (!article || !author) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{article.title}</h1>
              <p className="text-xl text-gray-700 mb-6">{article.subtitle}</p>
              
              <div className="flex items-center space-x-4">
                <Link to={`/author/${author.id}`} className="flex items-center group">
                  <img 
                    src={author.avatarUrl} 
                    alt={author.name} 
                    className="w-12 h-12 rounded-full mr-3" 
                  />
                  <div>
                    <p className="font-medium group-hover:underline">{author.name}</p>
                    <div className="text-sm text-gray-500">
                      <span>{formattedDate}</span>
                      <span> · </span>
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              </div>
            </header>
            
            {/* Featured Image */}
            <figure className="mb-10">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto rounded-lg" 
              />
            </figure>
            
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
        
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
