import { Questions } from "./Questions";
import { ColorGradients } from "../Helper/Colors";
import { Utility } from "../Helper/Utility";

export class GameButton {
	constructor(htmlContainer, name, callback) {
		this.button = document.createElement("button");
		this.button.id = name;
		this.button.classList.add("button");
		this.button.classList.add("gameButton");
		this.button.onclick = callback;
		htmlContainer.appendChild(this.button);

		this.index = -1;
		this.correct = false;

		this.deselect();
	}

	updateText() {
		this.button.innerHTML = Questions[this.index];
	}

	select() {
		this.button.style.backgroundImage = ColorGradients.buttonSelected;
		this.setBorder(true);
	}

	deselect() {
		this.button.style.backgroundImage = ColorGradients.blue;
		this.setBorder(false);
	}

	freezeInput(value = true) {
		this.button.disabled = value;
	}

	setCorrect() {
		this.button.style.backgroundImage = ColorGradients.green;
		this.setBorder(false);
	}

	setWrong() {
		this.button.style.backgroundImage = ColorGradients.red;
		this.setBorder(false);
	}

	hide() {
		Utility.hideElement(this.button);
	}

	show() {
		Utility.showElement(this.button);
	}

	mark() {
		this.unmark();
		this.button.classList.add("tutorialActiveButton");
	}

	unmark() {
		this.button.classList.remove("tutorialActiveButton");
	}

	setBorder(value) {
		if (value) {
			this.button.classList.add("activeButton");
		} else {
			this.button.classList.remove("activeButton");
		}
	}
}