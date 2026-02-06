"use client";

import React from 'react';
import { QrCode } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-8 px-6 flex items-center justify-between max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <QrCode className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">QuickQR</h1>
      </div>
      <nav>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Minimalist Generator
        </span>
      </nav>
    </header>
  );
};

export default Header;