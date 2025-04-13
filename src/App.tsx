import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import Workspace from "./pages/Workspace";
import ToolPage from "./pages/ToolPage";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import EditPdf from "./pages/tools/EditPdf";
import PdfOcr from "./pages/tools/PdfOcr";

// Function to set initial theme from localStorage to prevent flashing
const setInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  }
};

// Execute immediately to prevent flashing
setInitialTheme();

// Auth route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/tools" element={<Tools />} />
          
          <Route path="/tools/:toolId" element={
            <ProtectedRoute>
              <ToolPage />
            </ProtectedRoute>
          } />
          
          <Route path="/tool/:toolId" element={<Navigate to={(location) => `/tools${location.pathname.substring(5)}`} replace />} />
          
          <Route path="/tools/edit-pdf" element={
            <ProtectedRoute>
              <EditPdf />
            </ProtectedRoute>
          } />
          <Route path="/tools/pdf-ocr" element={
            <ProtectedRoute>
              <PdfOcr />
            </ProtectedRoute>
          } />
          
          <Route path="/workspace" element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/get-started" element={<GetStarted />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<About />} /> {/* Placeholder, you can create a proper Help page later */}
          <Route path="/blog" element={<About />} /> {/* Placeholder */}
          <Route path="/tutorials" element={<About />} /> {/* Placeholder */}
          <Route path="/api" element={<About />} /> {/* Placeholder */}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="AquaPDF is an all-in-one PDF toolkit for editing, converting, compressing and signing PDF documents online." />
          <meta name="keywords" content="pdf editor, pdf converter, pdf tools, compress pdf, merge pdf, split pdf, pdf to word" />
        </Helmet>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
