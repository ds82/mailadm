var express		= require('express'),
	app 		= express(),
	server 		= require('http').createServer(app),
	io 			= require('socket.io').listen(server);

var allowCrossDomain = function( req, res, next ) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	if ( next ) next();
};

app.configure(function() {
	app.use( allowCrossDomain );
	app.use( express.bodyParser() );
});

app.options('*', function(req, res) {
	res.send(200);
	res.end();
});


app.get('/navbar', function (req, res) {
	res.send({ hello: 'world' });
});

io.sockets.on('connection', function (socket) {
	socket.emit('test', { hello: 'world' });
});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
	app.use.apply(app, arguments);
};
