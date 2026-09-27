import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const server = await createServer({
  server: { middlewareMode: true, ws: false, watch: null },
  appType: 'custom',
});
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const path = new URL('../dist/index.html', import.meta.url);
  const template = await readFile(path, 'utf8');
  if (!template.includes('<!--app-html-->')) throw new Error('Missing prerender placeholder');
  await writeFile(path, template.replace('<!--app-html-->', renderToString(createElement(App))));
  console.log('Prerendered dist/index.html with the complete page.');
} finally {
  await server.close();
}
