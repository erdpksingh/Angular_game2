import { getTeamDataProvider } from "./TeamDataProviderFactory";
import { ScoreInstance as Score} from "../../../Gameplay/Score";
import { Utility } from "../../../Helper/Utility";

class TeamData {
	queryTeamScore(callback) {
		let provider = getTeamDataProvider();
		provider.queryTeamScore(getScoreSuccessCallback(callback));
	}

	sendTeamScore(score0, score1, callback) {
		let provider = getTeamDataProvider();
		provider.sendTeamScore(score0, score1, callback);
	}
}

function getScoreSuccessCallback(callback) {
	return function (data) {
		setupTeamScore(data);
		if (Utility.isDefined(callback)) callback();
	}
}

function setupTeamScore(data) {
	Score.setTotalTeamScore(data);
}

export var TeamDataInstance = new TeamData();