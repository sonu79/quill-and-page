
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="font-serif text-2xl font-bold">Quill & Page</Link>
          <nav className="hidden md:block">
            <ul className="flex gap-8">
              <li><Link to="/" className="text-gray-700 hover:text-black">Home</Link></li>
              <li><Link to="/" className="text-gray-700 hover:text-black">Technology</Link></li>
              <li><Link to="/" className="text-gray-700 hover:text-black">Travel</Link></li>
              <li><Link to="/" className="text-gray-700 hover:text-black">Business</Link></li>
              <li><Link to="/" className="text-gray-700 hover:text-black">Culture</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button size="sm" variant="outline" className="rounded-full">Sign In</Button>
          <Button size="sm" className="rounded-full">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
