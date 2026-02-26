import React from 'react';
import { FileText, Download, Eye, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ScanResult } from '../types/config';

export default function Reports() {
  const [reports, setReports] = useLocalStorage<ScanResult[]>('compliance_reports', []);

  const clearReports = () => {
    if (confirm('Are you sure you want to clear all reports?')) {
      setReports([]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Compliance Reports</h1>
          <p className="text-gray-500 mt-1">Archive of all generated compliance reports (stored locally).</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={clearReports}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No reports found. Run a scan to generate reports.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">File Name</th>
                <th scope="col" className="px-6 py-4 font-medium">Date</th>
                <th scope="col" className="px-6 py-4 font-medium">API Used</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FileText size={18} />
                      </div>
                      <div className="font-medium text-gray-900">{report.fileName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{new Date(report.date).toLocaleDateString()} {new Date(report.date).toLocaleTimeString()}</td>
                  <td className="px-6 py-4">{report.apiName}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'Compliant' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : report.status === 'Error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" 
                        title="View Details"
                        onClick={() => alert(JSON.stringify(report.details, null, 2))}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
