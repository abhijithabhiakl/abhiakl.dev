const puppeteer = require('puppeteer');

async function generateOGImage() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const websiteUrl = 'https://abhiakl.xyz';

    // Navigate to your website
    await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });

    // Set the viewport size to the desired image dimensions
    await page.setViewport({ width: 1200, height: 630 });

    // Capture a screenshot of the rendered HTML
    await page.screenshot({ path: 'og_image.png' });

    await browser.close();
}

generateOGImage();
