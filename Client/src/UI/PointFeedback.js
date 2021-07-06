import { Colors } from "../Helper/Colors";

class PointFeedback {
	constructor() {
		this.element = document.getElementById("pointFeedbackIdle");

		if (this.element == null) return;
		
		this.element.addEventListener("animationstart", this.eventListener.bind(this), false);
		this.element.addEventListener("animationend", this.eventListener.bind(this), false);
		this.element.addEventListener("animationiteration", this.eventListener.bind(this), false);
		this.stop();
	}

	start(points) {
		if (points == 0) return;

		this.element.innerHTML = (points > 0 ? "+" : "-") + Math.abs(points).toString();
		this.element.hidden = false;
		this.element.id = "pointFeedbackActive";
		this.element.style.color = points > 0 ? Colors.green : Colors.red;
	}

	stop() {
		this.element.hidden = true;
		this.element.id = "pointFeedbackIdle";
	}

	eventListener(event) {
		switch (event.type) {
			case "animationstart":
				break;
			case "animationend":

				break;
			case "animationiteration":
				this.stop();
				break;
		}
	}
}

export var PointFeedbackInstance = new PointFeedback();