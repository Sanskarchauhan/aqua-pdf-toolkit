
import React from 'react';
import { Link } from 'react-router-dom';
import { FileIcon, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">
              Aqua<span className="text-primary">PDF</span>
            </span>
          </div>
          <p className="text-muted-foreground">
            Powerful PDF tools for all your document needs.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Github size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-3">Tools</h3>
          <ul className="space-y-2">
            <li><Link to="/tools/compress" className="text-muted-foreground hover:text-foreground">Compress PDF</Link></li>
            <li><Link to="/tools/convert" className="text-muted-foreground hover:text-foreground">Convert PDF</Link></li>
            <li><Link to="/tools/merge" className="text-muted-foreground hover:text-foreground">Merge PDFs</Link></li>
            <li><Link to="/tools/ai" className="text-muted-foreground hover:text-foreground">AI Tools</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-3">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground">Tutorials</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground">API</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-3">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t">
        <p className="text-center text-muted-foreground text-sm">
          © {currentYear} AquaPDF. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
