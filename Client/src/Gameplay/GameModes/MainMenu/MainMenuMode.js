export class MainMenuMode {
	hasStartButton = false;
	hasTrainingButton = false;
	hasTutorialButton = false;
	hasAchievementButton = false;
	hasRankingButton = false;
	hasTeamScore = false;
	hasTeamCount = false;
	hasInfo = false;

	teamScoreCallback = function (a, b) { };
	teamCountCallback = function (a, b) { };
	gameStartCallback = function () { };

	init() { }
	update() { }
	sendGameStart() { }
	getInfo() { return ""; }
	exit() { }
}