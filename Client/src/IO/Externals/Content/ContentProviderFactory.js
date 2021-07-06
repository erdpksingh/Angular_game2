import { ContentDummy } from "./ContentDummy";
import { ConfigData } from "../../Config";
import { ContentHyperCms } from "./ContentHyperCms";
import { ExternalTypes } from "../ExternalTypes";

export function getContentProvider() {
	switch (ConfigData.content_type) {
		case ExternalTypes.HYPERCMS:
			return new ContentHyperCms();
		default:
			return new ContentDummy();
	}
}