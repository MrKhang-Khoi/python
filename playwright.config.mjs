import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '_e2e_test.spec.mjs',
  timeout: 60000,
  retries: 0,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'http://localhost:8000',
  },
  reporter: [['list']],
});
