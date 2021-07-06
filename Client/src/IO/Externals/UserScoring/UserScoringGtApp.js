import { UserScoringProvider } from "./UserScoringProvider";
import { ConfigData } from "../../Config";
import { GtApp } from "../GtApp";

export class UserScoringGtApp extends UserScoringProvider {
	sendScore(userId, value, reason, successCallback, errorCallback) {
		let gtApp = new GtApp();
		gtApp.setup(ConfigData.user_credentials_url, ConfigData.gt_app_app_token, ConfigData.gt_app_provider_token);
		gtApp.sendScore(userId, value, reason, successCallback, errorCallback);
	}
}