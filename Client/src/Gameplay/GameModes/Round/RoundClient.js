import { RoundMode } from "./RoundMode";
import { getMultiplayerProvider } from "../../../IO/Externals/Multiplayer/MultiplayerProviderFactory";
import { ServerState } from "../../../IO/Externals/Multiplayer/ServerState";
import { ComboInstance as Combo} from "../../Combo";
import { CarColors, ModelSettings } from "../../../Settings/ModelSettings";
import { UserInstance as User} from "../../../UserProgress/User";
import { Teams } from "../../Teams";

var lastUpdateTime = 0;
var updateIntervalMS = 2000;

export class RoundClient extends RoundMode {
	hasQuestions = true;
	hasJoker = true;
	hasSingleScore = true;
	init() {
		
	}
	update() {
		let now = (new Date()).getTime();
		if (lastUpdateTime + updateIntervalMS <= now) {
			getMultiplayerProvider().queryMultiplayerState(multiplayerStateCallback.bind(this));
			lastUpdateTime = now;
		}
	}
	sendScore(a) {
		getMultiplayerProvider().sendMultiplayerScore(a, function() { this.singleScoreCallback(a); }.bind(this));
	}
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

function multiplayerStateCallback(data) {
	if (data.state != ServerState.RUNNING) {
		this.gameEndCallback();
	}
}