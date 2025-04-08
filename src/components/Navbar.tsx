
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Successfully signed out!');
    navigate('/');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="font-serif text-2xl font-bold">Quill & Page</Link>
          <nav className="hidden md:block">
            <ul className="flex gap-8">
              <li><Link to="/" className="text-gray-700 hover:text-black">Home</Link></li>
              <li><Link to="/" className="text-gray-700 hover:text-black">Trading</Link></li>
              <li><Link to="/" className="text-gray-700 hover:text-black">Python</Link></li>
              <li><Link to="/" className="text-gray-700 hover:text-black">AI tools</Link></li>
              <li><Link to="/" className="text-gray-700 hover:text-black">Data Science</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline">Hello, {user?.name || user?.username}</span>
              
              {isAdmin && (
                <Link to="/admin">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Button>
                </Link>
              )}
              
              <Button 
                onClick={handleLogout} 
                size="sm" 
                variant="outline" 
                className="rounded-full flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <Button size="sm" variant="outline" className="rounded-full">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="rounded-full">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
