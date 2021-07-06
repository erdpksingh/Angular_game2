import { Babylon } from "../Engine/Babylon";
import { loadMesh, spawnNewDuplicate, resetPosition } from "../Helper/MeshLoader";
import { Utility } from "../Helper/Utility";
import { GameControllerInstance as GameController, GameState } from "./GameController";
import { Vector3, Color3 } from "babylonjs";
import { GameSettings } from "../Settings/GameSettings";
import { CameraInstance as Camera } from "./Camera";
import { CarControllerInstance as CarController } from "./CarContoller";
import { Sprite } from "../Helper/Sprite";
import { ComboInstance as Combo } from "./Combo";
import { getRoundSettings } from "./GameModes/Round/RoundSettingsFactory";

// green (ground)
// green2 (big terrain)
// green3 (small terrain)
// treegreen
// treegreen2
// rock
// bark

function getRandomZ() {
	return 200 - Math.random() * 300;
}

var lantern = {
	name: "streetlamp",
	position: new Vector3(-42, 0, -190),
	rotation: new Vector3(0, Math.PI, 0),
	mirror: true,
	duplicate: true,
	duplicateDistance: 300,
	duplicateNumber: 3,
	castShadow: true,
	container: [],
	colors: {
		metall1: new Color3(162 / 255, 174 / 255, 187 / 255),
		LightLamp1: BABYLON.Color3.White(),
	},
	standardMaterial: true,
}

var pillar = {
	name: "leitplankePillar",
	position: new Vector3(-49, 0, -190),
	mirror: true,
	duplicate: true,
	duplicateDistance: 150,
	duplicateNumber: 6,
	container: [],
	colors: {
		metall: new Color3(162 / 255, 174 / 255, 187 / 255),
	},
	standardMaterial: true,
}

var trees = []

var tree = {
	mirror: true,
	duplicate: true,
	duplicateDistanceMin: 300,
	duplicateDistanceMax: 400,
	duplicateNumber: 2,
	randomRotation: true,
	randomPositionX: 15,
	castShadow: true,
	container: trees,
	standardMaterial: true,
}

var tree01 = { // leaf tree
	base: tree,
	duplicateDistanceMin: 100,
	duplicateDistanceMax: 120,
	duplicateNumber: 6,
	name: "tree01",
	position: new Vector3(-75, 0, getRandomZ()),
	colors: {
		treegreen2: new BABYLON.Color3(105 / 255, 153 / 255, 93 / 255),
		bark: new BABYLON.Color3(47 / 255, 37 / 255, 4 / 255),
	}
}

var tree04 = { // conifer
	base: tree,
	duplicateDistanceMin: 100,
	duplicateDistanceMax: 120,
	duplicateNumber: 6,
	name: "tree04",
	position: new Vector3(-75, 0, getRandomZ()),
	colors: {
		treegreen: new BABYLON.Color3(52 / 255, 98 / 255, 63 / 255),
		bark: new BABYLON.Color3(47 / 255, 37 / 255, 4 / 255),
	}
}

var rocks01 = { //big rocks
	base: tree,
	name: "rocks01",
	position: new Vector3(-140, 0, getRandomZ()),
	duplicateDistanceMin: 500,
	duplicateDistanceMax: 600,
	colors: {
		rock: new BABYLON.Color3(70 / 255, 70 / 255, 66 / 255),
	}
}

var rocks02 = {
	base: tree,
	name: "rocks02",
	position: new Vector3(-80, 0, getRandomZ()),
	randomPositionX: 5,
	colors: {
		rock: new BABYLON.Color3(70 / 255, 70 / 255, 66 / 255),
	}
}

var terrain01 = {
	base: tree,
	name: "terrain01",
	position: new Vector3(-150, 0, getRandomZ()),
	colors: {
		green2: new BABYLON.Color3(200 / 255, 69 / 150, 62 / 255),
	}
}

var terrain02 = {
	base: tree,
	name: "terrain02",
	position: new Vector3(-150, 0, getRandomZ()),
	colors: {
		green3: new BABYLON.Color3(200 / 255, 69 / 150, 62 / 255),
	}
}


var ground = {
	name: "groundplanestreet",
	scaling: new Vector3(1, 1, 3),
	receiveShadows: true,
	mirror: true,
	colors: {
		green: new BABYLON.Color3(225 / 255, 187 / 255, 126 / 255),
		street: new BABYLON.Color3(35 / 255, 37 / 255, 40 / 255),
		metall: new BABYLON.Color3(154 / 255, 164 / 255, 165 / 255),
		FinishlineM: BABYLON.Color3.White(),
	},
	standardMaterial: true,
}

var center_line = {
	name: "street_center_line",
	position: new Vector3(0, 0.5, 0),
	scaling: new Vector3(1, 1, 0.2),
	duplicate: true,
	duplicateDistance: 120,
	duplicateNumber: 5,
	container: [],
	colors: {
		LiningM: BABYLON.Color3.White(),
	},
	standardMaterial: true,
}

var startFinish = {
	name: "startfinish",
	position: new Vector3(0, 0, -40),
	scaling: new Vector3(-1, 1, 1),
	duplicate: true,
	duplicateDistance: 0,
	duplicateNumber: 2,
	castShadow: true,
	container: [],
	standardMaterial: true,
}

var startFinishLine = {
	name: "startfinishline",
	position: new Vector3(0, 1, -65),
	duplicate: true,
	duplicateDistance: 0,
	duplicateNumber: 2,
	container: [],
	standardMaterial: true,
}

class Environment {
	constructor() {
		this.currentSpeed = 0;
		this.minSpeed = 0.2;
		this.maxSpeed = 0.5;
	}

	setup() {
		loadMesh(lantern);
		loadMesh(pillar);
		loadMesh(tree01);
		loadMesh(tree04);
		loadMesh(rocks01);
		loadMesh(rocks02);
		loadMesh(terrain01);
		loadMesh(terrain02);
		loadMesh(ground);
		loadMesh(startFinish);
		loadMesh(startFinishLine);

		if (getRoundSettings().twoCarRace) loadMesh(center_line);

		this.skidmarks = new Sprite({
			texture: "./assets/sprites/comboracer_spriteanim_breaks.png",
			width: 20,
			height: 150,
			alpha: 0,
			rotation: new BABYLON.Vector3(Math.PI / 2, 0, 0),
			position: new BABYLON.Vector3(0, 2, -60),
		});

		this.setupLighting();
	}

	setupLighting() {
		Babylon.ambientLight.direction = new BABYLON.Vector3(0, 1, 0);
		Babylon.ambientLight.intensity = 0.75;
		
		Babylon.directionalLight.position = new BABYLON.Vector3(-100, 100, -100);
		Babylon.directionalLight.direction = new BABYLON.Vector3(1, -1, 1);
		Babylon.directionalLight.intensity = 0.5;
	}

	init() {
		startFinish.container[0].rotation.y = Math.PI;
		startFinish.container[1].rotation.y = 0;
	}

	update() {
		if (GameController.state == GameState.running) {
			let targetSpeed = Combo.lerpCombo(this.minSpeed, this.maxSpeed) * getRoundSettings().environmentSpeedFactor;
			this.currentSpeed += Math.min(targetSpeed - this.currentSpeed, 0.1) * Babylon.engine.getDeltaTime() / 1000;
		} else if (GameController.state == GameState.menu) {
			let targetSpeed = this.minSpeed;
			this.currentSpeed += Math.min(targetSpeed - this.currentSpeed, 0.1) * Babylon.engine.getDeltaTime() / 1000;
		}

		this.currentSpeed = Math.max(this.currentSpeed, 0);

		this.updateObjects(lantern);
		this.updateObjects(pillar);
		this.updateObjects(tree);
		this.updateObjects(center_line);
		this.updateObjects(startFinish, false);
		this.updateObjects(startFinishLine, false);

		this.updateObject(this.skidmarks.mesh);

		if (GameController.state == GameState.menu) {
			startFinish.container[0].position.z = -300;
			startFinishLine.container[0].position.z = -300;
			startFinish.container[1].position.z = -300;
			startFinishLine.container[1].position.z = -300;
		} else if (startFinish.container[1].position.z > 300) {
			this.updateGoalPosition();
		}
	}

	showSkidmarks() {
		this.skidmarks.mesh.position.z = CarController.getFirstCarPosition() - 30;
		this.skidmarks.setAlpha(1);
	}

	updateGoalPosition() {
		let targetDistance = CarController.getFirstCarPosition() + (GameSettings.roundDistanceMeters - GameController.distanceMeters) / Math.max(GameController.currentSpeed, GameController.minSpeed) * Math.max(this.currentSpeed, this.minSpeed);

		startFinish.container[1].position.z = targetDistance;
		startFinishLine.container[1].position.z = targetDistance - 25;
	}

	reset() {
		resetPosition(startFinish.container[0], startFinish);
		resetPosition(startFinishLine.container[0], startFinishLine);
		this.currentSpeed = 0;

		this.updateGoalPosition();
	}

	updateObjects(object, duplicate = true) {
		if (Utility.isDefined(object.container)) {
			object.container.forEach(element => {
				this.updateObject(element);
				if (duplicate && element.position.z < Camera.runningPosition.z) {
					spawnNewDuplicate(element, object);
				}
			});
		}
	}

	updateObject(object) {
		object.position.z -= Babylon.engine.getDeltaTime() * this.currentSpeed;
	}
}

export var EnvironmentInstance = new Environment();