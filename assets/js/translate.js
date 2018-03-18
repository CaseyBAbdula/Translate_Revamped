T_URL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&hl=en-US&dt=t&dt=bd&dj=1&source=bubble", element = document.createElement("span"), targetElement = null, translateEnabled = !0, chrome.runtime.onMessage.addListener(function(e, t, n) {
	translateEnabled = !!e.translateOn, element.remove(), targetElement = null
});
var getLanguages = () => new Promise((e, t) => {
		var n = new XMLHttpRequest;
		n.open("GET", "https://gist.githubusercontent.com/jrnk/8eb57b065ea0b098d571/raw/97efa7bc28c72bacfebce73e28e35cdfea34db63/ISO-639-1-language.json"), n.onload = (t => e(JSON.parse(t.target.response))), n.onerror = (t => e(t)), n.send()
	}),
	langs = {};
getLanguages().then(e => {
	e.forEach(e => {
		langs[e.code] = e.name
	})
});
var handleEvents = e => {
	(translateEnabled && (!element || !element.parentElement || e.target == element || e.target == targetElement || element.contains(e.target)) || (element.remove(), targetElement = null, translateEnabled)) && (selection = window.getSelection(), selectedText = selection.toString(), e.target == element || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement || "" == selection || translate(selectedText).then(t => {
		var n = JSON.parse(t);
		"en" != n.src && (translation = n.sentences.map(e => e.trans).join(""), sourceLang = langs[n.src.split("-")[0]].split(";")[0], country = n.src.split("-")[1], element.innerHTML = `<div class="lang">${sourceLang.toUpperCase()+(country?" - "+country:"")}</div>\n\t\t\t\t\t\t\t\t<div class="text">${selectedText}</div>\n\t\t\t\t\t\t\t\t<div class="lang">ENGLISH</div>\n\t\t\t\t\t\t\t\t<div class="text">${translation}</div>\n\t\t\t\t\t\t\t\t`, element.className = "translationBox", element.style = "visibility:hidden;position:absolute;top:0", document.body.appendChild(element), eBCR = element.getBoundingClientRect(), r = selection.getRangeAt(0).getBoundingClientRect(), element.style = `top:${r.y+r.height+6-document.body.getBoundingClientRect().y}px;left:${r.x+r.width/2-eBCR.width/2}px;`, document.body.append(element), targetElement = e.target)
	}))
};
document.addEventListener("mouseup", handleEvents), document.addEventListener("keyup", handleEvents);
var translate = function(e) {
		return new Promise((t, n) => {
			var a = new XMLHttpRequest;
			a.open("GET", T_URL + "&q=" + encodeURI(e) + Tk(e)), a.onload = (n => t(n.target.response, e)), a.onerror = (e => {
				n(e)
			}), a.send()
		})
	},
	Tk = function(e) {
		b = 0;
		for (var t = [], n = 0, a = 0; a < e.length; a++) {
			var r = e.charCodeAt(a);
			128 > r ? t[n++] = r : (2048 > r ? t[n++] = r >> 6 | 192 : (55296 == (64512 & r) && a + 1 < e.length && 56320 == (64512 & e.charCodeAt(a + 1)) ? (r = 65536 + ((1023 & r) << 10) + (1023 & e.charCodeAt(++a)), t[n++] = r >> 18 | 240, t[n++] = r >> 12 & 63 | 128) : t[n++] = r >> 12 | 224, t[n++] = r >> 6 & 63 | 128), t[n++] = 63 & r | 128)
		}
		for (e = 0, n = 0; n < t.length; n++) e += t[n], e = Wb(e, "+-a^+6");
		return e = Wb(e, "+-3^+b+-f"), 0 > (e ^= 0) && (e = 2147483648 + (2147483647 & e)), "&tk=" + (e %= 1e6).toString() + "." + e.toString()
	};
Wb = function(e, t) {
	for (var n = 0; n < t.length - 2; n += 3) {
		var a = t.charAt(n + 2);
		a = "a" <= a ? a.charCodeAt(0) - 87 : Number(a), a = "+" == t.charAt(n + 1) ? e >>> a : e << a, e = "+" == t.charAt(n) ? e + a & 4294967295 : e ^ a
	}
	return e
};