console.log('running extension')
var ajax = new XMLHttpRequest()
var report = function(){
	post_object = {
		"latency": window.performance.timing.responseEnd - window.performance.timing.fetchStart
	}
	console.log(post_object)
	ajax.open("POST", "http://localhost:3000/", true)
	ajax.send(post_object)
}

window.document.addEventListener("load", report)
if (window.document.readyState == 'complete') {
	report()
}