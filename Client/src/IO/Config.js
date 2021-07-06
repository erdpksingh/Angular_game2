import { FileLoader } from "./FileLoader";
import { Utility } from "../Helper/Utility";

export var ConfigData = {
	user_credentials_type: "",
	user_credentials_url: "",
	user_data_type: "",
	user_data_url: "",
	user_scoring_type: "",
	user_scoring_url: "",
	content_type: "",
	content_url: "",
	scoring_data_type: "",
	scoring_data_url: "",
	multiplayer_type: "",
	multiplayer_url: "",
	gt_app_provider_token: "",
	gt_app_app_token: "",
	gt_app_user_token: "",
}

export var ConfigLoader = {
	fileLoader: new FileLoader(),

	load(success, error) {
		let url = "config.json";

		this.fileLoader.loadFile(url, parseConfigFile(success), error);
	},
}

function parseConfigFile(success) {
	return function (data) {
		Utility.addToObject(ConfigData, JSON.parse(data));
		if (Utility.isDefined(success)) success();
	}
}