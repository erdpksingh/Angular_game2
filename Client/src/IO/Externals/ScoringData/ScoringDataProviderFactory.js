import { GameSettings } from "../../../Settings/GameSettings";
import { ScoringDataDummy } from "./ScoringDataDummy";
import { ConfigData } from "../../Config";
import { ScoringDataHyperCms } from "./ScoringDataHyperCms";
import { ExternalTypes } from "../ExternalTypes";
import { ScoringDataCsv } from "./ScoringDataCsv";

export function getScoringDataProvider() {
	if (GameSettings.testmode) {
		return new ScoringDataDummy();
	}

	switch (ConfigData.scoring_data_type) {
		case ExternalTypes.HYPERCMS:
			return new ScoringDataHyperCms();
		case ExternalTypes.CSV:
			return new ScoringDataCsv();
		default:
			return new ScoringDataDummy();
	}
}