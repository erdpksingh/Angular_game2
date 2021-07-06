import { Utility } from "../../../Helper/Utility";
import { getUserDataProvider } from "./UserDataProviderFactory";
import { StringValues } from "../../Strings";
import { Popup } from "../../../UI/Popup";
import { UserInstance as User } from "../../../UserProgress/User";
import { Ranking } from "../../../UserProgress/Ranking";
import { AchievementsInstance as Achievements } from "../../../UserProgress/Achievements";

class UserData {
	unlockAchievement(achievementId) {
		let provider = getUserDataProvider();
		provider.unlockAchievement(achievementId);
	}

	loadHighscoreBest(callback) {
		let provider = getUserDataProvider();
		provider.loadHighscoreBest(callback);
	}

	loadHighscoreBestNearby(callback) {
		let provider = getUserDataProvider();
		provider.loadHighscoreBestNearby(callback);
	}

	loadHighscoreTotal(callback) {
		let provider = getUserDataProvider();
		provider.loadHighscoreTotal(callback);
	}

	loadHighscoreTotalNearby(callback) {
		let provider = getUserDataProvider();
		provider.loadHighscoreTotalNearby(callback)
	}

	sendScore(score, combo, successCallback) {
		let provider = getUserDataProvider();
		provider.sendScore(score, combo, getStatsSuccessCallback(successCallback), getErrorCallback(function () { this.sendScore(score, combo, successCallback); }.bind(this)));
	}

	updateUserStats(successCallback, errorCallback) {
		let provider = getUserDataProvider();
		provider.updateUserStats(getStatsSuccessCallback(successCallback), errorCallback);
	}
}

function getStatsSuccessCallback(callback) {
	return function (data) {
		setupUserStats(data);
		if (Utility.isDefined(callback)) callback();
	}
}

function setupUserStats(data) {
	if (Utility.isDefined(data.teamId)) User.setTeam(data.teamId);
	if (Utility.isDefined(data.totalScore)) Ranking.total_score = data.totalScore;
	if (Utility.isDefined(data.bestScore)) Ranking.best_score = data.bestScore;
	if (Utility.isDefined(data.bestCombo)) Ranking.best_combo = data.bestCombo;
	if (Utility.isDefined(data.rankTotal)) Ranking.rank_total = data.rankTotal;
	if (Utility.isDefined(data.rankBest)) Ranking.rank_best = data.rankBest;

	if (Utility.isDefined(data.achievements)) {
		for (let i = 0; i < data.achievements.length; ++i) {
			if (data.achievements[i]) Achievements.unlock(i);
		}
	}
}

function getErrorCallback(retryCallback) {
	return function () {
		new Popup(
			StringValues.connectionErrorTitle,
			StringValues.sendScoreError,
			[{ text: StringValues.buttonCancel }, { text: StringValues.buttonRetry, callback: retryCallback }]
		);
	}
}

export var UserDataInstance = new UserData();