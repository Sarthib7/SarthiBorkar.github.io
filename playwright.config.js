import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const bravePath = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:43187',
    browserName: 'chromium',
    launchOptions: {
      executablePath: process.env.BRAVE_EXECUTABLE_PATH
        ?? (existsSync(bravePath) ? bravePath : undefined),
    },
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 43187 --strictPort',
    url: 'http://127.0.0.1:43187',
    reuseExistingServer: false,
  },
});
