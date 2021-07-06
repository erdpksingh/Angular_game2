import { GameControllerInstance as GameController} from "../Gameplay/GameController";

class PauseScreen {
	constructor() {
		this.continueButton = document.getElementById("btPauseContinue");
		this.restartButton = document.getElementById("btPauseRestart");
		
		if (this.continueButton == null) return;
		
		this.continueButton.onclick = this.unpause.bind(this);
		this.restartButton.onclick = this.restart.bind(this);
		this.menu = document.getElementById("pauseScreen")

		this.hide();
	}

	unpause() {
		GameController.pause(false);
	}

	restart() {
		GameController.startMenu();
	}

	hide() {
		this.menu.classList.remove("visible");
		this.menu.classList.add("hidden");
	}

	show() {
		this.menu.classList.remove("hidden");
		this.menu.classList.add("visible");
	}
}

export var PauseScreenInstance = new PauseScreen();