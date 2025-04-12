
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About AquaPDF</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            AquaPDF is a powerful suite of PDF tools designed to make working with PDF documents simple and efficient.
          </p>
          <p className="mb-4">
            Created by Sanskar Chauhan, our mission is to provide high-quality PDF editing, conversion, and management tools that are accessible to everyone.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p className="mb-4">
            AquaPDF started as a simple project to address the common frustrations people face when working with PDF files. 
            What began as a basic conversion tool has grown into a comprehensive platform offering a wide range of PDF utilities.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Simplicity</strong> - Tools that are intuitive and easy to use</li>
            <li><strong>Quality</strong> - High-fidelity document processing that preserves your content</li>
            <li><strong>Security</strong> - Your documents are processed securely and never stored permanently</li>
            <li><strong>Innovation</strong> - Continuously improving our tools with the latest technologies</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            Have questions or suggestions? Feel free to reach out to us at 
            <a href="mailto:chauhansankar555@gmail.com" className="text-primary hover:underline ml-1">chauhansankar555@gmail.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
