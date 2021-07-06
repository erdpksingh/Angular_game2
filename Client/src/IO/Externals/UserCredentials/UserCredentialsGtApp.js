import { UserCredentialsProvider } from "./UserCredentialsProvider";
import { Utility } from "../../../Helper/Utility";
import { ConfigData } from "../../Config";
import { GtApp } from "../GtApp";

export class UserCredentialsGtApp extends UserCredentialsProvider {
	loadUser(successCallback, errorCallback) {
		if (Utility.isDefined(ConfigData.gt_app_user_token) && ConfigData.gt_app_user_token != "") {
			let gtApp = new GtApp();
			gtApp.setup(ConfigData.user_credentials_url, ConfigData.gt_app_app_token, ConfigData.gt_app_provider_token);
			gtApp.getUserData(ConfigData.gt_app_user_token, parseUser(successCallback), errorCallback);
		} else {
			console.error("Could not read user token.");
			if (Utility.isDefined(errorCallback)) errorCallback();
		}
	}

	getUsers(playerIds, callback) {
		if (playerIds.length == 0) {
			callback({});
		} else {
			let gtApp = new GtApp();
			gtApp.setup(ConfigData.user_credentials_url, ConfigData.gt_app_app_token, ConfigData.gt_app_provider_token);
			gtApp.getUsers(playerIds, parseUserList(callback));
		}
	}
}

function parseUser(callback) {
	return function (data) {
		let returnData = {
			id: data.id,
			nickname: data.nickname,
			language: data.language
		}

		if (Utility.isDefined(callback)) callback(returnData);
	}
}

function parseUserList(callback) {
	return function (data) {
		var list = {};

		for (let i = 0; i < data.length; ++i) {
			list[data[i].id] = data[i].nickname;
		}

		if (Utility.isDefined(callback)) callback(list);
	}
}