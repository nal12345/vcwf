

     




//////////////////////////////////
    var DEBUG = true;
    var username;
    var cache = null;
    var kik_user;
    var timer;
    var page = 0;
    var refresh_flag = false;
    var lock = false;



setTimeout(function() {init();}, 1000);        
//setTimeout(function() {_create_list(getTestData(), page);}, 1000);   

function init(){
    console.log('init ');
    setUserName();
    _get_users('');
}    


function setUserName(){
    try{

            kik.getUser(function (user) {
            if ( !user ) {
                // user denied access to their information
            } else {
                //typeof user.username; // 'string'
                //typeof user.fullName; // 'string'
                //typeof user.firstName; // 'string'
                //typeof user.lastName; // 'string'
                //typeof user.pic; // 'string'
                //typeof user.thumbnail; // 'string'

                username = user.username;
            }
            });

        }catch(e){
            console.log('failed to retrieve kik user data ' + e);
        }    

    console.log('setUserName '+username);
}


function onUserSelected(userid){
    console.log('onUserSelected '+userid);
    sendInvite(userid);
    //openVideoSharingApp(userid);
}


function openVideoSharingApp(userid){
    console.log('openVideoSharingApp '+userid);
    var videoShareURL = 'http://videochatlive.igame5.com';
    try{
            kik.picker(
                videoShareURL,
                { mediaURL : 'request data' },
                function (response) {
                    // do something with the picked data!
                    console.log('openVideoSharingApp '+'mediaURL : '+mURL);
                    sendInvite(userid,mURL);
                }
            );

    }catch(e){
        console.log('failed to open picker ' + e);
    }   

}    

function sendInvite(userid,mURL){
    var sndr = username;
    var recipient = userid;

    console.log('sendInvite from '+sndr+' to: '+recipient+' mediaURL : '+mURL);

    try{
        kik.send(userid, {
        title : sndr+' has invited you to a video chat.' ,
        text : 'Video Chat now with '+sndr,
        pic       : 'http://cdn.kik.com/user/pic/'+sndr ,
        data      : { sender : sndr , mediaURL : mURL }
        });

    }catch(e){
        console.log('failed to kik send ' + e);
    }    
}


function checkInviteOpen(){
    // recipient opens invite from sender
    try{
        if (kik.message) {
        console.log('kik.message ' + kik.message.sender);
        console.log('Congrats!' + kik.message.sender + 'sent you a video! Heres the URL!');
        kik.openConversation(kik.message.sender);
        // your webpage was launched from a message
        // kik.message is exactly what was provided in kik.send
        // in this case: { some 'json' }
        }
    }catch(e){
        console.log('failed to kik message ' + e);
    }
}

//////////////////////////////////
// Get Users
//////////////////////////////////
    var _get_users = function(username, page_start, user, search_term) {
        //var usersURL = 'testdata.txt';
        var usersURL = 'http://54.186.79.235:8081/api/users.html';
        console.log('_get_users : '+usersURL);
        if(!navigator.onLine) return;
        console.log(lock + ' khoa page: ' + page );
        if(lock == true) {console.log('lock');return};
        lock = true;

        if (search_term == '') {
            page = 0;
            page_start = 0;
        }
        
        if(typeof(user) == 'undefined') {
            user = '';
        }
        
        var custom = false;
        //check if start page is set, if not, use current page
        var start = page;
        if(typeof(page_start) != 'undefined' ) {
            start = page_start;
            custom = true;
        }

        var post_data = { username: username, page: start, userdata:user}

        if (search_term !== undefined) {
            post_data['search'] = search_term;
        }

        $.ajax({
                type:'GET',
                async:   'false',
                url:usersURL,
                timeout: 9000,
                data: post_data,
                success: function(remoteData){
                    //cache = remoteData;
                    console.log('success');
                    if (search_term !== undefined) page = 1;
                    _create_list(remoteData, page);
                    var app_list = $('#app-list');

                    if(custom == true) {
                        setTimeout(function(){$('#refresh_text').css('display','none');}, 50);
                    }

                    
                    $('ul#app-list li.userblock.new').each(function(i) {
                            var that = $(this);
                            that.removeClass('new');
                            $(that).mousedown(function(){$(this).addClass('active')}).mouseup(function(){$(this).removeClass('active');});
                        });
                    

                    if(page <=1) {
                        app_list.off('click');
                        app_list.on('click', function(e){
                                if (e.target.classname == "search-header") { 
                                    return;
                                }

                                if (e.target.className == "tags-promo") {
                                    if ($('li.self').length > 0) {
                                        $('li.self')[0].click();
                                    }
                                    return;
                                }

                                if(e.target.className == 'removeme' || e.target.className == 'remove_img') {
                                    _confirm(e,username);
                                    return;
                                }

                                if (e.target.className == "remove-notice") { 
                                    $('#addtags').hide();
                                    return;
                                }

                                if (e.target.className == 'tagme' || e.target.className == 'notags') {
                                    edit_profile(post_data);
                                    return;
                                }

                                var id = $(e.target).closest('li.userblock')[0].id;
                                if ($('#' + id).hasClass('self')) {
                                    edit_profile(post_data);
                                    return;
                                } else {
                                    console.log('clicked user '+id);
                                    onUserSelected(id);
                                    //cards.kik.showProfile(id);
                                }
                                
                                return;
                            });
                    }

                },
                error: function(xhr, type){
                    if(type == 'timeout') {
                        var code;
                        if(page == 1) {
                            code = 'loading-timeout'
                            console.log('error: '+code);
                            //ga('send', 'event', 'error', 'get_user', code);
                        }
                    } else {
                        console.log('error: '+type);
                        //ga('send', 'event', 'error', 'get_user', 'unknown');
                    }    
                }
            });

        page++;
    }



//////////////////////////////////
// Create List
//////////////////////////////////
        var _create_list = function(remoteData,page) {
        console.log('_create_list');
        if(!navigator.onLine) return;
        $('#loading').remove();
        if(page<=1){
            $('ul#app-list').children().remove();
            $('ul#app-list').append(remoteData);

            if(navigator.onLine){
                $('.app-content').scroll(function () {
                        if ($(this).scrollTop() + $(this).height() >= this.scrollHeight - 100) {
                            setTimeout(function() {_get_users('');}, 100);
                        }
                    });
            }

        }else{
            $('ul#app-list').find('.bottom-margin').remove();
            
            //they refreshed by scrolling down.. add new entries to top instead bottom
            if(refresh_flag == true) {
                $('ul#app-list').prepend(remoteData);
                refresh_flag = false;
            }else{
                $('ul#app-list').append(remoteData);
            }
        }

        
        //go over each element
        var children = $('ul#app-list').children();
        var ids ={};
        for ( var i = 0, len = children.length; i < len; i++ ) {
            var id = children[ i ].id;
            //was this id previously seen?
            if ( ids.hasOwnProperty(id) ) {
                $( children[i] ).remove();
            }
            //a brand new id was discovered!
            else {
                ids[ id ] = true;
            }
        }
        lock = false;
    }



