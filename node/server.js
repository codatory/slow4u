var port = process.env.PORT || 3000

var express = require('express')
var app = express()

var redis   = require('redis')
var db = redis.createClient()

app.use(express.bodyParser())

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.get('/', function(req, res){
	db.hvals(req.ip, function(err, vals){
		sum = vals.reduce(function(pv,cv,index,array){
			return pv + parseInt(cv)
		}, 0)
		avg = sum / vals.length
		console.log(sum)
		console.log(vals.length)
		console.log(avg)
		res.send({"average": avg})
	})
})

app.post('/', function(req, res){
	console.log(req.ip + ': ' + req.headers.latency)
	db.hset(req.ip, Date.now(), req.headers.latency)
	db.expire(req.ip, 300)
	res.send('OK')
})

app.options('/', function(req,res){
	res.send()
})

app.listen(port)
