'use strict';

define(['react', 'jquery', 'dashboardSection', 'message'],
        function (React, jQuery, DashboardSection, Message) {
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

                return (
                    React.createElement(Message, {key: message.id, data: message, sent: sent})
                );
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

            var sectionContent = (
                React.createElement("div", null, 
                    React.createElement("div", {className: "dashboard-section-errors"}, 
                        errorNodes
                    ), 
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