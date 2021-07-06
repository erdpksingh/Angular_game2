import { GameModes } from "../GameModes";
import { EndScreenLocal } from "./EndScreenLocal";
import { GameSettings } from "../../../Settings/GameSettings";
import { EndScreenMode } from "./EndScreenMode";
import { EndScreenServer } from "./EndScreenServer";
import { EndScreenClient } from "./EndScreenClient";

var initialized = false;
var mainMenuModeInstance = new EndScreenMode();

function getMode() {
	switch (GameSettings.gameMode) {
		case GameModes.LOCAL:
			return new EndScreenLocal();
		case GameModes.CLIENT:
			return new EndScreenClient();
		case GameModes.SERVER:
			return new EndScreenServer();
		default:
			return new EndScreenMode();
	}
}

export function getEndScreenSettings() {
	if (!initialized) {
		mainMenuModeInstance = getMode();
		initialized = true;
	}

	return mainMenuModeInstance;
}