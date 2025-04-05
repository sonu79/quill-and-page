
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-serif text-2xl font-bold">Quill & Page</Link>
            <p className="mt-4 text-gray-600 max-w-md">A modern publishing platform focusing on quality content and thoughtful discussions.</p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-600 hover:text-black">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Topics</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-black">Technology</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-black">Travel</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-black">Business</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-black">Culture</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-black">Science</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-black">About</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-black">Careers</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-black">Privacy Policy</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-black">Terms of Service</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-black">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Quill & Page. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
