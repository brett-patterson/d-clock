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

            var sectionContent = (
                <div>
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
            );

            return (<DashboardSection sectionID='messages-section'
                                      sectionContent={sectionContent} />);
        }
    });
});