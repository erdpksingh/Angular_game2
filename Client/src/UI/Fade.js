class Fade {
	setup() {
		this.fade = document.getElementById("screenFade");
		this.fade.addEventListener("animationend", this.endAnimation.bind(this), false);
	}

	fadeCallback(callback) {
		this.startAnimation();
		setTimeout(callback, 750);
	}

	startAnimation() {
		this.fade.classList.add("doFade");
	}

	endAnimation() {
		this.fade.classList.remove("doFade");
	}
}

export var FadeInstance = new Fade();