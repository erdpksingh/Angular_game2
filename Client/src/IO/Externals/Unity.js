

var userAgent = navigator.userAgent || navigator.vendor || window.opera;

function isIOS() {
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return true;
	} else {
		return false;
	}
}
function isAndroid() {
	return (/android/i.test(userAgent));
}

function removeIframe(url, iframe) {
	iframe.parentNode.removeChild(iframe);
	iframe = null;
}

function appendIframeWithURL(url) {
	var iframe = document.createElement("IFRAME");
	iframe.setAttribute("src", url);
	document.documentElement.appendChild(iframe);
	setTimeout(function () { removeIframe(url, iframe); }, 1000);
}

export function sendMessageToUnity(message) {
	console.log("UnityBridge: " + message);
	if (isIOS()) {
		appendIframeWithURL('inappbrowserbridge://' + message);
	} else if (isAndroid()) {
		UnityInAppBrowser.sendMessageFromJS(message);
	}
}