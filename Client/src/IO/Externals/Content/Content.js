import { getContentProvider } from "./ContentProviderFactory";
import { Utility } from "../../../Helper/Utility";
import { GameSettings } from "../../../Settings/GameSettings";

class Content {
	load(container, contentId, successCallback, errorCallback) {
		let provider = getContentProvider();
		provider.load(contentId, getLoadingSuccessCallback(container, successCallback), errorCallback);
	}
}

function getLoadingSuccessCallback(container, callback) {
	return function (data) {
		data = postProcessData(data);

		Utility.addToObject(container, data);
		
		if (Utility.isDefined(callback)) callback();
	}
}

function postProcessData(data) {
	//fill string placeholders
	for (var entry in data) {
		if (!isNaN(data[entry])) continue;
		let replacement;
		let reg = /\[([^\]]*)\]/;
		var match = reg.exec(data[entry]);
		while (match != null) {
			replacement = data[match[1].trim()];
			if (Utility.isDefined(replacement)) data[entry] = data[entry].replace(reg, replacement);
			else data[entry] = data[entry].replace(reg, "MISSING");
			match = reg.exec(data[entry]);
		}
	}

	//fill variable placeholders
	for (var entry in data) {
		if (!isNaN(data[entry])) continue;
		let replacement;
		let reg = /\{([^\}]*)\}/;
		var match = reg.exec(data[entry]);
		while (match != null) {
			replacement = GameSettings[match[1].trim()];
			if (Utility.isDefined(replacement)) {
				if (isNaN(replacement)) data[entry] = data[entry].replace(reg, replacement);
				else data[entry] = data[entry].replace(reg, Utility.floatToCredits(replacement));
			} else data[entry] = data[entry].replace(/\{/, "###");
			match = reg.exec(data[entry]);
		}
		data[entry] = data[entry].replace(/###/g, "{");
	}

	//add spaced between chinese characters
	for (var entry in data) {
		if (!isNaN(data[entry]) || !Utility.isDefined(data[entry])) continue;
		data[entry] = data[entry].replace(/([\u4E00-\u9FCC])([\u4E00-\u9FCC])/g, "$1 $2");
	}

	return data;
}

export var ContentInstance = new Content();