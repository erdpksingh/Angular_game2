import { getRoundSettings } from "./GameModes/Round/RoundSettingsFactory";
import { Car } from "./Car";
import { ModelSettings } from "../Settings/ModelSettings";

class CarController {
	setup() {
		this.cars = [];
		this.carContainers = [];

		if (getRoundSettings().twoCarRace) {
			this.cars.push(new Car(0, ModelSettings.carModel, getRoundSettings().getCarColor(0), -1));
			this.cars.push(new Car(1, ModelSettings.carModel, getRoundSettings().getCarColor(1), 1));
		} else {
			this.cars.push(new Car(0, ModelSettings.carModel, getRoundSettings().getCarColor(0), 0));
		}
	}

	init() {
		this.cars.forEach(function (element) { element.init(); });
	}

	reset() {
		this.cars.forEach(function (element) { element.reset(); });
	}

	update() {
		this.cars.forEach(function (element) { element.update(); });
	}

	boost() {
		this.cars.forEach(function (element) { element.boost(); });
	}

	getFirstCarPosition() {
		let position = -1000;
		this.cars.forEach(function (element) { position = Math.max(element.getPosition(), position); });
		return position;
	}

	break() {
		this.cars.forEach(function (element) { element.break(); });
	}
}

export var CarControllerInstance = new CarController();