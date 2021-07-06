import { ScoringDataProvider } from "./ScoringDataProvider";
import { GameSettings } from "../../../Settings/GameSettings";

export class ScoringDataDummy extends ScoringDataProvider {
	load(successCallback, errorCallback) {
		successCallback({});
	}
}
