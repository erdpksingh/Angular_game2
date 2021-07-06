import { ContentProvider } from "./ContentProvider";

export class ContentDummy extends ContentProvider {
	load(contentId, successCallback, errorCallback) {
		errorCallback();
	}
}