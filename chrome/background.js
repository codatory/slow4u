var ajax = new XMLHttpRequest()
var avg = null

var updateReading = function(){
	avg = null
	ajax.open('GET', 'http://slow4u.herokuapp.com/', false)
	ajax.timeout = 1000
	ajax.send()

	if (ajax.status === 200) {
	  avg = parseInt(JSON.parse(ajax.response).average)
	}

	if ( isNaN(avg) ){
		chrome.browserAction.setIcon({path: 'question.png'})
	} else if (avg == null) {
		chrome.browserAction.setIcon({path: 'connecting.png'})
	} else if (avg < 400) {
		chrome.browserAction.setIcon({path: 'check.png'})
	} else {
		chrome.browserAction.setIcon({path: 'hourglass.png'})
	}
}

setInterval(updateReading, 30000)
updateReading()
