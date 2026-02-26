import React, { useState } from 'react';
import { Plus, Trash2, Save, Key } from 'lucide-react';

interface ApiConfig {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  isActive: boolean;
}

export default function Settings() {
  const [apis, setApis] = useState<ApiConfig[]>([
    { id: '1', name: 'OpenAI Content Filter', endpoint: 'https://api.openai.com/v1/moderations', apiKey: 'sk-................', isActive: true },
    { id: '2', name: 'Google Cloud Vision', endpoint: 'https://vision.googleapis.com/v1/images:annotate', apiKey: '', isActive: false },
  ]);

  const toggleApi = (id: string) => {
    setApis(apis.map(api => api.id === id ? { ...api, isActive: !api.isActive } : api));
  };

  const deleteApi = (id: string) => {
    setApis(apis.filter(api => api.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">API Configuration</h1>
        <p className="text-gray-500 mt-1">Manage external compliance APIs and integrations.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-900">Connected APIs</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Plus size={16} />
            Add New API
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {apis.map((api) => (
            <div key={api.id} className="p-6 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-900">{api.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${api.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {api.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded w-fit">
                  <span className="text-gray-400">POST</span>
                  {api.endpoint}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={14} className="text-gray-400" />
                  </div>
                  <input 
                    type="password" 
                    value={api.apiKey} 
                    readOnly 
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-48 bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <button 
                    onClick={() => toggleApi(api.id)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {api.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button 
                    onClick={() => deleteApi(api.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {apis.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
              <Key size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No APIs Configured</h3>
            <p className="text-gray-500 mt-1">Add an external API to start scanning your assets.</p>
          </div>
        )}
      </div>

      {/* Global Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Scan Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
            <span className="text-sm text-gray-700">Automatically generate PDF reports after scan</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
            <span className="text-sm text-gray-700">Email notification on critical compliance failures</span>
          </label>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
