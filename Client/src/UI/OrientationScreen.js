class OrientationScreen {
	constructor() {
		this.menu = document.getElementById("orientationScreen")
	}

	setup() {
		window.addEventListener("resize", function (event) {
			this.check();
		}.bind(this));

		this.check();
	}

	hide() {
		this.menu.classList.add("hidden");
	}

	show() {
		this.menu.classList.remove("hidden");
	}

	check() {
		if (window.innerWidth < window.innerHeight) {
			this.show();
		} else {
			this.hide();
		}
	}
}

export var OrientationScreenInstance = new OrientationScreen();