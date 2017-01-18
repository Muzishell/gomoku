var misc = require('./misc.js');

module.exports = {
    putpawn: function(io, socket, games) {
	var checkgame = function(game, player, x, y) {
	    // Check si pion pris
	    var taken = game.arePawnTaken(x, y);
	    var takenLen = taken.length;
	    
	    if (game.gameOngoing == 2 && takenLen < 0)
		console.log("Partie Perdu : L'ennemie à posé 5 pions alignés !");
	    else
		game.gameOngoing = 1;

	    for (var i = 0; i < takenLen; i += 4) {
		io.to(game.room).emit('eatpawn', {x1: taken[i], y1: taken[i + 1], x2: taken[i + 2], y2: taken[i + 3], player: player.id, nb_eaten: player.pawn});
	    }
	    
	    // Check de fin de jeu
	    if (game.tenPawnTaken() == true) {
		console.log("Partie gagné : 10 pions pris !");
		io.to(game.room).emit('win', {player: player.id, reason: "pawn taken"});
	    }
	    if (game.areThereFivePawn(game.get1DP(x, y)) == true) {
		console.log('Partie gagné !');
		io.to(game.room).emit('win', {player: player.id, reason: "pawn alignment"});
	    }
	}
	
	socket.on('putpawn', function(data) {
	    var x = data.x;
	    var y = data.y;
	    var player = misc.find_player(games, socket.id);
	    var game = player.game;
	    var bool_three;
	    
	    bool_three = game.twoFreeThreeRule(game.get1DP(x, y));
	    console.log(bool_three);
	    
	    if (game.map[y * game.col_nb + x] != 0 || data.player != game.activePlayer + 1 || bool_three) {
		socket.emit('badmove', {x: x, y: y, value: game.map[y * game.col_nb + x]});
	    }
	    else {
		game.map[y * game.col_nb + x] = player.id;
		io.to(game.room).emit('move', {x: x, y: y, player: player.id});
		checkgame(game, player, x, y);
                if (game.ai) {
                  game.activePlayer = game.activePlayer ^ 1;
                  var coord = game.aiObject.findPlay(2, player.pawn, game.map);
                  console.log('x: ', coord[1]);
                  console.log('y: ', coord[0]);
                  game.map[game.get1DP(coord[1], coord[0])] = 2;
                  io.to(game.room).emit('move', {x: coord[1], y: coord[0], player: 2});
                  checkgame(game, game.players[1], coord[1], coord[0]);
                  game.activePlayer = game.activePlayer ^ 1;
                }
                else
                  game.activePlayer = game.activePlayer ^ 1;
	    }
	});
    }
};
