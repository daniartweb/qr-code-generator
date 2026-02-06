"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 border-none shadow-2xl rounded-[2.5rem] bg-white">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl">
            <QrCode className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to QuickQR</h1>
          <p className="text-slate-500 text-center">Sign in to save your QR codes and track your history.</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4F46E5',
                  brandAccent: '#4338CA',
                },
                radii: {
                  buttonRadius: '1rem',
                  inputRadius: '1rem',
                }
              }
            }
          }}
          providers={[]}
          theme="light"
        />
      </Card>
    </div>
  );
};

export default Login;