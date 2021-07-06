import { GameControllerInstance as GameController } from "../Gameplay/GameController";
import { Utility } from "../Helper/Utility";
import { StringValues } from "../IO/Strings";
import { AchievementsInstance as Achievements } from "../UserProgress/Achievements";
import { getLocaleString } from "../Helper/Localization";
import { Ranking } from "../UserProgress/Ranking";

var entries = [
	{ element: "achievementScreenTotal", text: "achievementsPointsTotal", getValue: function () { return Ranking.total_score; } },
	{ element: "achievementScreenSingle", text: "achievementsPointsSingle", getValue: function () { return Ranking.best_score; } },
	{ element: "achievementScreenCombo", text: "achievementsCombo", getValue: function () { return Ranking.best_combo; } },
];

class AchievementScreen {
	setup() {
		this.buttonBack = document.getElementById("btAchievementClose");
		this.buttonBack.onclick = this.back.bind(this);

		this.menu = document.getElementById("achievementScreen");

		this.stats = [];
		for (let i = 0; i < entries.length; ++i) {
			this.stats[i] = document.getElementById(entries[i].element);
		}
		let columns = 2;
		let rows = Math.ceil(Achievements.getCount() / columns);
		let index = 0;

		let html = "";

		for (let j = 0; j < columns; ++j) {
			html += "<div class=\"achievementScreenStatsColumn\">";
			for (let i = 0; i < rows && j * rows + i < Achievements.getCount(); ++i) {
				index = j * rows + i;
				html += "<div class=\"achievementScreenStatsEntry\">";
				html += "<img src=\"assets/sprites/badge_" + index + ".png\" class=\"achievementScreenAchievement\">";
				html += "<div class=\"achievementScreenStatsText\">" + Achievements.getTask(index) + "</div>";
				html += "</div>";
			}
			html += "</div>";
		}

		document.getElementById("achievementScreenProgressContainer").innerHTML = html;
		
		this.achievements = this.menu.getElementsByClassName("achievementScreenStatsEntry");

		this.hide();
	}

	updateAchievements() {
		for (let i = 0; i < this.achievements.length && i < Achievements.getCount(); ++i) {
			if (Achievements.getProgress(i)) {
				this.achievements[i].classList.remove("achievementScreenAchievementLocked");
			} else {
				this.achievements[i].classList.add("achievementScreenAchievementLocked");
			}
		}
	}

	back() {
		GameController.startMenuInstant();
	}

	hide() {
		Utility.disableElement(this.menu);
	}

	show() {
		Utility.enableElement(this.menu);

		for (let i = 0; i < entries.length; ++i) {
			this.stats[i].innerHTML = Utility.formatString(StringValues[entries[i].text], entries[i].getValue().toLocaleString(getLocaleString()));
		}
		
		this.updateAchievements();
	}
}

export var AchievementScreenInstance = new AchievementScreen();