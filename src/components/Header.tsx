"use client";

import React from 'react';
import { QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full py-8 px-6 flex items-center justify-between max-w-5xl mx-auto">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <QrCode className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">QuickQR</h1>
      </Link>
      {/* Navigation buttons hidden as requested */}
    </header>
  );
};

export default Header;