export function setupLogo() {
	let urlContent = "./assets/sprites/logo.png";
	
	let titleDiv = document.getElementById("mainMenuTitle");
	titleDiv.style.backgroundImage = "url('" + urlContent + "')";
}