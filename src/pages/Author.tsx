
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { findAuthorById } from '@/data/authors';
import { getArticlesByAuthor } from '@/data/articles';

const Author = () => {
  const { id } = useParams<{ id: string }>();
  const author = id ? findAuthorById(id) : undefined;
  const articles = id ? getArticlesByAuthor(id) : [];

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
                src={author.avatarUrl} 
                alt={author.name} 
                className="w-24 h-24 rounded-full mb-4" 
              />
              <h1 className="text-3xl font-serif font-bold mb-4">{author.name}</h1>
              <p className="text-gray-600 max-w-2xl">{author.bio}</p>
              
              <div className="flex gap-4 mt-6">
                <Link to="/" className="text-sm text-primary hover:underline">Twitter</Link>
                <Link to="/" className="text-sm text-primary hover:underline">LinkedIn</Link>
                <Link to="/" className="text-sm text-primary hover:underline">Website</Link>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-8">Stories by {author.name}</h2>
              {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
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
