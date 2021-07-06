import { ModelSettings } from "../../../Settings/ModelSettings";

export class RoundMode {
	hasProgressBar = false;
	hasQuestions = false;
	hasJoker = false;
	hasGoal = false;
	twoCarRace = false;
	environmentSpeedFactor = 1;
	
	hasTeamScore = false;
	hasSingleScore = false;

	teamScoreCallback = function (a, b) { };
	teamCountCallback = function (a, b) { };
	singleScoreCallback = function (a) { };
	carPositionCallback = function (a) { };
	gameEndCallback = function () { };

	init() { }
	update() { }
	sendScore(score) { }
	sendGameEnd() { }
	getCarPosition(index) { return 0; }
	getCarColor(carIndex) { return ModelSettings.carColor }
}