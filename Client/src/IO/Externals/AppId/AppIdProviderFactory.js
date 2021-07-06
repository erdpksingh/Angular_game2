import { AppIdDummy } from "./AppIdDummy";
import { ConfigData } from "../../Config";
import { AppIdHyperCms } from "./AppIdHyperCms";
import { ExternalTypes } from "../ExternalTypes";
import { GameSettings } from "../../../Settings/GameSettings";

export function getAppIdProvider() {
	if (GameSettings.testmode) {
		return new AppIdDummy();
	}

	switch (ConfigData.content_type) {
		case ExternalTypes.HYPERCMS:
			return new AppIdHyperCms();
		default:
			return new AppIdDummy();
	}
}