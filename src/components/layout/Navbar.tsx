
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { FileIcon, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 mr-4">
          <FileIcon className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold">
            Aqua<span className="text-primary">PDF</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : ''}`}>
            Home
          </Link>
          <Link to="/tools" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/tools' || location.pathname.startsWith('/tools/') ? 'text-primary' : ''}`}>
            All Tools
          </Link>
          <Link to="/workspace" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/workspace' ? 'text-primary' : ''}`}>
            Workspace
          </Link>
          <Link to="/get-started" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/get-started' ? 'text-primary' : ''}`}>
            Get Started
          </Link>
        </nav>
        
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/tools">All Tools</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/workspace">Workspace</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/get-started">Get Started</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login">Sign In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup">Sign Up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="ml-auto hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
