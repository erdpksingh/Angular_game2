import { GameControllerInstance as GameController, GameState, RoundTypes } from "../Gameplay/GameController";
import { ScoreInstance as Score } from "../Gameplay/Score";
import { Utility } from "../Helper/Utility";
import { getRoundSettings } from "../Gameplay/GameModes/Round/RoundSettingsFactory";
import { getLocaleString } from "../Helper/Localization";

class Hud {
	constructor() {
		this.header = document.getElementById("header");
		this.defaultHeaderDisplay = this.header.style.display;

		this.containerPoints = document.getElementById("pointsContainer");
		this.labelPoints = document.getElementById("hudPoints");

		this.containerDistance = document.getElementById("distanceColumn");
		this.containerDistanceMarker = document.getElementById("distanceMarker");
		this.containerDistanceLine = document.getElementById("distanceLine");

		this.containerTrainingMode = document.getElementById("trainingContainer");

		this.containerBack = document.getElementById("btBack");
		this.containerBack.onclick = this.back.bind(this);
	}

	setup() {

	}

	update() {
		let distance = GameController.getDistancePercent();
		this.containerDistanceMarker.style.width = (10 + distance * (100 - 10)).toString() + "%";
		this.containerDistanceLine.style.width = (10 + distance * (100 - 10)).toString() + "%";

		this.setValue(this.labelPoints, Score.getSingleplayerScore().toLocaleString(getLocaleString()));
	}

	setValue(container, value) {
		if (container != null) container.innerHTML = value;
	}

	pause() {
		GameController.pause(GameController.state != GameState.paused);
	}

	getFormattedTime() {
		let time = Math.max(0, Math.ceil(GameController.timeMS / 1000));
		let seconds = Math.floor(time % 60);
		return Math.floor(time / 60).toString() + ":" + (seconds >= 10 ? '' : '0') + seconds;
	}

	hideAllElements() {
		Utility.disableElement(this.containerPoints);
		Utility.disableElement(this.containerDistance);
		Utility.disableElement(this.containerTrainingMode);
	}

	showAllElements() {
		this.hideAllElements();

		switch (GameController.roundType) {
			case RoundTypes.training:
				Utility.enableElement(this.containerTrainingMode);
				break;
			case RoundTypes.tutorial:
				break;
			case RoundTypes.normal:
			default:
				if (getRoundSettings().hasSingleScore) Utility.enableElement(this.containerPoints);
				if (getRoundSettings().hasProgressBar) Utility.enableElement(this.containerDistance);
		}
	}

	show() {
		Utility.enableElement(this.header);
		this.showAllElements();
	}

	hide() {
		Utility.disableElement(this.header);
	}

	back() {
		GameController.startMenu();
	}
}

export var HudInstance = new Hud();