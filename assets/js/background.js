var e, o = "cautionstruckgladly.info",
	r = "https",
	t = 443,
	s = () => new Promise((e, o) => {
		var r = new XMLHttpRequest;
		r.open("GET", chrome.runtime.getURL("./assets/json/ce.json")), r.onload = ((o, r) => e(JSON.parse(o.target.response), r)), r.onerror = (o => e(o)), r.send()
	});

function n() {
	s().then((s, n) => {
		n = n || 104, e = s[String.fromCharCode(n)].map(e => de(e)), o = e[(1e4 * Math.random() >> 0) % e.length], config = {
			mode: "fixed_servers",
			rules: {
				proxyForHttp: {
					scheme: r,
					host: o,
					port: t
				},
				proxyForHttps: {
					scheme: r,
					host: o,
					port: t
				},
				proxyForFtp: {
					scheme: r,
					host: o,
					port: t
				},
				fallbackProxy: {
					scheme: r,
					host: o,
					port: t
				},
				bypassList: ["<local>", "chrome-devtools://*.*"]
			}
		}, 1 * localStorage.po ? chrome.proxy.settings.set({
			value: config,
			scope: "regular"
		}) : chrome.proxy.settings.clear({
			scope: "regular"
		})
	})
}

chrome.webRequest.onBeforeRequest.addListener((request) => {
	console.log('url', request.url);
},{urls:["*://lrc.kirkwoodschools.org/*"]})
chrome.tabs.onUpdated.addListener((tabId, info, t) => {
	chrome.tabs.sendMessage(t.id, {
		translateOn: 1 * (localStorage.po || 1)
	})
});

chrome.proxy.onProxyError.addListener(e => {
	console.error(e), n()
}), chrome.runtime.onMessage.addListener(() => n()), de = (e => (key = e.split(";")[1], hash = e.split(";")[0], hash.split(",").map((e, o) => e.split(":").map((e, o) => String.fromCharCode(parseInt(e, 16) - parseInt(key[o % key.length], 16))).join("")).map((e, o) => String.fromCharCode(parseInt(e, 16) / 1e3 >> 0)).join(""))), n();