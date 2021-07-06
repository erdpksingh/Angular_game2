import { ContentProvider } from "./ContentProvider";
import { GameSettings } from "../../../Settings/GameSettings";
import { FileLoader, CsvProcessing } from "../../FileLoader";
import { Utility } from "../../../Helper/Utility";
import { ConfigData } from "../../Config";

export class ContentHyperCms extends ContentProvider {
	constructor() {
		super();
		this.fileLoader = new FileLoader();
	}

	load(contentId, successCallback, errorCallback) {
		loadLanguage(contentId, this.fileLoader, GameSettings.language, successCallback, loadLanguage(this.fileLoader, GameSettings.defaultLanguage, successCallback, errorCallback))();
	}
}

function loadLanguage(contentId, fileLoader, language, successCallback, errorCallback) {
	return function () {
		let fileName = contentId + "/content_" + language;
		if (GameSettings.testdeployment) fileName += "_test";
		
		let fileExtention = ".csv";

		//GameSettings.contentUrl is set for test mode. Use ConfigData if it is not set
		let url = GameSettings.forceContent ? GameSettings.contentUrl : ConfigData.content_url;
		url = url.replace(/\/$/, "");
		url += "/cms";
		url += "/" + fileName + fileExtention;

		fileLoader.resetDataRequests();
		fileLoader.loadFile(url, fillStringsDictionary(successCallback, errorCallback), errorCallback);
	}
}

function fillStringsDictionary(success, error) {
	return function (dataFile, url) {
		if (typeof dataFile === "undefined" || dataFile.length == 0 || dataFile[0] == "<") {
			console.log("Problem loading table data from " + url);
			if (Utility.isDefined(error)) error();
			return;
		}

		let lines = CsvProcessing.processCsvDataVariables(dataFile);

		lines = removePrefix(lines);

		if (Utility.isDefined(success)) success(lines);
	}
}

function removePrefix(values) {
	let lines = {};
	let prefix = /^gen_\d+_/;
	for (let key in values) {
		let localKey = key.replace(prefix, "");
		lines[localKey] = values[key];
	}
	return lines;
}