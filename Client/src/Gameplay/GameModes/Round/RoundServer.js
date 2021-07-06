import { RoundMode } from "./RoundMode";
import { getMultiplayerProvider } from "../../../IO/Externals/Multiplayer/MultiplayerProviderFactory";
import { ScoreInstance as Score} from "../../Score";
import { CarColors, ModelSettings } from "../../../Settings/ModelSettings";

var lastUpdateTime = 0;
var updateIntervalMS = 2000;

export class RoundServer extends RoundMode {
	hasProgressBar = true;
	twoCarRace = true;
	hasGoal = true;
	hasTeamScore = true;
	environmentSpeedFactor = 1.5;

	init() {
		getMultiplayerProvider().sendClearLobby(clearLobbyCallback.bind(this));
		getMultiplayerProvider().sendServerRunning();
	}
	update() {
		let now = (new Date()).getTime();
		if (lastUpdateTime + updateIntervalMS <= now) {
			getMultiplayerProvider().sendServerRunning();
			getMultiplayerProvider().queryLobby(queryLobbyCallback.bind(this));
			lastUpdateTime = now;
		}
	}
	sendGameEnd() {
		getMultiplayerProvider().sendServerFinished();
		getMultiplayerProvider().queryLobby(finalLobbyCallback.bind(this));
		this.gameEndCallback();
	}
	getCarPosition(index) {
		let minPos = -180;
		let maxPos = -60;
		return (minPos + maxPos) / 2 + Math.max(Math.min((Score.getAverageTeamScore(index, false) - Score.getAverageTeamScore(1 - index, false)) / 100, 1), -1) * (maxPos - minPos) / 2;
	}
	getCarColor(carIndex) {
		switch (carIndex) {
			case 0:
				return CarColors.white;
			case 1:
				return CarColors.red;
			default:
				return ModelSettings.carColor;
		}
	}
}

function clearLobbyCallback() {

}

function queryLobbyCallback(data) {
	this.teamScoreCallback(data.teamScore[0], data.teamScore[1]);
	this.teamCountCallback(data.teamCount[0], data.teamCount[1]);
}

function finalLobbyCallback(data) {
	getMultiplayerProvider().sendClearLobby(clearLobbyCallback.bind(this));
	this.teamScoreCallback(data.teamScore[0], data.teamScore[1]);
	this.teamCountCallback(data.teamCount[0], data.teamCount[1]);
}