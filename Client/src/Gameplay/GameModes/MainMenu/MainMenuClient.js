import { StringValues } from "../../../IO/Strings";
import { MainMenuMode } from "./MainMenuMode";
import { Loading } from "../../../Loading/Loading";
import { GameSettings } from "../../../Settings/GameSettings";
import { QuestionLoading } from "../../../Loading/QuestionLoading";
import { Utility } from "../../../Helper/Utility";
import { ServerState } from "../../../IO/Externals/Multiplayer/ServerState";
import { getMultiplayerProvider } from "../../../IO/Externals/Multiplayer/MultiplayerProviderFactory";
import { isArray } from "util";

var lastUpdateTime = 0;
var updateIntervalMS = 2000;
var contentLoading = new Loading();

export class MainMenuClient extends MainMenuMode {
	hasTutorialButton = true;
	// hasRankingButton = true;
	hasInfo = true;
	getInfo() {
		return StringValues.mainMenuClientInfo;
	}
	init() {
		getMultiplayerProvider().sendMultiplayerLogin();
	}
	update() {
		let now = (new Date()).getTime();
		if (lastUpdateTime + updateIntervalMS <= now) {

			contentLoading.update(now - lastUpdateTime);

			getMultiplayerProvider().sendMultiplayerLogin();
			getMultiplayerProvider().queryMultiplayerState(multiplayerStateCallback.bind(this));

			lastUpdateTime = now;
		}
	}
}

function multiplayerStateCallback(data) {
	switch (data.state) {
		case ServerState.CLOSED:
			return;
		case ServerState.IDLE:
			tryLoadQuestions(data.questionIds);
			break;
		case ServerState.RUNNING:
			tryLoadQuestions(data.questionIds, this.gameStartCallback);
			break;
	}
}

function tryLoadQuestions(questionIds, onFinish = null) {
	if (!isArray(questionIds)) questionIds = [questionIds];

	let reloadQuestions = false;

	for (let i = 0; i < questionIds.length; ++i) {
		if (questionIds[i] != GameSettings.questionIds[i]) {
			reloadQuestions = true;
			break;
		}
	}

	if (reloadQuestions) {
		GameSettings.questionIds = questionIds;

		let contentLoading = new Loading();
		contentLoading.add(QuestionLoading);
		contentLoading.start(onFinish);
	} else if (onFinish) {
		onFinish();
	}
}