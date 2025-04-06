
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { articles, getArticleBySlug } from '@/data/articles';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';

interface ArticleFormValues {
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  featured: boolean;
}

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!id;
  
  const methods = useForm<ArticleFormValues>({
    defaultValues: {
      title: '',
      subtitle: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
      featured: false
    }
  });
  
  useEffect(() => {
    // If in edit mode, fetch the article data
    if (isEditMode) {
      const existingArticle = articles.find(article => article.id === id);
      if (existingArticle) {
        methods.reset({
          title: existingArticle.title,
          subtitle: existingArticle.subtitle,
          content: existingArticle.content,
          imageUrl: existingArticle.imageUrl,
          featured: existingArticle.featured || false
        });
      } else {
        toast.error('Article not found');
        navigate('/admin/manage-articles');
      }
    }
  }, [id, isEditMode, navigate, methods]);
  
  const onSubmit = (data: ArticleFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      if (isEditMode) {
        // Update existing article
        toast.success('Article updated successfully!');
        console.log('Updated article:', { ...data, id });
      } else {
        // Create new article
        const newArticle = {
          id: String(articles.length + 1),
          authorId: user?.id || '1',
          publishedDate: new Date().toISOString().split('T')[0],
          readTime: Math.ceil(data.content.split(' ').length / 200), // Rough estimate
          slug: data.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
          ...data
        };
        
        console.log('Created new article:', newArticle);
        toast.success('Article published successfully!');
      }
      
      // Navigate back to admin page after short delay
      setTimeout(() => {
        navigate('/admin/manage-articles');
      }, 1500);
      
    } catch (error) {
      console.error('Error publishing article:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'publish'} article. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b sticky top-0 z-10 bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin/manage-articles')}
              className="text-gray-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> 
            </Button>
            <span className="font-serif font-bold text-lg">
              {isEditMode ? 'Edit Article' : 'Draft'}
            </span>
            <span className="text-gray-500 text-sm">
              in {user?.name || 'Your'} Blog
            </span>
          </div>
          
          <div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="flex items-center">
                <div className="mr-2">
                  <input
                    type="checkbox"
                    id="featured"
                    {...methods.register('featured')}
                    className="mr-1"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-600">Featured</label>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full px-6"
                >
                  {isSubmitting ? (isEditMode ? 'Saving...' : 'Publishing...') : 
                                (isEditMode ? 'Save' : 'Publish')}
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
        <FormProvider {...methods}>
          <RichTextEditor 
            name="content" 
            description="Write your story..."
          />
          
          {/* Hidden input for imageUrl since it's not directly exposed in the UI */}
          <input type="hidden" {...methods.register('imageUrl')} />
        </FormProvider>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleEditor;
