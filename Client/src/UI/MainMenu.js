import { GameControllerInstance as GameController } from "../Gameplay/GameController";
import { Utility } from "../Helper/Utility";
import { GameSettings } from "../Settings/GameSettings";
import { getMainMenuSettings } from "../Gameplay/GameModes/MainMenu/MainMenuSettingsFactory";
import { ScoreInstance as Score} from "../Gameplay/Score";
import { sendMessageToUnity } from "../IO/Externals/Unity";

class MainMenu {
	setup() {
		this.menu = document.getElementById("mainMenu");

		this.startButton = document.getElementById("btMenuStart");
		this.startButton.onclick = this.start.bind(this);
		this.startButtonContainer = document.getElementById("mainMenuStartContainer");
		if (!getMainMenuSettings().hasStartButton) Utility.disableElement(this.startButtonContainer);
		
		this.tutorialButton = document.getElementById("btMenuTutorial");
		this.tutorialButton.onclick = this.startTutorial.bind(this);
		if (!getMainMenuSettings().hasTutorialButton) Utility.disableElement(this.tutorialButton);
		
		this.trainingButton = document.getElementById("btMenuTraining");
		this.trainingButton.onclick = this.startTraining.bind(this);
		if (!getMainMenuSettings().hasTrainingButton) Utility.disableElement(this.trainingButton);
		
		this.achievementButton = document.getElementById("btMenuAchievements");
		this.achievementButton.onclick = this.startAchievements.bind(this);
		if (!getMainMenuSettings().hasAchievementButton) Utility.disableElement(this.achievementButton);
		
		this.rankingButton = document.getElementById("btMenuRanking");
		this.rankingButton.onclick = this.startRanking.bind(this);
		if (!getMainMenuSettings().hasRankingButton) Utility.disableElement(this.rankingButton);
		
		this.teamCount = document.getElementById("teamCountContainer");
		this.teamCountA = document.getElementById("teamCount0");
		this.teamCountB = document.getElementById("teamCount1");
		if (!getMainMenuSettings().hasTeamCount) Utility.disableElement(this.teamCount);
		
		this.info = document.getElementById("mainMenuInfo");
		this.info.innerHTML = getMainMenuSettings().getInfo();
		if (!getMainMenuSettings().hasInfo) Utility.disableElement(this.info);
		
		this.buttonBack = document.getElementById("mainMenuBackButton");
		this.buttonBack.onclick = this.back.bind(this);

		let testmode = document.getElementById("testmode");
		if (!GameSettings.testmode) Utility.disableElement(testmode);
	}

	start() {
		getMainMenuSettings().sendGameStart();
	}

	startTutorial() {
		GameController.startTutorial();
	}

	startTraining() {
		GameController.startTraining();
	}

	startAchievements() {
		GameController.startAchievements();
	}

	startRanking() {
		GameController.startRanking();
	}

	update() {
		this.setTeamCount(Score.getTeamCount(0), Score.getTeamCount(1));
	}

	hide() {
		Utility.disableElement(this.menu);
	}

	show() {
		Utility.enableElement(this.menu);
	}

	back() {
		getMainMenuSettings().exit();
		sendMessageToUnity("close");
		window.close();
		window.history.back();
	}

	setTeamCount(teamA, teamB) {
		this.teamCountA.innerHTML = teamA;
		this.teamCountB.innerHTML = teamB;
	}
}

export var MainMenuInstance = new MainMenu();