var io = require('socket.io').listen(15881);


io.sockets.on('connection', function (socket) {


  socket.on('message', function ( data ) {
    
    switch( data.type){
      case 'status':
          if (data.message == 'join' ) {
            socket.set('user', data.user , function () {
              io.sockets.emit( 'message', { type:'ready', user:data.user, message: 'has joined the conversation.' } );
            }); 
          } 
      break;
      case 'talk':
        socket.get( 'user', function( err, user ){           
          io.sockets.emit('message', { type: 'talk', user: user, message: data.message } );
        });
      break;
    }
    
  });
  
  socket.on('disconnect', function(  ){
    socket.get( 'user', function( err, user ){      
      socket.broadcast.emit( 'message', { type: 'disconnected', user: user, message: 'has left the conversation.' })
    });
  })
  
  
});