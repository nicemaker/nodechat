var io = require('socket.io').listen(8080);


io.sockets.on('connection', function (socket) {

  socket.on('set nickname', function ( name ) {
    socket.set('nickname', name, function () {
      socket.emit('ready');
    });
  });

  socket.on('msg', function ( message ) {
    socket.get('nickname', function(err,name){
      io.sockets.emit('msg', name + ': ' + message);
    });
  });
  
  
});