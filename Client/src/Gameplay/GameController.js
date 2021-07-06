import { MainMenuInstance as MainMenu } from "../UI/MainMenu";
import { FadeInstance as Fade } from "../UI/Fade";
import { CountdownInstance as Countdown } from "../UI/Countdown";
import { GameButtonControllerInstance as GameButtonController } from "./GameButtonController";
import { Babylon } from "../Engine/Babylon";
import { EndScreenInstance as EndScreen } from "../UI/EndScreen";
import { PauseScreenInstance as PauseScreen } from "../UI/PauseScreen";
import { EnvironmentInstance as Environment } from "./Environment";
import { HudInstance as Hud } from '../UI/Hud';
import { GameSettings } from "../Settings/GameSettings";
import { CarControllerInstance as CarController } from "./CarContoller";
import { CameraInstance as Camera } from "./Camera";
import { TutorialInstance as Tutorial } from "./Tutorial";
import { ScoreInstance as Score } from "./Score";
import { ComboInstance as Combo } from "./Combo";
import { JokerInstance as Joker } from "../UI/Joker";
import { AchievementScreenInstance as AchievementScreen } from "../UI/AchievementScreen";
import { RankingScreenInstance as RankingScreen } from "../UI/RankingScreen";
import { LoadingScreenInstance as LoadingScreen } from "../UI/LoadingScreen";
import { registerCheat, cheatCode } from "../Helper/Cheats";
import { getMainMenuSettings } from "./GameModes/MainMenu/MainMenuSettingsFactory";
import { getRoundSettings } from "./GameModes/Round/RoundSettingsFactory";
import { TeamScoreInstance as TeamScore } from "../UI/TeamScore";
import { getEndScreenSettings } from "./GameModes/EndScreen/EndScreenSettingsFactory";

export var GameState = {
	loading: 0,
	menu: 1,
	countdown: 2,
	running: 3,
	paused: 4,
	tutorial: 5,
	end: 6,
}

export var RoundTypes = {
	normal: 0,
	tutorial: 1,
	training: 2,
}

class GameController {
	constructor() { }

	setup() {
		getMainMenuSettings().teamCountCallback = this.setTeamCount.bind(this);
		getMainMenuSettings().gameStartCallback = this.startIntro.bind(this);
		getRoundSettings().teamScoreCallback = this.setTeamScoreAverage.bind(this);
		getRoundSettings().teamCountCallback = this.setTeamCount.bind(this);
		getRoundSettings().singleScoreCallback = this.setSingleScore.bind(this);
		getRoundSettings().gameEndCallback = this.end.bind(this);

		Camera.setup();
		Environment.setup();
		CarController.setup();
		GameButtonController.setup();
		MainMenu.setup();
		Fade.setup();
		EndScreen.setup();
		AchievementScreen.setup();
		RankingScreen.setup();
		Hud.setup();
		TeamScore.setup();
		Score.setup();
		Combo.setup();

		this.state = GameState.loading;
		this.previousState = GameState.loading;

		this.roundType = RoundTypes.normal;

		this.timeMS = 0;
		this.distanceMeters = 0;
		this.currentSpeed = 0;

		this.minSpeed = 60 / 60 / 60;
		this.maxSpeed = 160 / 60 / 60;

		registerCheat(cheatCode.GAMEEND, this.sendEnd.bind(this));
	}

	init() {
		CarController.init();
		Environment.init();

		this.reset();

		this.startMenu();
	}

	reset() {
		this.timeMS = 0;
		this.distanceMeters = 0;

		Score.reset();
		Combo.reset();

		GameButtonController.reset();
		Environment.reset();
		CarController.reset();
		Joker.reset();
	}

	hideMenus() {
		MainMenu.hide();
		AchievementScreen.hide();
		RankingScreen.hide();
		PauseScreen.hide();
		EndScreen.hide();
		Hud.hide();
		GameButtonController.hide();
		Joker.hide();
		TeamScore.hide();
		Tutorial.stop();
	}

	update() {
		switch (this.state) {
			case GameState.menu:
				getMainMenuSettings().update();
				MainMenu.update();
				CarController.update();
				break;
			case GameState.countdown:
				break;
			case GameState.running:
				this.updateGameValues();

				if (this.roundType == RoundTypes.normal) {
					getRoundSettings().update();
					this.checkEnd();
				}

				CarController.update();
				break;
			case GameState.end:
			case GameState.paused:
				return;
		}

		TeamScore.update();
		Environment.update();
		Camera.update();
		Hud.update();
	}

	updateGameValues() {
		let timeDifference = Babylon.engine.getDeltaTime();
		this.currentSpeed = Combo.lerpCombo(this.minSpeed, this.maxSpeed);
		let distanceDifference = Babylon.engine.getDeltaTime() * this.currentSpeed;

		this.timeMS += timeDifference;

		if (this.roundType == RoundTypes.normal && getRoundSettings().hasGoal) {
			this.distanceMeters += distanceDifference;
		}

		Combo.update();
	}

	startMenu() {
		Fade.fadeCallback(function () {
			getMainMenuSettings().init();
			this.startMenuInstant();
		}.bind(this));
	}

	startMenuInstant() {
		this.hideMenus();

		LoadingScreen.hide();
		MainMenu.show();
		if (getMainMenuSettings().hasTeamScore) TeamScore.show();
		Tutorial.stop();
		Countdown.stop();
		Camera.startMenu();

		this.state = GameState.menu;
	}

	startAchievements() {
		this.hideMenus();
		AchievementScreen.show();
	}

	startRanking() {
		this.hideMenus();
		RankingScreen.show();
	}

	startTutorial() {
		Fade.fadeCallback(function () {
			this.reset();
			this.hideMenus();

			this.state = GameState.running;
			this.roundType = RoundTypes.tutorial;

			Hud.show();
			Camera.startTutorial();
			Tutorial.start();
		}.bind(this));
	}

	startTraining() {
		Fade.fadeCallback(function () {
			this.reset();
			this.hideMenus();

			this.state = GameState.running;
			this.roundType = RoundTypes.training;

			Hud.show();
			Camera.startTutorial();
			GameButtonController.show();
		}.bind(this));
	}

	startIntro() {
		Fade.fadeCallback(function () {
			this.reset();

			getRoundSettings().init();

			this.hideMenus();

			this.state = GameState.countdown;
			this.roundType = RoundTypes.normal;

			Hud.show();
			Camera.startIntro();
			Countdown.start();
		}.bind(this));
	}

	startGame() {
		this.state = GameState.running;

		if (getRoundSettings().hasTeamScore) TeamScore.show();
		if (getRoundSettings().hasQuestions) GameButtonController.show();
		if (getRoundSettings().hasJoker) Joker.show();
		CarController.boost();
		Camera.startGame();
	}

	pause(value = true) {
		if (value) {
			this.previousState = this.state;
			this.state = GameState.paused;
			Countdown.pause();
			PauseScreen.show();
			GameButtonController.hide();
		} else {
			this.state = this.previousState;
			Countdown.pause(false);
			PauseScreen.hide();
			if (this.previousState == GameState.running) GameButtonController.show();
		}
	}

	checkEnd() {
		if (this.distanceMeters >= GameSettings.roundDistanceMeters) this.sendEnd();
	}

	sendEnd() {
		getRoundSettings().sendGameEnd();
	}

	end() {
		this.state = GameState.menu;
		this.distanceMeters = GameSettings.roundDistanceMeters;

		this.hideMenus();

		EndScreen.show();
		Camera.startMenu();
	}

	correctSelection() {
		Score.correctSelection();
		Combo.correctSelection();
		CarController.boost();
	}

	wrongSelection() {
		Camera.enableScreenShake(1000);
		Environment.showSkidmarks();
		CarController.break();

		Score.wrongSelection();
		Combo.wrongSelection();
	}

	getDistancePercent() {
		let distance = this.distanceMeters / Math.max(this.distanceMeters, GameSettings.roundDistanceMeters);
		return distance;
	}

	setSingleScore(score) {
		Score.setSingleplayerScore(score);
	}

	setTeamScoreAverage(a, b) {
		Score.setTeamScore([a, b]);
	}

	setTeamCount(a, b) {
		Score.setTeamCount([a, b]);
	}
}

export var GameControllerInstance = new GameController();