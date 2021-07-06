import { StringValues } from "../IO/Strings";
import { ConfigData } from "../IO/Config";
import { ModelSettings, CarModels, CarColors } from "../Settings/ModelSettings";
import { Utility } from "../Helper/Utility";

export var VariableParsing = {
	name: "String variables",
	enter: function (success, error) {
		ConfigData.gt_app_app_token = StringValues.games_channel_token;

		let model = CarModels.aclass;

		if (Utility.isDefined(StringValues.com_0_car)) {
			switch (StringValues.com_0_car.toLowerCase()) {
				case "aclass":
					model = CarModels.aclass;
					break;
				case "eqc":
					model = CarModels.eqc;
					break;
				case "amg":
					model = CarModels.amg;
					break;
				case "smart":
					model = CarModels.smart;
					break;
				case "slk":
					model = CarModels.slk;
					break;
				case "vito":
					model = CarModels.vito;
					break;
			}
		}
		ModelSettings.carModel = model;

		let color = CarColors.blue;
		if (Utility.isDefined(StringValues.com_0_carcolor)) {
			switch (StringValues.com_0_carcolor.toLowerCase()) {
				case "blue":
					color = CarColors.blue;
					break;
				case "white":
					color = CarColors.white;
					break;
				case "red":
					color = CarColors.red;
					break;
			}
		}
		ModelSettings.carColor = color;

	},
	immediate: true,
}