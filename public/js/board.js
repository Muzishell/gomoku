var board = new WGo.Board(document.getElementById("board"), {
  width: 800,
  size: 19,
  right: -0.5,
  bottom: -0.5
});

socket.on('badmove', function(data) {
  var x = data.x;
  var y = data.y;
  var value = data.value;

  console.log('badmove!');
  console.log(x, y, value);
  if (value > 0) {
    board.addObject({
      x: x,
      y: y,
      c: (value == 1 ? WGo.B : WGo.W)
    });
  }
  else if (value == 0)
    board.removeObjectsAt(x, y);
});

socket.on('move', function(data) {
  var x = data.x;
  var y = data.y;
  var by_player = data.player;

  if (by_player != playerid)
    board.addObject({
      x: x,
      y: y,
      c: (by_player == 1 ? WGo.B : WGo.W)
    });
});

socket.on('win', function(data) {
  var elem = document.createElement('li');
  elem.appendChild(document.createTextNode('Player #' + data.player + ' won by ' + data.reason));
  chatlog.appendChild(elem);
  onGoing = 0;
})

socket.on('eatpawn', function(data) {
  board.removeObjectsAt(data.x1, data.y1);
  board.removeObjectsAt(data.x2, data.y2);
  var elem = document.createElement('li');
  elem.appendChild(document.createTextNode('Player #' + data.player + ' has yet to eat ' + (10 - data.nb_eaten) + ' more stones to win'));
  chatlog.appendChild(elem);
});

socket.on('clear', function() {
  board.removeAllObjects();
  onGoing = 1;
})

var tool = document.getElementById("tool"); // get the <select> element

board.addEventListener("click", function(x, y) {
  if (onGoing) {
    socket.emit('putpawn', {x: x, y: y, player: playerid});
    board.addObject({
      x: x,
      y: y,
      c: (playerid == 1 ? WGo.B : WGo.W)
    });
  }
});

var coordinates = {
    // draw on grid layer
    grid: {
        draw: function(args, board) {
            var ch, t, xright, xleft, ytop, ybottom;
            
            this.fillStyle = "rgba(0,0,0,0.7)";
            this.textBaseline="middle";
            this.textAlign="center";
            this.font = board.stoneRadius+"px "+(board.font || "");
            
            xright = board.getX(-0.40);
            ytop = board.getY(-0.40);
            
            for(var i = 0; i < board.size; i++) {
                ch = i+"A".charCodeAt(0);
                if(ch >= "I".charCodeAt(0)) ch++;
                
                t = board.getY(i);
                this.fillText(board.size-i, xright, t);
                this.fillText(board.size-i, xleft, t);
                
                t = board.getX(i);
                this.fillText(String.fromCharCode(ch), t, ytop);
                this.fillText(String.fromCharCode(ch), t, ybottom);
            }
            
            this.fillStyle = "black";
      }
    }
}
board.addCustomObject(coordinates);
