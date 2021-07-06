import { createMaterial, loadMesh } from "../Helper/MeshLoader";
import { Babylon } from "../Engine/Babylon";
import { Utility } from "../Helper/Utility";

var wheelSpeed = 2;

var carModels = {
	0: {
		wheelRotation: [wheelSpeed, wheelSpeed, -wheelSpeed, -wheelSpeed],
		carMaterials: ["carBody002", "mirror_lo"],
		wheelMaterials: ["wheel_Front_r", "wheel_back_r", "wheel_back_l", "wheel_Front_l"],
		shadowPosition: new BABYLON.Vector3(4, 0, -3),
		shadowScaling: new BABYLON.Vector3(1.1, 1, 1),
	},
	1: {
		wheelRotation: [wheelSpeed, wheelSpeed, -wheelSpeed, -wheelSpeed],
		carMaterials: ["eqc_car_lo"],
		wheelMaterials: ["wheel_Front_r", "wheel_back_r", "wheel_back_l", "wheel_Front_l"],
		shadowPosition: new BABYLON.Vector3(4, 0, -3),
		shadowScaling: new BABYLON.Vector3(1.1, 1, 1.1),
	},
	2: {
		wheelRotation: [wheelSpeed, wheelSpeed, -wheelSpeed, -wheelSpeed],
		carMaterials: ["amg_lo", "mirror_lo"],
		wheelMaterials: ["wheel_Front_r", "wheel_back_r", "wheel_back_l", "wheel_Front_l"],
		shadowPosition: new BABYLON.Vector3(4, 0, -3),
		shadowScaling: new BABYLON.Vector3(1.1, 1, 1),
	},
	3: {
		wheelRotation: [wheelSpeed, wheelSpeed, -wheelSpeed, -wheelSpeed],
		carMaterials: ["slk_lo", "mirror_lo"],
		wheelMaterials: ["wheel_Front_r", "wheel_back_r", "wheel_back_l", "wheel_Front_l"],
		shadowPosition: new BABYLON.Vector3(4, 0, -2),
		shadowScaling: new BABYLON.Vector3(1.1, 1, 0.9),
	},
	4: {
		wheelRotation: [-wheelSpeed, wheelSpeed, -wheelSpeed, wheelSpeed],
		carMaterials: ["smart_lo", "mirror_lo"],
		wheelMaterials: ["wheel_Front_r", "wheel_back_r", "wheel_back_l", "wheel_Front_l"],
		shadowPosition: new BABYLON.Vector3(4, 0, -2),
		shadowScaling: new BABYLON.Vector3(1.1, 1, 0.8),
	},
	5: {
		wheelRotation: [wheelSpeed, wheelSpeed, -wheelSpeed, -wheelSpeed],
		carMaterials: ["vito_lo", "mirror", "dachtraeger"],
		wheelMaterials: ["wheel_Front_r", "wheel_back_r", "wheel_back_l", "wheel_Front_l"],
		shadowPosition: new BABYLON.Vector3(4, 0, -4),
		shadowScaling: new BABYLON.Vector3(1.1, 1, 1.2),
	},
}

export class CarModel {
	constructor(carModel, carColor, offset) {
		this.mesh = [];
		this.shadow = [];
		this.container = null;
		this.wheels = [];
		this.offset = offset;
		this.wheelRotation = carModels[carModel].wheelRotation;
		loadCar(this.mesh, { model: carModel, texture: carColor });
		loadMesh({
			name: "fakeshadow",
			position: carModels[carModel].shadowPosition,
			scaling: carModels[carModel].shadowScaling,
			container: this.shadow,
			colors: {
				DefaultMaterial: new BABYLON.Color3(25 / 255, 26 / 255, 27 / 255),
			},
			standardMaterial: true,
		});
	}

	init() {
		this.container = new BABYLON.TransformNode("carContainer", Babylon.scene);
		
		this.shadow[0].parent = this.container;
		this.mesh[0].parent = this.container;
		this.mesh[0].position = new BABYLON.Vector3(0, 0, 10);
		this.mesh[0].rotation = new BABYLON.Vector3(0, Math.PI * 0.5, 0);
		this.mesh[0].scaling = new BABYLON.Vector3(10, 10, -10);

		this.setupWheels();

		this.container.position = new BABYLON.Vector3(this.offset, 0, 0);
	}

	addPosition(position) {
		this.container.position.z += position;
	}

	setPosition(position) {
		this.container.position.z = position;
	}

	getPosition() {
		return this.container.position;
	}

	setRotation(rotation) {
		this.container.rotation.y = rotation;
	}

	setupWheels() {
		this.mesh[0].getChildMeshes().forEach(function (mesh) {
			if (mesh.name.startsWith("wheel")) this.wheels.push(mesh);
		}.bind(this));
	}

	showWheels(value) {
		for (let i = 0; i < this.wheels.length; ++i) {
			this.wheels[i].isVisible = value;
		}
	}

	rotateWheels(deltaTime) {
		let rotation;
		for (let i = 0; i < this.wheels.length; ++i) {
			if (!Utility.isDefined(rotation)) rotation = this.wheels[i].rotation.z;
			this.wheels[i].rotation.z = (rotation + 0.003 * deltaTime) * this.wheelRotation[i];
		}
	}
}

function loadCar(container, carData) {
	let carMaterial = createMaterial({
		name: "carMaterial",
		diffuse: "./assets/textures/car_0" + carData.model + "_albedo_0" + carData.texture + ".png",
		normal: "./assets/textures/car_0" + carData.model + "_normal.png",
		specular: "./assets/textures/car_0" + carData.model + "_specular.png",
		emissive: "./assets/textures/car_0" + carData.model + "_emissive.png",
	});

	let wheelMaterial = createMaterial({
		name: "wheelMaterial",
		diffuse: "./assets/textures/wheel_0" + carData.model + "_albedo.png",
		normal: "./assets/textures/wheel_0" + carData.model + "_normal.png",
		specular: "./assets/textures/wheel_0" + carData.model + "_specular.png",
	});

	let materials = {};
	for (let i = 0; i < carModels[carData.model].carMaterials.length; ++i) {
		materials[carModels[carData.model].carMaterials[i]] = carMaterial;
	}
	for (let i = 0; i < carModels[carData.model].wheelMaterials.length; ++i) {
		materials[carModels[carData.model].wheelMaterials[i]] = wheelMaterial;
	}

	let parameters = {
		name: "car_0" + carData.model,
		castShadow: true,
		container: container,
		materials: materials
	}

	loadMesh(parameters);
}