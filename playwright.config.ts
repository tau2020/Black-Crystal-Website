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
    // Cross-engine run: PW_ENGINES=all npm run test:e2e (needs `npx playwright install webkit firefox`).
    ...(process.env.PW_ENGINES === 'all'
      ? [
          {
            name: 'webkit-desktop',
            use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
          },
          {
            name: 'webkit-iphone',
            use: { ...devices['iPhone 14'] },
            testMatch: /(navigation|contact|layout|home)\.spec\.ts/,
          },
          {
            name: 'firefox-desktop',
            use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
          },
        ]
      : []),
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
