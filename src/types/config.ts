export interface ApiConfig {
  id: string;
  name: string;
  endpoint: string;
  method: 'POST' | 'GET';
  headers: { key: string; value: string }[];
  bodyTemplate: string; // JSON string with placeholders like {{imageUrl}} or {{text}}
  isActive: boolean;
}

export interface ScanResult {
  id: string;
  date: string;
  fileName: string;
  status: 'Compliant' | 'Issues Found' | 'Error';
  details: any;
  apiName: string;
}

export const defaultApis: ApiConfig[] = [
  {
    id: 'openai-moderation',
    name: 'OpenAI Moderation',
    endpoint: 'https://api.openai.com/v1/moderations',
    method: 'POST',
    headers: [
      { key: 'Authorization', value: 'Bearer YOUR_OPENAI_KEY' },
      { key: 'Content-Type', value: 'application/json' }
    ],
    bodyTemplate: '{\n  "input": "{{text}}"\n}',
    isActive: true
  }
];
