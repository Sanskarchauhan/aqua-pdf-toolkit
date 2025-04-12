
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: April 12, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
          <p className="mb-4">
            At AquaPDF, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our website and services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <h3 className="text-xl font-medium mt-6 mb-3">Personal Information</h3>
          <p className="mb-4">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Register for an account</li>
            <li>Subscribe to our newsletter</li>
            <li>Request customer support</li>
            <li>Use certain features of our website</li>
          </ul>
          <p className="mb-4">
            This information may include your name, email address, and other information you choose to provide.
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Files and Documents</h3>
          <p className="mb-4">
            When you use our PDF tools, we process the documents you upload. We do not permanently store your documents
            on our servers. Files are processed in-memory and are automatically deleted after processing is complete or 
            after a short period of time.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We may use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Providing and maintaining our services</li>
            <li>Managing your account and preferences</li>
            <li>Responding to your inquiries and support requests</li>
            <li>Sending you technical notices and updates</li>
            <li>Improving our website and services</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <a href="mailto:chauhansankar555@gmail.com" className="text-primary hover:underline">chauhansankar555@gmail.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
