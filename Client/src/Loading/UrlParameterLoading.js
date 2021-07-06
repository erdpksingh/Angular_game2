import { GameSettings } from "../Settings/GameSettings";
import { getParameter } from "../IO/Parameters";
import { Utility } from "../Helper/Utility";
import { ConfigData } from "../IO/Config";
import { GameModes } from "../Gameplay/GameModes/GameModes";
import { UserInstance as User} from "../UserProgress/User";
import { ScoreInstance } from "../Gameplay/Score";

export var UrlParameterLoading = {
	name: "URL Parameters",
	enter: function (success, error) {
		let language = getParameter("language");
		if (Utility.isDefined(language)) {
			GameSettings.language = language;
			GameSettings.forceLanguage = true;
		}

		let testdeployment = getParameter("testdeployment");
		if (Utility.isDefined(testdeployment)) GameSettings.testdeployment = testdeployment == 1;

		let testmode = getParameter("testmode");
		if (Utility.isDefined(testmode)) GameSettings.testmode = testmode == 1;

		let contentId = getParameter("content_id");
		if (Utility.isDefined(contentId)) {
			GameSettings.contentId = parseInt(contentId);
			GameSettings.questionIds = [parseInt(contentId)];
		}

		contentId = getParameter("cms_content_id");
		if (Utility.isDefined(contentId)) {
			GameSettings.contentId = parseInt(contentId);
			GameSettings.questionIds = [parseInt(contentId)];
		}

		let contentIdAdditive = getParameter("question_ids");
		if (Utility.isDefined(contentIdAdditive)) {
			let contentIds = [];
			contentIdAdditive.split(',').forEach(id => contentIds.push(parseInt(id)));
			GameSettings.questionIds = contentIds;
		}

		let userToken = getParameter("token");
		if (!Utility.isDefined(userToken)) userToken = getParameter("?token");
		if (Utility.isDefined(userToken)) ConfigData.gt_app_user_token = userToken;

		let userId = getParameter("user_id");
		if (Utility.isDefined(userId)) User.setId(userId);

		let teamId = getParameter("team_id");
		if (Utility.isDefined(teamId)) User.setTeam(parseInt(teamId));

		let groupId = getParameter("group_id");
		if (Utility.isDefined(groupId)) User.setGroup(parseInt(groupId));

		let gameMode = getParameter("game_mode");
		if (Utility.isDefined(gameMode)) {
			switch (gameMode) {
				case "server":
					GameSettings.gameMode = GameModes.SERVER;
					break;
				case "client":
					GameSettings.gameMode = GameModes.CLIENT;
					break;
				default:
					GameSettings.gameMode = GameModes.LOCAL;
			}
		}

		let multiplier = getParameter("multiplier");
		if (Utility.isDefined(multiplier)) ScoreInstance.setMultiplier(parseFloat(multiplier));
	},
	immediate: true,
}
