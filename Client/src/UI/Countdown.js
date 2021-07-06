import { GameControllerInstance as GameController } from "../Gameplay/GameController";
import { GameSettings } from "../Settings/GameSettings";
import { GameButtonControllerInstance as GameButtonController } from "../Gameplay/GameButtonController";
import { CameraInstance as Camera } from "../Gameplay/Camera";

class Countdown {
	constructor() {
		this.element = document.getElementById("countdownIdle");
		this.duration = GameSettings.countdownDurationSec + GameSettings.countdownDelaySec;

		this.element.addEventListener("animationstart", this.eventListener.bind(this), false);
		this.element.addEventListener("animationend", this.eventListener.bind(this), false);
		this.element.addEventListener("animationiteration", this.eventListener.bind(this), false);
		
		this.element.style.animationDuration = "1s";
		//this.element.style.animationDelay = GameSettings.countdownDurationSec.toString() + "s";

		this.stop();
	}

	start() {
		this.stop();
		
		this.element.innerHTML = "GET READY!";
		this.element.hidden = false;
		this.element.id = "countdownActive";

		GameButtonController.hide();
	}

	pause(value = true) {
		let state = value ? "paused" : "running";
		this.element.style.animationPlayState = state;
		this.element.style.webkitAnimationPlayState = state;
	}

	stop() {
		this.element.hidden = true;
		this.element.id = "countdownIdle";
		this.pause(false);
	}

	eventListener(event) {
		switch (event.type) {
			case "animationstart":
				this.currentDuration = Math.floor(this.duration);
				this.element.innerHTML = "GET READY!";//this.duration.toString();
				break;
			case "animationend":

				break;
			case "animationiteration":
				--this.currentDuration;
				if (this.currentDuration > 0) {
					this.element.innerHTML = this.currentDuration.toString();
				} else if (this.currentDuration == 0) {
					this.element.innerHTML = "GO!";
					GameController.startGame();
				} else {
					this.stop();
				}
				break;
		}
	}
}

export var CountdownInstance = new Countdown();