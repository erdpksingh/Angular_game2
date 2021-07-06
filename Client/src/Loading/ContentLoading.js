import { ContentInstance as Content} from "../IO/Externals/Content/Content";
import { StringValues } from "../IO/Strings";
import { GameSettings } from "../Settings/GameSettings";
import { htmlLocalization } from "../IO/HtmlLocalization";

export var ContentLoading = {
	name: "Content",
	enter: function(success, error) {
		Content.load(StringValues, GameSettings.contentId, success, error);
	},
	exit: function() {
		htmlLocalization(StringValues);
	},
	timeout: 10000
}