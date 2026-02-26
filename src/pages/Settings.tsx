import React, { useState } from 'react';
import { Plus, Trash2, Save, Key, Code, Globe } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ApiConfig, defaultApis } from '../types/config';

export default function Settings() {
  const [apis, setApis] = useLocalStorage<ApiConfig[]>('compliance_apis', defaultApis);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleApi = (id: string) => {
    setApis(apis.map(api => api.id === id ? { ...api, isActive: !api.isActive } : api));
  };

  const deleteApi = (id: string) => {
    setApis(apis.filter(api => api.id !== id));
  };

  const updateApi = (id: string, updates: Partial<ApiConfig>) => {
    setApis(apis.map(api => api.id === id ? { ...api, ...updates } : api));
  };

  const addNewApi = () => {
    const newApi: ApiConfig = {
      id: crypto.randomUUID(),
      name: 'New API Integration',
      endpoint: 'https://api.example.com/v1/check',
      method: 'POST',
      headers: [{ key: 'Authorization', value: 'Bearer ' }],
      bodyTemplate: '{\n  "data": "{{base64}}"\n}',
      isActive: false
    };
    setApis([...apis, newApi]);
    setEditingId(newApi.id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">API Configuration</h1>
        <p className="text-gray-500 mt-1">Manage external compliance APIs. Data is stored locally in your browser.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-900">Connected APIs</h2>
          <button 
            onClick={addNewApi}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus size={16} />
            Add New API
          </button>
          <button 
            onClick={() => {
              if (confirm('Reset all API configurations to default? This will lose your custom settings.')) {
                setApis(defaultApis);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 ml-2"
          >
            Reset Defaults
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {apis.map((api) => (
            <div key={api.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                
                {/* Main Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <input 
                      value={api.name}
                      onChange={(e) => updateApi(api.id, { name: e.target.value })}
                      className="font-medium text-gray-900 border-none p-0 focus:ring-0 text-lg placeholder-gray-400"
                      placeholder="API Name"
                    />
                    <span className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer select-none ${api.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => toggleApi(api.id)}>
                      {api.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select 
                      value={api.method}
                      onChange={(e) => updateApi(api.id, { method: e.target.value as 'GET' | 'POST' })}
                      className="text-sm font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1"
                    >
                      <option>POST</option>
                      <option>GET</option>
                    </select>
                    <input 
                      value={api.endpoint}
                      onChange={(e) => updateApi(api.id, { endpoint: e.target.value })}
                      className="flex-1 text-sm font-mono bg-gray-50 border border-gray-200 rounded px-3 py-1 w-full"
                      placeholder="https://api.example.com/endpoint"
                    />
                  </div>

                  {/* Advanced Config Toggle */}
                  <button 
                    onClick={() => setEditingId(editingId === api.id ? null : api.id)}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
                  >
                    {editingId === api.id ? 'Hide Configuration' : 'Show Configuration'}
                  </button>

                  {/* Expanded Configuration */}
                  {editingId === api.id && (
                    <div className="mt-4 space-y-4 border-t border-gray-100 pt-4 animate-in fade-in slide-in-from-top-2">
                      
                      {/* Headers */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Headers</label>
                        <div className="space-y-2">
                          {api.headers.map((header, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input 
                                value={header.key}
                                onChange={(e) => {
                                  const newHeaders = [...api.headers];
                                  newHeaders[idx].key = e.target.value;
                                  updateApi(api.id, { headers: newHeaders });
                                }}
                                placeholder="Key (e.g. Authorization)"
                                className="flex-1 text-sm border border-gray-200 rounded px-3 py-1.5"
                              />
                              <input 
                                value={header.value}
                                onChange={(e) => {
                                  const newHeaders = [...api.headers];
                                  newHeaders[idx].value = e.target.value;
                                  updateApi(api.id, { headers: newHeaders });
                                }}
                                placeholder="Value"
                                className="flex-1 text-sm border border-gray-200 rounded px-3 py-1.5 font-mono text-xs"
                              />
                              <button 
                                onClick={() => {
                                  const newHeaders = api.headers.filter((_, i) => i !== idx);
                                  updateApi(api.id, { headers: newHeaders });
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => updateApi(api.id, { headers: [...api.headers, { key: '', value: '' }] })}
                            className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Header
                          </button>
                        </div>
                      </div>

                      {/* Body Template */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Body Template (JSON)</label>
                          <div className="text-xs text-gray-400">Available vars: <code className="bg-gray-100 px-1 rounded">{'{{text}}'}</code>, <code className="bg-gray-100 px-1 rounded">{'{{base64}}'}</code></div>
                        </div>
                        <textarea 
                          value={api.bodyTemplate}
                          onChange={(e) => updateApi(api.id, { bodyTemplate: e.target.value })}
                          className="w-full h-32 font-mono text-xs border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="{}"
                        />
                      </div>

                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pl-4 md:border-l border-gray-200">
                  <button 
                    onClick={() => toggleApi(api.id)}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
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
              <Globe size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No APIs Configured</h3>
            <p className="text-gray-500 mt-1">Add an external API to start scanning your assets.</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <div className="text-blue-600 mt-0.5">
          <Code size={20} />
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">Developer Note</p>
          <p className="mt-1">
            Since this is a client-side application, ensure your target APIs support CORS (Cross-Origin Resource Sharing) 
            or use a proxy. API keys are stored in your browser's LocalStorage and are never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
