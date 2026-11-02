import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { app } from './server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    // Development mode: Mount Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production standalone mode: Serve static Vite build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkillForge] Server operational on http://localhost:${PORT}`);
    console.log(`[SkillForge] Super Admin email authorized: ${process.env.ADMIN_EMAIL || 'sbksojib@gmail.com'}`);
  });
}

startServer().catch((err) => {
  console.error('[SkillForge] Server initialization failed:', err);
  process.exit(1);
});
