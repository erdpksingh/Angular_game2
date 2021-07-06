import { GameSettings } from "../Settings/GameSettings";
import { Ranking } from "./Ranking";
import { ScoreInstance as Score } from "../Gameplay/Score";
import { ComboInstance as Combo } from "../Gameplay/Combo";
import { StringValues } from "../IO/Strings";
import { Utility } from "../Helper/Utility";
import { getLocaleString } from "../Helper/Localization";
import { AchievementSettings } from "../Settings/AchievementSettings";
import { UserDataInstance as UserData } from "../IO/Externals/UserData/UserData";
import { UserScoringInstance as UserScoring } from "../IO/Externals/UserScoring/UserScoring";
import { ScoringValues } from "../IO/Externals/ScoringData/ScoringData";

var progress = [];

class Achievements {
	constructor() {
		for (let i = 0; i < AchievementSettings.achievementNum; ++i) progress[i] = false;
	}

	unlock(index) {
		progress[index] = true;
	}

	update(result = []) {
		for (let i = 0; i < AchievementSettings.achievementNum; ++i) {
			result[i] = false;
			if (this.isNewAchievement(i)) {
				this.unlock(i);
				this.sendUnlockToDatabase(i);

				if (!(this.hasOverridingSuccessor(i) && this.isNewAchievement(i + 1))) {
					this.sendRewardToApi(i);
					result[i] = true;
				}
			}
		}
	}

	isNewAchievement(index) {
		return !(AchievementSettings.achievementUnique[index] && progress[index]) && this.getCurrentValueForAchievement(index) >= AchievementSettings.achievementLimits[index];
	}

	getCurrentValueForAchievement(index) {
		let value = 0;
		if (index < 3) value = AchievementSettings.achievementUnique[index] ? Ranking.best_score : Score.getSingleplayerScore();
		else if (index < 6) value = Ranking.total_score;
		else if (index < 9) value = AchievementSettings.achievementUnique[index] ? Ranking.best_combo : Combo.getMaxCombo();
		else {
			let correct = Score.getCorrectAnswers();
			let wrong = Score.getWrongAnswers();

			value = correct > 0 && wrong == 0 ? 100 : 0;
		}
		return value;
	}

	hasOverridingSuccessor(index) {
		return (index % 3) < 2 && index < 9
	}

	sendUnlockToDatabase(index) {
		UserData.unlockAchievement(index);
	}

	sendRewardToApi(index) {
		let xpPoints = ScoringValues[AchievementSettings.achievementIds[index]];
		let task = this.getTask(index);
		UserScoring.sendScore(xpPoints, task, () => console.log("Sent +" + xpPoints + ": " + task));
	}

	getProgress(index) {
		return progress[index];
	}

	getLimit(index) {
		return AchievementSettings.achievementLimits[index];
	}

	getCount() {
		return AchievementSettings.achievementNum;
	}

	getTask(index) {
		return Utility.formatString(StringValues["achievements_" + index], this.getLimit(index).toLocaleString(getLocaleString()))
	}
}

export var AchievementsInstance = new Achievements();