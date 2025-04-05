
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { articles } from '@/data/articles';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

const ManageArticles = () => {
  const navigate = useNavigate();
  
  const handleDelete = (id: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we're just simulating the deletion
    toast.success(`Article with ID ${id} has been deleted.`);
  };
  
  const handleEdit = (id: string) => {
    navigate(`/admin/edit-article/${id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.authorId}</TableCell>
                  <TableCell>{formatDate(article.publishedDate)}</TableCell>
                  <TableCell>{article.featured ? "Yes" : "No"}</TableCell>
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
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageArticles;
