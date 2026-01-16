// Dark Mode Toggler Logic
const toggler = document.getElementById('toggler');
const body = document.body;

// Check for saved user preference, if any, on load of the website
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === 'dark-mode') {
        toggler.checked = true;
    }
} else {
    // If no saved preference, check system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme.matches) {
        body.classList.add('dark-mode');
        toggler.checked = true;
    }
}

// Listen for a click on the button
toggler.addEventListener('change', function () {
    if (this.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light-mode');
    }
});
