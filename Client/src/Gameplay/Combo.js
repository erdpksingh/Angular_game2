import { GameSettings } from "../Settings/GameSettings";
import { Babylon } from "../Engine/Babylon";
import { registerCheat, cheatCode } from "../Helper/Cheats";
import { ScoringValues } from "../IO/Externals/ScoringData/ScoringData";

var currentCombo = 0;
var runningCombo = 0;
var maxRunningCombo = 0;
var comboTimerMS = 0;

class Combo {
	setup() {
		registerCheat(cheatCode.COMBO, this.correctSelection.bind(this));
	}

	reset() {
		currentCombo = 0;
		comboTimerMS = 0;
		runningCombo = 0;
		maxRunningCombo = 0;
	}

	update() {
		let timeDifference = Babylon.engine.getDeltaTime();
		comboTimerMS += timeDifference;
		if (currentCombo > 0 && comboTimerMS >= GameSettings.comboReductionTimeMS) {
			comboTimerMS = 0;
			--currentCombo;
		}
	}

	correctSelection() {
		currentCombo = Math.min(GameSettings.maxCombo, currentCombo + 1);
		++runningCombo;
		maxRunningCombo = Math.max(maxRunningCombo, runningCombo);
		comboTimerMS = 0;
	}

	wrongSelection() {
		currentCombo = 0;
		runningCombo = 0;
		comboTimerMS = 0;
	}

	getCombo() {
		return currentCombo;
	}

	getComboMultiplier() {
		return ScoringValues["cr_combo_multiplier_" + currentCombo];
	}

	getMaxCombo() {
		return maxRunningCombo;
	}

	lerpCombo(a, b) {
		let linearParameter = currentCombo / GameSettings.maxCombo;
		return a * (1 - linearParameter) + b * linearParameter;
	}
}

export var ComboInstance = new Combo();