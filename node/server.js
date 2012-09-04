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
	db.get('cache_'+req.ip, function(err, val){
		if (!err && val ){
			db.ttl('cache_'+req.ip, function(err,ttl){
				console.log("Sending from cache for " + req.ip + " ttl "+ ttl)
				res.header("Cache-Control", "private, max-age="+(ttl+1))
				res.send({"average": val})
			})
		} else {
			console.log("Uncached read for " + req.ip)
			db.hkeys(req.ip, function(err, vals){
				now = Date.now()
				old = now - 300000 // 5 minutes ago
				expired = vals.filter(function(v){
					return parseInt(v) < old
				})
				expired.forEach(function(key){
					db.hdel(req.ip, key)
				})
			})
			db.hvals(req.ip, function(err, vals){
				var sum
				var count
				var average
				count = vals.length
				sum = vals.reduce(function(pv,cv,index,array){
					return pv + parseInt(cv)
				}, 0)
				average = sum / count
				console.log(average)
				db.set('cache_'+req.ip, average, function(e){
					db.expire('cache_'+req.ip, 29)
				})
				res.header("Cache-Control", "private, max-age=30")
				res.send({"average": average})
			})
		}
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
