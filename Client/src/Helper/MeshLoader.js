import { Babylon } from "../Engine/Babylon";
import { Utility } from "./Utility";
import { GraphicsSettings } from "../Settings/GraphicsSettings";

function setupParameters(parameters) {
	parameters = Utility.getLayoutHierarchy(parameters);

	parameters = Utility.mergeObjects({
		name: "",
		position: BABYLON.Vector3.Zero(),
		rotation: BABYLON.Vector3.Zero(),
		scaling: BABYLON.Vector3.One(),
		mirror: false,
		duplicate: false,
		duplicateDistance: 10,
		duplicateNumber: 1,
		randomRotation: false,
		randomPositionX: 0,
		container: null,
		receiveShadows: false,
		castShadow: false,
		standardMaterial: false,
		colors: null,
		index: -1,
		textures: null,
		materials: null,
	}, parameters);

	return parameters;
}

export function loadMesh(parameters) {
	parameters = setupParameters(parameters);

	var meshTask = Babylon.assetsManager.addMeshTask("Loading " + parameters.name, null, "./assets/models/", parameters.name + ".glb");
	meshTask.onSuccess = function (task) {
		let original = task.loadedMeshes[0];

		original.name = parameters.name;

		//set rotationQuaternion to undefined to fix problems when setting the rotation of meshes
		//http://www.html5gamedevs.com/topic/40981-does-rotation-work-differently-on-built-in-mesh-and-imported-mesh/
		original.rotationQuaternion = undefined;

		original.position = parameters.position.clone();
		original.position.x += (Math.random() * 2 - 1) * parameters.randomPositionX;
		original.scaling = parameters.scaling.clone();
		original.rotation.y = parameters.randomRotation ? Math.random() * Math.PI * 2 : parameters.rotation.y;

		setupNewMesh(original, parameters);
		setupMeshColor(original, parameters);

		let mirroredObject = null;
		if (parameters.mirror) {
			mirroredObject = mirrorObject(original, parameters);
		}

		if (parameters.duplicate) {
			if (mirroredObject != null) duplicateObject(mirroredObject, parameters);
			duplicateObject(original, parameters);
		}
	};

	meshTask.onError = function (task, message) {
		console.error(message);
	}
}

export function createMaterial(parameters) {
	let newMaterial = new BABYLON.StandardMaterial(parameters.name, Babylon.scene);
	newMaterial.backFaceCulling = false;
	newMaterial.ambientColor = new BABYLON.Color3(0, 0, 0);
	if (Utility.isDefined(parameters.diffuse)) {
		newMaterial.diffuseTexture = new BABYLON.Texture(parameters.diffuse, Babylon.scene, true, false);
	}
	if (Utility.isDefined(parameters.normal)) {
		newMaterial.bumpTexture = new BABYLON.Texture(parameters.normal, Babylon.scene, true, false);
	}
	if (Utility.isDefined(parameters.specular)) {
		newMaterial.specularTexture = new BABYLON.Texture(parameters.specular, Babylon.scene, true, false);
	}
	// if (Utility.isDefined(parameters.emissive)) {
	// 	newMaterial.emissiveTexture = new BABYLON.Texture(parameters.emissive, Babylon.scene, true, false);
	// }

	return newMaterial;
}

function setupNewMesh(mesh, parameters) {
	if (parameters.container != null) {
		if (parameters.index < 0) parameters.container.push(mesh);
		else parameters.container[parameters.index] = mesh;
	}

	if (GraphicsSettings.shadows) {
		if (parameters.castShadow) Babylon.shadowGenerator.addShadowCaster(mesh, true);

		if (parameters.receiveShadows) {
			mesh.receiveShadows = true;
			mesh.getChildMeshes().forEach(function (mesh) {
				mesh.receiveShadows = true;
			});
		}
	}
}

function setupMeshColor(mesh, parameters) {
	if (Utility.isDefined(mesh.material)) {
		let color = BABYLON.Color3.Purple();
		let texture = null;

		if (Utility.isDefined(mesh.material.diffuseColor)) {
			color = mesh.material.diffuseColor;
		}

		if (Utility.isDefined(mesh.material.albedoColor)) {
			color = mesh.material.albedoColor;
		}

		if (Utility.isDefined(parameters.colors)) {
			for (let material in parameters.colors) {
				if (material == mesh.material.name) {
					color = parameters.colors[material];
				}
			}
		}

		if (parameters.standardMaterial) {
			if (Utility.isDefined(mesh.material.diffuseTexture)) {
				texture = mesh.material.diffuseTexture;
			}

			if (Utility.isDefined(mesh.material._albedoTexture)) {
				texture = mesh.material._albedoTexture;
			}

			let newMaterial = new BABYLON.StandardMaterial(mesh.material.name, Babylon.scene);
			newMaterial.diffuseColor = color;
			newMaterial.specularColor = BABYLON.Color3.Black();
			newMaterial.backFaceCulling = false;
			newMaterial.diffuseTexture = texture;

			mesh.material = newMaterial;
		} else {
			mesh.material.albedoColor = color;
		}

		if (Utility.isDefined(parameters.textures)) {
			let data = parameters.textures[mesh.name];
			if (Utility.isDefined(data)) {
				mesh.material = createMaterial(data);
			}
		}

		if (Utility.isDefined(parameters.materials)) {
			let data = parameters.materials[mesh.name];
			if (Utility.isDefined(data)) {
				mesh.material = data;
			}
		}
	}

	mesh.getChildMeshes().forEach(function (mesh) {
		setupMeshColor(mesh, parameters);
	});
}


function setMeshColor(mesh, parameters) {
	if (Utility.isDefined(mesh.material)) {
		for (let material in parameters.colors) {
			if (material == mesh.material.name) {
				mesh.material.albedoColor = parameters.colors[material];
			}
		}
	}

	mesh.getChildMeshes().forEach(function (mesh) {
		setMeshColor(mesh, parameters);
	});
}
function mirrorObject(mesh, parameters) {
	let mirroredObject = mesh.clone(mesh.name + "Mirrored");
	mirroredObject.position.x = -parameters.position.x;
	mirroredObject.position.x += (Math.random() * 2 - 1) * parameters.randomPositionX;
	mirroredObject.rotation.y = mesh.rotation.y + Math.PI;
	setupNewMesh(mirroredObject, parameters);
	return mirroredObject;
}

function duplicateObject(mesh, parameters) {
	let currentDistance = 0;
	for (var i = 1; i < parameters.duplicateNumber; ++i) {
		var newInstance = mesh.clone(mesh.name + i);
		currentDistance += getDistance(parameters);
		newInstance.position.z += currentDistance;
		newInstance.position.x = Math.abs(parameters.position.x) * (mesh.position.x < 0 ? -1 : 1);
		newInstance.position.x += (Math.random() * 2 - 1) * parameters.randomPositionX;
		newInstance.rotation.y = parameters.randomRotation ? Math.random() * Math.PI * 2 : mesh.rotation.y;
		setupNewMesh(newInstance, parameters);
	}
}

function getDistance(parameters) {
	if (typeof parameters.duplicateDistance === 'function') {
		return parameters.duplicateDistance();
	} if (Utility.isDefined(parameters.duplicateDistanceMin) && Utility.isDefined(parameters.duplicateDistanceMax)) {
		let t = Math.random();
		return t * parameters.duplicateDistanceMin + (1 - t) * parameters.duplicateDistanceMax;
	} else {
		return parameters.duplicateDistance;
	}
}

export function spawnNewDuplicate(mesh, parameters) {
	parameters = setupParameters(parameters);
	if (parameters.duplicate) {
		mesh.position.z += getDistance(parameters) * parameters.duplicateNumber;
		if (parameters.randomRotation) mesh.rotation.y = Math.random() * Math.PI * 2;
	}
}

export function resetPosition(mesh, parameters) {
	if (Utility.isDefined(mesh)) {
		mesh.position = Utility.isDefined(parameters.position) ? parameters.position.clone() : BABYLON.Vector3.Zero();
	}
}