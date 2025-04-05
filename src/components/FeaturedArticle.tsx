
import { Link } from 'react-router-dom';
import { Article } from '@/data/articles';
import { findAuthorById } from '@/data/authors';

interface FeaturedArticleProps {
  article: Article;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const author = findAuthorById(article.authorId);
  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <article className="grid md:grid-cols-2 gap-8 group">
      <Link to={`/article/${article.slug}`} className="overflow-hidden rounded-lg">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full max-h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      <div className="flex flex-col justify-center space-y-4">
        <Link to={`/article/${article.slug}`}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold group-hover:underline">{article.title}</h2>
        </Link>
        <p className="text-lg text-gray-700">{article.subtitle}</p>
        
        <div className="flex items-center space-x-2 pt-2">
          {author && (
            <Link to={`/author/${author.id}`} className="flex items-center">
              <img 
                src={author.avatarUrl} 
                alt={author.name} 
                className="w-8 h-8 rounded-full mr-2" 
              />
              <span className="font-medium hover:underline">{author.name}</span>
            </Link>
          )}
          <span className="text-gray-500">·</span>
          <span className="text-gray-500">{formattedDate}</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500">{article.readTime} min read</span>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
