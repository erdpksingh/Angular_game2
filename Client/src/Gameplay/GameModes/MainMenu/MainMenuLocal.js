import { MainMenuMode } from "./MainMenuMode";

export class MainMenuLocal extends MainMenuMode {
	hasStartButton = true;
	hasTrainingButton = true;
	hasTutorialButton = true;
	// hasAchievementButton = true;
	// hasRankingButton = true;
	sendGameStart() {
		this.gameStartCallback();
	}
}