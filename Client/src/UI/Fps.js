import { Babylon } from "../Engine/Babylon";

export var Fps = {
	fps: 0,

	render: function() {
		var fpsLabel = document.getElementById("fpsLabel");
	
		let smoothing = 0.9; // larger=more smoothing
		let currentFps = Babylon.engine.getFps();
		if (currentFps > 60) currentFps = 60;
		this.fps = (this.fps * smoothing) + (currentFps * (1 - smoothing));
	
		fpsLabel.innerHTML = this.fps.toFixed() + " fps";
	}
}