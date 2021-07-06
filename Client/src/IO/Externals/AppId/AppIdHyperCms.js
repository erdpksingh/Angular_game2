import { AppIdProvider } from "./AppIdProvider";
import { GameSettings } from "../../../Settings/GameSettings";
import { FileLoader, CsvProcessing } from "../../FileLoader";
import { Utility } from "../../../Helper/Utility";
import { ConfigData } from "../../Config";

export class AppIdHyperCms extends AppIdProvider {
	constructor() {
		super();
		this.fileLoader = new FileLoader();
	}

	load(contentId, successCallback, errorCallback) {
		loadFile(contentId, this.fileLoader, successCallback, errorCallback);
	}
}

function loadFile(contentId, fileLoader, successCallback, errorCallback) {
	let fileName = contentId + "/content";
	let fileExtention = ".csv";

	//GameSettings.content_url is set for test mode. Use ConfigData if it is not set
	let url = GameSettings.forceContent ? GameSettings.contentUrl : ConfigData.content_url;
	url = url.replace(/\/$/, "");
	url += "/cms";
	url += "/" + fileName + fileExtention;

	fileLoader.loadFile(url, parseAppId(successCallback, errorCallback), errorCallback);
}

function parseAppId(success, error) {
	return function (dataFile) {
		if (typeof dataFile === "undefined" || dataFile.length == 0 || dataFile[0] == "<") {
			if (Utility.isDefined(error)) error();
			return;
		}

		let data = CsvProcessing.processCsvDataVariables(dataFile);

		if (!Utility.isDefined(data.games_channel_token) || data.games_channel_token == "" || data.games_channel_token == "not set") {
			if (Utility.isDefined(error)) error("The Game Channel Token has not been defined in the content management system. Please contact your administrator.");
			return;
		}

		if (Utility.isDefined(success)) success(data.games_channel_token);
	}
}