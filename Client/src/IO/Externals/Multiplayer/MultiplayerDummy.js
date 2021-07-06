import { MultiplayerProvider } from "./MultiplayerProvider";

export class MultiplayerDummy extends MultiplayerProvider {
	sendServerOpen() { }
	sendServerRunning() { }
	sendServerFinished() { }
	sendServerClosed() { }
	sendQuestionId(questionIds) { }

	queryLobby(callback) { }
	sendClearLobby(callback) { }
	sendTeamScore(score0, score1) { }
	queryTeamScore(callback) { }

	queryMultiplayerState (callback) {}
	sendMultiplayerLogin() {}
	sendMultiplayerScore(score, callback) {}
}