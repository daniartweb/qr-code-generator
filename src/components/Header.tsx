"use client";

import React from 'react';
import { QrCode, UserCircle, LogOut, LayoutDashboard, Plus, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from './AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full py-8 px-6 flex items-center justify-between max-w-6xl mx-auto">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <QrCode className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">QuickQR</h1>
      </Link>
      
      <nav className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="hidden sm:flex text-slate-600 hover:text-indigo-600 rounded-xl gap-2"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard size={18} />
              History
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-slate-200">
                  <div className="bg-indigo-100 w-full h-full flex items-center justify-center text-indigo-600 font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl p-2" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-slate-500 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={() => navigate('/')}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create New</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl cursor-pointer text-red-600 focus:text-red-600" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              className="text-slate-600 hover:text-indigo-600 rounded-xl px-4 hidden sm:flex"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 flex gap-2 shadow-lg shadow-indigo-100"
              onClick={() => navigate('/login')}
            >
              <UserPlus size={18} />
              Get Started
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;