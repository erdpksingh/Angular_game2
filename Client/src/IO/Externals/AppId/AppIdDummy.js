import { AppIdProvider } from "./AppIdProvider";

export class AppIdDummy extends AppIdProvider {
	load(contentId, successCallback, errorCallback) {
		successCallback("");
	}
}