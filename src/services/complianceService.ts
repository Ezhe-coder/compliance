import { ApiConfig, ScanResult } from '../types/config';

export async function runComplianceScan(file: File, apis: ApiConfig[]): Promise<ScanResult[]> {
  const activeApis = apis.filter(a => a.isActive);
  const results: ScanResult[] = [];

  // Helper to read file as text or base64 based on needs
  // For this demo, we'll assume text-based analysis or simple placeholder replacement
  // In a real app, you'd handle file upload to a storage bucket first, then pass the URL
  // Or convert to base64 for APIs that support it.
  
  const fileContent = await readFileAsText(file); 
  // Note: Binary files (images) need base64. 
  // Let's implement a basic base64 reader too.
  const fileBase64 = await readFileAsBase64(file);

  for (const api of activeApis) {
    try {
      // Replace placeholders in headers and body
      const headers: Record<string, string> = {};
      api.headers.forEach(h => {
        headers[h.key] = h.value;
      });

      let body = api.bodyTemplate
        .replace('{{text}}', JSON.stringify(fileContent).slice(1, -1)) // simple escape
        .replace('{{base64}}', fileBase64.split(',')[1] || ''); // remove data url prefix

      // If the user didn't provide a body, default to empty object
      if (!body.trim()) body = '{}';

      const response = await fetch(api.endpoint, {
        method: api.method,
        headers,
        body: api.method !== 'GET' ? body : undefined,
      });

      const data = await response.json();

      results.push({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        fileName: file.name,
        status: response.ok ? 'Compliant' : 'Error', // Simplified logic. Real logic needs to parse 'data'
        details: data,
        apiName: api.name
      });

    } catch (error: any) {
      results.push({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        fileName: file.name,
        status: 'Error',
        details: { error: error.message },
        apiName: api.name
      });
    }
  }

  return results;
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
