import { TeamDataProvider } from "./TeamDataProvider";
import { GameSettings } from "../../../Settings/GameSettings";

export class TeamDataDummy extends TeamDataProvider {
	sendTeamScore(score0, score1, callback) { callback(); }
	queryTeamScore(callback) { callback([0, 0]); }
}