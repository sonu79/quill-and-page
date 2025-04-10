
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { PenLine, Users, Settings, FileText } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-slate-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            title="Manage Articles" 
            icon={<FileText className="h-8 w-8" />}
            description="Create, edit, and manage all articles"
            actionText="Manage Articles"
            onClick={() => navigate('/admin/manage-articles')}
          />
          
          <DashboardCard 
            title="Manage Users" 
            icon={<Users className="h-8 w-8" />}
            description="View and manage user accounts"
            actionText="Manage Users"
            onClick={() => {/* Future functionality */}}
          />
          
          <DashboardCard 
            title="Create Content" 
            icon={<PenLine className="h-8 w-8" />}
            description="Write new articles and content"
            actionText="New Article"
            onClick={() => navigate('/admin/new-article')}
          />
          
          <DashboardCard 
            title="Site Settings" 
            icon={<Settings className="h-8 w-8" />}
            description="Configure global site settings"
            actionText="Settings"
            onClick={() => {/* Future functionality */}}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  actionText: string;
  onClick?: () => void;
}

const DashboardCard = ({ title, icon, description, actionText, onClick }: DashboardCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col">
      <div className="mb-4 text-primary">
        {icon}
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <Button className="w-full" onClick={onClick}>{actionText}</Button>
    </div>
  );
};

export default Admin;
