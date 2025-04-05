
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { articles } from '@/data/articles';
import { useAuth } from '@/contexts/AuthContext';

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [article, setArticle] = useState({
    title: '',
    subtitle: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0', // Default placeholder
    featured: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setArticle(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!article.title || !article.subtitle || !article.content) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're just simulating the creation
      const newArticle = {
        id: String(articles.length + 1),
        authorId: user?.id || '1',
        publishedDate: new Date().toISOString().split('T')[0],
        readTime: Math.ceil(article.content.split(' ').length / 200), // Rough estimate
        slug: article.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        ...article
      };
      
      console.log('Created new article:', newArticle);
      
      // Show success message
      toast.success('Article published successfully!');
      
      // Navigate back to admin page after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
      
    } catch (error) {
      console.error('Error publishing article:', error);
      toast.error('Failed to publish article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin')}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Admin
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create New Article</h1>
          <p className="text-gray-600">Fill in the details below to publish a new article</p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title"
                name="title"
                value={article.title}
                onChange={handleChange}
                placeholder="Enter article title"
                className="text-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input 
                id="subtitle"
                name="subtitle"
                value={article.subtitle}
                onChange={handleChange}
                placeholder="Enter article subtitle"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Cover Image URL</Label>
              <Input 
                id="imageUrl"
                name="imageUrl"
                value={article.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {article.imageUrl && (
                <div className="mt-2 aspect-video w-full max-w-md overflow-hidden rounded-lg bg-slate-100">
                  <img 
                    src={article.imageUrl} 
                    alt="Article cover preview" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0";
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Article Content *</Label>
              <Textarea 
                id="content"
                name="content"
                value={article.content}
                onChange={handleChange}
                placeholder="Write your article content here..."
                className="min-h-[300px]"
                required
              />
              <p className="text-sm text-gray-500">
                Use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;)
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={article.featured}
                onChange={handleCheckboxChange}
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured" className="cursor-pointer">Feature this article on homepage</Label>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Publishing...' : 'Publish Article'}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleEditor;
