"use client";

import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, Share2, RefreshCw, Type, Link as LinkIcon, 
  FileCode, Palette, Wifi, Mail, Settings2, ShieldCheck,
  UserPlus, MessageSquare, Image as ImageIcon, History, Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess } from "@/utils/toast";

interface HistoryItem {
  id: string;
  type: string;
  value: string;
  timestamp: number;
}

const QRCodeGenerator = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [value, setValue] = useState('https://example.com');
  
  // WiFi State
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState('WPA');

  // Email State
  const [emailAddr, setEmailAddr] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // SMS State
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // vCard State
  const [vName, setVName] = useState('');
  const [vOrg, setVOrg] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');

  // Customization State
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const qrRef = useRef<SVGSVGElement>(null);
  const fgColorRef = useRef<HTMLInputElement>(null);
  const bgColorRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('qr_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Update QR value based on active tab
  useEffect(() => {
    let newValue = value;
    if (activeTab === 'wifi') {
      newValue = `WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};;`;
    } else if (activeTab === 'email') {
      newValue = `mailto:${emailAddr}?subject=${encodeURIComponent(emailSub)}&body=${encodeURIComponent(emailBody)}`;
    } else if (activeTab === 'sms') {
      newValue = `SMSTO:${smsPhone}:${smsMessage}`;
    } else if (activeTab === 'vcard') {
      newValue = `BEGIN:VCARD\nVERSION:3.0\nFN:${vName}\nORG:${vOrg}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
    }
    setValue(newValue);
  }, [activeTab, wifiSsid, wifiPass, wifiEnc, emailAddr, emailSub, emailBody, smsPhone, smsMessage, vName, vOrg, vPhone, vEmail]);

  const saveToHistory = () => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: activeTab,
      value: value,
      timestamp: Date.now()
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('qr_history', JSON.stringify(updated));
  };

  const downloadPNG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    saveToHistory();
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
      downloadLink.download = `qrcode-${activeTab}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      showSuccess("High-res PNG downloaded!");
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogoUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto px-6 pb-20">
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Professional QR Studio</h2>
          <p className="text-slate-500 text-lg">Generate, customize, and brand your QR codes in seconds.</p>
        </div>

        <Card className="p-8 border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[2rem]">
          <Tabs defaultValue="url" className="w-full" onValueChange={(v) => { setActiveTab(v); }}>
            <TabsList className="flex flex-wrap h-auto w-full mb-8 bg-slate-100/80 p-1.5 rounded-2xl gap-1">
              <TabsTrigger value="url" className="flex-1 rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <LinkIcon size={14} className="mr-2" /> URL
              </TabsTrigger>
              <TabsTrigger value="text" className="flex-1 rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Type size={14} className="mr-2" /> Text
              </TabsTrigger>
              <TabsTrigger value="wifi" className="flex-1 rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Wifi size={14} className="mr-2" /> WiFi
              </TabsTrigger>
              <TabsTrigger value="vcard" className="flex-1 rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <UserPlus size={14} className="mr-2" /> vCard
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex-1 rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <MessageSquare size={14} className="mr-2" /> SMS
              </TabsTrigger>
            </TabsList>
            
            <div className="min-h-[240px]">
              <TabsContent value="url" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Target URL</Label>
                  <Input placeholder="https://your-website.com" value={value} onChange={(e) => setValue(e.target.value)} className="h-14 rounded-2xl border-slate-200 text-lg" />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Message Content</Label>
                  <Textarea placeholder="Type your message here..." value={value} onChange={(e) => setValue(e.target.value)} className="min-h-[140px] rounded-2xl border-slate-200 text-lg resize-none" />
                </div>
              </TabsContent>

              <TabsContent value="wifi" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">SSID</Label>
                    <Input placeholder="Network Name" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Encryption</Label>
                    <Select value={wifiEnc} onValueChange={setWifiEnc}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
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

              <TabsContent value="vcard" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Full Name</Label>
                    <Input placeholder="John Doe" value={vName} onChange={(e) => setVName(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Organization</Label>
                    <Input placeholder="Company Inc." value={vOrg} onChange={(e) => setVOrg(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Phone</Label>
                    <Input placeholder="+1 234 567 890" value={vPhone} onChange={(e) => setVPhone(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Email</Label>
                    <Input placeholder="john@example.com" value={vEmail} onChange={(e) => setVEmail(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Phone Number</Label>
                  <Input placeholder="+1 234 567 890" value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Message</Label>
                  <Textarea placeholder="Hello, I'm interested in..." value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} className="h-24 rounded-xl resize-none" />
                </div>
              </TabsContent>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Palette size={16} className="text-indigo-500" /> Colors
                </Label>
                <div className="flex flex-col gap-3">
                  <div className="relative flex items-center">
                    <button onClick={() => fgColorRef.current?.click()} className="absolute left-2.5 w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: fgColor }} />
                    <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="pl-10 h-10 rounded-xl text-xs font-mono" />
                    <input ref={fgColorRef} type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="absolute opacity-0 pointer-events-none" />
                  </div>
                  <div className="relative flex items-center">
                    <button onClick={() => bgColorRef.current?.click()} className="absolute left-2.5 w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: bgColor }} />
                    <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="pl-10 h-10 rounded-xl text-xs font-mono" />
                    <input ref={bgColorRef} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="absolute opacity-0 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon size={16} className="text-indigo-500" /> Logo Overlay
                </Label>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full h-10 rounded-xl border-dashed border-slate-300 text-slate-500" onClick={() => logoInputRef.current?.click()}>
                    {logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  {logoUrl && (
                    <Button variant="ghost" size="sm" className="w-full text-xs text-red-500 hover:text-red-600" onClick={() => setLogoUrl(null)}>
                      Remove Logo
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-500" /> Quality
                </Label>
                <Select value={level} onValueChange={(v: any) => setLevel(v)}>
                  <SelectTrigger className="h-10 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full h-10 rounded-xl text-slate-500" onClick={() => { setFgColor('#000000'); setBgColor('#FFFFFF'); setLogoUrl(null); setLevel('H'); }}>
                  <RefreshCw size={14} className="mr-2" /> Reset All
                </Button>
              </div>
            </div>
          </Tabs>
        </Card>

        {history.length > 0 && (
          <Card className="p-6 border-none shadow-xl shadow-slate-100 bg-white rounded-[2rem]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <History size={18} className="text-indigo-500" /> Recent Generations
              </h3>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500" onClick={() => { setHistory([]); localStorage.removeItem('qr_history'); }}>
                <Trash2 size={14} />
              </Button>
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => { setActiveTab(item.type); setValue(item.value); }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <QRCodeSVG value={item.value} size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 capitalize">{item.type}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.value}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-8">
        <Card className="p-10 border-none shadow-2xl shadow-indigo-100/50 bg-white rounded-[3rem] flex flex-col items-center gap-8 w-full max-w-md">
          <div className="p-8 rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:scale-[1.02]" style={{ backgroundColor: bgColor }}>
            <QRCodeSVG
              ref={qrRef}
              value={value || ' '}
              size={256}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              includeMargin={includeMargin}
              imageSettings={logoUrl ? {
                src: logoUrl,
                x: undefined,
                y: undefined,
                height: 48,
                width: 48,
                excavate: true,
              } : undefined}
            />
          </div>

          <div className="flex flex-col w-full gap-3">
            <Button onClick={downloadPNG} className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-200 transition-all active:scale-95">
              <Download className="mr-2" size={22} /> Download PNG
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={downloadSVG} className="h-14 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                <FileCode className="mr-2" size={18} /> SVG
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold" onClick={() => { navigator.clipboard.writeText(value); showSuccess("Copied to clipboard!"); }}>
                <Share2 className="mr-2" size={18} /> Copy
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