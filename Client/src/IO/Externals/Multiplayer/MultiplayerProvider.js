export class MultiplayerProvider {
	sendServerOpen() { }
	sendServerRunning() { }
	sendServerFinished() { }
	sendServerClosed() { }
	sendQuestionId(questionIds) { }

	queryLobby(callback) { }
	sendClearLobby(callback) { }

	queryMultiplayerState (callback) {}
	sendMultiplayerLogin() {}
	sendMultiplayerScore(score, callback) {}
}