import { GameControllerInstance as GameController, GameState } from "./GameController";
import { Babylon } from "../Engine/Babylon";
import { GameSettings } from "../Settings/GameSettings";
import { ComboInstance as Combo } from "./Combo";
import { registerCheat, cheatCode } from "../Helper/Cheats";

class Camera {
	constructor() {
		this.runningPosition = new BABYLON.Vector3(0, 128, -242);
		this.runningRotationMin = new BABYLON.Vector3(50 * Math.PI / 180, 0, 0);
		this.runningRotationMax = new BABYLON.Vector3(37 * Math.PI / 180, 0, 0);

		this.introPosition = new BABYLON.Vector3(0, 40, -96);
		this.introRotation = new BABYLON.Vector3(25 * Math.PI / 180, 0, 0);

		this.shakeTimerMS = 0;
		this.countdownTimerMS = 0;
		this.rotationTimerMS = 0;

		registerCheat(cheatCode.ROTATE, this.speedUpRotation.bind(this));
	}

	setup() {
		this.basePosition = this.runningPosition.clone();
		this.baseRotation = this.runningRotationMin.clone();
		Babylon.scene.clearColor = new BABYLON.Color3(71 / 255, 93 / 255, 35 / 255);
	}

	startMenu() {
		this.baseRotation = this.introRotation.clone();
	}

	startIntro() {
		this.countdownTimerMS = 0;
		this.basePosition = this.introPosition.clone();
		this.baseRotation = this.introRotation.clone();
	}

	startGame() {
		this.basePosition = this.runningPosition.clone();
	}

	startTutorial() {
		this.basePosition = this.runningPosition.clone();
		this.baseRotation = this.runningRotationMin.clone();
	}

	speedUpRotation() {
		this.rotationTimerMS += 1000;
	}

	update() {
		let deltaTime = Math.min(1000, Babylon.engine.getDeltaTime());

		switch (GameController.state) {
			case GameState.menu:
				this.rotationTimerMS += deltaTime;
				let t = this.rotationTimerMS / 5000;
				let distance = 50;
				this.basePosition = new BABYLON.Vector3(Math.sin(t) * distance, 30, Math.cos(t) * distance);
				this.baseRotation.y = t + Math.PI;
				break;
			case GameState.countdown:
				this.countdownTimerMS += deltaTime;
				let parameter = Math.max(0, Math.min(1, (this.countdownTimerMS / 1000 - GameSettings.countdownCameraMovementDelaySec) / (GameSettings.countdownDurationSec + GameSettings.countdownDelaySec - GameSettings.countdownCameraMovementDelaySec)));
				let invParameter = 1 - parameter;
				invParameter *= invParameter;
				parameter *= parameter;
				this.basePosition = this.runningPosition.scale(parameter).add(this.introPosition.scale(1 - parameter));
				this.baseRotation = this.introRotation.scale(invParameter).add(this.runningRotationMin.scale(1 - invParameter));
				break;
			case GameState.running:
				let targetRotation = 0;
				targetRotation = Combo.lerpCombo(this.runningRotationMin.x, this.runningRotationMax.x);
				this.baseRotation.x += Math.min(targetRotation - this.baseRotation.x, 0.1) * deltaTime / 1000;
				this.baseRotation.x = Math.max(this.baseRotation.x, this.runningRotationMax.x);
				break;
		}

		Babylon.camera.position = this.basePosition.add(this.getScreenShake());
		Babylon.camera.rotation = this.baseRotation.clone();
	}

	enableScreenShake(durationMS) {
		this.shakeTimerMS = durationMS;
		this.shakeDurationMS = durationMS;
	}

	getScreenShake() {
		if (this.shakeTimerMS > 0) {
			this.shakeTimerMS -= Babylon.engine.getDeltaTime();

			let magnitude = 2;

			return new BABYLON.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).scale(magnitude * this.shakeTimerMS / this.shakeDurationMS);
		} else {
			return BABYLON.Vector3.Zero();
		}
	}
}

export var CameraInstance = new Camera();