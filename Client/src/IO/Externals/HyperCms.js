import ComboRacerApi from "./ComboRacerApi"
import { Utility } from "../../Helper/Utility";
import { ConfigData } from "../Config";

export class HyperCms {
	constructor() {
		this.openQueries = 0;
		this.defaultClient = null;

		this.defaultClient = ComboRacerApi.ApiClient.instance;
		var api_key = this.defaultClient.authentications['api_key'];
		api_key.apiKey = "c746510a3ca2d711cacccaedd5a2e209c101af8b";
		this.defaultClient.basePath = ConfigData.user_data_url;
	}

	getUserStats(userId, contentId, success, error) {
		var api = new ComboRacerApi.StatsApi(this.defaultClient);
		++this.openQueries;
		api.statsGet(userId, contentId, { groupId: 0 }, newCallback(this, success, error));
	}

	getHighscoreBest(limit, contentId, success, error) {
		var api = new ComboRacerApi.HighscoreApi(this.defaultClient);
		++this.openQueries;
		api.highscoreBestGet(limit, contentId, { groupId: 0 }, newCallback(this, success, error));
	}

	getHighscoreBestNearby(userId, limit, contentId, success, error) {
		var api = new ComboRacerApi.HighscoreApi(this.defaultClient);
		++this.openQueries;
		api.highscoreBestUserGet(limit, userId, contentId, { groupId: 0 }, newCallback(this, success, error));
	}

	getHighscoreTotal(limit, contentId, success, error) {
		var api = new ComboRacerApi.HighscoreApi(this.defaultClient);
		++this.openQueries;
		api.highscoreTotalGet(limit, contentId, { groupId: 0 }, newCallback(this, success, error));
	}

	getHighscoreTotalNearby(userId, limit, contentId, success, error) {
		var api = new ComboRacerApi.HighscoreApi(this.defaultClient);
		++this.openQueries;
		api.highscoreTotalUserGet(limit, userId, contentId, { groupId: 0 }, newCallback(this, success, error));
	}

	sendHighscore(userId, contentId, score, best_combo, success, error) {
		var api = new ComboRacerApi.HighscoreApi(this.defaultClient);
		++this.openQueries;
		api.highscorePost(userId, contentId, { score: score, best_combo: best_combo }, { groupId: 0 }, newCallback(this, success, error));
	}

	sendAchievement(userId, contentId, achievement_id, unlocked, timestamp, success, error) {
		var api = new ComboRacerApi.AchievementsApi(this.defaultClient);
		++this.openQueries;
		api.achievementsPut(userId, contentId, { achievement_id: achievement_id, unlocked: unlocked, timestamp: timestamp }, { groupId: 0 }, newCallback(this, success, error));
	}

	getContentConfig(contentId, success, error) {
		var api = new ComboRacerApi.ContentApi(this.defaultClient);
		++this.openQueries;
		api.contentContentIdGet(contentId, newCallback(this, success, error));
	}

	resetOpenQueries() {
		this.openQueries = 0;
	}

	hasOpenQueries() {
		return this.openQueries > 0;
	}
}

function newCallback(api, successCallback, errorCallback) {
	return function (error, data, response) {
		--api.openQueries;
		if (error) {
			printCallback(error, data, response);
			if (Utility.isDefined(errorCallback)) errorCallback(response);
		} else {
			printCallback(error, data, response);
			if (Utility.isDefined(successCallback)) successCallback(data);
		}
	};
}

function printCallback(error, data, response) {
	if (error) {
		if (Utility.isDefined(response)) {
			console.log("Database communication error: " + error + " message: " + response.text);
		} else {
			console.log("Database communication error: " + error);
		}
	} else {
		//console.log(response);
	}
}