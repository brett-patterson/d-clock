'use strict';

define([
    'react',
    'reactBootstrap',
    'moment',
    'config',
    'dashboard/dashboardSection',
    'dashboard/messages/editMessageModal',
    'dashboard/messages/newMessageModal'
], function (React, ReactBootstrap, Moment, Config, DashboardSection,
             EditMessageModal, NewMessageModal) {
    /**
     * A React component representing a list of messages.
     */
    return React.createClass({
        displayName: 'MessageList',

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
            this.updateMessages();
        },

        updateMessages: function (callback) {
            if (callback === undefined) {
                callback = function () {};
            }
            this.fetchQueue(this.fetchMessages(callback));
        },

        fetchMessages: function (callback) {
            jQuery.post('/api/messages/').done(function (result) {
                var messages = result.map(function (message) {
                    message.target = Moment(message.target, Config.dateTimeFormat);
                    message.recurring = parseInt(message.recurring);
                    return message;
                });
                this.setState(React.addons.update(this.state, {
                    messages: { $set: messages },
                    error: { $merge: { messages: false } }
                }), callback);
            }.bind(this)).fail(function () {
                this.setState(React.addons.update(this.state, {
                    error: { $merge: { messages: true } }
                }), callback);
            }.bind(this));
        },

        fetchQueue: function (callback) {
            jQuery.post('/api/queue/').done(function (result) {
                this.setState(React.addons.update(this.state, {
                    queue: { $set: result },
                    error: { $merge: { queue: false } }
                }), callback);
            }.bind(this)).fail(function () {
                this.setState(React.addons.update(this.state, {
                    error: { $merge: { queue: true } }
                }), callback);
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

                return <EditMessageModal key={message.id} message={message}
                                         sent={sent} messageDelegate={this} />;
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

            var sectionContent = (
                <div>
                    <div className='dashboard-section-errors'>
                        {errorNodes}
                    </div>

                    <NewMessageModal messageDelegate={this} />

                    <div className='message-list'>
                        {messageNodes}
                    </div>
                </div>
            );

            return (<DashboardSection sectionContent={sectionContent} />);
        }
    });
});