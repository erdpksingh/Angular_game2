import { UserCredentialsProvider } from "./UserCredentialsProvider";
import { GameSettings } from "../../../Settings/GameSettings";

export class UserCredentialsDummy extends UserCredentialsProvider {
	loadUser(successCallback, errorCallback) {
		successCallback({
			nickname: "player",
			language: GameSettings.defaultLanguage,
		});
	}

	getUsers(playerIds, callback) {
		let nicknames = [];
		for (let i = 0; i < playerIds.length; ++i) {
			nicknames[playerIds[i]] = "player " + (i + 1);
		}
		setTimeout(callback, 1000, nicknames);
	}
}