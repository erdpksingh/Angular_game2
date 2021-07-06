import { EndScreenMode } from "./EndScreenMode";
import { TeamDataInstance as TeamData} from "../../../IO/Externals/TeamData/TeamData";
import { ScoreInstance as Score} from "../../Score";

export class EndScreenServer extends EndScreenMode {
	hasTeamScore = true;
	sendScore(callback) {
		TeamData.sendTeamScore(Score.getAverageTeamScore(0), Score.getAverageTeamScore(1), updateTeamScore(callback));
	}
}

function updateTeamScore(callback) {
	return function () {
		TeamData.queryTeamScore(callback);
	}
}