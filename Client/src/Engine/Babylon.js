import { GraphicsSettings } from "../Settings/GraphicsSettings";

export var Babylon = {
	canvas: null,
	engine: null,
	scene: null,
	camera: null,
	directionalLight: null,
	ambientLight: null,
	shadowGenerator: null,
	assetsManager: null,
	setup: setup,
	loadAssets: loadAssets,
}

function setup() {
	Babylon.canvas = document.getElementById("renderCanvas");
	Babylon.engine = new BABYLON.Engine(Babylon.canvas, true);
	Babylon.scene = new BABYLON.Scene(Babylon.engine);
	Babylon.camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, 0), Babylon.scene, true);
	Babylon.camera.attachControl(Babylon.canvas, true);
	Babylon.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), Babylon.scene);
	Babylon.ambientLight.diffuse = BABYLON.Color3.White();
	Babylon.ambientLight.groundColor = BABYLON.Color3.White();
	Babylon.directionalLight = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(1, -1, 1), Babylon.scene);
	Babylon.directionalLight.diffuse = BABYLON.Color3.White();
	Babylon.directionalLight.autoUpdateExtends = false;

	if (GraphicsSettings.shadows) {
		Babylon.shadowGenerator = new BABYLON.ShadowGenerator(1024, Babylon.directionalLight);
		Babylon.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
	}

	Babylon.assetsManager = new BABYLON.AssetsManager(Babylon.scene);
	Babylon.assetsManager.useDefaultLoadingScreen = false;

	if (GraphicsSettings.lowQuality) {
		Babylon.engine.setHardwareScalingLevel(2);
	}

	Babylon.engine.runRenderLoop(function () {
		Babylon.scene.render();
	});

	window.addEventListener("resize", function () {
		Babylon.engine.resize();
	});
}

function loadAssets(callback) {
	Babylon.assetsManager.onFinish = callback;
	Babylon.assetsManager.load();
}