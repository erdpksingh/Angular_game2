import { GameSettings } from "../Settings/GameSettings";
import { Groups } from "../Gameplay/Groups";
import { Teams } from "../Gameplay/Teams";

var user_id = "";
var nickname = "";
var team_id = GameSettings.defaultTeam;
var group_id = GameSettings.defaultGroup;

class User {
	setId(value) {
		if (GameSettings.forceUserId) user_id = GameSettings.userId;
		else user_id = value;
	}

	setName(value) {
		nickname = value;
	}

	setTeam(value) {
		if (value == Teams.undefined) return;

		team_id = value;
	}

	setGroup(value) {
		if (value == Groups.undefined) return;

		group_id = value;
	}

	getId() {
		return user_id;
	}
	
	getName() {
		return nickname;
	}
	
	getTeam() {
		return team_id;
	}

	getGroup() {
		return group_id;
	}
}

export var UserInstance = new User();