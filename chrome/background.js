var ajax = new XMLHttpRequest()
var avg = NaN

var updateReading = function(){
	ajax.open('GET', 'http://slow4u.herokuapp.com/', false)
	ajax.timeout = 1000
	ajax.send()

	if (ajax.status === 200) {
	  avg = parseInt(JSON.parse(ajax.response).average)
	}

	if (!avg || avg == NaN ){
		chrome.browserAction.setIcon({path: 'Yello.png'})
	} else if (avg < 400) {
		chrome.browserAction.setIcon({path: 'Dark_Green.png'})
	} else {
		chrome.browserAction.setIcon({path: 'Red.png'})
	}
}

setInterval(updateReading, 30000)
updateReading()