import { UserCredentialsInstance as UserCredentials} from "../IO/Externals/UserCredentials/UserCredentials";

export var UserCredentialsLoading = {
	name: "User Credentials",
	enter: function(success, error) {
		UserCredentials.load(success, error);
	},
	timeout: 10000,
}