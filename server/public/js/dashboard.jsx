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
                <h1 className='dashboard-title'>Dashboard</h1>
                <MessageList />
            </div>
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

    sectionTitleClicked: function (event) {
        var target = $(event.target);
        var section = $(target.attr('data-section'));

        if (target.hasClass('section-open')) {
            target.removeClass('section-open').addClass('section-closed');
            section.addClass('collapse');
        } else {
            target.removeClass('section-closed').addClass('section-open');
            section.removeClass('collapse');
        }
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
            <div className='dashboard-section'>
                <div className='dashboard-section-title-wrapper'>
                    <h2 className='dashboard-section-title section-open'
                        onClick={this.sectionTitleClicked}
                        data-section='#message-section'>Messages</h2>
                </div>
                <div className='dashboard-section-content' id='message-section'>
                    <div className='dashboard-section-errors'>
                        {errorNodes}
                    </div>
                    <table className='table message-list'>
                        <thead>
                            <tr>
                                <th>Content</th>
                                <th className='target-cell'>Target Date</th>
                                <th className='sent-cell'>Sent?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messageNodes}
                        </tbody>
                    </table>
                </div>
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
        var displaySent = triStateEvaluate(this.state.sent,
            <i className='fa fa-lg fa-check-circle message-complete'></i>,
            <i className='fa fa-lg fa-dot-circle-o message-pending'></i>,
            <i className='fa fa-lg fa-question-circle message-unknown'></i>);
        return (
            <tr className='message'>
                <td>{state.html}</td>
                <td className='target-cell'>{state.target}</td>
                <td className='sent-cell'>{displaySent}</td>
            </tr>
        );
    }
});

// Handle click events on a touch device
React.initializeTouchEvents(true);

React.render(
    <Dashboard />,
    document.getElementById('dashboard')
);