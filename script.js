let colors = ["#24d05a", "#e4094b", "#10a2f5", "#e9bc3f"];

(function () {
	setModeEventListener();
	setRandomLinkColor();
	setColorHoverListener();
	setBioEventListener();
	setRandomPhoto();

	setInterval(() => {
		setRandomPhoto();
	}, 2500);

	setInterval(() => {
		setRandomLinkColor();
	}, 5000);
})();

/* Dark Mode & Readme jokes theme change according to page theme change*/

function setModeEventListener() {
	let list = document.body.classList;
	list.add("dark-mode");
	document.getElementById("toggler").addEventListener("change", (event) => {
		event.target.checked ? list.remove("dark-mode") : list.add("dark-mode");
		event.target.checked ? document.getElementById("readmejokes").src = `https://readme-jokes.vercel.app/api?bgColor=%23efefefb3&textColor=%23a4a4a4&borderColor=%23a4a4a4&qColor=%23252525&aColor=%23ff0836`: document.getElementById("readmejokes").src = `https://readme-jokes.vercel.app/api?bgColor=%23252525&textColor=%23a4a4a4&aColor=%23a4a4a4&borderColor=%23efefefb3&qColor=%23ff0836`;
	});
}

/* Colors */

function getRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)];
}

function setRandomLinkColor() {
	Array.from(document.getElementsByTagName("a")).forEach((e) => {
		e.style.textDecorationColor = getRandomColor();
	});
}

function setColorHoverListener() {
	Array.from(document.querySelectorAll("a, button")).forEach((e) => {
		e.addEventListener("mouseover", setRandomLinkColor);
	});
}

/* Photos */
// change the number multiplied by the math.random to change how many photos to cycle
function setRandomPhoto() {
	let num = Math.floor(Math.random() * 2) + 1;
	document.getElementById("propic").src = `./img/face${num}.jpg`;
}

/* Bio Toggles */

function setBioEventListener() {
	Array.from(document.getElementsByTagName("button")).forEach((e) => {
		e.addEventListener("click", bioToggle);
	});
}

function bioToggle(e) {
	let bioType = e.target;
	let color = getRandomColor();
	off();
	bioType.style.cssText = `border-color: ${color}; color: ${color}; font-weight: bold;`;
	let bioTypeElement = document.getElementsByClassName(bioType.id)[0];
	if (bioTypeElement !== undefined) bioTypeElement.classList.add("show");
}

function off() {
	Array.from(document.getElementsByTagName("button")).forEach((butt) => {
		butt.style.borderColor = "#96979c";
		butt.style.color = "#96979c";
	});
	Array.from(document.getElementsByClassName("bio")).forEach((e) => {
		e.classList.remove("show");
	});
}
