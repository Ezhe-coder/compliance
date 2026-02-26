import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Loader2, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function Scan() {
  const [files, setFiles] = useState<File[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    }
  } as any);

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((f) => f.name !== name));
  };

  const handleScan = async () => {
    if (files.length === 0) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      // Simulate API call or use Gemini if configured
      // For now, we'll just simulate a delay and a mock response
      // In a real implementation, this would loop through configured APIs
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setScanResult("Scan complete. No critical compliance issues found in the uploaded assets.");
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Compliance Scan</h1>
        <p className="text-gray-500 mt-1">Upload media assets to run against your configured compliance APIs.</p>
      </div>

      {/* Upload Area */}
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-white'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <UploadCloud size={32} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Files to Scan ({files.length})</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {files.map((file) => (
              <li key={file.name} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button 
                  onClick={() => removeFile(file.name)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={handleScan}
          disabled={files.length === 0 || isScanning}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all
            ${files.length === 0 || isScanning 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}
          `}
        >
          {isScanning ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              Run Compliance Check
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Results Preview */}
      {scanResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="h-6 w-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-emerald-900">Scan Complete</h3>
              <p className="text-emerald-700 mt-1">{scanResult}</p>
              <button className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800 underline">
                View Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { CheckCircle } from 'lucide-react';
