import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Loader2, ArrowRight, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ApiConfig, ScanResult } from '../types/config';
import { runComplianceScan } from '../services/complianceService';

export default function Scan() {
  const [files, setFiles] = useState<File[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  
  // Load configs to pass to service
  const [apis] = useLocalStorage<ApiConfig[]>('compliance_apis', []);
  const [savedReports, setSavedReports] = useLocalStorage<ScanResult[]>('compliance_reports', []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'text/*': ['.txt', '.json', '.md']
    }
  } as any);

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((f) => f.name !== name));
  };

  const handleScan = async () => {
    if (files.length === 0) return;
    setIsScanning(true);
    setResults([]);

    try {
      const activeApis = apis.filter(a => a.isActive);
      if (activeApis.length === 0) {
        alert("No active APIs configured. Please go to Settings to configure an API.");
        setIsScanning(false);
        return;
      }

      const allResults: ScanResult[] = [];
      
      for (const file of files) {
        const fileResults = await runComplianceScan(file, apis);
        allResults.push(...fileResults);
      }

      setResults(allResults);
      setSavedReports([...savedReports, ...allResults]);
      
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
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
            <p className="text-sm text-gray-500 mt-1">Images or Text files</p>
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
      {results.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="font-semibold text-gray-900">Scan Results</h2>
          {results.map((res) => (
            <div key={res.id} className={`
              border rounded-xl p-4 flex items-start gap-4
              ${res.status === 'Compliant' ? 'bg-emerald-50 border-emerald-200' : 
                res.status === 'Error' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}
            `}>
              <div className="mt-1">
                {res.status === 'Compliant' && <CheckCircle size={20} className="text-emerald-600" />}
                {res.status === 'Issues Found' && <AlertTriangle size={20} className="text-amber-600" />}
                {res.status === 'Error' && <XCircle size={20} className="text-red-600" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${
                    res.status === 'Compliant' ? 'text-emerald-900' : 
                    res.status === 'Error' ? 'text-red-900' : 'text-amber-900'
                  }`}>
                    {res.fileName}
                  </h3>
                  <span className="text-xs text-gray-500">{res.apiName}</span>
                </div>
                <div className="mt-2 bg-white/50 rounded p-2 text-xs font-mono overflow-auto max-h-32">
                  <pre>{JSON.stringify(res.details, null, 2)}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
