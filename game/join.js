Game = require('./game.js');
Player = require('./player.js');

var join = function(io, socket, games){

  var game = games[games.length - 1];

  socket.join(game.room);
  game.clearBoard();
  game.players.push(new Player(game.players.length + 1, socket, game));
  socket.emit('connected', {id: game.players.length, room: games.length})
  if (game.players.length == 2){
    game.init = true;
    io.to(game.room).emit('starting');
    games.push(new Game('room #' + games.length));
  }
};

module.exports = join;
