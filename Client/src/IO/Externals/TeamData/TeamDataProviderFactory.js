import { GameSettings } from "../../../Settings/GameSettings";
import { TeamDataDummy } from "./TeamDataDummy";
import { ConfigData } from "../../Config";
import { TeamDataMbtw } from "./TeamDataMbtw";
import { ExternalTypes } from "../ExternalTypes";

export function getTeamDataProvider() {
	if (GameSettings.testmode) {
		return new TeamDataDummy();
	}

	switch (ConfigData.team_data_type) {
		case ExternalTypes.MBTW:
			return new TeamDataMbtw(ConfigData.team_data_url);
		default:
			return new TeamDataDummy();
	}
}