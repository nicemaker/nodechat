var chat = ( function($){
    
    var socket;

    $(document).ready( function(){
        
        socket = io.connect('http://127.0.0.1:8080');
        
        $('#nickname').submit( function(e){
            e.preventDefault();
            var name = $('#nickname input').first().val();
            
            socket.on( 'ready', function( data){
                $('#nickname').hide();
                $('#chat').show();
                socket.on('msg', function (data) {
                    $('#english').append( '<p>' + data + '</p>' );
                    translate( data ) 
                });
            });   
            socket.emit('set nickname', name );
        });
        
        $('#message').keyup( function(e){
            if(e.which == 13 && !e.shiftKey){
                sendMessage( $(this).val() );
                $(this).val('')
            }
        });        
        
    } );
    
    
    function updateDisplay() {
        $(window).scrollTop(  $(window).height() );
    }
    
    
    function sendMessage( val ) {
        socket.emit('msg', val );
    }
    
    function translate( val ) {
        $.get( 'https://www.googleapis.com/language/translate/v2',{
                key:'AIzaSyCoY_uJ22vg_v9gIlh0u58398PEmrTFYFM',
                source:'en',
                target:'fr',
                q:val
            },
            function( googleTrans ){
               $('#french').append( '<p>' + googleTrans.data.translations[0].translatedText + '</p>' );
            }
        );
        updateDisplay();
    }
    
}(jQuery));