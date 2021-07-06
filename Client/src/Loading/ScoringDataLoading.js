import { ScoringDataInstance as ScoringData } from "../IO/Externals/ScoringData/ScoringData";

export var ScoringDataLoading = {
	name: "Scoring Data",
	enter: function(success, error) {
		ScoringData.load(success, error);
	},
	timeout: 10000,
}