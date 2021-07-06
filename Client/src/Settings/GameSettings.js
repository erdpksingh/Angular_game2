import { Teams } from "../Gameplay/Teams";
import { GameModes } from "../Gameplay/GameModes/GameModes";
import { Groups } from "../Gameplay/Groups";

export var GameSettings = {
	countdownCameraMovementDelaySec: 1,
	countdownDelaySec: 1,
	countdownDurationSec: 3,
	roundDistanceMeters: 3000,
	roundDurationMS: 120000,

	buttonsPerColumn: 3,
	numButtonColumns: 2,
	maxCorrectPairs: 2,

	maxCombo: 4,
	comboReductionTimeMS: 10000,

	cheats: true,
	allowLoadingErrors: true,

	gameMode: GameModes.LOCAL,

	rankingListNum: 50,

	defaultLanguage: "en",
	language: "en",
	forceLanguage: false,

	defaultGroup: Groups.none,
	defaultTeam: Teams.none,

	userId: "",
	forceUserId: false,

	contentId: 0,
	questionIds: [],
	contentUrl: "",
	forceContent: false,
	testmode: false,
	testdeployment: false,
}