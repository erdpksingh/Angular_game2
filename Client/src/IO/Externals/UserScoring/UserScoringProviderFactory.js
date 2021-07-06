import { GameSettings } from "../../../Settings/GameSettings";
import { UserScoringDummy } from "./UserScoringDummy";
import { ConfigData } from "../../Config";
import { UserScoringGtApp } from "./UserScoringGtApp";
import { ExternalTypes } from "../ExternalTypes";
import { UserScoringMbtw } from "./UserScoringMbtw";

export function getUserScoringProvider() {
	if (GameSettings.testmode) {
		return new UserScoringDummy();
	}

	switch (ConfigData.user_scoring_type) {
		case ExternalTypes.GTAPP:
			return new UserScoringGtApp();
		case ExternalTypes.MBTW:
			return new UserScoringMbtw();
		default:
			return new UserScoringDummy();
	}
}