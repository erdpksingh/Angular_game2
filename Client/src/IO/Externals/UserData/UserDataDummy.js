import { UserDataProvider } from "./UserDataProvider";
import { GameSettings } from "../../../Settings/GameSettings";
import { Teams } from "../../../Gameplay/Teams";

export class UserDataDummy extends UserDataProvider {
	unlockAchievement(achievementId) {

	}

	loadHighscoreBest(callback) {
		setTimeout(callback, 1000, getDummyRanking(5));
	}

	loadHighscoreBestNearby(callback) {
		setTimeout(callback, 1000, getDummyRanking(3));
	}

	loadHighscoreTotal(callback) {
		setTimeout(callback, 1000, getDummyRanking(5));
	}

	loadHighscoreTotalNearby(callback) {
		setTimeout(callback, 1000, getDummyRanking(3));
	}

	sendScore(score, combo, successCallback, errorCallback) {
		successCallback(getEmptyStats());
	}

	updateUserStats(successCallback, errorCallback) {
		successCallback(getEmptyStats());
	}
}

function getEmptyStats() {
	return {
		// teamId: GameSettings.defaultTeam,
		totalScore: 0,
		bestScore: 0,
		bestCombo: 0,
		rankTotal: 0,
		rankBest: 0,
		achievements: []
	};
}

function getDummyRanking(num) {
	let list = [];

	for (let i = 0; i < num; ++i) {
		list.push({ user_id: "player " + (i + 1), team_id: (Math.random() > 0.5 ? Teams.teamA : Teams.teamB), score: (num - i) * 100, rank: i + 1 })
	}

	return list;
}