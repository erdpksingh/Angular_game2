import { UserDataInstance as UserData } from "../IO/Externals/UserData/UserData";

export var UserDataLoading = {
	name: "User Data",
	enter: function (success, error) {
		UserData.updateUserStats(success, error);
	},
	timeout: 10000,
}