


window.JST['participants/panel'] = _.template(

'        <div id= "search">'
+ '            <input id = "email" name="email" placeholder="Enter user e-mail" type="text" style="margin-top:8px"><br>'
+ '            <p id="emaildiv" style="color:red; display:none" >Email Format is not correct!</p>'
+ '            <button id ="searchForMember" >Search</button>'
+ '        </div> '

+ '        <div id="edit-user-form" style="display:none">'
+ '            <p>The email you searched is not yet registered with CSchedule.</p>'
+ '            <p>Please enter their contact info to invote them to register:</p>'
+ '            <label>Name</label>		'
+ '            <input id = "inputName" placeholder="Required" name="name" type="text" value="">'
+ '            <br />'
+ '            <p id="nameDiv" style="display:none;color:red">Name is necessary!</p>'
+ '            <label>Email</label>'
+ '            <input id = "inputEmail" value ="" placeholder="Required" name="email" type="text" value="">'
+ '            <br />'
+ '            <p id="inputEmailFormat" style="display:none;color:red">Email Format is not correct!</p>'
+ '            <label>Mobile</label>'
+ '            <input id = "inputMobile" placeholder="Optional" name="mobile" type="text" value="">'
+ '            <hr />		'
+ '            <button id ="addMember" >Add</button>'
+ '            <button id ="cancelAddMember" >Cancel</button>'
+ '        </div>'


+ '        <div id="display-user-form">'
+ '            <% _.each(participants, function(participant) { %>'
+ '            <ul >'
+ '            <li data-id=<%= participant.id%> data-email=<%= htmlEncode(participant.get("email")) %> data-name=<%= htmlEncode(participant.get(\'name\')) %>	 class="participant"> 	'
+ '            <img src = "<%= participant.get(\'profile\') %>">  <%= htmlEncode(participant.get(\'name\')) %>			'		
+ '            </li>'
+ '            </ul>'
+ '            <% }); %>  '
+ '        </div>   '
);



var ParticipantsListView = Backbone.View.extend({
    el: '.MemberList',
	events:{
		'dblclick .participant'   : 'showDetails',
		'click .participant':'messageBox'
	},
	
	
	messageBox:function(ev){
		var participant =$(ev.target).closest('li');
		var id = $(participant[0]).data('id');
		var name = $(participant[0]).data('name');
		//$('#messageDialog').attr("title", "Chat with " + name);	
		

			
		var dialogView = new DialogView();
        
		dialogView.render(id,name);
		$('#messageDialog').dialog({
          title: "Chat with " + name
        });
		
		
		getNonce()

      // Use the nonce to get an identity token
      .then(function(nonce) {
          return getIdentityToken(nonce);
      })

      // Use the identity token to get a session
      .then(function(identityToken) {
          return getSession(identityToken);
      })

      // Store the sessionToken so we can use it in the header for our requests
      .then(function(sessionToken) {
          layersample.headers.Authorization =
              'Layer session-token="' + sessionToken + '"';

          // Now we can do stuff, like get a list of conversations
          return getConversations();
      })

      .then(function(conversations){
        return createConversation(["123",id]);     
      })

      .then(function(conversation) {
        layersample.conversationUrl = conversation.url;
     
      });
		
		
		
		
		
		
		
	},
	
	
	showDetails:function(ev){
		var participant =$(ev.target).closest('li');
		var email = $(participant[0]).data('email'); 		
		var participantView = new ParticipantView();
		participantView.render(email);
		$('#participantDialog').dialog();
        //ev.preventDefault();
	},
		
	
    render: function () {
        var that = this;
        gParticipants = new Participants();
        gParticipants.fetch({
            success: function (gParticipants) {
                //var template = _.template($('#user-list-template').html());    
                var template = JST['participants/panel']({participants: gParticipants.models});
                //$(".MemberList").html(template({participants: gParticipants.models}));
                $(".MemberList").html(template);
				//WFB must fix $('.participant').draggable();
                $("#ParticipantDiv").css("display", "block");
            }
        })
    }
});

