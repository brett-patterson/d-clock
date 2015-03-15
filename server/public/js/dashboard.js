'use strict';

/**
 * Evaluate a value that could have three possible states:
 * undefined, true, or false.
 * @param {boolean} value - The value to be evaluated
 * @param {any} truthy - The return value if `value` is truthy.
 * @param {any} falsy - The return value if `value` is falsy.
 * @param {any} undef - The return value if `value` is undefined.
 */
function triStateEvaluate(value, truthy, falsy, undef) {
    if (value === undefined) {
        return undef;
    } else if (value) {
        return truthy;
    } else {
        return falsy;
    }
}

/**
 * The main React component for the dashboard.
 */
var Dashboard = React.createClass({displayName: "Dashboard",
    render: function () {
        return (
            React.createElement("div", {className: "dashboard"}, 
                React.createElement("h1", {className: "dashboard-title"}, "Dashboard"), 
                React.createElement(MessageList, null)
            )
        );
    }
});

/**
 * A React component representing a section in the dashboard.
 */
var DashboardSection = React.createClass({displayName: "DashboardSection",
    sectionTitleClicked: function (event) {
        var target = $(event.target);
        var section = $('#' + this.props.sectionID);

        if (target.hasClass('section-open')) {
            target.removeClass('section-open').addClass('section-closed');
            section.addClass('collapse');
        } else {
            target.removeClass('section-closed').addClass('section-open');
            section.removeClass('collapse');
        }
    },

    render: function () {
        return (
            React.createElement("div", {className: "dashboard-section"}, 
                React.createElement("div", {className: "dashboard-section-title-wrapper"}, 
                    React.createElement("h2", {className: "dashboard-section-title section-open", 
                        onClick: this.sectionTitleClicked, 
                        "data-section": this.props.sectionID}, "Messages")
                ), 
                React.createElement("div", {className: "dashboard-section-content", 
                     id: this.props.sectionID}, 
                    this.props.sectionContent
                )
            )
        );
    }
});

/**
 * A React component representing a list of messages.
 */
var MessageList = React.createClass({displayName: "MessageList",
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
        $.post('/api/messages/').done(function (result) {
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
        $.post('/api/queue/').done(function (result) {
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

/**
 * A React component representing a message. Intended for use inside of a
 * MessageList.
 */
var Message = React.createClass({displayName: "Message",
    getInitialState: function () {
        var state = {};

        if (this.props.data !== undefined) {
            $.extend(state, this.props.data);
        }

        if (this.props.sent !== undefined) {
            state.sent = this.props.sent;
        }

        return state;
    },

    componentWillReceiveProps: function(nextProps) {
        var newState = {};
        $.extend(newState, nextProps.data, { sent: nextProps.sent });
        this.setState(newState);
    },

    render: function () {
        var state = this.state;
        var displaySent = triStateEvaluate(this.state.sent,
            React.createElement("i", {className: "fa fa-lg fa-check-circle message-complete"}),
            React.createElement("i", {className: "fa fa-lg fa-dot-circle-o message-pending"}),
            React.createElement("i", {className: "fa fa-lg fa-question-circle message-unknown"}));
        return (
            React.createElement("tr", {className: "message"}, 
                React.createElement("td", null, state.html), 
                React.createElement("td", {className: "target-cell"}, state.target), 
                React.createElement("td", {className: "sent-cell"}, displaySent)
            )
        );
    }
});

// Handle click events on a touch device
React.initializeTouchEvents(true);

React.render(
    React.createElement(Dashboard, null),
    document.getElementById('dashboard')
);