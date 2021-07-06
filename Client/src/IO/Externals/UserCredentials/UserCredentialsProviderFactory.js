import { GameSettings } from "../../../Settings/GameSettings";
import { UserCredentialsDummy } from "./UserCredentialsDummy";
import { ConfigData } from "../../Config";
import { UserCredentialsGtApp } from "./UserCredentialsGtApp";
import { ExternalTypes } from "../ExternalTypes";

export function getUserCredentialsProvider() {
	if (GameSettings.testmode) {
		return new UserCredentialsDummy();
	}

	switch (ConfigData.user_credentials_type) {
		case ExternalTypes.GTAPP:
			return new UserCredentialsGtApp();
		case ExternalTypes.MBTW:
			return new UserCredentialsDummy();
		default:
			return new UserCredentialsDummy();
	}
}