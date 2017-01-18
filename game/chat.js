var misc = require('./misc.js');
var Ai = require('../ai/ai.js');

module.exports = function(io, socket, games) {
  socket.on('message', function (data) {
    var game = misc.find_player(games, socket.id).game;

    if (data.message.charAt(0) == '/') {
      if (data.message == '/help')
        socket.emit('message', {message: 'Help: /ai /bouh'});
      if (data.message == '/ai') {
        if (game.players.length == 2)
          socket.emit('message', {message: 'Room is already full'});
        else {
          socket.emit('message', {message: 'AI has come forth'})
          var AIsocket = require('socket.io-client')('http://localhost:8080/');
          game.ai = true;
        }
      }
      if (data.message == '/replay') {
        if (game.players.length == 2) {
          game.clearBoard();
          socket.emit('clear');
          game.players[0].pawn = 0;
          game.players[1].pawn = 0;
          game.activePlayer = 0;
        }
        else
          socket.emit('message', {message: 'Cannot replay the game'});
      }
      if (data.message == '/advice') {
        var player = game.players[0];
        var coord = game.aiObject.findPlay(1, player.pawn, game.map);
        socket.emit('message', {message: 'Our AI advices you to play x: ' + coord[0] + ' y: ' + coord[1]});
      }
    }
    else {
      io.to(game.room).emit('message', {id: data.user, message: data.message});
    }
  });
};
