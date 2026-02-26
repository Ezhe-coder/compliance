import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

export default function Reports() {
  const reports = [
    { id: 'R-2024-001', name: 'Q1 Marketing Assets Audit', date: '2024-03-15', status: 'Compliant', items: 45 },
    { id: 'R-2024-002', name: 'Social Media Campaign v2', date: '2024-03-14', status: 'Issues Found', items: 12 },
    { id: 'R-2024-003', name: 'Legal Doc Review', date: '2024-03-10', status: 'Compliant', items: 8 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Compliance Reports</h1>
          <p className="text-gray-500 mt-1">Archive of all generated compliance reports.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
            <option>All Reports</option>
            <option>Compliant Only</option>
            <option>Issues Found</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Report Name</th>
              <th scope="col" className="px-6 py-4 font-medium">Date</th>
              <th scope="col" className="px-6 py-4 font-medium">Items Scanned</th>
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
                    <div>
                      <div className="font-medium text-gray-900">{report.name}</div>
                      <div className="text-xs text-gray-400">{report.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{report.date}</td>
                <td className="px-6 py-4">{report.items}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.status === 'Compliant' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="View">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Download PDF">
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
