import { getMultiplayerProvider } from "./MultiplayerProviderFactory";

class Multiplayer {
	sendServerOpen() {
		let provider = getMultiplayerProvider();
		provider.sendServerOpen();
	}

	sendServerRunning() {
		let provider = getMultiplayerProvider();
		provider.sendServerRunning();
	}

	sendServerFinished() {
		let provider = getMultiplayerProvider();
		provider.sendServerFinished();
	}

	sendServerClosed() {
		let provider = getMultiplayerProvider();
		provider.sendServerClosed();
	}

	sendQuestionId(questionIds) {
		let provider = getMultiplayerProvider();
		provider.sendQuestionId(questionIds);
	}

	queryLobby(callback) {
		let provider = getMultiplayerProvider();
		provider.queryLobby(callback);
	}

	clearLobby(callback) {
		let provider = getMultiplayerProvider();
		provider.sendClearLobby(callback);
	}

	queryMultiplayerState (callback) {
		let provider = getMultiplayerProvider();
		provider.queryMultiplayerState(callback);
	}

	sendMultiplayerLogin() {
		let provider = getMultiplayerProvider();
		provider.sendMultiplayerLogin();
	}

	sendMultiplayerScore(score, callback) {
		let provider = getMultiplayerProvider();
		provider.sendMultiplayerScore(score, callback);
	}
}

export var MultiplayerInstance = new Multiplayer();