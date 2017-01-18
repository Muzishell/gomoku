function Player(id, socket, game) {
  this.id = id;
  this.socket = socket;
  this.sockid = socket.id;
  this.pawn = 0;
  this.game = game;
  this.alive = true;
};

module.exports = Player;
