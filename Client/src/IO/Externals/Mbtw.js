import { ConfigData } from "../Config";

const query = require('query-string');

export class Mbtw {
	constructor(url) {
		this.url = url;
		this.game = "ComboRacer";
		this.hash = "d493424b366d859341d48aebc14c24ab";
	}

	sendLive(groupId, value, question_ids) {
		this.queryPut(groupId, {}, { state: value, multiplier: 1, game_id: this.game, question_ids: question_ids }, "games/comboracer/");
	}

	queryLobby(groupId, callback) {
		this.queryGet(groupId, {}, "games/comboracer/lobby", callback);
	}

	sendClearLobby(groupId, callback) {
		this.queryDelete(groupId, {}, "games/comboracer/lobby", callback);
	}

	sendTeamScore(groupId, score0, score1, callback) {
		let queryCount = 2;
		this.queryPost(groupId, {}, { score: score0 }, "games/comboracer/teamscores/1", function () { --queryCount; if (queryCount == 0) callback(); });
		this.queryPost(groupId, {}, { score: score1 }, "games/comboracer/teamscores/2", function () { --queryCount; if (queryCount == 0) callback(); });
	}

	queryTeamScore(groupId, callback) {
		this.queryGet(groupId, {}, `groups/${groupId}/teamscores`, callback);
	}

	queryMultiplayerState(groupId, callback) {
		this.queryGet(groupId, {}, "games/comboracer", callback);
	}

	sendMultiplayerLogin(groupId, userId, teamId) {
		this.queryPut(groupId, {}, { user_id: userId, team_id: teamId, score: -1 }, "games/comboracer/lobby");
	}

	//sends current score to server during live sessions
	sendMultiplayerScore(groupId, userId, teamId, score, callback) {
		this.queryPut(groupId, {}, { user_id: userId, team_id: teamId, score: score }, "games/comboracer/lobby", callback);
	}

	//sends final score to server in all sessions
	sendFinalScore(groupId, userId, score, callback) {
		this.queryPost(groupId, {}, { score: score }, `games/comboracer/userscores/${userId}`, callback);
	}

	queryGet(groupId, parameters, script, callback = null) {
		var xmlHttp = this.buildRequest("GET", groupId, parameters, script, callback);
		xmlHttp.send();
	}

	queryPost(groupId, parameters, payload, script, callback = null) {
		var xmlHttp = this.buildRequest("POST", groupId, parameters, script, callback);
		xmlHttp.send(JSON.stringify(payload));
	}

	queryPut(groupId, parameters, payload, script, callback = null) {
		var xmlHttp = this.buildRequest("PUT", groupId, parameters, script, callback);
		xmlHttp.send(JSON.stringify(payload));
	}

	queryDelete(groupId, parameters, script, callback = null) {
		var xmlHttp = this.buildRequest("DELETE", groupId, parameters, script, callback);
		xmlHttp.send();
	}

	buildRequest(method, groupId, parameters, script, callback = null) {
		parameters["game_id"] = this.game;
		parameters["group_id"] = groupId;

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open(method, this.url + '/' + script + "?" + query.stringify(parameters), true);
		xmlHttp.setRequestHeader('Authorization', this.hash);
		xmlHttp.setRequestHeader("Content-Type", "application/json");
		xmlHttp.onload = function () {
			if (xmlHttp.status == 200) {
				if (callback != null) {
					if (xmlHttp.responseText == "") {
						callback();
					} else {
						callback(JSON.parse(xmlHttp.responseText));
					}
				}
			}
		}
		xmlHttp.onerror = function () {
			console.error("Error in request '" + script + "': " + xmlHttp.responseText);
		}
		return xmlHttp;
	}
}