import { Utility } from "../Helper/Utility";
import { Popup } from "../UI/Popup";
import { StringValues } from "../IO/Strings";
import { GameSettings } from "../Settings/GameSettings";

export class Loading {
	currentIndex = 0;
	currentState = {};
	queue = [];
	timer = 0;
	done = true;
	popup = false;
	onFinish = null;
	onUpdate = null;

	constructor() {
		this.success = this.success.bind(this);
		this.error = this.error.bind(this);
	}

	add(parameters) {
		if (Array.isArray(parameters)) {
			parameters.forEach((entry) => this.add(entry));
			return;
		}

		parameters = Utility.mergeObjects({
			name: "state " + this.queue.length,
			enter: () => { },
			update: () => { },
			exit: () => { },
			checkSuccess: () => { return false },
			onSuccess: () => { },
			onError: () => { },
			timeout: -1,
			retry: 0,
			immediate: false,
		}, parameters)
		this.queue.push(parameters);
	}

	start(onFinish = null, onUpdate = null) {
		this.done = false;
		this.onFinish = onFinish;
		this.onUpdate = onUpdate;
		this.nextState(0);
	}

	enter() {
		console.log("Loading " + this.currentState.name + "...");
		this.currentState.enter(this.successCallback(this.currentIndex).bind(this), this.errorCallback(this.currentIndex).bind(this));
		this.timer = 0;
		if (this.currentState.immediate) this.success();
	}

	update(deltaTime) {
		if (this.done) return;
		if (this.popup) return;

		this.timer += deltaTime;
		this.currentState.update();
		if (this.currentState.checkSuccess()) {
			this.success();
		} else if (this.currentState.timeout >= 0 && this.timer >= this.currentState.timeout) {
			this.error();
		}
	}

	sendUpdate() {
		if (Utility.isDefined(this.onUpdate)) {
			let progress = this.currentIndex / this.queue.length;
			this.onUpdate(progress);
		}
	}

	successCallback(stateIndex) {
		return function () {
			if (this.currentIndex != stateIndex) return;
			if (this.done) return;
			if (this.popup) return;
			this.success();
		}
	}

	errorCallback(stateIndex) {
		return function (message) {
			if (this.currentIndex != stateIndex) return;
			if (this.done) return;
			if (this.popup) return;
			this.error(message);
		}
	}

	success() {
		console.log("Successfully loaded " + this.currentState.name + ".");
		let index = this.currentState.onSuccess();
		this.currentState.exit();
		this.nextState(index);
	}

	error(message) {
		console.log("Error loading " + this.currentState.name + ".");
		if (Utility.isDefined(message)) console.log("Error: " + message);
		this.showPopup(message);
	}

	skip() {
		let index = this.currentState.onError();
		this.currentState.exit();
		this.nextState(index);
	}

	nextState(index) {
		if (Utility.isDefined(index)) {
			this.currentIndex = index;
		} else {
			++this.currentIndex;
		}

		if (this.currentIndex < this.queue.length) {
			this.currentState = this.queue[this.currentIndex];
			this.enter();
		} else {
			this.done = true;
			if (Utility.isDefined(this.onFinish)) this.onFinish();
		}

		this.sendUpdate();
	}

	showPopup(message) {
		let title = "Connection error";
		if (Utility.isDefined(StringValues["connectionErrorTitle"])) title = StringValues["connectionErrorTitle"];
		let text = "The app could not load {0}.";
		if (Utility.isDefined(StringValues["connectionErrorText"])) text = StringValues["connectionErrorText"];
		if (Utility.isDefined(message)) text += "\n\n" + message;
		let buttonCancel = "Cancel";
		if (Utility.isDefined(StringValues["buttonCancel"])) buttonCancel = StringValues["buttonCancel"];
		let buttonRetry = "Retry";
		if (Utility.isDefined(StringValues["buttonRetry"])) buttonRetry = StringValues["buttonRetry"];

		let cancelCallback = GameSettings.allowLoadingErrors ? this.cancelPopup.bind(this) : this.closeApp.bind(this);

		new Popup(title, Utility.formatString(text, this.currentState.name), [{ text: buttonCancel, callback: cancelCallback }, { text: buttonRetry, callback: this.retryPopup.bind(this) }]);
		this.popup = true;
	}

	closeApp() {
		console.log("Closing app.");
		window.history.back();
	}

	cancelPopup() {
		console.log("Skipping loading " + this.currentState.name + ".");
		this.popup = false;
		this.skip();
	}

	retryPopup() {
		console.log("Retry loading " + this.currentState.name + ".");
		this.popup = false;
		this.enter();
	}
}