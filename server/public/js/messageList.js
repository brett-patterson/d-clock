'use strict';

define(['react', 'jquery', 'dashboardSection', 'message', 'modal'],
        function (React, jQuery, DashboardSection, Message, Modal) {
    /**
     * A React component representing a list of messages.
     */
    return React.createClass({
        getInitialState: function () {
            return {
                messages: [],
                queue: [],
                error: {
                    messages: false,
                    queue: false
                }
            };
        },

        componentDidMount: function () {
            this.fetchMessages();
            this.fetchQueue();
        },

        fetchMessages: function () {
            jQuery.post('/api/messages/').done(function (result) {
                this.setState(React.addons.update(this.state, {
                    messages: { $set: result },
                    error: { $merge: { messages: false } }
                }));
            }.bind(this)).fail(function () {
                this.setState(React.addons.update(this.state, {
                    error: { $merge: { messages: true } }
                }));
            }.bind(this));
        },

        fetchQueue: function () {
            jQuery.post('/api/queue/').done(function (result) {
                this.setState(React.addons.update(this.state, {
                    queue: { $set: result },
                    error: { $merge: { queue: false } }
                }));
            }.bind(this)).fail(function () {
                this.setState(React.addons.update(this.state, {
                    error: { $merge: { queue: true } }
                }));
            }.bind(this));
        },

        newMessageHandler: function (event) {
            console.log('new message');
        },

        render: function () {
            var messageNodes = this.state.messages.map(function (message) {
                var sent;

                if (this.state.error.queue) {
                    sent = undefined;
                } else {
                    sent = true;
                    for (var i = 0; i < this.state.queue.length; i++) {
                        if (this.state.queue[i].id === message.id) {
                            sent = false;
                            break;
                        }
                    }
                }

                var messageEl = React.createElement(Message, {data: message, sent: sent});
                return React.createElement(Modal, {key: message.id, trigger: messageEl});
            }, this);

            var errorNodes = [];
            if (this.state.error.messages || this.state.error.queue) {
                if (this.state.error.messages) {
                    errorNodes.push(React.createElement("p", null, "Could not load messages."));
                }

                if (this.state.error.queue) {
                    errorNodes.push(React.createElement("p", null, "Could not load message queue."));
                }
            }

            var newMessageTrigger = (
                React.createElement("button", null, "New Message")
            );

            var newMessageTitle = React.createElement("h4", {className: "modal-title"}, "New Message")
            var newMessageBody = (React.createElement("div", null
                
            ));
            var newMessageFooter = (React.createElement("div", null, 
                React.createElement("button", {type: "button", className: "btn btn-danger", 
                        "data-dismiss": "modal"}, "Cancel"), 
                React.createElement("button", {type: "button", className: "btn btn-success", 
                        onClick: this.newMessageHandler}, "Send")
            ));

            var sectionContent = (
                React.createElement("div", null, 
                    React.createElement("div", {className: "dashboard-section-errors"}, 
                        errorNodes
                    ), 

                    React.createElement(Modal, {trigger: newMessageTrigger, 
                           header: newMessageTitle, 
                           body: newMessageBody, 
                           footer: newMessageFooter}), 

                    React.createElement("table", {className: "table message-list"}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "Content"), 
                                React.createElement("th", {className: "target-cell"}, "Target Date"), 
                                React.createElement("th", {className: "sent-cell"}, "Sent?")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            messageNodes
                        )
                    )
                )
            );

            return (React.createElement(DashboardSection, {sectionID: "messages-section", 
                                      sectionContent: sectionContent}));
        }
    });
});