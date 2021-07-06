import { getAppIdProvider } from "./AppIdProviderFactory";
import { Utility } from "../../../Helper/Utility";
import { ConfigData } from "../../Config";

class AppId {
	load(contentId, successCallback, errorCallback) {
		let provider = getAppIdProvider();
		provider.load(contentId, getLoadingSuccessCallback(successCallback), errorCallback);
	}	
}

function getLoadingSuccessCallback(callback) {
	return function (id) {
		ConfigData.gt_app_app_token = id;
		
		if (Utility.isDefined(callback)) callback();
	}
}

export var AppIdInstance = new AppId();