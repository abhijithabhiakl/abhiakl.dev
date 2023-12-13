const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateOGImage() {

    if (fs.existsSync('./img/og_image.png')) {
        fs.unlinkSync('./img/og_image.png');
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const websiteUrl = 'https://abhiakl.xyz';

    // Navigate to your website
    await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });

    // Set the viewport size to the desired image dimensions
    await page.setViewport({ width: 1300, height: 730 });
    
    // Capture a screenshot of the rendered HTML
    await page.screenshot({ path: './img/og_image.png' });

    await browser.close();
}

generateOGImage();
