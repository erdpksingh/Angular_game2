import { Utility } from "../Helper/Utility";
import { GameSettings } from "../Settings/GameSettings";

export var Questions = [];

export function clearQuestions() {
	Questions = [];
}

export function appendQuestions(strings) {
	let i = 0;
	let reg = /^pair_\d+$/;
	for (let key in strings) {
		if (reg.test(key)) {
			let optionA = strings[key + "_option_0"];
			let optionB = strings[key + "_option_1"];
			let optionC = strings[key + "_option_2"];

			if (Utility.isDefined(optionC)) {
				optionA = optionB;
				optionB = optionC;
			}

			if (!Utility.isDefined(optionA) && !Utility.isDefined(optionB)) {
				continue;
			}

			if (!Utility.isDefined(optionA)) {
				optionA = "" + i + ". A";
			}

			if (!Utility.isDefined(optionB)) {
				optionB = "" + i + ". B";
			}

			Questions.push(optionA);
			Questions.push(optionB);

			++i;
		}
	}

	//if necessary, fill with minimal number of pairs
	for (let i = Questions.length / 2; i < 2 * GameSettings.buttonsPerColumn; ++i) {
		Questions.push("" + i + ". A");
		Questions.push("" + i + ". B");
	}
}