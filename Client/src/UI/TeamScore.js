import { Utility } from "../Helper/Utility";
import { StringValues } from "../IO/Strings";
import { getLocaleString } from "../Helper/Localization";
import { ScoreInstance as Score} from "../Gameplay/Score";

class TeamScore {
	setup() {
		this.menu = document.getElementById("teamScore");
		this.teamA = document.getElementById("teamScore0");
		this.teamB = document.getElementById("teamScore1");
		this.teamASubtitle = document.getElementById("teamScoreSubtitle0");
		this.teamBSubtitle = document.getElementById("teamScoreSubtitle1");
		this.teamASingle = document.getElementById("teamScoreSingle0");
		this.teamBSingle = document.getElementById("teamScoreSingle1");
		this.setScore = this.setScoreTotal.bind(this);
	}

	setScoreTotal(teamA, teamB) {
		teamA = teamA.toLocaleString(getLocaleString());
		teamB = teamB.toLocaleString(getLocaleString());

		this.teamA.innerHTML = teamA;
		this.teamB.innerHTML = teamB;
		this.teamASubtitle.innerHTML = StringValues.totalScore;
		this.teamBSubtitle.innerHTML = StringValues.totalScore;
		this.teamASingle.innerHTML = "";
		this.teamBSingle.innerHTML = "";
	}

	setScoreAverage(teamA, teamB) {
		teamA = teamA.toLocaleString(getLocaleString(), { maximumFractionDigits: 0 });
		teamB = teamB.toLocaleString(getLocaleString(), { maximumFractionDigits: 0 });

		this.teamA.innerHTML = "";
		this.teamB.innerHTML = "";
		this.teamASubtitle.innerHTML = "";
		this.teamBSubtitle.innerHTML = "";
		this.teamASingle.innerHTML = "&empty; " + teamA;
		this.teamBSingle.innerHTML = "&empty; " + teamB;
	}

	update() {
		this.setScoreTotal(Score.getTotalTeamScore(0), Score.getTotalTeamScore(1));
		this.setScoreAverage(Score.getAverageTeamScore(0), Score.getAverageTeamScore(1));
	}

	hide() {
		Utility.disableElement(this.menu);
	}

	show() {
		Utility.enableElement(this.menu);
	}
}

export var TeamScoreInstance = new TeamScore();