
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create a new user with admin role
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            isAdmin: true,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success('Admin user created! Please check your email to confirm your account.');
      navigate('/signin');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create Admin User</h1>
          <p className="mt-2 text-sm text-gray-600">
            This page is for development purposes only.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleCreateAdmin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Admin Name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={8}
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Admin User'}
          </Button>
          
          <div className="text-center text-sm">
            <Button
              variant="link"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </form>
        
        <div className="mt-4 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="text-yellow-800">
              <p className="text-sm font-medium">Important Note</p>
              <p className="mt-1 text-xs">
                This page should be removed or protected in production environments.
                After creating an admin user, you can access the admin dashboard at /admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
