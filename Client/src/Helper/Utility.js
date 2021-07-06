export var Utility = {
	mergeObjects: function (a, b) {
		var result = {};
		Utility.addToObject(result, a);
		Utility.addToObject(result, b);
		return result;
	},

	copyObject: function (a) {
		var result = {};
		Utility.addToObject(result, a);
		return result;
	},

	addToObject: function (a, b) {
		for (var attribute in b) { a[attribute] = b[attribute]; }
	},

	getRandomSubarray: function (arr, size) {
		var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
		while (i-- > min) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
		}
		return shuffled.slice(min);
	},

	isDefined: function (variable) {
		return !(typeof variable === "undefined" || variable == null);
	},

	getLayoutHierarchy(layout) {
		layout = Utility.copyObject(layout);

		if (Utility.isDefined(layout.override) && Utility.isDefined(layout.ref) && Utility.isDefined(layout.override[layout.ref])) {
			layout = Utility.mergeObjects(layout, layout.override[layout.ref]);
		}

		if (Utility.isDefined(layout.base)) {
			if (Array.isArray(layout.base)) {
				for (var i = layout.base.length - 1; i >= 0; --i) {
					var baseLayout = Utility.getLayoutHierarchy(layout.base[i]);
					layout = Utility.mergeObjects(baseLayout, layout);
				}
			} else if (typeof layout.base === 'function') {
				var baseLayout = Utility.getLayoutHierarchy(layout.base());
				layout = Utility.mergeObjects(baseLayout, layout);
			} else {
				var baseLayout = Utility.getLayoutHierarchy(layout.base);
				layout = Utility.mergeObjects(baseLayout, layout);
			}
		}

		return layout;
	},

	filterFloat(value) {
		if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
			.test(value))
			return Number(value);
		return NaN;
	},

	formatString: function (str) {
		if (!Utility.isDefined(str)) return str;
		var args = arguments;
		return str.replace(/{(\d+)}/g, function (match, number) {
			let index = parseInt(number);
			return !isNaN(index) && Utility.isDefined(args[index + 1])
				? args[index + 1]
				: match;
		});
	},

	parseArray(arrayStringId, strings) {
		return Utility.parseArrayFormat(arrayStringId + "_{0}", strings);
	},

	parseArrayFormat(arrayStringId, strings) {
		var options = [];
		let index = 0;
		let string = strings[Utility.formatString(arrayStringId, index)];
		while (Utility.isDefined(string)) {
			options.push(string);
			++index;
			string = strings[Utility.formatString(arrayStringId, index)];
		}

		return options;
	},

	countArray(arrayString, strings) {
		return Utility.countArrayFormat(arrayString + "_{0}", strings);
	},

	countArrayFormat(arrayString, strings) {
		let index = 0;
		while (Utility.isDefined(strings[Utility.formatString(arrayString, index)])) {
			++index;
		}
		return index;
	},

	disableElement(element) {
		element.classList.remove("hidden");
		element.classList.add("hidden");
	},

	enableElement(element) {
		element.classList.remove("hidden");
	},

	hideElement(element) {
		element.classList.remove("invisible");
		element.classList.add("invisible");
	},

	showElement(element) {
		element.classList.remove("invisible");
	},
}