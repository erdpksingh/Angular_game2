import { GameSettings } from "../../../Settings/GameSettings";
import { MultiplayerDummy } from "./MultiplayerDummy";
import { ConfigData } from "../../Config";
import { MultiplayerMbtw } from "./MultiplayerMbtw";
import { ExternalTypes } from "../ExternalTypes";
import { UserInstance as User} from "../../../UserProgress/User";
import { MultiplayerProvider } from "./MultiplayerProvider";

var initialized = false;
var multiplayerModeInstance = new MultiplayerProvider();

function getProvider() {
	if (GameSettings.testmode) {
		return new MultiplayerDummy();
	}

	switch (ConfigData.multiplayer_type) {
		case ExternalTypes.MBTW:
			return new MultiplayerMbtw(ConfigData.multiplayer_url);
		default:
			return new MultiplayerDummy();
	}
}

export function getMultiplayerProvider() {
	if (!initialized) {
		multiplayerModeInstance = getProvider();
		initialized = true;
	}

	return multiplayerModeInstance;
}