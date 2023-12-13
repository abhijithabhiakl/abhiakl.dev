const puppeteer = require('puppeteer');

// const image = document.querySelector('img[src="./img/og_image.png"]');
// if (image) {
//   image.remove();   build fail
// }

async function generateOGImage() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');

    const websiteUrl = 'https://abhiakl.xyz';

    // Navigate to your website
    await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });

    // Set the viewport size to the desired image dimensions
    await page.setViewport({ width: 1200, height: 730 });

    // Capture a screenshot of the rendered HTML
    await page.screenshot({ path: './img/og_image.png' });

    await browser.close();
}

generateOGImage();
