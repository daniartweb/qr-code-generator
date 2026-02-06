"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Trash2, Calendar, ExternalLink, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';

interface QRCode {
  id: string;
  name: string;
  type: string;
  content: string;
  fg_color: string;
  bg_color: string;
  level: string;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [codes, setCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCodes = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showError("Failed to load QR codes");
    } else {
      setCodes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, [user]);

  const deleteCode = async (id: string) => {
    const { error } = await supabase
      .from('qr_codes')
      .delete()
      .eq('id', id);

    if (error) {
      showError("Failed to delete QR code");
    } else {
      showSuccess("QR code deleted");
      setCodes(codes.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <History className="text-indigo-600" /> My QR History
            </h1>
            <p className="text-slate-500">You have generated {codes.length} QR codes.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-64 animate-pulse bg-slate-100 border-none rounded-3xl" />
            ))}
          </div>
        ) : codes.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-transparent rounded-[2.5rem]">
            <p className="text-slate-400 text-lg">No QR codes saved yet. Go create one!</p>
            <Button className="mt-4 bg-indigo-600 rounded-xl" onClick={() => window.location.href = '/'}>
              Create QR Code
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codes.map((code) => (
              <Card key={code.id} className="p-6 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] group">
                <div className="flex flex-col items-center gap-6">
                  <div 
                    className="p-4 rounded-2xl border border-slate-100"
                    style={{ backgroundColor: code.bg_color }}
                  >
                    <QRCodeSVG
                      value={code.content}
                      size={140}
                      fgColor={code.fg_color}
                      bgColor={code.bg_color}
                      level={code.level as any}
                    />
                  </div>
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 truncate max-w-[150px]">{code.name}</h3>
                      <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                        {code.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={12} />
                      {format(new Date(code.created_at), 'MMM d, yyyy')}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-10 rounded-xl border-slate-200 text-slate-600 hover:text-indigo-600"
                        onClick={() => {
                          navigator.clipboard.writeText(code.content);
                          showSuccess("Content copied!");
                        }}
                      >
                        <ExternalLink size={14} className="mr-2" /> Copy
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteCode(code.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;