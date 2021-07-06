import { UserDataProvider } from "./UserDataProvider";
import { UserInstance as User} from "../../../UserProgress/User";
import { GameSettings } from "../../../Settings/GameSettings";
import { Utility } from "../../../Helper/Utility";
import { HyperCms } from "../HyperCms";

export class UserDataHyperCms extends UserDataProvider {
	constructor() {
		super();
		this.api = new HyperCms();
	}

	unlockAchievement(achievementId) {
		this.api.sendAchievement(User.getId(), GameSettings.contentId, achievementId, true, (new Date()).toISOString());
	}

	loadHighscoreBest(callback) {
		this.api.getHighscoreBest(GameSettings.rankingListNum, GameSettings.contentId, parseRanking(callback));
	}

	loadHighscoreBestNearby(callback) {
		this.api.getHighscoreBestNearby(User.getId(), 1, GameSettings.contentId, parseRanking(callback));
	}

	loadHighscoreTotal(callback) {
		this.api.getHighscoreTotal(GameSettings.rankingListNum, GameSettings.contentId, parseRanking(callback));
	}

	loadHighscoreTotalNearby(callback) {
		this.api.getHighscoreTotalNearby(User.getId(), 1, GameSettings.contentId, parseRanking(callback));
	}

	sendScore(score, combo, successCallback, errorCallback) {
		this.api.sendHighscore(User.getId(), GameSettings.contentId, score, combo, parseStats(successCallback), errorCallback);
	}

	updateUserStats(successCallback, errorCallback) {
		this.api.getUserStats(User.getId(), GameSettings.contentId, parseStats(successCallback), parseStatsError(successCallback, errorCallback))
	}
}

function parseStats(callback) {
	return function(data) {
		let returnData = {
			teamId: data.team_id,
			totalScore: data.user_scores.total_score,
			bestScore: data.user_scores.best_score,
			bestCombo: data.user_scores.best_combo,
			rankTotal: data.user_scores.rank_total,
			rankBest: data.user_scores.rank_best,
			achievements: []
		}
		
		for (let i = 0; i < data.achievements.length; ++i) {
			returnData.achievements[data.achievements[i].achievement_id] = data.achievements[i].unlocked;
		}
		
		if (Utility.isDefined(callback)) callback(returnData);
	}
}

function getEmptyStats() {
	return {
		teamId: GameSettings.defaultTeam,
		totalScore: 0,
		bestScore: 0,
		bestCombo: 0,
		rankTotal: 0,
		rankBest: 0,
		achievements: []
	};
}

function parseStatsError(success, error) {
	return function (response) {
		if (Utility.isDefined(response)) {
			switch (response.statusCode) {
				case 404:
					//new user
					console.log("User is not yet registered in the database.");
					if (Utility.isDefined(success)) success(getEmptyStats());
					break;
				default:
					if (Utility.isDefined(error)) error();
			}
		} else { 
			console.log("Database response is invalid.");
			if (Utility.isDefined(error)) error();
		}
	}
}

function parseRanking(callback) {
	return function(data) {
		let list = []; 

		for (let i = 0; i < data.length; ++i) {
			list.push({user_id: data[i].user_id, team_id: data[i].team_id, score: data[i].score, rank: data[i].rank })
		}
		
		if (Utility.isDefined(callback)) callback(list);
	}
}