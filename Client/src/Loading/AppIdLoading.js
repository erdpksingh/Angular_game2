import { AppIdInstance as AppId} from "../IO/Externals/AppId/AppId";
import { GameSettings } from "../Settings/GameSettings";

export var AppIdLoading = {
	name: "App ID",
	enter: function (success, error) {
		AppId.load(GameSettings.contentId, success, error);
	},
	timeout: 10000,
}