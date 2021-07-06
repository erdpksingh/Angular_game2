import { ScoringDataProvider } from "./ScoringDataProvider";
import { Utility } from "../../../Helper/Utility";
import { FileLoader, CsvProcessing } from "../../FileLoader";
import { ConfigData } from "../../Config";

export class ScoringDataCsv extends ScoringDataProvider {
	constructor() {
		super();
		this.fileLoader = new FileLoader();
	}

	load(successCallback, errorCallback) {
		let url = ConfigData.scoring_data_url;

		this.fileLoader.loadFile(url, parseConfigFile(successCallback), errorCallback);
	}
}

function parseConfigFile(callback) {
	return function (data) {
		let variables = CsvProcessing.processCsvDataVariables(data);
		if (Utility.isDefined(callback)) callback(variables);
	}
}