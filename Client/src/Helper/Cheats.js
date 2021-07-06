import { Utility } from "./Utility";
import { GameSettings } from "../Settings/GameSettings";

export var cheatCode = {
	COMBO: 1,
	SCORE: 2,
	GAMEEND: 3,
	ROTATE: 4,
	COUNT: 5,
}

var cheatKey = ["C", "S", "E", "R"];

export function registerCheat(code, callback) {
	if (!GameSettings.cheats) return;

	if (code < 1 || code >= cheatCode.COUNT) return;
	if (!Utility.isDefined(callback)) return;

	document.addEventListener("keydown", function (event) {
		if (event.key == cheatKey[code - 1]
		&& !event.shiftKey) callback();
	});
}