import { defineConfig, devices } from '@playwright/test';

// Runs against the production review build (npm run build:review) served by server/serve.mjs.
// The contact form uses the local "capture" transport so the success path is tested end-to-end
// without sending real email. Uses the locally installed Google Chrome (H.264 support for the hero video).
const PORT = 4323;
const channel = process.env.PW_CHANNEL ?? 'chrome';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel, viewport: { width: 390, height: 844 } },
      testMatch: /(navigation|contact|layout)\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'node server/serve.mjs',
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      PORT: String(PORT),
      HOST: '127.0.0.1',
      CONTACT_TRANSPORT: 'capture',
      CONTACT_ALLOW_CAPTURE: 'true',
      CONTACT_CAPTURE_DIR: 'test-results/outbox',
      CONTACT_RATE_LIMIT: '200',
    },
  },
});
