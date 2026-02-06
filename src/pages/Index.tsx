"use client";

import React from 'react';
import Header from '@/components/Header';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      
      <main className="pt-4">
        <QRCodeGenerator />
      </main>

      <footer className="py-12 border-t border-slate-200 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm">
            © {new Date().getFullYear()} QuickQR. Simple, fast, and private.
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API</a>
          </div>
        </div>
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;