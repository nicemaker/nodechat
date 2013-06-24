var chat = ( function($){
    
    var socket;
    var user;
    var state;
    
    $(document).ready( function(){
        
        socket = io.connect('http   ://nodechat.nicemaker.me:15881/');
        socket.on( 'message', onUpdate );
        
        $('#nickname').submit( function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            user = $('#nickname input').first().val();
            socket.emit( 'message', { type:'status', message: 'join', user: user } );
        });
        
        
        $('.button').click( onLanguage );
        
        $('#message').keyup( function(e){
            if(e.which == 13 && !e.shiftKey){
                sendTalk( $(this).val() );
                $(this).val('')
            }
        });
        
        $(window).resize( updateDisplay );
        
        updateDisplay();
        
    } );
    
    /* incoming messages from server */
    function onUpdate( data ) {
        var translateToken = data.message;
        var preToken;
        var html= $( "<p></p>" );
        var className;
        
        switch ( data.type ) {
            case 'ready':
                preToken = data.user + ' ';
                className = 'status';
                $('#nickname').hide();
                $('#chat').show();    
            break;
            case 'disconnected':
                preToken = data.user + ' ';
                className = 'status';
            break;
            case 'disconnected':
                className = 'status';
                
            break;
            case 'talk':
                className = 'talk';
                translateToken = data.message;
                preToken = data.user + ': ';
        }
        
        html.addClass( className );
        html.append( preToken + translateToken );
         $('#english').append( html );
        
        //translate
        var transHTML = $( "<p></p>");
        transHTML.addClass( className );
        
        translate( translateToken, function( gData ){      
            transHTML.append( preToken +  gData.data.translations[0].translatedText )
            $('#french').append( transHTML );
        });
    }
    
    /* sends message to server */
    function sendTalk( val ) {
        socket.emit( 'message', { type: 'talk', user: user, message: val } );
    }
    
    /* translates token into french */
    function translate( val, callback ) {
        $.get( 'https://www.googleapis.com/language/translate/v2',{
                key:'AIzaSyCoY_uJ22vg_v9gIlh0u58398PEmrTFYFM',
                source:'en',
                target:'fr',
                q:val
            },
            callback
        );
        updateDisplay();
    }
    
    /* language button event */           
    function onLanguage( e ) {
            if( $(this).attr( 'class' ).indexOf('english') == -1 ){
               
                setState( 'translation');
            }
            else{
                $('#translations').animate( { left: 0 }, 200 );
                setState( 'default');
            }
    }
    
    
    function setState( val ){
        if ( val == undefined || val == '' || val == null )
            val = state;
        state = val;
        updateDisplay();
    }
    
    
    function updateDisplay( e ) {
        
        var h =  $(window).height();
        var chat_h =  $("#chat").height() + $("#chat").offset().top + 10;
        
 
        $(window).scrollTop(   chat_h - h );
        
        
        
        if (e){// resize event
              switch ( state ) {
                case 'translation':
                    if ($(window).width() < 480 ){
                        $('#translations').css( 'left', -$( '#french' ).parent().position().left  );
                    }
                    else
                        $('#translations').css( 'left', 0 );
                break;
                case 'default':
                    $('#translations').css( 'left', 0 );
                break;
            }
        }
        else{
            switch ( state ) {
                case 'translation':
                    if ($(window).width() < 480 ){
                        $('#translations').animate( { left: -$( '#french' ).parent().position().left }, 200 );
                        $('.button.french').hide();
                        $('.button.english').show().css( 'display','inline-block');
                    }
                break;
                case 'default':
                    $('#translations').animate( { left: 0 }, 200 );
                    $('.button.french').show();
                    $('.button.english').hide();
                break;
            }
        }
        
    }
    
    

}(jQuery));