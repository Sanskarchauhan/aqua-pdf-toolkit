
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './App.css';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Pricing from './pages/Pricing';
import Tools from './pages/Tools';
import GetStarted from './pages/GetStarted';
import Workspace from './pages/Workspace';
import { AuthProvider } from './contexts/AuthContext';
import ToolPage from './pages/ToolPage';
import CompressPdf from './pages/tools/CompressPdf';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UnlockPdf from './pages/tools/UnlockPdf';
import PdfOcr from './pages/tools/PdfOcr';
import EditPdf from './pages/tools/EditPdf';
import DeletePages from './pages/tools/DeletePages';
import ExtractPages from './pages/tools/ExtractPages';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <Helmet>
                <title>PDF Tools - Edit, Compress, Convert and Manage PDF Files</title>
                <meta name="description" content="Professional PDF tools to edit, compress, convert, rotate, unlock and watermark PDFs with just a few clicks. Free online PDF editor with powerful features." />
                <meta name="keywords" content="pdf tools, pdf editor, compress pdf, merge pdf, split pdf, convert pdf, rotate pdf, unlock pdf, edit pdf, ocr pdf, extract pdf pages" />
                <meta property="og:title" content="PDF Tools - Edit, Compress, Convert and Manage PDF Files" />
                <meta property="og:description" content="Professional PDF tools to edit, compress, convert, rotate, unlock and watermark PDFs with just a few clicks." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="PDF Tools - Edit, Compress, Convert and Manage PDF Files" />
                <meta name="twitter:description" content="Professional PDF tools to edit, compress, convert, rotate, unlock and watermark PDFs with just a few clicks." />
              </Helmet>

              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/tools/:toolId" element={<ToolPage />} />
                <Route path="/tools/compress-pdf" element={<CompressPdf />} />
                <Route path="/tools/unlock-pdf" element={<UnlockPdf />} />
                <Route path="/tools/pdf-ocr" element={<PdfOcr />} />
                <Route path="/tools/edit-pdf" element={<EditPdf />} />
                <Route path="/tools/delete-pages" element={<DeletePages />} />
                <Route path="/tools/extract-pages" element={<ExtractPages />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
