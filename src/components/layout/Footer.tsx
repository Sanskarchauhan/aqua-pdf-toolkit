
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, ShieldCheck, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">PDF Tools</h3>
            <p className="text-muted-foreground text-sm mb-4">
              All-in-one solution for working with PDF documents. Edit, convert, and manage PDFs with ease.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  All PDF Tools
                </Link>
              </li>
              <li>
                <Link to="/tools/compress-pdf" className="text-muted-foreground hover:text-foreground transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link to="/tools/edit-pdf" className="text-muted-foreground hover:text-foreground transition-colors">
                  Edit PDF
                </Link>
              </li>
              <li>
                <Link to="/tools/pdf-ocr" className="text-muted-foreground hover:text-foreground transition-colors">
                  PDF OCR
                </Link>
              </li>
              <li>
                <Link to="/tools/unlock-pdf" className="text-muted-foreground hover:text-foreground transition-colors">
                  Unlock PDF
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="text-muted-foreground hover:text-foreground transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:chauhansankar555@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} PDF Tools. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center">
            Application developed by Sanskar Chauhan
            <Heart className="h-4 w-4 text-red-500 ml-2" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
