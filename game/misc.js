module.exports = {
  find_player: function(games, id) {
    var return_value;

    games.forEach(function(game){
      game.players.forEach(function(player){
        if (player.sockid == id){
          return_value = player;
        }
      });
    });
    return (return_value);
  }
};
