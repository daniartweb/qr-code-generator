"use client";

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, RefreshCw, Type, Link as LinkIcon, FileCode, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess } from "@/utils/toast";

const QRCodeGenerator = () => {
  const [value, setValue] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#4F46E5');
  const [size, setSize] = useState(256);
  const qrRef = useRef<SVGSVGElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const downloadPNG = () => {
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
      showSuccess("QR Code downloaded as PNG!");
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
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showSuccess("QR Code downloaded as SVG!");
  };

  const handleColorBlobClick = () => {
    colorInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto px-6 pb-20">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Generate your QR Code</h2>
          <p className="text-slate-500">Enter your URL or text below to create a custom QR code instantly.</p>
        </div>

        <Card className="p-6 border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl">
          <Tabs defaultValue="url" className="w-full" onValueChange={() => setValue('')}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-2xl">
              <TabsTrigger value="url" className="rounded-xl flex gap-2">
                <LinkIcon size={16} /> URL
              </TabsTrigger>
              <TabsTrigger value="text" className="rounded-xl flex gap-2">
                <Type size={16} /> Text
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-6 mt-0">
              <div className="space-y-2">
                <Label htmlFor="url-content" className="text-sm font-semibold text-slate-700">
                  Website URL
                </Label>
                <Input
                  id="url-content"
                  placeholder="https://example.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-6 mt-0">
              <div className="space-y-2">
                <Label htmlFor="text-content" className="text-sm font-semibold text-slate-700">
                  Plain Text
                </Label>
                <Textarea
                  id="text-content"
                  placeholder="Enter your message here..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="min-h-[120px] rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
            </TabsContent>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[140px] space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Palette size={14} /> QR Color
                  </Label>
                  <div className="relative flex items-center group">
                    <button 
                      type="button"
                      onClick={handleColorBlobClick}
                      className="absolute left-3 w-6 h-6 rounded-full border border-slate-200 shadow-sm z-10 transition-transform hover:scale-110 active:scale-95"
                      style={{ backgroundColor: fgColor }}
                      title="Open color picker"
                    />
                    <Input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="pl-11 h-11 rounded-xl border-slate-200 font-mono text-sm focus:ring-indigo-500"
                    />
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="absolute right-2 w-8 h-8 opacity-0 pointer-events-none"
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 px-4"
                  onClick={() => {
                    setValue('');
                    setFgColor('#4F46E5');
                  }}
                >
                  <RefreshCw size={16} className="mr-2" /> Reset
                </Button>
              </div>
            </div>
          </Tabs>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center lg:sticky lg:top-8">
        <Card className="p-10 border-none shadow-2xl shadow-indigo-100 bg-white rounded-[2.5rem] flex flex-col items-center gap-8 w-full max-w-md">
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-inner">
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
              onClick={downloadPNG}
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="mr-2" size={20} /> Download PNG
            </Button>
            <Button 
              variant="outline"
              onClick={downloadSVG}
              className="w-full h-14 rounded-2xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold transition-all"
            >
              <FileCode className="mr-2" size={20} /> Download SVG
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