import { RoundMode } from "./RoundMode";
import { ComboInstance as Combo} from "../../Combo";
import { UserInstance as User } from "../../../UserProgress/User";
import { Teams } from "../../Teams";
import { CarColors, ModelSettings } from "../../../Settings/ModelSettings";

export class RoundLocal extends RoundMode {
	hasProgressBar = true;
	hasQuestions = true;
	hasJoker = true;
	hasGoal = true;
	hasSingleScore = true;
	sendScore(a) { this.singleScoreCallback(a); }
	sendGameEnd() { this.gameEndCallback(); }
	getCarPosition(index) {
		let minPos = -140;
		let maxPos = 40;
		return Combo.lerpCombo(minPos, maxPos);
	}
	getCarColor(carIndex) {
		let teamId = User.getTeam();
		
		switch (teamId) {
			case Teams.teamA:
				return CarColors.white;
			case Teams.teamB:
				return CarColors.red;
			default:
				return ModelSettings.carColor;
		}
	}
}