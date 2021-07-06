
import { Utility } from "../Helper/Utility";
import { ContentInstance as Content} from "../IO/Externals/Content/Content";
import { GameSettings } from "../Settings/GameSettings";
import { clearQuestions, appendQuestions } from "../Gameplay/Questions";


var questionStrings = []
var querieHashes = []
var querieStates = []

export var QuestionLoading = {
	name: "Questions",
	enter: function (success, error) {
		if (GameSettings.questionIds.length == 0) {
			console.log("No questions defined.");
			success();
			return;
		}

		for (let i = 0; i < GameSettings.questionIds.length; ++i) {
			questionStrings[i] = {};
			let contentId = GameSettings.questionIds[i];
			Content.load(questionStrings[i], contentId, getSuccessCallback(contentId, i, success), error);
		}
	},
	exit: function (success, error) {
		clearQuestions();

		for (let i = 0; i < GameSettings.questionIds.length; ++i) {
			console.log("Adding question pack \"" + questionStrings[i].name + "\"");
			appendQuestions(questionStrings[i]);
		}

		//if necessary, fill with minimal number of pairs
		appendQuestions([]);
	},
	timeout: 10000,
}

function getSuccessCallback(id, index, success) {
	let hash = id.toString() + (+new Date).toString(36);
	querieHashes[index] = hash;
	querieStates[index] = false;
	return function() {
		if (querieHashes[index] != hash) return;

		querieStates[index] = true;

		for (let i = 0; i < GameSettings.questionIds.length; ++i) {
			if (!querieStates[i]) return;
		}

		if (Utility.isDefined(success)) success();
	}
}