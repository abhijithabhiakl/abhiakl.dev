// Example script using Puppeteer to generate an Open Graph image

const puppeteer = require('puppeteer');

async function generateOGImage() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent('<html content>'); // Replace with your HTML content

    // Set the viewport size to the desired image dimensions
    await page.setViewport({ width: 1200, height: 630 });

    // Capture a screenshot of the rendered HTML
    await page.screenshot({ path: './img/og_image.png' });

    await browser.close();
}

generateOGImage();
