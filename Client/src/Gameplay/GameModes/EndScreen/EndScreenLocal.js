import { EndScreenMode } from "./EndScreenMode";
import { UserDataInstance as UserData } from "../../../IO/Externals/UserData/UserData";
import { ScoreInstance as Score} from "../../Score";
import { ComboInstance as Combo} from "../../Combo";

export class EndScreenLocal extends EndScreenMode {
	hasSingleScore = true;
	hasSingleCombo = true;
	hasRankSingle = true;
	hasRankTotal = true;
	hasAchievements = true;

	sendScore(callback) {
		UserData.sendScore(Score.getSingleplayerScore(), Combo.getMaxCombo(), callback);
	}
}