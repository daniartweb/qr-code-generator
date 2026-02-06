"use client";

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, RefreshCw, Type, Link as LinkIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess } from "@/utils/toast";

const QRCodeGenerator = () => {
  const [value, setValue] = useState('https://dyad.sh');
  const [fgColor, setFgColor] = useState('#000000');
  const [size, setSize] = useState(256);
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQRCode = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      showSuccess("QR Code downloaded successfully!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto px-6 pb-20">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Generate your QR Code</h2>
          <p className="text-slate-500">Enter your URL or text below to create a custom QR code instantly.</p>
        </div>

        <Card className="p-6 border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-2xl">
              <TabsTrigger value="url" className="rounded-xl flex gap-2">
                <LinkIcon size={16} /> URL
              </TabsTrigger>
              <TabsTrigger value="text" className="rounded-xl flex gap-2">
                <Type size={16} /> Text
              </TabsTrigger>
            </TabsList>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold text-slate-700">
                  Content
                </Label>
                <Input
                  id="content"
                  placeholder={value === 'url' ? "https://example.com" : "Enter your text here..."}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-sm font-semibold text-slate-700">
                    QR Color
                  </Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      id="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-10 w-full rounded-xl cursor-pointer border-none p-0 overflow-hidden"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Quick Actions
                  </Label>
                  <Button 
                    variant="outline" 
                    className="w-full h-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                    onClick={() => setValue('')}
                  >
                    <RefreshCw size={16} className="mr-2" /> Clear
                  </Button>
                </div>
              </div>
            </div>
          </Tabs>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center lg:sticky lg:top-8">
        <Card className="p-10 border-none shadow-2xl shadow-indigo-100 bg-white rounded-[2.5rem] flex flex-col items-center gap-8 w-full max-w-md">
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
            <QRCodeSVG
              ref={qrRef}
              value={value || ' '}
              size={size}
              fgColor={fgColor}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="flex flex-col w-full gap-3">
            <Button 
              onClick={downloadQRCode}
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="mr-2" size={20} /> Download PNG
            </Button>
            <Button 
              variant="ghost"
              className="w-full h-12 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => {
                navigator.clipboard.writeText(value);
                showSuccess("Content copied to clipboard!");
              }}
            >
              <Share2 className="mr-2" size={18} /> Copy Content
            </Button>
          </div>
          
          <p className="text-xs text-slate-400 text-center">
            High-quality QR code generated instantly. <br/>
            Scan with any mobile device.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeGenerator;