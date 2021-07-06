import { MultiplayerProvider } from "./MultiplayerProvider";
import { Utility } from "../../../Helper/Utility";
import { Mbtw } from "../Mbtw";
import { ServerState } from "./ServerState";
import { UserInstance as User } from "../../../UserProgress/User";

var MbtwServerState = {
	CLOSED: 0,
	IDLE: 1,
	RUNNING: 2
}

export class MultiplayerMbtw extends MultiplayerProvider {
	constructor(url) {
		super();
		this.questionIds = "";
		this.serverState = MbtwServerState.CLOSED;
		this.api = new Mbtw(url);
	}

	sendServerOpen() {
		this.sendServerState(MbtwServerState.IDLE);
	}

	sendServerRunning() {
		this.sendServerState(MbtwServerState.RUNNING);
	}

	sendServerFinished() {
		this.sendServerState(MbtwServerState.CLOSED);
	}

	sendServerClosed() {
		this.sendServerState(MbtwServerState.CLOSED);
	}

	sendServerState(serverState) {
		this.api.sendLive(User.getGroup(), serverState, this.questionIds);
		this.serverState = serverState;
	}

	sendQuestionId(questionIds) {
		this.questionIds = "";
		for (var i = 0; i < questionIds.length; ++i) {
			this.questionIds += "," + questionIds[i];
		}
		this.questionIds = this.questionIds.substr(1);
		this.sendServerState(this.serverState);
	}

	queryLobby(callback) {
		this.api.queryLobby(User.getGroup(), parseLobby(callback));
	}

	sendClearLobby(callback) {
		this.api.sendClearLobby(User.getGroup(), callback);
	}

	queryMultiplayerState(callback) {
		this.api.queryMultiplayerState(User.getGroup(), parseMultiplayerState(callback));
	}

	sendMultiplayerLogin() {
		this.api.sendMultiplayerLogin(User.getGroup(), User.getId(), User.getTeam());
	}

	sendMultiplayerScore(score, callback) {
		this.api.sendMultiplayerScore(User.getGroup(), User.getId(), User.getTeam(), score, callback);
	}
}

function parseLobby(callback) {
	return function (data) {
		let lobby = {
			teamCount: [0, 0],
			teamScore: [0, 0],
		}

		data.forEach(entry => {
			++lobby.teamCount[entry.team_id - 1];
			lobby.teamScore[entry.team_id - 1] += entry.score;
		});

		if (Utility.isDefined(callback)) callback(lobby);
	}
}

function parseScore(callback) {
	return function (data) {
		let score = [0, 0];

		data.forEach(entry => {
			score[entry.team_id - 1] = entry.score;
		});

		if (Utility.isDefined(callback)) callback(score);
	}
}

function parseMultiplayerState(callback) {
	return function (data) {

		let serverState;

		if (data.state === MbtwServerState.CLOSED) serverState = ServerState.CLOSED;
		else if (data.state === MbtwServerState.IDLE) serverState = ServerState.IDLE;
		else if (data.state === MbtwServerState.RUNNING) serverState = ServerState.RUNNING;

		let returnData = {
			state: serverState,
			questionIds: data.question_ids.split(",")
		};

		if (Utility.isDefined(callback)) callback(returnData);
	}
}
