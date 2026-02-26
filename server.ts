import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // --- Proxy Routes ---

  app.post('/api/proxy/hive', async (req, res) => {
    try {
      const { image_base64 } = req.body;

      if (!image_base64) {
        return res.status(400).json({ error: 'Missing image_base64 data' });
      }

      // Get API Key from environment variable (secure server-side storage)
      const HIVE_API_KEY = process.env.HIVE_API_KEY;

      if (!HIVE_API_KEY) {
        return res.status(500).json({ 
          error: 'Server configuration error: HIVE_API_KEY is missing.' 
        });
      }

      // Forward request to The Hive
      const response = await fetch('https://api.thehive.ai/api/v3/hive/ai-generated-and-deepfake-content-detection', {
        method: 'POST',
        headers: {
          'Authorization': `token ${HIVE_API_KEY}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          image_base64: image_base64
        })
      });

      const data = await response.json();
      
      // Forward the response status and data back to the frontend
      res.status(response.status).json(data);

    } catch (error: any) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // --- Vite Middleware (Must be last) ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
