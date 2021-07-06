import { GameSettings } from "../../../Settings/GameSettings";
import { UserInstance as User } from "../../../UserProgress/User";
import { Utility } from "../../../Helper/Utility";
import { getUserCredentialsProvider } from "./UserCredentialsProviderFactory";

class UserCredentials {
	load(success, error) {
		let provider = getUserCredentialsProvider();
		provider.loadUser(getLoadingSuccessCallback(success, error), error);
	}

	getUsers(playerIds, callback) {
		let provider = getUserCredentialsProvider();
		provider.getUsers(playerIds, callback);
	}
}

function getLoadingSuccessCallback(success, error) {
	return function (data) {
		if (!Utility.isDefined(data)) {
			if (Utility.isDefined(error)) error();
			return;
		}

		setupUser(data);

		if (Utility.isDefined(success)) success();
	}
}

function setupUser(data) {
	if (Utility.isDefined(data.id)) User.setId(data.id);
	if (Utility.isDefined(data.nickname)) User.setName(data.nickname);

	if (Utility.isDefined(data.language) && !GameSettings.forceLanguage) GameSettings.language = data.language;

	console.log("User received - ID: " + data.id + " - nickname: " + data.nickname + " - language: " + data.language);
}

export var UserCredentialsInstance = new UserCredentials();