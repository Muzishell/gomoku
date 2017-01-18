var join = require('./join.js');
var leave = require('./leave.js');
var putpawn = require('./gameplay.js').putpawn;
var chat = require('./chat.js');

module.exports = function(io, games) {

  io.on('connection', function(socket) {
    join(io, socket, games);
    leave(io, socket, games);
    putpawn(io, socket, games);
    chat(io, socket, games);
  });
};
