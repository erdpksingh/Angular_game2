import { GameSettings } from "../../../Settings/GameSettings";
import { UserDataDummy } from "./UserDataDummy";
import { ConfigData } from "../../Config";
import { UserDataHyperCms } from "./UserDataHyperCms";
import { ExternalTypes } from "../ExternalTypes";
import { UserDataMbtw } from "./UserDataMbtw";

export function getUserDataProvider() {
	if (GameSettings.testmode) {
		return new UserDataDummy();
	}

	switch (ConfigData.user_data_type) {
		case ExternalTypes.HYPERCMS:
			return new UserDataHyperCms();
		case ExternalTypes.MBTW:
			return new UserDataMbtw(ConfigData.user_data_url);
		default:
			return new UserDataDummy();
	}
}