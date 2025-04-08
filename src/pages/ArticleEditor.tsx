
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createArticle, fetchArticleBySlug, updateArticle, SupabaseArticle } from '@/services/articleService';

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
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftSaving, setDraftSaving] = useState(false);
  const [existingArticle, setExistingArticle] = useState<SupabaseArticle | null>(null);
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
  
  const { watch } = methods;
  const formValues = watch();
  
  // Initialize form with data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      // Load the article from Supabase
      const loadArticle = async () => {
        try {
          const article = await fetchArticleBySlug(id);
          if (article) {
            setExistingArticle(article);
            methods.reset({
              title: article.title || '',
              subtitle: article.excerpt || '',
              content: article.content || '',
              imageUrl: article.cover_image || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
              featured: article.is_featured || false
            });
          } else {
            toast.error('Article not found');
            navigate('/admin/manage-articles');
          }
        } catch (error) {
          console.error('Error loading article:', error);
          toast.error('Failed to load article');
          navigate('/admin/manage-articles');
        }
      };
      
      loadArticle();
    }
    
    // Try to load draft from localStorage
    if (!isEditMode) {
      const savedDraft = localStorage.getItem('article_draft');
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          const savedAt = new Date(draftData.savedAt);
          setLastSaved(savedAt);
          
          // Only restore if saved within the last 24 hours
          const oneDayAgo = new Date();
          oneDayAgo.setDate(oneDayAgo.getDate() - 1);
          
          if (savedAt > oneDayAgo) {
            methods.reset({
              title: draftData.title || '',
              subtitle: draftData.subtitle || '',
              content: draftData.content || '',
              imageUrl: draftData.imageUrl || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
              featured: draftData.featured || false
            });
            toast.success('Draft restored from your last session');
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, [id, isEditMode, navigate, methods]);
  
  // Auto-save functionality
  useEffect(() => {
    let autoSaveTimer: NodeJS.Timeout;
    
    if (autoSave && !isEditMode && (formValues.title || formValues.content)) {
      autoSaveTimer = setTimeout(() => {
        saveDraft();
      }, 10000); // Auto-save every 10 seconds if there's content
    }
    
    return () => {
      clearTimeout(autoSaveTimer);
    };
  }, [formValues, autoSave, isEditMode]);
  
  const saveDraft = () => {
    if (!formValues.title && !formValues.content) return; // Don't save empty drafts
    
    setDraftSaving(true);
    const now = new Date();
    
    try {
      const draftData = {
        ...formValues,
        savedAt: now.toISOString()
      };
      
      localStorage.setItem('article_draft', JSON.stringify(draftData));
      setLastSaved(now);
      
      // Only show toast if manual save
      if (!autoSave || draftSaving) {
        toast.success('Draft saved');
      }
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Error saving draft:', error);
    } finally {
      setDraftSaving(false);
    }
  };
  
  const onSubmit = async (data: ArticleFormValues) => {
    if (!user?.id) {
      toast.error('You must be logged in to publish an article');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const articleData = {
        title: data.title,
        content: data.content,
        excerpt: data.subtitle,
        cover_image: data.imageUrl,
        is_featured: data.featured,
        is_published: true,
        author_id: user.id,
        slug: data.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        published_at: new Date().toISOString(),
        view_count: 0
      };
      
      if (isEditMode && existingArticle) {
        // Update existing article
        await updateArticle(existingArticle.id, {
          ...articleData,
          updated_at: new Date().toISOString()
        });
        toast.success('Article updated successfully!');
      } else {
        // Create new article
        await createArticle(articleData);
        toast.success('Article published successfully!');
        
        // Clear draft after successful publish
        localStorage.removeItem('article_draft');
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
  
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const hours = Math.floor(diffMins / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
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
            
            {!isEditMode && lastSaved && (
              <span className="text-xs text-gray-400 ml-4">
                Last saved: {formatLastSaved()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {!isEditMode && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-save" 
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                  <Label htmlFor="auto-save" className="text-sm text-gray-600">Auto save</Label>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveDraft}
                  disabled={draftSaving || (!formValues.title && !formValues.content)}
                  className="gap-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  {draftSaving ? 'Saving...' : 'Save draft'}
                </Button>
              </>
            )}
            
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
