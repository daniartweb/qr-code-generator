"use client";

import React from 'react';
import { QrCode, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full py-8 px-6 flex items-center justify-between max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <QrCode className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">QuickQR</h1>
      </div>
      <nav className="flex items-center gap-4">
        <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 rounded-xl">
          Pricing
        </Button>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 flex gap-2">
          <UserCircle size={18} />
          Sign In
        </Button>
      </nav>
    </header>
  );
};

export default Header;