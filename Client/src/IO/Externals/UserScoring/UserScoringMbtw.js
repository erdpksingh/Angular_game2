import { UserScoringProvider } from "./UserScoringProvider";

export class UserScoringMbtw extends UserScoringProvider {
	sendScore(userId, value, reason, successCallback, errorCallback) {
		successCallback();
	}
}