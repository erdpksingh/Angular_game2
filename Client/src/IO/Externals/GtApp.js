import { Utility } from "../../Helper/Utility";
const query = require('query-string');

export class GtApp {
	setup(url, appToken, providerToken) {
		this.authorizationToken = "Token " + providerToken + " " + appToken;
		this.baseUrl = url;
	}

	getUserData(playerToken, successCallback, errorCallback) {
		getUserData(this.baseUrl, this.authorizationToken, playerToken, successCallback, errorCallback);
	}

	getUsers(playerIds, callback) {
		getUsers(this.baseUrl, this.authorizationToken, playerIds, callback);
	}

	sendScore(userId, value, reason = "", successCallback = null, errorCallback = null) {
		sendScore(this.baseUrl, this.authorizationToken, userId, value, reason, successCallback, errorCallback);
	}
}

function getUserData(baseUrl, authorizationToken, playerToken, successCallback, errorCallback) {
	let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var data = JSON.parse(xhttp.responseText);
				if (Utility.isDefined(successCallback)) successCallback(data);
			} else {
				console.error("Wrong status error in getUserData: " + xhttp.responseText);
				if (Utility.isDefined(errorCallback)) errorCallback(xhttp.responseText);
			}
		}
	};
	xhttp.onerror = function () {
		console.error("Error in getUserData: " + xhttp.responseText);
		if (Utility.isDefined(errorCallback)) errorCallback(xhttp.responseText);
	}
	let parameters = {token: playerToken};
	let url = baseUrl + "/player/sync/?" + query.stringify(parameters);
	xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', authorizationToken);
    xhttp.send();
}

function getUsers(baseUrl, authorizationToken, playerIds, callback, url = "", list = [], errorCallback) {
	let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(xhttp.responseText);

			for (let i = 0; i < data.results.length; ++i) {
				list[i] = data.results[i];
			}
			
			let nextPage = getNextPage(data);
			if (Utility.isDefined(nextPage)) {
				getUsers(baseUrl, authorizationToken, playerIds, callback, nextPage, list, errorCallback);
			} else {
				callback(list);
			}
        }
	};
	xhttp.onerror = function () {
		console.error("Error in getUsers: " + xhttp.responseText);
		if (Utility.isDefined(errorCallback)) errorCallback(xhttp.responseText);
	}

	if (url == "") {
		let parameters = {};
		parameters["ids"] = playerIds.toString();
		url = baseUrl + "/player/?" + query.stringify(parameters);
	}

    xhttp.open("GET", url, true);
	xhttp.setRequestHeader('Authorization', authorizationToken);
    xhttp.send();
}

function getNextPage(data) {
	return Utility.isDefined(data) ? data.next : null;
}

function sendScore(baseUrl, authorizationToken, user_id, value, reason = "", successCallback, errorCallback) {
    let id = user_id;
    if(Utility.isDefined(id) && id != "") {
        let bodyData = { player: id, score: value, reason: reason};

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
				if (Utility.isDefined(successCallback)) successCallback();
            }
        };
		xhttp.onerror = function () {
			console.error("Error in sendScore: " + xhttp.responseText);
			if (Utility.isDefined(errorCallback)) errorCallback(xhttp.responseText);
		}
        xhttp.open("POST", baseUrl + "/score/", true);
        xhttp.setRequestHeader('Authorization', authorizationToken);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(bodyData));
    }
}