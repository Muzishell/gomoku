var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var favicon = require('serve-favicon');

var Game = require('./game/game.js');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

var games = [];
games.push(new Game("room #0"));

var handler = require('./game/handler.js')(io, games);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './views/game.html'));
})

http.listen(8080, function() {});
