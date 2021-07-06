import { getParameter } from "../IO/Parameters";
import { PointFeedbackInstance as PointFeedback } from "../UI/PointFeedback";
import { ComboInstance as Combo } from "./Combo";
import { registerCheat, cheatCode } from "../Helper/Cheats";
import { ScoringValues } from "../IO/Externals/ScoringData/ScoringData";
import { getRoundSettings } from "./GameModes/Round/RoundSettingsFactory";
import { Utility } from "../Helper/Utility";

var multiplier = 1;
var points = 0;
var teamScore = [0, 0];
var teamCount = [0, 0];
var averageTeamScore = [0, 0];
var totalTeamScore = [0, 0];
var temporaryPoints = 0;
var correctAnswers = 0;
var wrongAnswers = 0;

class Score {
	setup() {
		multiplier = getParameter("multiplier") || 1;

		registerCheat(cheatCode.SCORE, this.correctSelection.bind(this));
	}

	reset() {
		correctAnswers = 0;
		wrongAnswers = 0;
		points = 0;
		temporaryPoints = 0;
		teamScore = [0, 0];
		teamCount = [0, 0];
		averageTeamScore = [0, 0];
	}

	setMultiplier(value) {
		if (Utility.isDefined(value) && !isNaN(value)) {
			multiplier = value;
		}
	}

	correctSelection() {
		let newPoints = temporaryPoints;

		let bonus = ScoringValues.cr_correct_pair * Combo.getComboMultiplier();

		PointFeedback.start(bonus);
		newPoints += bonus;
		correctAnswers += 1;

		temporaryPoints = newPoints;
		getRoundSettings().sendScore(newPoints);
	}

	wrongSelection() {
		let newPoints = temporaryPoints;
		newPoints += ScoringValues.cr_wrong_pair;

		if (newPoints < 0) newPoints = 0;
		PointFeedback.start(newPoints - temporaryPoints);

		wrongAnswers += 1;

		temporaryPoints = newPoints;
		getRoundSettings().sendScore(newPoints);
	}

	getSingleplayerScore() {
		return points;
	}

	setSingleplayerScore(score) {
		points = score;
	}

	setTotalTeamScore(score) {
		totalTeamScore = score;
	}

	setTeamScore(score) {
		teamScore = score;
		this.updateAverageTeamScore();
	}

	setTeamCount(count) {
		teamCount = count;
	}

	updateAverageTeamScore() {
		averageTeamScore[0] = teamCount[0] > 0 ? teamScore[0] / teamCount[0] : 0;
		averageTeamScore[1] = teamCount[1] > 0 ? teamScore[1] / teamCount[1] : 0;
	}

	getAverageTeamScore(index, useMultiplier = true) {
		return averageTeamScore[index] * multiplier;
	}

	getTotalTeamScore(index) {
		return totalTeamScore[index];
	}

	getTeamCount(index) {
		return teamCount[index];
	}

	getCorrectAnswers() {
		return correctAnswers;
	}

	getWrongAnswers() {
		return wrongAnswers;
	}
}

export var ScoreInstance = new Score();