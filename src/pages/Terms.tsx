
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: April 12, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using AquaPDF's website and services, you accept and agree to be bound by the terms 
            and conditions of this agreement.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Services</h2>
          <p className="mb-4">
            AquaPDF provides tools for editing, converting, and managing PDF documents. Users can access both free 
            and premium features based on their subscription status.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p className="mb-4">
            To access certain features, you may need to create an account. You are responsible for maintaining the 
            confidentiality of your account information and for all activities that occur under your account.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Free and Premium Services</h2>
          <p className="mb-4">
            AquaPDF offers both free and premium services:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Free accounts have limited usage (3 operations)</li>
            <li>Premium subscriptions provide unlimited access to all features</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
          <p className="mb-4">
            The content, features, and functionality of AquaPDF are owned by AquaPDF and are protected by copyright, 
            trademark, and other intellectual property laws.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Privacy Policy</h2>
          <p className="mb-4">
            Your use of AquaPDF is also governed by our Privacy Policy, which can be found 
            <a href="/privacy" className="text-primary hover:underline ml-1">here</a>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
          <p>
            For questions about these Terms, please contact us at
            <a href="mailto:chauhansankar555@gmail.com" className="text-primary hover:underline ml-1">chauhansankar555@gmail.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
