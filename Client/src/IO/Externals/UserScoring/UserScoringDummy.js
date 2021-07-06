import { UserScoringProvider } from "./UserScoringProvider";

export class UserScoringDummy extends UserScoringProvider {
	sendScore(userId, value, reason, successCallback, errorCallback) {}
}