import { Utility } from "../Helper/Utility";

export class Popup {
	constructor(title, text, buttons) {
		this.setupHtml(title, text, buttons);
	}

	setupHtml(title, text, buttons) {
		this.background = document.createElement("div");
		this.background.classList.add("popup");
		document.body.appendChild(this.background);

		let container = document.createElement("div");
		this.background.appendChild(container);

		let titleContainer = document.createElement("h1");
		titleContainer.innerHTML = title;
		container.appendChild(titleContainer);

		let textContainer = document.createElement("p");
		textContainer.innerHTML = text;
		container.appendChild(textContainer);

		let buttonContainer = document.createElement("div");
		buttonContainer.classList.add("popupButtonContainer");
		container.appendChild(buttonContainer);

		for (let i = 0; i < buttons.length; ++i) {
			let button = document.createElement("button");
			button.innerHTML = buttons[i].text;
			button.classList.add("button");
			button.onclick = function() {this.close(); if (Utility.isDefined(buttons[i].callback)) buttons[i].callback()}.bind(this);
			buttonContainer.appendChild(button);
		}
	}

	close() {
		this.background.parentNode.removeChild(this.background);
	}
}