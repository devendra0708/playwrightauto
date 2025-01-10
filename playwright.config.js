// config/playwright.config.js
module.exports = {

    testDir: './tests',
    expect: {
        timeout: 5000
      },
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
    use: {
        headless: false,  // Set to true when running headless
        baseURL: 'https://techm139-dev-ed.develop.my.salesforce.com',
        browserName: 'chromium', // or 'firefox', 'webkit'
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on-first-retry', // Capture video for failed tests
        screenshot: 'on',
        trace: 'retain-on-failure', // Retain trace for failed tests
    },
    timeout: 30000, // Increase timeout for longer Salesforce interactions
};
