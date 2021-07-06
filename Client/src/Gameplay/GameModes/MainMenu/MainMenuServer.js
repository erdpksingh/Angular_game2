import { StringValues } from "../../../IO/Strings";
import { MainMenuMode } from "./MainMenuMode";
import { GameSettings } from "../../../Settings/GameSettings";
import { getMultiplayerProvider } from "../../../IO/Externals/Multiplayer/MultiplayerProviderFactory";

var lastUpdateTime = 0;
var updateIntervalMS = 2000;

export class MainMenuServer extends MainMenuMode {
	hasStartButton = true;
	hasTutorialButton = true;
	// hasRankingButton = true;
	hasTeamCount = true;
	hasInfo = true;
	init() {
		getMultiplayerProvider().sendServerOpen();
		getMultiplayerProvider().sendQuestionId(GameSettings.questionIds);
		getMultiplayerProvider().sendClearLobby(clearLobbyCallback.bind(this));
	}
	getInfo() {
		return StringValues.mainMenuServerInfo;
	}
	update() {
		let now = (new Date()).getTime();
		if (lastUpdateTime + updateIntervalMS <= now) {
			getMultiplayerProvider().sendServerOpen();
			getMultiplayerProvider().queryLobby(queryLobbyCallback.bind(this));
			lastUpdateTime = now;
		}
	}
	sendGameStart() {
		this.gameStartCallback();
	}
	exit() {
		getMultiplayerProvider().sendServerClosed();
	}
}

function clearLobbyCallback() {

}

function queryLobbyCallback(data) {
	this.teamScoreCallback(data.teamScore[0], data.teamScore[1]);
	this.teamCountCallback(data.teamCount[0], data.teamCount[1]);
}