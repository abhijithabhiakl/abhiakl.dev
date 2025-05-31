const colors = ["#24d05a", "#e4094b", "#10a2f5", "#e9bc3f"];
const PROFILE_PHOTO_COUNT = 2; // Suggestion: use a variable for easy updates

document.addEventListener("DOMContentLoaded", () => {
    setModeEventListener();
    setRandomLinkColor();
    setColorHoverListener();
    setBioEventListener();
    setRandomPhoto();

    setInterval(setRandomPhoto, 2500);
    setInterval(setRandomLinkColor, 5000);

    // Start the typing effect
    typeText();
});

/* Dark Mode & Readme jokes theme change according to page theme change */
function setModeEventListener() {
    const toggler = document.getElementById("toggler");
    const jokesImg = document.getElementById("readmejokes");
    const list = document.body.classList;
    // Suggestion: persist user preference in localStorage
    if (localStorage.getItem("darkMode") === "off") {
        list.remove("dark-mode");
        if (toggler) toggler.checked = true;
    } else {
        list.add("dark-mode");
        if (toggler) toggler.checked = false;
    }
    if (toggler) {
        toggler.addEventListener("change", (event) => {
            if (event.target.checked) {
                list.remove("dark-mode");
                localStorage.setItem("darkMode", "off");
                if (jokesImg) {
                    jokesImg.src = "https://readme-jokes.vercel.app/api?bgColor=%23efefefb3&textColor=%23a4a4a4&borderColor=%23a4a4a4&qColor=%23252525&aColor=%23ff0836";
                }
            } else {
                list.add("dark-mode");
                localStorage.setItem("darkMode", "on");
                if (jokesImg) {
                    jokesImg.src = "https://readme-jokes.vercel.app/api?bgColor=%23252525&textColor=%23a4a4a4&aColor=%23a4a4a4&borderColor=%23efefefb3&qColor=%23ff0836";
                }
            }
        });
    }
}

/* Colors */
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function setRandomLinkColor() {
    document.querySelectorAll("a").forEach((e) => {
        e.style.textDecorationColor = getRandomColor();
    });
}

function setColorHoverListener() {
    // Suggestion: use a single event listener on the document for delegation to avoid duplicate listeners
    document.addEventListener("mouseover", (event) => {
        if (event.target.matches("a, button")) {
            setRandomLinkColor();
        }
    });
}

/* Photos */
function setRandomPhoto() {
    const propic = document.getElementById("propic");
    if (propic) {
        const num = Math.floor(Math.random() * PROFILE_PHOTO_COUNT) + 1;
        propic.src = `./img/face${num}.jpg`;
    }
}

/* Bio Toggles */
function setBioEventListener() {
    document.querySelectorAll("button").forEach((e) => {
        e.addEventListener("click", bioToggle);
    });
}

function bioToggle(e) {
    const bioType = e.target;
    const color = getRandomColor();
    off();
    bioType.style.cssText = `border-color: ${color}; color: ${color}; font-weight: bold;`;
    const bioTypeElement = document.querySelector(`.bio.${bioType.id}`);
    if (bioTypeElement) bioTypeElement.classList.add("show");
}

function off() {
    document.querySelectorAll("button").forEach((butt) => {
        butt.style.borderColor = "#96979c";
        butt.style.color = "#96979c";
    });
    document.querySelectorAll(".bio").forEach((e) => {
        e.classList.remove("show");
    });
}

/* Dynamic Typing Text */
const textArray = [
    "Hardware Developer",
    "Network Technician",
    "Maker & Tinkerer",
    "DIY Hobbyist"
];
let textIndex = 0;
let charIndex = 0;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeText() {
    const textElement = document.getElementById("dynamic-text");
    if (!textElement) return;
    const currentText = textArray[textIndex];

    if (charIndex < currentText.length) {
        textElement.textContent += currentText.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, typingSpeed);
    } else {
        setTimeout(deleteText, pauseTime);
    }
}

function deleteText() {
    const textElement = document.getElementById("dynamic-text");
    if (!textElement) return;
    if (charIndex > 0) {
        textElement.textContent = textElement.textContent.slice(0, -1);
        charIndex--;
        setTimeout(deleteText, deletingSpeed);
    } else {
        textIndex = (textIndex + 1) % textArray.length;
        setTimeout(typeText, typingSpeed);
    }
}
