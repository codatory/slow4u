var express = require('express')
var redis   = require('redis')

var app = express()
var db = redis.createClient()

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.get('/', function(req, res){
	console.log('GET')
	console.log(req)
	res.send('Hello World.')
})

app.post('/', function(req, res){
	console.log(req.ip + ': ')
	console.log(req)
	// db.zadd(req.ip, Date.now, 1)
	res.send('OK')
})

app.options('/', function(req,res){
	res.send()
})

app.listen(3000)