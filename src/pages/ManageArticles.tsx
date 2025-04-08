
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { fetchAllArticles, deleteArticle, SupabaseArticle } from '@/services/articleService';
import { fetchProfiles } from '@/services/profileService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

const ManageArticles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  
  const { data: articles, isLoading } = useQuery({
    queryKey: ['adminArticles'],
    queryFn: fetchAllArticles,
    enabled: isAdmin // Only fetch if user is admin
  });

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
    enabled: isAdmin // Only fetch if user is admin
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminArticles'] });
      toast.success('Article has been deleted.');
    },
    onError: (error) => {
      toast.error(`Failed to delete article: ${error.message}`);
    }
  });
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleEdit = (id: string) => {
    navigate(`/admin/edit-article/${id}`);
  };
  
  const getAuthorName = (authorId: string | null) => {
    if (!authorId || !profiles) return 'Unknown';
    const profile = profiles.find(p => p.id === authorId);
    return profile ? (profile.name || profile.username || 'Anonymous') : 'Unknown';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-4">You do not have permission to access this page.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
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
          <h1 className="text-3xl font-bold mb-2">Manage Articles</h1>
          <p className="text-gray-600">Edit or delete existing articles</p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Articles</h2>
          <Button onClick={() => navigate('/admin/new-article')}>
            <Plus className="mr-1 h-4 w-4" /> New Article
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles && articles.length > 0 ? (
                  articles.map((article: SupabaseArticle) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>{getAuthorName(article.author_id)}</TableCell>
                      <TableCell>{formatDate(article.created_at)}</TableCell>
                      <TableCell>{article.is_published ? "Yes" : "No"}</TableCell>
                      <TableCell>{article.is_featured ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(article.id)}
                            title="Edit article"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            title="Delete article"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No articles found. Create your first article by clicking "New Article".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageArticles;
