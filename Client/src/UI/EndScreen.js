import { GameControllerInstance as GameController } from "../Gameplay/GameController";
import { ScoreInstance as Score } from "../Gameplay/Score";
import { Utility } from "../Helper/Utility";
import { StringValues } from "../IO/Strings";
import { ComboInstance as Combo } from "../Gameplay/Combo";
import { AchievementsInstance as Achievements } from "../UserProgress/Achievements";
import { Ranking } from "../UserProgress/Ranking";
import { AchievementSettings } from "../Settings/AchievementSettings";
import { ScoringValues } from "../IO/Externals/ScoringData/ScoringData";
import { getEndScreenSettings } from "../Gameplay/GameModes/EndScreen/EndScreenSettingsFactory";
import { getLocaleString } from "../Helper/Localization";

var entries = [
	{ active: function() { return getEndScreenSettings().hasSingleScore; }, title: "endScreenPoints", isLoaded: function () { return true; }, isRecord: function () { return oldPoints < Score.getSingleplayerScore(); }, getValue: function () { return Score.getSingleplayerScore().toLocaleString(getLocaleString(), { maximumFractionDigits: 0 }); } },
	{ active: function() { return getEndScreenSettings().hasSingleCombo; }, title: "endScreenCombo", isLoaded: function () { return true; }, isRecord: function () { return oldCombo < Combo.getMaxCombo(); }, getValue: function () { return Combo.getMaxCombo().toLocaleString(getLocaleString()); } },
	{ active: function() { return getEndScreenSettings().hasRankSingle; }, title: "endScreenRankSingle", isLoaded: function () { return loadedScore; }, isRecord: function () { return false; }, getValue: function () { return Ranking.rank_best.toLocaleString(getLocaleString()); } },
	{ active: function() { return getEndScreenSettings().hasRankTotal; }, title: "endScreenRankTotal", isLoaded: function () { return loadedScore; }, isRecord: function () { return false; }, getValue: function () { return Ranking.rank_total.toLocaleString(getLocaleString()); } },
	{ active: function() { return getEndScreenSettings().hasAchievements; }, title: "endScreenAchievements", isLoaded: function () { return loadedScore; }, isRecord: function () { return false; }, getValue: function () { return getAchievements(); } },
	{ active: function() { return getEndScreenSettings().hasTeamScore; }, title: "endScreenTeamPoints", isLoaded: function () { return true; }, isRecord: function () { return false; }, getValue: function () { return getTeamScore(0); } },
	{ active: function() { return getEndScreenSettings().hasTeamScore; }, title: "endScreenTeamPoints", isLoaded: function () { return true; }, isRecord: function () { return false; }, getValue: function () { return getTeamScore(1); } },
	{ active: function() { return getEndScreenSettings().hasTeamScore; }, title: "endScreenTotalTeamPoints", isLoaded: function () { return loadedScore; }, isRecord: function () { return false; }, getValue: function () { return getTotalTeamScore(0); } },
	{ active: function() { return getEndScreenSettings().hasTeamScore; }, title: "endScreenTotalTeamPoints", isLoaded: function () { return loadedScore; }, isRecord: function () { return false; }, getValue: function () { return getTotalTeamScore(1); } },
];

function getTeamScore(index) {
	let html = "";
	html += "<img class=\"endScreenTeamColor\" src=\"./assets/sprites/" + ((index == 0) ? "team_bg_0" : "team_bg_1") + ".png\" />";
	html += Score.getAverageTeamScore(index).toLocaleString(getLocaleString(), { maximumFractionDigits: 0 });
	return html;
}

function getTotalTeamScore(index) {
	let html = "";
	html += "<img class=\"endScreenTeamColor\" src=\"./assets/sprites/" + ((index == 0) ? "team_bg_0" : "team_bg_1") + ".png\" />";
	html += Score.getTotalTeamScore(index).toLocaleString(getLocaleString(), { maximumFractionDigits: 0 });
	return html;
}

function getAchievements() {
	let html = "";
	for (let i = 0; i < Achievements.getCount(); ++i) {
		html += "<div class=\"endScreenAchievementContainer endScreenAchievementLocked\">";
		html += "<img src=\"assets/sprites/badge_" + i + ".png\" class=\"endScreenAchievement\"/>";
		html += "<div class=\"endScreenXp\">+" + ScoringValues[AchievementSettings.achievementIds[i]].toLocaleString(getLocaleString(), { maximumFractionDigits: 1 }) + " GT XP</div>";
		html += "</div>";
	}
	return html;
}

var oldPoints = 0;
var oldCombo = 0;
var unlockedAchievements = [];
var loadedScore = false;
var animated = false;

class EndScreen {
	setup() {
		this.buttonBack = document.getElementById("btEndClose");
		this.buttonBack.onclick = this.back.bind(this);

		this.menu = document.getElementById("endScreen");

		let row = "";
		row += "<div class=\"endScreenStatsRow\">";
		row += "<div class=\"endScreenStatsName endScreenStatsText\"></div>";
		row += "<div class=\"endScreenStatsValueGroup\">";
		row += "<div class=\"endScreenStatsValueNew endScreenStatsText\"></div>";
		row += "<div class=\"loadingIcon\"></div>";
		row += "<div class=\"endScreenStatsValue endScreenStatsText\"></div>";
		row += "</div>";
		row += "</div>";

		let html = "";
		for (let i = 0; i < entries.length; ++i) html += row;

		document.getElementById("endScreenStatsContainer").innerHTML = html;

		this.rows = this.menu.getElementsByClassName("endScreenStatsRow");
		let titles = this.menu.getElementsByClassName("endScreenStatsName");
		this.record = this.menu.getElementsByClassName("endScreenStatsValueNew");
		this.values = this.menu.getElementsByClassName("endScreenStatsValue");
		this.loading = this.menu.getElementsByClassName("loadingIcon");
		this.achievements = this.menu.getElementsByClassName("endScreenAchievementContainer");
		this.xps = this.menu.getElementsByClassName("endScreenXp");

		this.activeIndices = [];
		for (let i = 0; i < entries.length; ++i) {
			if (entries[i].active()) this.activeIndices.push(i);
			else Utility.disableElement(this.rows[i]);
		}

		for (let i = 0; i < this.activeIndices.length; ++i) {
			let index = this.activeIndices[i];
			this.rows[index].classList.add("endScreenRowShading" + index % 2);
			titles[index].innerHTML = StringValues[entries[index].title];
			this.record[index].innerHTML = StringValues["endScreenNewRecord"];
			this.values[index].innerHTML = "-";
		}

		this.hide();
	}

	back() {
		GameController.startMenu();
	}

	hide() {
		Utility.disableElement(this.menu);
	}

	show() {
		Utility.enableElement(this.menu);
		this.saveOldValues();
		getEndScreenSettings().sendScore(this.scoreCallback.bind(this));
		this.updateScreenContent();
		this.updateScreenLoading();
		this.animateRows();
	}

	saveOldValues() {
		oldPoints = Ranking.best_score;
		oldCombo = Ranking.best_combo;
	}

	scoreCallback() {
		loadedScore = true;
		this.updateScreenContent();
		this.updateScreenLoading();

		unlockedAchievements = [];
		Achievements.update(unlockedAchievements);
		this.tryAnimateAchievements();
	}

	updateScreenContent() {
		for (let i = 0; i < this.activeIndices.length; ++i) {
			let index = this.activeIndices[i];
			if (entries[index].isRecord()) {
				Utility.enableElement(this.record[index]);
			} else {
				Utility.disableElement(this.record[index]);
			}
			this.values[index].innerHTML = entries[index].getValue().toString();
		}
		this.hideAchievements();
	}

	updateScreenLoading() {
		for (let i = 0; i < this.activeIndices.length; ++i) {
			let index = this.activeIndices[i];
			if (entries[index].isLoaded()) {
				Utility.disableElement(this.loading[index]);
				Utility.enableElement(this.values[index]);
			} else {
				Utility.enableElement(this.loading[index]);
				Utility.disableElement(this.values[index]);
			}
		}
	}

	animateRows() {
		animated = false;

		let i = 0;
		for (; i < this.activeIndices.length; ++i) {
			let delay = i;
			let index = this.activeIndices[i];
			Utility.hideElement(this.rows[index]);
			setTimeout(() => Utility.showElement(this.rows[index]), 1000 + delay * 500);
		}

		Utility.hideElement(this.buttonBack);
		setTimeout(() => this.animateRowsFinished(), 1000 + i * 500);
	}

	animateRowsFinished() {
		Utility.showElement(this.buttonBack);
		animated = true;
		this.tryAnimateAchievements();
	}

	hideAchievements() {
		for (let i = 0; i < this.achievements.length && i < Achievements.getCount(); ++i) {
			this.achievements[i].classList.add("hidden");
			this.xps[i].classList.add("hidden");
		}
	}

	tryAnimateAchievements() {
		if (animated && loadedScore) {
			this.animateAchievements();
		}
	}

	animateAchievements() {
		let j = 0;
		for (let i = 0; i < this.achievements.length && i < unlockedAchievements.length; ++i) {
			if (unlockedAchievements[i]) {
				this.achievements[i].classList.remove("hidden");
				this.xps[i].classList.remove("hidden");
				setTimeout(() => {
					this.achievements[i].classList.add("newAchievement");
					this.achievements[i].classList.remove("endScreenAchievementLocked");
					this.xps[i].classList.add("endScreenXpAnimated");
				}, j * 1000);
				++j;
			}
		}
	}
}

export var EndScreenInstance = new EndScreen();