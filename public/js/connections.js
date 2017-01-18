var chatlog = document.getElementById('chatlog');

var playerid = 0;
var onGoing = false;

var putMessage = function(text) {
  var elem = document.createElement('li');
  elem.setAttribute('class', 'mdl-list__item');
  elem.appendChild(document.createTextNode(text));
  chatlog.appendChild(elem);
};

socket.on('connected', function (data) {
  playerid = data.id;
  putMessage('[INFO] Player #' + data.id + ' just joined Room #' + data.room);
  if (data.id == 1) {
    putMessage('[INFO] Waiting for the Player #2 ...');
  }
});

socket.on('starting', function () {
  putMessage('[INFO] Room is full, Game is about to begin...');
  onGoing = true;
});

socket.on('disconnected', function(data){
  putMessage('[INFO] Player #' + data.name + ' has left the Room. Reason: ' + data.reason);
  onGoing = false;
});

document.getElementById('chatinput').addEventListener('submit', function(e) {
  var input = document.getElementById('message');
  e.preventDefault();
  socket.emit('message', {user: playerid, message: input.value});
  input.value = '';
  return (false);
});

socket.on('message', function(data) {
  putMessage('[CHAT] Player #' + data.id + ': ' + data.message);
});
