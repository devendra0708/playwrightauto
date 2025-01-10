export const testDir = './tests';

export const expect = {
    timeout: 5000
};

export const reporter = [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
];

export const use = {
    headless: false,  // Set to true when running headless
    baseURL: 'https://techm139-dev-ed.develop.my.salesforce.com',
    browserName: 'chromium', // or 'firefox', 'webkit'
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry', // Capture video for failed tests
    screenshot: 'on',
    trace: 'retain-on-failure', // Retain trace for failed tests
};

export const timeout = 30000; // Increase timeout for longer Salesforce interactions
