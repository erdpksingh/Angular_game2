import { GameControllerInstance as GameController } from "../Gameplay/GameController";
import { Babylon } from "../Engine/Babylon";
import { OrientationScreenInstance as OrientationScreen } from "../UI/OrientationScreen";

export var EngineLoading = {
	name: "Engine",
	enter: function (success, error) {
		GameController.setup();
		Babylon.loadAssets(success);
	},
	onSuccess: function () {
		GameController.init();
		OrientationScreen.setup();
	}
}