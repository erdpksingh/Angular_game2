import { GameModes } from "../GameModes";
import { RoundLocal } from "./RoundLocal";
import { GameSettings } from "../../../Settings/GameSettings";
import { RoundMode } from "./RoundMode";
import { RoundServer } from "./RoundServer";
import { RoundClient } from "./RoundClient";

var initialized = false;
var RoundModeInstance = new RoundMode();

function getMode() {
	switch (GameSettings.gameMode) {
		case GameModes.LOCAL:
			return new RoundLocal();
		case GameModes.CLIENT:
			return new RoundClient();
		case GameModes.SERVER:
			return new RoundServer();
		default:
			return new RoundMode();
	}

}

export function getRoundSettings() {
	if (!initialized) {
		RoundModeInstance = getMode();
		initialized = true;
	}

	return RoundModeInstance;
}