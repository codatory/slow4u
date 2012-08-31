var ajax = new XMLHttpRequest()
var report = function(){
	var latency = window.performance.timing.responseEnd - window.performance.timing.fetchStart
	ajax.open("POST", "http://localhost:3000/", true)
	ajax.send("latency=" + latency)
}

window.document.addEventListener("load", report)
if (window.document.readyState == 'complete') {
	report()
}