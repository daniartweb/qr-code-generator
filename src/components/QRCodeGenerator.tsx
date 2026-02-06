"use client";

import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, Share2, RefreshCw, Type, Link as LinkIcon, 
  FileCode, Palette, Wifi, Mail, Settings2, ShieldCheck, Save
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const QRCodeGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('url');
  const [value, setValue] = useState('https://example.com');
  const [qrName, setQrName] = useState('My QR Code');
  const [isSaving, setIsSaving] = useState(false);
  
  // WiFi State
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState('WPA');

  // Email State
  const [emailAddr, setEmailAddr] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Customization State
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [includeMargin, setIncludeMargin] = useState(false);
  
  const qrRef = useRef<SVGSVGElement>(null);
  const fgColorRef = useRef<HTMLInputElement>(null);
  const bgColorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'wifi') {
      setValue(`WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};;`);
    } else if (activeTab === 'email') {
      setValue(`mailto:${emailAddr}?subject=${encodeURIComponent(emailSub)}&body=${encodeURIComponent(emailBody)}`);
    }
  }, [activeTab, wifiSsid, wifiPass, wifiEnc, emailAddr, emailSub, emailBody]);

  const saveQRCode = async () => {
    if (!user) {
      showError("Please sign in to save QR codes");
      navigate('/login');
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from('qr_codes').insert({
      user_id: user.id,
      name: qrName || 'Untitled QR',
      type: activeTab,
      content: value,
      fg_color: fgColor,
      bg_color: bgColor,
      level: level
    });

    if (error) {
      showError("Failed to save QR code");
    } else {
      showSuccess("QR code saved to your history!");
    }
    setIsSaving(false);
  };

  const downloadPNG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx!.fillStyle = bgColor;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      showSuccess("High-res PNG downloaded!");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const downloadSVG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "qrcode.svg";
    downloadLink.click();
    showSuccess("SVG vector file downloaded!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto px-6 pb-20">
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create something unique</h2>
          <p className="text-slate-500 text-lg">Choose a type and customize your QR code's appearance.</p>
        </div>

        <Card className="p-8 border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[2rem]">
          <div className="mb-8 space-y-2">
            <Label className="text-sm font-bold text-slate-700">QR Code Name</Label>
            <Input 
              placeholder="e.g. My Portfolio Website" 
              value={qrName} 
              onChange={(e) => setQrName(e.target.value)}
              className="h-12 rounded-xl border-slate-200"
            />
          </div>

          <Tabs defaultValue="url" className="w-full" onValueChange={(v) => { setActiveTab(v); setValue(''); }}>
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-100/80 p-1.5 rounded-2xl">
              <TabsTrigger value="url" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <LinkIcon size={16} className="mr-2 hidden sm:inline" /> URL
              </TabsTrigger>
              <TabsTrigger value="text" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Type size={16} className="mr-2 hidden sm:inline" /> Text
              </TabsTrigger>
              <TabsTrigger value="wifi" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Wifi size={16} className="mr-2 hidden sm:inline" /> WiFi
              </TabsTrigger>
              <TabsTrigger value="email" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Mail size={16} className="mr-2 hidden sm:inline" /> Email
              </TabsTrigger>
            </TabsList>
            
            <div className="min-h-[200px]">
              <TabsContent value="url" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Target URL</Label>
                  <Input
                    placeholder="https://your-website.com"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="h-14 rounded-2xl border-slate-200 text-lg focus:ring-indigo-500"
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Message Content</Label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="min-h-[140px] rounded-2xl border-slate-200 text-lg focus:ring-indigo-500 resize-none"
                  />
                </div>
              </TabsContent>

              <TabsContent value="wifi" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Network Name (SSID)</Label>
                    <Input placeholder="Home_WiFi" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Encryption</Label>
                    <Select value={wifiEnc} onValueChange={setWifiEnc}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WPA">WPA/WPA2</SelectItem>
                        <SelectItem value="WEP">WEP</SelectItem>
                        <SelectItem value="nopass">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Password</Label>
                  <Input type="password" placeholder="••••••••" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className="h-12 rounded-xl" />
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Recipient Email</Label>
                  <Input placeholder="hello@example.com" value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Subject</Label>
                  <Input placeholder="Inquiry about..." value={emailSub} onChange={(e) => setEmailSub(e.target.value)} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Body</Label>
                  <Textarea placeholder="Write your message..." value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="h-24 rounded-xl resize-none" />
                </div>
              </TabsContent>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Palette size={16} className="text-indigo-500" /> Appearance
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 ml-1">Foreground</span>
                    <div className="relative flex items-center">
                      <button 
                        onClick={() => fgColorRef.current?.click()}
                        className="absolute left-2.5 w-5 h-5 rounded-full border border-slate-200 shadow-sm z-10"
                        style={{ backgroundColor: fgColor }}
                      />
                      <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="pl-10 h-10 rounded-xl text-xs font-mono" />
                      <input ref={fgColorRef} type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="absolute opacity-0 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 ml-1">Background</span>
                    <div className="relative flex items-center">
                      <button 
                        onClick={() => bgColorRef.current?.click()}
                        className="absolute left-2.5 w-5 h-5 rounded-full border border-slate-200 shadow-sm z-10"
                        style={{ backgroundColor: bgColor }}
                      />
                      <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="pl-10 h-10 rounded-xl text-xs font-mono" />
                      <input ref={bgColorRef} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="absolute opacity-0 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-500" /> Reliability
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 ml-1">Error Correction</span>
                    <Select value={level} onValueChange={(v: any) => setLevel(v)}>
                      <SelectTrigger className="h-10 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 flex items-end">
                    <Button 
                      variant="outline" 
                      className="w-full h-10 rounded-xl border-slate-200 text-slate-500 hover:text-indigo-600"
                      onClick={() => {
                        setFgColor('#000000');
                        setBgColor('#FFFFFF');
                        setLevel('H');
                      }}
                    >
                      <RefreshCw size={14} className="mr-2" /> Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </Card>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-8">
        <Card className="p-10 border-none shadow-2xl shadow-indigo-100/50 bg-white rounded-[3rem] flex flex-col items-center gap-8 w-full max-w-md">
          <div 
            className="p-8 rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeSVG
              ref={qrRef}
              value={value || ' '}
              size={256}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              includeMargin={includeMargin}
            />
          </div>

          <div className="flex flex-col w-full gap-3">
            <Button 
              onClick={saveQRCode}
              disabled={isSaving}
              className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              <Save className="mr-2" size={22} /> {isSaving ? 'Saving...' : 'Save to History'}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={downloadPNG}
                className="h-14 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
              >
                <Download className="mr-2" size={18} /> PNG
              </Button>
              <Button 
                variant="outline"
                onClick={downloadSVG}
                className="h-14 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
              >
                <FileCode className="mr-2" size={18} /> SVG
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
            <Settings2 size={12} />
            <span>{level === 'H' ? 'Maximum' : 'Standard'} Reliability Enabled</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeGenerator;