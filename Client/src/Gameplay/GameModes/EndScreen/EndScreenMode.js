export class EndScreenMode {
	hasSingleScore = false;
	hasSingleCombo = false;
	hasRankSingle = false;
	hasRankTotal = false;
	hasAchievements = false;
	hasTeamScore = false;

	teamScoreCallback = function (a, b) { };
	teamCountCallback = function (a, b) { };
	gameStartCallback = function () { };

	init() { }
	update() { }
	sendScore(callback) { callback(); }
}