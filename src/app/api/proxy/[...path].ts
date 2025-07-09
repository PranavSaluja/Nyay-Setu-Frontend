// pages/api/proxy/[...path].ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const BACKEND_BASE_URL = 'http://13.235.85.242:8000'; // Base backend URL

  const { path = [] } = req.query;
  const targetPath = Array.isArray(path) ? path.join('/') : path;

  const targetUrl = `${BACKEND_BASE_URL}/${targetPath}`;
  console.log(`Proxying request to: ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { authorization: req.headers.authorization } : {})
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method || '') ? JSON.stringify(req.body) : undefined,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
