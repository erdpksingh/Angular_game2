import { Utility } from "../Helper/Utility";
import { GameButtonControllerInstance as GameButtonController} from "../Gameplay/GameButtonController";

class Joker {
	constructor() {
		this.container = document.getElementById("jokerContainer");
		this.jokerButtons = [];

		for (let i = 0; i < 2; ++i) {
			this.jokerButtons[i] = document.getElementById("btJoker" + i);
			this.jokerButtons[i].onclick = this.startJoker(i).bind(this);
		}

		this.reset();
	}

	reset() {
		this.freezeInput(false);

		for (let i = 0; i < 2; ++i) {
			Utility.showElement(this.jokerButtons[i]);
		}
	}

	startJoker(index) {
		return function() {
			switch(index) {
				case 0:
				GameButtonController.markCorrectPair();
				break;
				case 1:
				GameButtonController.hideWrongPair();
				break;
			}
			Utility.hideElement(this.jokerButtons[index]);
		}
	}

	freezeInput(value = true) {
		for (let i = 0; i < 2; ++i) {
			this.jokerButtons[i].disabled = value;
		}
	}

	show() {
		Utility.enableElement(this.container);
	}

	hide() {
		Utility.disableElement(this.container);
	}
}

export var JokerInstance = new Joker();