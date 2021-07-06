import { GameModes } from "../GameModes";
import { MainMenuLocal } from "./MainMenuLocal";
import { GameSettings } from "../../../Settings/GameSettings";
import { MainMenuMode } from "./MainMenuMode";
import { MainMenuServer } from "./MainMenuServer";
import { MainMenuClient } from "./MainMenuClient";

var initialized = false;
var mainMenuModeInstance = new MainMenuMode();

function getMode() {
	switch (GameSettings.gameMode) {
		case GameModes.LOCAL:
			return new MainMenuLocal();
		case GameModes.CLIENT:
			return new MainMenuClient();
		case GameModes.SERVER:
			return new MainMenuServer();
		default:
			return new MainMenuMode();
	}
}

export function getMainMenuSettings() {
	if (!initialized) {
		mainMenuModeInstance = getMode();
		initialized = true;
	}

	return mainMenuModeInstance;
}