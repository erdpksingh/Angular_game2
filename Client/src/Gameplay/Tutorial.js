import { MainMenuInstance as MainMenu } from "../UI/MainMenu";
import { GameControllerInstance as GameController } from "./GameController";
import { HudInstance as Hud } from "../UI/Hud";
import { GameButtonControllerInstance as GameButtonController } from "./GameButtonController";
import { GameSettings } from "../Settings/GameSettings";
import { StringValues } from "../IO/Strings";
import { JokerInstance as Joker} from "../UI/Joker";
import { Utility } from "../Helper/Utility";

class Tutorial {
	constructor() {
		this.menu = document.getElementById("tutorialArea");
		this.background = document.getElementById("tutorialBackground");
		this.continueButton = document.getElementById("btTutorialContinue");
		this.continueButton.classList.add("tutorialActiveButton");
		this.continueButton.onclick = this.continue.bind(this);
		this.title = document.getElementById("tutorialTitle");
		this.text = document.getElementById("tutorialText");
		this.originalDisplay = this.title.style.display;

		this.continueCallback = this.continue.bind(this);

		this.stop();
	}

	start() {
		this.state = 0;
		this.initState();
		this.correctButtons = null;
		Utility.enableElement(this.menu);
		Utility.enableElement(this.background);

		this.addButtonCallbacks();
	}

	addButtonCallbacks() {
		this.correctButtons = GameButtonController.getCorrectPair();
		this.correctButtons[0].button.addEventListener("click", this.continueCallback);
		this.correctButtons[1].button.addEventListener("click", this.continueCallback);
	}

	removeButtonCallbacks() {
		if (this.correctButtons != null) {
			for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
				this.correctButtons[i].button.removeEventListener("click", this.continueCallback);
				this.correctButtons[i].button.classList.remove("tutorialActiveButton");
			}
			this.correctButtons = null;
		}
	}

	continue() {
		++this.state;
		this.initState();
	}

	initState() {
		let title = "tutorial_" + this.state + "_title";
		let text = "tutorial_" + this.state + "_text";

		switch (this.state) {
			case 0:
				this.continueButton.style.display = this.originalDisplay;
				this.continueButton.innerHTML = StringValues["buttonContinue"];
				GameButtonController.hide();
				GameButtonController.freezeInput();
				Hud.hideAllElements();
				break;
			case 1:
				GameButtonController.show();
				this.continueButton.style.display = "none";
				this.correctButtons[0].freezeInput(false);
				this.correctButtons[0].button.classList.add("tutorialActiveButton");
				break;
			case 2:
				this.correctButtons[0].freezeInput(true);
				this.correctButtons[0].button.classList.remove("tutorialActiveButton");
				this.correctButtons[1].freezeInput(false);
				this.correctButtons[1].button.classList.add("tutorialActiveButton");
				break;
			case 3:
				this.removeButtonCallbacks();
				this.continueButton.style.display = this.originalDisplay;
				break;
			case 4:
				GameButtonController.hide();
				Joker.show();
				Joker.freezeInput();
				break;
			case 5:
				Hud.hideAllElements();
				Joker.hide();
				this.continueButton.innerHTML = StringValues["buttonTutorialEnd"];
				break;
			default:
				GameController.startMenu();
				return;
		}

		if (title != "") {
			this.title.style.display = this.originalDisplay;
			this.title.innerHTML = StringValues[title];
		} else {
			this.title.style.display = "none";
		}

		this.text.innerHTML = StringValues[text];
	}

	stop() {
		Utility.disableElement(this.menu);
		Utility.disableElement(this.background);
		this.removeButtonCallbacks();
	}
}

export var TutorialInstance = new Tutorial();