import { setupLogo } from "../IO/Logo";

export var LogoLoading = {
	name: "Logo",
	enter: function(success, error) {
		setupLogo();
	},
	immediate: true,
}