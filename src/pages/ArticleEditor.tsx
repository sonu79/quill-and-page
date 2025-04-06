
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { ArrowLeft, Save, FileText } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin/manage-articles')}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Articles
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isEditMode ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-gray-600">
            {isEditMode 
              ? 'Update the article details below' 
              : 'Fill in the details below to publish a new article'}
          </p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title"
                  {...methods.register('title', { required: true })}
                  placeholder="Enter article title"
                  className="text-lg"
                />
                {methods.formState.errors.title && (
                  <p className="text-red-500 text-sm">Title is required</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle *</Label>
                <Input 
                  id="subtitle"
                  {...methods.register('subtitle', { required: true })}
                  placeholder="Enter article subtitle"
                />
                {methods.formState.errors.subtitle && (
                  <p className="text-red-500 text-sm">Subtitle is required</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Cover Image URL</Label>
                <Input 
                  id="imageUrl"
                  {...methods.register('imageUrl')}
                  placeholder="https://example.com/image.jpg"
                />
                {methods.watch('imageUrl') && (
                  <div className="mt-2 aspect-video w-full max-w-md overflow-hidden rounded-lg bg-slate-100">
                    <img 
                      src={methods.watch('imageUrl')} 
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
              
              <RichTextEditor 
                name="content" 
                label="Article Content *"
                description="Use the toolbar above to format your content"
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...methods.register('featured')}
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
                {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : 
                              (isEditMode ? 'Update Article' : 'Publish Article')}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/manage-articles')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleEditor;
