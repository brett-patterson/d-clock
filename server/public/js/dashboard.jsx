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
var Dashboard = React.createClass({
    render: function () {
        return (
            <div className='dashboard'>
                <h1>Dashboard</h1>
                <MessageList />
            </div>
        );
    }
});

/**
 * A React component representing a message. Intended for use inside of a
 * MessageList.
 */
var Message = React.createClass({
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
        var displaySent = triStateEvaluate(this.state.sent, 'Sent', 'Pending', 'Unknown');
        return (
            <li>{state.html} - {displaySent}</li>
        );
    }
});


/**
 * A React component representing a list of messages.
 */
var MessageList = React.createClass({
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
                <Message key={message.id} data={message} sent={sent} />
            );
        }, this);

        var errorNodes = [];
        if (this.state.error.messages || this.state.error.queue) {
            if (this.state.error.messages) {
                errorNodes.push(<p>Could not load messages.</p>);
            }

            if (this.state.error.queue) {
                errorNodes.push(<p>Could not load message queue.</p>);
            }
        }

        return (
            <div className='messageContainer'>
                <div className='messageErrors'>
                    {errorNodes}
                </div>
                <ul className='messageList'>
                    {messageNodes}
                </ul>
            </div>
        );
    }
})

React.render(
    <Dashboard />,
    document.getElementById('dashboard')
);