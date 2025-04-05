
import { Link } from 'react-router-dom';
import { Article } from '@/data/articles';
import { findAuthorById } from '@/data/authors';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const author = findAuthorById(article.authorId);
  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <article className="flex flex-col space-y-4 group">
      <Link to={`/article/${article.slug}`} className="overflow-hidden rounded-lg">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      <div className="space-y-2">
        <Link to={`/article/${article.slug}`}>
          <h3 className="text-xl font-serif font-bold group-hover:underline line-clamp-2">{article.title}</h3>
        </Link>
        <p className="text-gray-600 line-clamp-2">{article.subtitle}</p>
      </div>
      
      <div className="flex items-center space-x-2 text-sm">
        {author && (
          <Link to={`/author/${author.id}`} className="flex items-center">
            <img 
              src={author.avatarUrl} 
              alt={author.name} 
              className="w-6 h-6 rounded-full mr-2" 
            />
            <span className="font-medium hover:underline">{author.name}</span>
          </Link>
        )}
        <span className="text-gray-500">·</span>
        <span className="text-gray-500">{formattedDate}</span>
        <span className="text-gray-500">·</span>
        <span className="text-gray-500">{article.readTime} min read</span>
      </div>
    </article>
  );
};

export default ArticleCard;
