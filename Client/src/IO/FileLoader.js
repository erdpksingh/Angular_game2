import { Utility } from "../Helper/Utility";

export class FileLoader {
	constructor() {
		this.resetDataRequests();
	}

	resetTimestamp = 0;
	openDataRequests = 0;

	loadFile = loadFile;
	processCsvDataRaw = processCsvDataRaw;
	processCsvDataVariables = processCsvDataVariables;
	processCsvDataGrid = processCsvDataGrid;

	resetDataRequests() {
		this.resetTimestamp = Date.now();
		this.openDataRequests = 0;
	}
}

function loadFile(path, callback, error = null) {
	try {
		var xmlHttp = new XMLHttpRequest();
		var loader = this;
		var timestamp = Date.now();

		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status == 200 && loader.resetTimestamp <= timestamp) {
				callback(xmlHttp.responseText, path);
				--loader.openDataRequests;
			}
		}

		xmlHttp.onerror = function () {
			console.error("Error in loadFile: " + xmlHttp.responseText);
			if (Utility.isDefined(error)) error(xmlHttp.responseText);
		}

		path += "?q=" + Math.random(); // added random to avoid caching
		xmlHttp.open("GET", path, true);
		xmlHttp.send(null);
		++this.openDataRequests;
	} catch (error) {
		console.log(error);
	}
}

export var CsvProcessing = {
	processCsvDataRaw: processCsvDataRaw,
	processCsvDataVariables: processCsvDataVariables,
	processCsvDataGrid: processCsvDataGrid,
}

function processCsvDataRaw(csv) {
	return CSVToArray(csv);
}

function processCsvDataVariables(csv) {
	var lines = {};

	var dataArray = CSVToArray(csv);
	var variable;
	for (var i = 0; i < dataArray.length; ++i) {
		if (dataArray[i].length >= 2) {
			variable = Utility.filterFloat(dataArray[i][1]);
			if (isNaN(variable)) {
				lines[dataArray[i][0]] = dataArray[i][1];
			} else {
				lines[dataArray[i][0]] = variable;
			}
		}
	}

	return lines;
}

function processCsvDataGrid(csv) {
	var lines = [];

	var dataArray = CSVToArray(csv);
	for (var i = 1; i < dataArray.length; ++i) {
		var row = [];
		for (var j = 1; j < dataArray[i].length; ++j) {
			row[dataArray[0][j]] = dataArray[i][j];
		}
		lines[dataArray[i][0]] = row;
	}

	return lines;
}


// https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
// By Ben Nadel on February 19, 2009
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData) {
	if (!Utility.isDefined(strData) || strData == "") return [];

	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	var strDelimiter = ",";
	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
	);

	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];

	//fix issue which skips first data entry, if it is empty
	if (strData.charAt(0) == strDelimiter)
		arrData[0].push("")

	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;
	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec(strData)) {
		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[1];
		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If it does not, then we know
		// that this delimiter is a row delimiter.
		if (
			strMatchedDelimiter.length &&
			(strMatchedDelimiter != strDelimiter)
		) {
			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push([]);
		}
		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[2]) {
			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			var strMatchedValue = arrMatches[2].replace(
				new RegExp("\"\"", "g"),
				"\""
			);
		} else {
			// We found a non-quoted value.
			var strMatchedValue = arrMatches[3];
		}
		// Now that we have our value string, let's add
		// it to the data array.
		arrData[arrData.length - 1].push(strMatchedValue);
	}
	// Return the parsed data.

	return (arrData);
}