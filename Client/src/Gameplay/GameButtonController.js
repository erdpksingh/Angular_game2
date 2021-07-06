import { Questions } from "./Questions";
import { Utility } from "../Helper/Utility";
import { GameButton } from "./GameButton";
import { GameControllerInstance as GameController } from "./GameController";
import { GameSettings } from "../Settings/GameSettings";

class GameButtonController {
	constructor() {
		this.buttons = [];
		this.buttonsSelected = [];
		this.buttonContainer = document.getElementById("gameButtonContainer");
		this.numCorrectPairs = 0;
	}

	setup() {
		let button;
		let buttonText;
		let buttonColumn;

		for (let j = 0; j < GameSettings.numButtonColumns; ++j) {
			this.buttonsSelected[j] = -1;
			buttonColumn = document.createElement("div");
			buttonColumn.id = "gameButtonColumn" + j;
			buttonColumn.classList.add("gameButtonColumn");
			this.buttonContainer.appendChild(buttonColumn);
			for (let i = 0; i < GameSettings.buttonsPerColumn; ++i) {
				button = new GameButton(buttonColumn, "gameButton" + j + i, this.clickCallback(j, i));
				this.buttons.push(button);
			}
		}

		this.hide();
		this.reset();
	}

	reset() {
		this.setupRandomIndices();

		//set correct answers
		let randomList = [];
		for (let i = 0; i < GameSettings.buttonsPerColumn; ++i) randomList[i] = i;
		let correctIndex = Utility.getRandomSubarray(randomList, GameSettings.maxCorrectPairs);
		for (let j = 0; j < correctIndex.length; ++j) {
			this.getButton(0, correctIndex[j]).correct = true;
		}

		for (let i = 1; i < GameSettings.numButtonColumns; ++i) {
			let correctIndexInColumn = Utility.getRandomSubarray(randomList, GameSettings.maxCorrectPairs);
			for (let j = 0; j < correctIndex.length; ++j) {
				this.getButton(i, correctIndexInColumn[j]).index = this.getButton(0, correctIndex[j]).index + i;
				this.getButton(i, correctIndexInColumn[j]).correct = true;
			}
		}

		for (let i = 0; i < this.buttons.length; ++i) {
			this.buttons[i].updateText();
		}

		this.numCorrectPairs = correctIndex.length;
		this.resetSelection();
		this.resetJoker();
	}

	setupRandomIndices() {
		let randomList = [];
		for (let i = 0; i < Questions.length / GameSettings.numButtonColumns; ++i) randomList[i] = i;
		randomList = Utility.getRandomSubarray(randomList, this.buttons.length);

		for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
			for (let j = 0; j < GameSettings.buttonsPerColumn; ++j) {
				this.getButton(i, j).index = randomList[i * GameSettings.buttonsPerColumn + j] * GameSettings.numButtonColumns + i;
				this.getButton(i, j).correct = false;
			}
		}
	}

	getRandomWrongButton(column) {
		let randomList = [];
		for (let i = 0; i < GameSettings.buttonsPerColumn; ++i) {
			if (!this.getButton(column, i).correct) {
				randomList.push(this.getButton(column, i));
			}
		}
		return randomList[Math.floor(Math.random() * randomList.length)];
	}

	getRandomUniqueIndex(column) {
		let randomList = [];
		let valid;
		let index = 0;
		for (let i = 0; i < Questions.length / GameSettings.numButtonColumns; ++i) {
			valid = true;
			for (let j = 0; j < this.buttons.length; ++j) {
				if (i == Math.floor(this.buttons[j].index / GameSettings.numButtonColumns)) {
					valid = false;
					break;
				}
			}
			if (valid) {
				randomList[index] = i;
				++index;
			}
		}
		return randomList[Math.floor(Math.random() * randomList.length)] * GameSettings.numButtonColumns + column;
	}

	hideWrongPair() {
		for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
			this.getRandomWrongButton(i).hide();
		}
	}

	markCorrectPair() {
		let buttons = this.getCorrectPair();
		for (let i = 0; i < buttons.length; ++i) {
			buttons[i].mark();
		}
	}

	resetJoker() {
		for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
			for (let j = 0; j < GameSettings.buttonsPerColumn; ++j) {
				let button = this.getButton(i, j);
				button.show();
				button.unmark();
			}
		}
	}

	clickCallback(column, index) {
		return function () {
			if (this.buttonsSelected[column] >= 0) {
				this.getButton(column, this.buttonsSelected[column]).deselect();
			}
			if (this.buttonsSelected[column] == index) {
				this.buttonsSelected[column] = -1;
				return;
			}

			this.getButton(column, index).select();
			this.buttonsSelected[column] = index;
			this.checkButtonSelection();
		}.bind(this);
	}

	checkButtonSelection() {
		for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
			if (this.buttonsSelected[i] < 0) return;
		}

		this.freezeInput();

		setTimeout(this.evaluateSelection.bind(this), 500);
	}

	freezeInput(value = true) {
		for (let i = 0; i < this.buttons.length; ++i) {
			this.buttons[i].freezeInput(value);
		}
	}

	getCorrectPair() {
		let button;
		let result = [];

		for (let i = 0; i < GameSettings.buttonsPerColumn; ++i) {
			button = this.getButton(0, i);
			if (button.correct) {
				result[0] = button;
				break;
			}
		}

		for (let i = 0; i < GameSettings.buttonsPerColumn; ++i) {
			button = this.getButton(1, i);
			if (button.correct && button.index == result[0].index + 1) {
				result[1] = button;
				break;
			}
		}

		return result;
	}

	evaluateSelection() {
		let correct = true;
		let firstButton = this.getButton(0, this.buttonsSelected[0]);
		for (let i = 1; i < GameSettings.numButtonColumns; ++i) {
			if (firstButton.index != this.getButton(i, this.buttonsSelected[i]).index - i) {
				correct = false;
				break;
			}
		}

		let timeout = 1000;
		let callback = null;

		if (correct) {
			GameController.correctSelection();
			callback = this.clearSelection;
		} else {
			GameController.wrongSelection();
			callback = this.resetSelection;
		}

		for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
			let button = this.getButton(i, this.buttonsSelected[i])
			if (correct) button.setCorrect();
			else button.setWrong();
		}

		setTimeout(callback.bind(this), timeout);
	}

	resetSelection() {
		let button;
		for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
			if (this.buttonsSelected[i] >= 0) {
				button = this.getButton(i, this.buttonsSelected[i])
				button.deselect();
				this.buttonsSelected[i] = -1;
			}
		}
		this.freezeInput(false);
	}

	clearSelection() {
		let changeNumCorrectPairs = Math.random() >= 0.4;
		let newCorrectPairs = 1;

		if (changeNumCorrectPairs) {
			newCorrectPairs = (this.numCorrectPairs + 1) % 3;
		}

		let button;

		switch (newCorrectPairs) {
			case 0:
				for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
					button = this.getButton(i, this.buttonsSelected[i])
					button.index = this.getRandomUniqueIndex(i);
					button.correct = false;
				}
				--this.numCorrectPairs;
				break;
			case 1:
				let newCorrectSourceColumn = Math.floor(Math.random() * GameSettings.numButtonColumns);
				let correctButton = this.getRandomWrongButton(newCorrectSourceColumn);
				correctButton.correct = true;

				for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
					button = this.getButton(i, this.buttonsSelected[i])

					if (i == newCorrectSourceColumn) {
						button.index = this.getRandomUniqueIndex(i);
						button.correct = false;
					} else {
						button.index = correctButton.index - newCorrectSourceColumn + i;
						button.correct = true;
					}
				}
				break;
			case 2:
				for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
					let correctButton = this.getRandomWrongButton(GameSettings.numButtonColumns - 1 - i);
					correctButton.correct = true;
					button = this.getButton(i, this.buttonsSelected[i]);
					button.index = correctButton.index - (GameSettings.numButtonColumns - 1 - i) + i;
					button.correct = true;
				}
				++this.numCorrectPairs;
				break;
		}

		for (let i = 0; i < GameSettings.numButtonColumns; ++i) {
			this.getButton(i, this.buttonsSelected[i]).updateText();
		}

		this.resetSelection();
		this.resetJoker();
	}

	getButton(column, index) {
		return this.buttons[column * GameSettings.buttonsPerColumn + index];
	}

	show() {
		Utility.enableElement(this.buttonContainer);
	}

	hide() {
		Utility.disableElement(this.buttonContainer);
	}
}

export var GameButtonControllerInstance = new GameButtonController();