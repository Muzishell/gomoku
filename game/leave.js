misc = require('./misc.js')

var leave = function(io, socket, games){
  socket.on('disconnect', function(reason){
    var player = misc.find_player(games, socket.id);

    io.to(player.game.room).emit('disconnected', {name: player.id, reason: reason});
    player.alive = false;
    player.game.alive = false;
  });
};

module.exports = leave;
