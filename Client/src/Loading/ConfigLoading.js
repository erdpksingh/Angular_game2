import { ConfigLoader } from "../IO/Config";

export var ConfigLoading = {
	name: "Config",
	enter: function(success, error) {
		ConfigLoader.load(success, error);
	},
	timeout: 10000,
}