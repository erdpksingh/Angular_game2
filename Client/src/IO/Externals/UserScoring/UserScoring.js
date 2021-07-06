import { UserInstance as User} from "../../../UserProgress/User";
import { getUserScoringProvider } from "./UserScoringProviderFactory";

class UserScoring {
	sendScore(points, task, callback) {
		let provider = getUserScoringProvider();
		provider.sendScore(User.getId(), points, task, callback);
	}
}

export var UserScoringInstance = new UserScoring();