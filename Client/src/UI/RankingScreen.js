import { GameControllerInstance as GameController } from "../Gameplay/GameController";
import { Utility } from "../Helper/Utility";
import { StringValues } from "../IO/Strings";
import { getLocaleString } from "../Helper/Localization";
import 'simplebar';
import { GameSettings } from "../Settings/GameSettings";
import { UserInstance as User } from "../UserProgress/User";
import { UserCredentialsInstance as UserCredentials } from "../IO/Externals/UserCredentials/UserCredentials";
import { UserDataInstance as UserData } from "../IO/Externals/UserData/UserData";
import { Teams } from "../Gameplay/Teams";

var columnTitles = ["rankingTitleSingle", "rankingTitleTotal"];

class RankingScreen {
	setup() {
		this.buttonBack = document.getElementById("rankingScreenBackButton");
		this.buttonBack.onclick = this.back.bind(this);

		this.limits = [
			{ offset: 0, count: GameSettings.rankingListNum },
			{ offset: GameSettings.rankingListNum, count: 3 },
			{ offset: GameSettings.rankingListNum + 3, count: GameSettings.rankingListNum },
			{ offset: 2 * GameSettings.rankingListNum + 3, count: 3 },
		]

		this.menu = document.getElementById("rankingScreen");

		let columns = 2;

		let html = "";

		for (let j = 0; j < columns; ++j) {
			html += "<div class=\"rankingScreenColumn\">";
			html += "<div class=\"rankingScreenTitleContainer\">";
			html += "<div class=\"rankingScreenTitle\">" + StringValues[columnTitles[j]] + "</div>";
			html += "</div>";
			html += "<div class=\"rankingScreenRankingContainer\">";
			html += "<div class=\"rankingScreenRanking\" data-simplebar data-simplebar-auto-hide=\"false\">";
			for (let i = 0; i < GameSettings.rankingListNum; ++i) {
				html += this.getRankingEntry(i);
			}
			html += "</div>";
			html += "<div class=\"rankingLoadingIcon\"></div>";
			html += "</div>";
			html += "<div class=\"rankingScreenNeighbors\">"
			for (let i = 0; i < 3; ++i) {
				html += this.getRankingEntry(i);
			}
			html += "<div class=\"rankingLoadingIcon\"></div>";
			html += "</div>";
			html += "</div>";
		}

		document.getElementById("rankingScreenContainer").innerHTML = html;

		this.rows = this.menu.getElementsByClassName("rankingScreenRankingEntry");
		this.ranks = this.menu.getElementsByClassName("rankingScreenRankingRank");
		this.teams = this.menu.getElementsByClassName("rankingScreenRankingTeam");
		this.names = this.menu.getElementsByClassName("rankingScreenRankingName");
		this.scores = this.menu.getElementsByClassName("rankingScreenRankingScore");

		this.loading = this.menu.getElementsByClassName("rankingLoadingIcon");

		this.hide();
	}

	getRankingEntry(index) {
		let html = "";
		html += "<div class=\"rankingScreenRankingEntry\">";
		html += "<div class=\"rankingScreenRankingRank\">" + (index + 1) + "</div>";
		html += "<div class=\"rankingScreenRankingTeam\"></div>";
		html += "<div class=\"rankingScreenRankingName\">Bob</div>";
		html += "<div class=\"rankingScreenRankingSpace\"></div>";
		html += "<div class=\"rankingScreenRankingScore\">" + (1000 - index).toLocaleString(getLocaleString()) + "</div>";
		html += "</div>";
		return html;
	}

	back() {
		GameController.startMenuInstant();
	}

	hide() {
		Utility.disableElement(this.menu);
	}

	show() {
		Utility.enableElement(this.menu);

		for (let i = 0; i < this.rows.length; ++i) {
			Utility.disableElement(this.rows[i]);
		}

		for (let i = 0; i < this.loading.length; ++i) {
			Utility.enableElement(this.loading[i]);
		}

		UserData.loadHighscoreBest(this.updateListCallback(0).bind(this));
		UserData.loadHighscoreBestNearby(this.updateListCallback(1).bind(this));
		UserData.loadHighscoreTotal(this.updateListCallback(2).bind(this));
		UserData.loadHighscoreTotalNearby(this.updateListCallback(3).bind(this));
	}

	updateListCallback(index) {
		return function (list) {
			let users = [];
			for (let i = 0; i < list.length && this.limits[index].offset + i < this.rows.length && i < this.limits[index].count; ++i) {
				let row = this.limits[index].offset + i;

				this.ranks[row].innerHTML = list[i].rank.toLocaleString(getLocaleString());
				let teamClass = "rankingScreenRankingTeamNone";
				switch (list[i].team_id) {
					case Teams.teamA:
					teamClass = "rankingScreenRankingTeam0";
					break;
					case Teams.teamB:
					teamClass = "rankingScreenRankingTeam1";
					break;
				}
				this.teams[row].classList.add(teamClass);
				this.names[row].innerHTML = list[i].user_id;
				this.scores[row].innerHTML = list[i].score.toLocaleString(getLocaleString());


				if (list[i].user_id == User.getId()) {
					this.rows[row].classList.add("ownScore");
				} else {
					this.rows[row].classList.remove("ownScore");
				}

				users.push(list[i].user_id);
			}

			UserCredentials.getUsers(users, this.updateUsers(index, users.length).bind(this));
		}
	}

	updateUsers(index, count) {
		return function (list) {
			for (let i = 0; i < count && this.limits[index].offset + i < this.rows.length; ++i) {
				let row = this.limits[index].offset + i;
				Utility.enableElement(this.rows[row]);
				this.names[row].innerHTML = list[this.names[row].innerHTML];
			}
			Utility.disableElement(this.loading[index]);
		}
	}
}

export var RankingScreenInstance = new RankingScreen();