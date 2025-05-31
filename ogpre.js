const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const imgDir = './img';
const imgPath = path.join(imgDir, 'og_image.png');

if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir);
}

if (fs.existsSync(imgPath)) {
    fs.unlinkSync(imgPath);
}

async function generateOGImage() {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        const websiteUrl = 'https://abhiakl.xyz';

        await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });
        await page.setViewport({ width: 1300, height: 730 });
        await page.screenshot({ path: imgPath });
    } catch (error) {
        console.error('Error generating OG image:', error);
    } finally {
        if (browser) await browser.close();
    }
}

generateOGImage();
