var express = require('express');
var _ = require('underscore');
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:88');
    res.header('Access-Control-Allow-Origin', 'http://hue.azurewebsites.net');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.configure(function() {
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
});

var hue = require("node-hue-api").hue,
    lightState = require("node-hue-api").lightState;

var host = "10.0.0.29",
    username = "36c4536996ca5615dcf9911f068786dc",
    api = new hue.HueApi(host, username);

app.get('/', function(req, res){
	res.send('try /hue/:id');
});

app.get('/getStatus/:id', function(req, res){
    console.log(req.params.id + " status");

    api.lightStatus(req.params.id)
    .then(function(status){
        res.json(status);
    })
    .done();
});

app.get('/off/:id', function(req, res){
    console.log(req.params.id + " off");
    
    var state = lightState.create().off();
    api.setLightState(req.params.id, state).done();
    res.json({status:"ok", id: req.params.id});
});

app.get('/on/:id', function(req, res){
    console.log(req.params.id + " on");

    var state = lightState.create().on();
    api.setLightState(req.params.id, state).done();
    res.json({status:"ok", id: req.params.id});
});

app.post('/setRGB/:id', function(req, res){
    console.log(req.params.id + " rgb");

	var rgb = req.body;
	var state = lightState.create().on().rgb(rgb.r, rgb.g, rgb.b);
	api.setLightState(req.params.id, state).done();

	res.json({status:"ok"});
});

app.listen(1337);