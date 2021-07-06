import { Babylon } from "../Engine/Babylon";
import { Sprite } from "../Helper/Sprite";
import { ComboInstance as Combo } from "./Combo";
import { GameControllerInstance as GameController, GameState} from "./GameController";
import { CarModel } from "./CarModel";
import { getRoundSettings } from "./GameModes/Round/RoundSettingsFactory";

var startPos = -120;
var offsetDistance = 22;

export class Car {
	constructor(index, carModel, carColor, offset) {
		this.animationOffset = 0;
		this.animationSpeed = 1 + Math.random();
		this.basePosition = startPos;
		this.breakTimerMS = 0;
		this.index = index;

		this.particleSystem = new BABYLON.ParticleSystem("particles", 10, Babylon.scene);
		this.particleSystem.particleTexture = new BABYLON.Texture("./assets/sprites/dustParticle.png", Babylon.scene);
		this.particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
		this.particleSystem.direction1 = new BABYLON.Vector3(-3, 0, -7);
		this.particleSystem.direction2 = new BABYLON.Vector3(3, 0, -7);
		this.particleSystem.gravity = new BABYLON.Vector3(0, 10, 0);
		this.particleSystem.minLifeTime = 1.5;
		this.particleSystem.maxLifeTime = 2;
		this.particleSystem.minAngularSpeed = -Math.PI / 2;
		this.particleSystem.maxAngularSpeed = Math.PI / 2;
		this.particleSystem.minInitialRotation = 0;
		this.particleSystem.maxInitialRotation = Math.PI;
		this.particleSystem.minEmitPower = 2;
		this.particleSystem.maxEmitPower = 2;
		this.particleSystem.addSizeGradient(0, 4, 15);
		this.particleSystem.addSizeGradient(1.0, 20);
		this.particleSystem.emitRate = 8;
		this.particleSystem.targetStopDuration = 1;
		this.particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0));
		this.particleSystem.addColorGradient(0.2, new BABYLON.Color4(1, 1, 1, 0.1));
		this.particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
		this.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

		this.effectParent = new BABYLON.TransformNode("effects", Babylon.scene);
		this.effectSprites = [];

		let effectSpriteBase = {
			rotation: new BABYLON.Vector3(Math.PI / 2, 0, 0),
			alpha: 0,
			parent: this.effectParent,
			framesX: 4,
		}

		this.effectSprites.push(new Sprite({
			base: effectSpriteBase,
			width: 15,
			height: 25,
			position: new BABYLON.Vector3(0, 5, -25),
			texture: "./assets/sprites/comboracer_spriteanim_lines.png",
		}));

		this.effectSprites.push(new Sprite({
			base: effectSpriteBase,
			width: 15,
			height: 30,
			position: new BABYLON.Vector3(0, 5, -30),
			texture: "./assets/sprites/comboracer_spriteanim_dust.png",
		}));

		this.effectSprites.push(new Sprite({
			base: effectSpriteBase,
			width: 25,
			height: 25,
			position: new BABYLON.Vector3(0, 10, 12),
			texture: "./assets/sprites/comboracer_spriteanim_dustfront.png",
		}));

		this.effectSprites.push(new Sprite({
			base: effectSpriteBase,
			width: 20,
			height: 20,
			position: new BABYLON.Vector3(0, 5, -30),
			texture: "./assets/sprites/comboracer_spriteanim_fire01.png",
		}));

		this.effectSprites.push(new Sprite({
			base: effectSpriteBase,
			width: 20,
			height: 100,
			position: new BABYLON.Vector3(0, 2, -60),
			texture: "./assets/sprites/comboracer_spriteanim_fire02.png",
		}));

		this.model = new CarModel(carModel, carColor, offsetDistance * offset);
	}

	init() {
		this.model.init();
	}

	reset() {
		this.model.setPosition(this.basePosition);

		let children = this.effectParent.getChildMeshes();
		for (let i = 0; i < children.length; ++i) {
			children[i].material.alpha = 0;
		}
	}

	break(durationMS = 1000) {
		this.breakTimerMS = durationMS;
		this.breakDurationMS = durationMS;
	}

	getBreakRotation() {
		if (this.breakTimerMS > 0) {
			this.breakTimerMS -= Babylon.engine.getDeltaTime();

			let magnitude = 0.3;

			return Math.sin(this.breakTimerMS / this.breakDurationMS * Math.PI * 2) * (magnitude * this.breakTimerMS / this.breakDurationMS);
		} else {
			return 0;
		}
	}

	update() {
		let deltaTime = Math.min(1000, Babylon.engine.getDeltaTime());

		if (GameController.state == GameState.menu) {
			this.model.rotateWheels(deltaTime);
			this.model.showWheels(true);

			this.model.setPosition(0);
			this.model.setRotation(0);

			for (let i = 0; i < this.effectSprites.length; ++i) {
				this.effectSprites[i].setAlpha(0);
			}

			return;
		}
		this.model.showWheels(false);

		let targetPosition = getRoundSettings().getCarPosition(this.index	) + getAnimationPosition((new Date).getTime() + this.animationOffset, this.animationSpeed);

		let difference = targetPosition - this.model.getPosition().z;

		this.model.addPosition((difference > 0 ? 1 : -1) * Math.min(Math.abs(difference), Math.pow(difference / 150, 2) * 500 * deltaTime / 1000));
		this.model.setRotation(this.getBreakRotation());
		
		this.particleSystem.emitter = new BABYLON.Vector3(this.model.getPosition().x, this.model.getPosition().y + 3, this.model.getPosition().z - 15);

		this.effectParent.position = new BABYLON.Vector3(this.model.getPosition().x, this.model.getPosition().y, this.model.getPosition().z);
		
		for (let i = 0; i < this.effectSprites.length; ++i) {
			this.effectSprites[i].updateAnimation();
			if (i < Combo.getCombo() || i > 2 && i <= Combo.getCombo()) this.effectSprites[i].setAlpha(Math.min(1, this.effectSprites[i].getAlpha() + deltaTime * 0.001));
			else this.effectSprites[i].setAlpha(Math.max(0, this.effectSprites[i].getAlpha() - deltaTime * 0.001));
		}
	}

	boost() {
		this.particleSystem.start();
	}

	getPosition() {
		if (this.model == null) return 0;
		return this.model.getPosition().z;
	}
}

function getAnimationPosition(time, speed) {
	return Math.sin(time / 1500 * speed) * 5;
}