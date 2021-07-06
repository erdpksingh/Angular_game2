import { Utility } from "../../../Helper/Utility";
import { getScoringDataProvider } from "./ScoringDataProviderFactory";

export var ScoringValues = {
	cr_score_min: 10,
	cr_score_med: 10,
	cr_score_max: 10,
	cr_total_min: 10,
	cr_total_med: 10,
	cr_total_max: 10,
	cr_combo_min: 10,
	cr_combo_med: 10,
	cr_combo_max: 10,
	cr_perfect: 10,
	cr_correct_pair: 10,
	cr_wrong_pair: -10,
	cr_combo_multiplier_0: 1,
	cr_combo_multiplier_1: 2,
	cr_combo_multiplier_2: 3,
	cr_combo_multiplier_3: 4,
	cr_combo_multiplier_4: 5,
};

class ScoringData {
	load(successCallback, errorCallback) {
		let provider = getScoringDataProvider();
		provider.load(getLoadingSuccessCallback(successCallback), errorCallback);
	}
}

function getLoadingSuccessCallback(callback) {
	return function (data) {
		Utility.addToObject(ScoringValues, data);
		if (Utility.isDefined(callback)) callback();
	}
}

export var ScoringDataInstance = new ScoringData();