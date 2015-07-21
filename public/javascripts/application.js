$(function() {




    var PoolMember = Backbone.Model.extend();

    var PoolMembers = Backbone.Collection.extend({

        model: PoolMember,

        url: 'task/30001/assignmentpool',


        parse: function(resp, xhr) {
            return resp.apgroup[0].member;
        }
    });



    var Event = Backbone.Model.extend();

    var Events = Backbone.Collection.extend({

        model: Event,

        url: 'community/30001/event',




        // **parse** converts a response into a list of models to be added to the
        // collection. The default implementation is just to pass it through.
        parse: function(resp, xhr) {



            function getAssignees(taskID, taskAssignees) {
                var names = "";
                taskAssignees.forEach(function(name) {
                    names += '<div style="float:left; margin-left:10px;text-align: center;"><div><img src=".\\images\\' 
                        + name.username + '.png"  height="32" width="32"></div><div>' + name.username + '</div></div>';

                    //names += '\n' + name.username;
                });
                names += '<div class="poolIcon" task-id="' + taskID * 1.0 
                    + '" style="float:left; margin-left:10px;text-align: center; color: lightgray;">' 
                    + '<div><img src=".\\images\\poolIcon.png" height="32" width="32"></div><div>pool</div></div>';
                names += '<div style="clear:both"></div>';
                return names;
            }


            var evAry = [];
            var evsC = resp.event;

            var events = {
                events: [ // put the array in the `events` property
                    {
                        title: 'event1',
                        start: '2015-05-02'
                    }, {
                        title: 'event2',
                        start: '2015-05-02',
                        end: '2015-05-04'
                    }, {
                        title: 'event3',
                        start: '2015-05-04T12:30:00',
                    }
                ],
                color: 'black', // an option!
                textColor: 'yellow' // an option!
            };



            var eventsC = {
                events: [],
                color: 'white', // an option!
                textColor: 'black' // an option!
            };

            var evsC = evsC[30001];
            var assignNames = "";

            for (var dayIdx = 0; dayIdx < evsC.length; dayIdx++) {

                assignNames = "";
                for (var taskIdx = 0; taskIdx < evsC[dayIdx].task.length; taskIdx++) {
                    var taskID = evsC[dayIdx].task[taskIdx].taskid;
                    assignNames += '<div class="taskAssignees" style="margin-top:10px;">' 
                        + getAssignees(taskID, evsC[dayIdx].task[taskIdx].assignment) + '</div>';
                }

                var newEv = {
                    title: assignNames, //'Group ' + getAssignees(evsC[dayIdx].task[0].assignment),
                    start: evsC[dayIdx].startdatetime
                };
                eventsC.events.push(newEv);




                if ($(".addtaskbtn").length === 0) {
                    var eventNm = evsC[dayIdx].eventname; //this.collection[0].eventname;
                    var times = evsC[dayIdx].startdatetime.split(' ')[1].split(':');
                    var eventTime = times[dayIdx] + ':' + times[1];

                    var tasks = evsC[dayIdx].task;


                    $('#event1_title').append('<div    style="margin-top:10px;">' + eventNm + '  ' + eventTime + '</div>');
                    $('#event1_title').append('<button class="addtaskbtn">+ new</button>');

                    for (taskid = 0; taskid < tasks.length; taskid++) {

                        $('#event1_title').append('<div class="taskname">' + '<div>' + tasks[taskid].taskname + '</div>');
                    }
                }

            }
            //$('#event1_title').   

            //Object {color: "black", textColor: "yellow", events: Array[1]}
            // eventsC.events[0]

            // Object {title: "300011", start: "2015-03-06 20:30:00"}



            //Object {events: Array[3], color: "black", textColor: "yellow"}
            //Object {title: "event1", start: "2015-05-02"}

            return eventsC; //[evAry[0]]  ;
        },
    });


    /*
    $('#calendar').fullCalendar({

        eventSources: [

            // your event source
            {
                events: [ // put the array in the `events` property
                    {
                        title  : 'event1',
                        start  : '2015-05-02'
                    },
                    {
                        title  : 'event2',
                        start  : '2015-05-02',
                        end    : '2015-05-04'
                    },
                    {
                        title  : 'event3',
                        start  : '2015-05-04T12:30:00',
                    }
                ],
                color: 'black',     // an option!
                textColor: 'yellow' // an option!
            }

            // any other event sources...

        ]

    });
        
    */




    var HelpersPoolView = Backbone.View.extend({
        
        el: "#floatDiv",
        collection: PoolMembers,
        
        initialize: function() {
            
            /*
            _.bindAll(this);

            this.helpersPoolView = new HelpersPoolView();
            */
        },

        events : {
            'click #closeHelpers' : 'closeHelpersBox'
        },
        
        closeHelpersBox: function(ev) {
            var helpersDiv = $("#floatDiv").hide();
            helpersDiv.find(".helperPoolLI").remove();
            
        },
        
        render: function() {
            // var poolID = $(jsEvent.toElement).closest(".poolIcon").attr('task-id');

            var pool = new PoolMembers();
            pool.fetch({ //EventList().fetch({
                /*
                data: {
                  from: start.getTime(),
                  to: end.getTime()
                },
                    
                One important adjustment, I had to convert the moment object to a 
                Javascript date object to get the getTime() function to work.
                data: {
                from: start.toDate().getTime(),
                to: end.toDate().getTime()
                }, //data

                */
                success: function(eventList) {
                    events = [];
                    events = _.map(eventList.models, function(event) {
                        var title = event.attributes.username;
                        var pic = event.attributes.userprofile;
                        var id = event.attributes.userid;

                        var personDiv = $("<div class='helperPoolLI' style='float:right; margin-left:8px; margin-right:8px;'>");

                        personDiv.append("<img data-id='" + id + "' src='" + pic + "'>");
                        personDiv.append("<div>" + title);
                        if (title === 'Irene')
                            personDiv.append("<div style='color: goldenrod;'>after July");
                        personDiv.draggable();
                        $("#floatDiv").append(personDiv);

                        //return newEv;
                    });
                    $("#floatDiv").show();
                }
            });

            //this.eventView.model = this.collection.get(fcEvent.id);
            //this.eventView.render();
        }
    });
                                          
                                          
    var EventsView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this);

            this.collection.bind('reset', this.addAll);
            this.collection.bind('add', this.addOne);
            this.collection.bind('change', this.change);
            this.collection.bind('destroy', this.destroy);

            this.eventView = new EventView();
        },

        render: function() {
            this.el.fullCalendar({
                header: {
                    left: 'prev,next,today',
                    center: 'title',
                    right: 'members' //WFB 'alldays,month,basicWeek,basicDay,members'
                },
                
                timeFormat: '',
                
                views: {
                    alldays: {
                        type: 'month',
                        duration: {
                            days: 30
                        },
                        hiddenDays: [],
                        buttonText: 'calender',

                        aspectRatio: 1.2,
                        fixedWeekCount: true
                    },
                    members: {
                        type: 'month',
                        duration: {
                            days: 30
                        },
                        hiddenDays: [],
                        buttonText: '<Show all members',

                        aspectRatio: 1.2,
                        fixedWeekCount: true
                    }
                },

                selectable:     true,
                selectHelper:   true,
                editable:       true,
                ignoreTimezone: false,
                
                select:      this.select,
                eventClick:  this.eventClick,
                eventDrop:   this.eventDropOrResize,
                eventResize: this.eventDropOrResize,

                hiddenDays:     [0, 1, 2, 3, 4, 6],
                aspectRatio:    6.5,
                fixedWeekCount: false,
                


                eventSources: [ {// your event source
                        events: function(start, end, timezone, callback) {
                            var newEvents = new Events();
                            newEvents.fetch({ //EventList().fetch({
                                /*
                                data: {
                                  from: start.getTime(),
                                  to: end.getTime()
                                },
                                */
                                success: function(eventList) {
                                    events = []
                                    events = _.map(eventList.models, function(event) {
                                        var newEv = {
                                            title: event.get("title"),
                                            start: new Date(event.get("start")),
                                            //end: new Date(event.get("end")),
                                            //url: event.get("url")
                                        };
                                        newEv.title = event.attributes.events[0].title;
                                        newEv.start = event.attributes.events[0].start;
                                        return newEv;
                                    });

                                    events[0].start = "2015-07-03 20:30:00";
                                    callback(events);


                                    //$('.poolIcon').click( function(){alert(event)} );
                                }
                            })
                        },
                        color:     'white',
                        textColor: 'black'
                    }]  //eventSources
            });

            /*
            renderCalendar: ->
                  @.$("#calendar").fullCalendar({
                    header: {
                      left: 'prev,next today'
                      center: 'title'
                      right: 'month,basicWeek,basicDay'
                    }
                    allDayDefault: false
                    editable: false
                    events: (start, end, callback) ->
                      new EventList().fetch({
                        data: {
                          from: start.getTime()
                          to: end.getTime()
                        }
                        success: (eventList) ->
                          events = []
                          events = _.map(eventList.models, (event) -> {
                            title: event.get("title")
                            start: new Date(event.get("start"))
                            end: new Date(event.get("end"))
                            url: event.get("url")
                          })
                          callback(events)
                      })
                  })
            */



        },
        
        addAll: function() {
            //WFB this.el.fullCalendar('addEventSource', this.collection.toJSON())
            // CHANGED TO USE EVENT FUNCTION this.el.fullCalendar('addEventSource', this.collection.toJSON()[0]);
        },
        
        addOne: function(event) {
            this.el.fullCalendar('renderEvent', event.toJSON());
        },
        
        select: function(startDate, endDate) {
            this.eventView.collection = this.collection;
            this.eventView.model = new Event({
                start: startDate,
                end: endDate
            });
            this.eventView.render();
        },


        eventClick: function(fcEvent, jsEvent, view) {
            var helpersPoolView = new HelpersPoolView( {'poolID' : $(jsEvent.toElement).closest(".poolIcon").attr('task-id')} );
            helpersPoolView.render();
        },
            
        change: function(event) {
            // Look up the underlying event in the calendar and update its details from the model
            var fcEvent = this.el.fullCalendar('clientEvents', event.get('id'))[0];
            fcEvent.title = event.get('title');
            fcEvent.color = event.get('color');
            this.el.fullCalendar('updateEvent', fcEvent);
        },
        eventDropOrResize: function(fcEvent) {
            // Lookup the model that has the ID of the event and update its attributes
            this.collection.get(fcEvent.id).save({
                start: fcEvent.start,
                end: fcEvent.end
            });
        },
        destroy: function(event) {
            this.el.fullCalendar('removeEvents', event.id);
        }
    });




    var EventView = Backbone.View.extend({
        el: $('#eventDialog'),
        initialize: function() {
            _.bindAll(this);
        },
        render: function() {
            var buttons = {
                'Ok': this.save
            };
            if (!this.model.isNew()) {
                _.extend(buttons, {
                    'Delete': this.destroy
                });
            }
            _.extend(buttons, {
                'Cancel': this.close
            });

            this.el.dialog({
                modal: true,
                title: (this.model.isNew() ? 'New' : 'Edit') + ' Event',
                buttons: buttons,
                open: this.open
            });

            return this;
        },
        open: function() {
            this.$('#title').val(this.model.get('title'));
            this.$('#color').val(this.model.get('color'));
        },
        save: function() {
            this.model.set({
                'title': this.$('#title').val(),
                'color': this.$('#color').val()
            });

            if (this.model.isNew()) {
                this.collection.create(this.model, {
                    success: this.close
                });
            } else {
                this.model.save({}, {
                    success: this.close
                });
            }
        },
        close: function() {
            this.el.dialog('close');
        },
        destroy: function() {
            this.model.destroy({
                success: this.close
            });
        }
    });


    var events = new Events();
    new EventsView({
        el: $("#calendar"),
        collection: events
    }).render();
    //events.fetch();

    var userListView = new UserListView();
    var userEditView = new UserEditView();
    
    userListView.render();
    
    var communityListView = new CommunityListView();
    communityListView.render();

});