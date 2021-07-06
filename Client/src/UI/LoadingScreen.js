class LoadingScreen {
	constructor() {
		this.menu = document.getElementById("loadingScreen")
	}

	hide() {
		this.menu.classList.add("hidden");
	}

	show() {
		this.menu.classList.remove("hidden");
	}
}

export var LoadingScreenInstance = new LoadingScreen();