# How to Edit Your New React Website

Since you are familiar with HTML, CSS, and JS, you'll find React is quite similar, just organized a bit differently!

## 1. Where is everything?

In your old site, everything was in one big `index.html`. In React, we break it down into small pieces called **Components**.

*   **`src/components/`**: This is where your HTML lives now. Each file represents a section of your page.
    *   `Header.jsx`: Top section with your name and profile picture.
    *   `Nav.jsx`: The social links (Github, Twitter, etc.).
    *   `BioSwitcher.jsx`: The buttons that switch between logic for "Short", "Long", etc.
    *   `BioContent.jsx`: **The actual text content** for your bio, projects list, and blog list.
    *   `Footer.jsx`: The bottom section with copyright and icons.
*   **`src/index.css`**: This is your `style.css`. It works exactly the same!
*   **`public/`**: This is where your images (`img/`) and old blog posts (`blogs/`) live.

## 2. How do I change...

### ...The Text in my Bio?
Go to **`src/components/BioContent.jsx`**.
You will see code that looks like HTML inside a `return (...)`.
Find the text you want to change (e.g., "Hi there! I'm Abhijith!") and just edit it!

### ...The Social Links?
Go to **`src/components/Nav.jsx`**.
You'll see familiar `<a>` tags. Edit the `href` just like normal HTML.

### ...The Profile Picture?
The images are in `public/img/`.
If you want to add `face3.jpg`, just drop it in that folder.
Then you might need to update the logic in `Header.jsx` if you want it to cycle through 3 images (look for `setPhotoNum(prev => (prev % 2) + 1)` and change `2` to `3`).

### ...CSS Styles?
Open **`src/index.css`**. It is exactly your old CSS file. You can change colors, fonts, margins, etc., right there.

### ...HTML Head (Title, Meta tags)?
Go to **`index.html`** in the root folder. usage is standard HTML.

## 3. Saving and Previewing
1.  Make a change in a file.
2.  Save the file (Ctrl+S).
3.  Look at your browser/terminal. It updates automatically! (You are already running `npm run dev`).

## 4. Key Differences "Gotchas"
*   **`class` vs `className`**: In HTML we write `<div class="box">`. In React/JSX, we write `<div className="box">`. (Because `class` is a reserved word in Javascript).
*   **Closing Tags**: All tags must be closed. `<img src="...">` must be `<img src="..." />` (note the `/` at the end). `<br>` becomes `<br/>`.
*   **Images**: When using `<img>`, the `src` starts from the public folder. So `src="/img/face1.jpg"` refers to `public/img/face1.jpg`.

## 5. Publishing
When you are done editing:
1.  Stop the server in the terminal (Ctrl+C).
2.  Run `npm run build`.
3.  A folder named `dist` will be created. This folder contains your final website. This is what you upload to Netlify/Vercel/GitHub Pages.
