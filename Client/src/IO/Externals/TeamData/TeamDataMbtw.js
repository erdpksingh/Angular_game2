import { TeamDataProvider } from "./TeamDataProvider";
import { UserInstance as User } from "../../../UserProgress/User";
import { Utility } from "../../../Helper/Utility";
import { Mbtw } from "../Mbtw";

export class TeamDataMbtw extends TeamDataProvider {
	constructor(url) {
		super();
		this.api = new Mbtw(url);
	}

	queryTeamScore(callback) {
		this.api.queryTeamScore(User.getGroup(), parseTeamScore(callback));
	}

	sendTeamScore(score0, score1, callback) {
		this.api.sendTeamScore(User.getGroup(), score0, score1, callback);
	}
}

function parseTeamScore(callback) {
	return function (data) {
		let score = [0, 0];

		data.forEach(entry => {
			score[entry.team_id - 1] = entry.score;
		});

		if (Utility.isDefined(callback)) callback(score);
	}
}