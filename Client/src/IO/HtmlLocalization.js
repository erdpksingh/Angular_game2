export function htmlLocalization(container) {
	var elems = document.body.getElementsByClassName("localize");
	for (let i = 0; i < elems.length; ++i) {
		elems[i].innerHTML = container[elems[i].innerHTML];
	}
}