import { Babylon } from "../Engine/Babylon";
import { Utility } from "./Utility";

function setupParameters(parameters) {
	parameters = Utility.getLayoutHierarchy(parameters);

	parameters = Utility.mergeObjects({
		name: "sprite",
		texture: "",
		position: BABYLON.Vector3.Zero(),
		rotation: BABYLON.Vector3.Zero(),
		scaling: BABYLON.Vector3.One(),
		width: 10,
		height: 10,
		framesX: 1,
		framesY: 1,
		alpha: 1,
		parent: null,
	}, parameters);

	return parameters;
}

export class Sprite {
	constructor(parameters) {
		parameters = setupParameters(parameters);

		this.mesh = null;
		this.animated = false;

		if (parameters.framesX * parameters.framesY > 1) {
			this.mesh = BABYLON.MeshBuilder.CreatePlane(parameters.name, { width: parameters.width, height: parameters.height, sideOrientation: BABYLON.Mesh.DOUBLESIDE, frontUVs: new BABYLON.Vector4(0, 0, 1 / parameters.framesX, 1 / parameters.framesY) }, Babylon.scene);
			this.animated = true;
			this.animationTimerMS = 0;
		} else {
			this.mesh = BABYLON.MeshBuilder.CreatePlane(parameters.name, { width: parameters.width, height: parameters.height }, Babylon.scene);
		}

		this.mesh.position = parameters.position.clone();
		this.mesh.rotation = parameters.rotation.clone();
		this.mesh.material = new BABYLON.StandardMaterial(parameters.name, Babylon.scene);
		this.mesh.material.diffuseTexture = new BABYLON.Texture(parameters.texture, Babylon.scene);
		this.mesh.material.opacityTexture = new BABYLON.Texture(parameters.texture, Babylon.scene);
		this.mesh.material.specularColor = BABYLON.Color3.Black();
		this.mesh.material.alpha = parameters.alpha;

		if (Utility.isDefined(parameters.parent)) this.mesh.parent = parameters.parent;

		this.parameters = parameters;
	}

	updateAnimation() {
		if (!this.animated) return;
		this.animationTimerMS += Babylon.engine.getDeltaTime();

		if (this.animationTimerMS > 100) {
			this.animationTimerMS = this.animationTimerMS % 100;
			this.mesh.material.diffuseTexture.uOffset += 1/this.parameters.framesX;
			this.mesh.material.opacityTexture.uOffset += 1/this.parameters.framesX;

			if (this.mesh.material.diffuseTexture.uOffset > 1) {
				this.mesh.material.diffuseTexture.uOffset -= 1;
				this.mesh.material.opacityTexture.uOffset -= 1;
				
				this.mesh.material.diffuseTexture.vOffset += 1/this.parameters.framesY;
				this.mesh.material.opacityTexture.vOffset += 1/this.parameters.framesY;
			}
		}
	}

	setAlpha(value) {
		this.mesh.material.alpha = value;
	}

	getAlpha() {
		return this.mesh.material.alpha;
	}
}