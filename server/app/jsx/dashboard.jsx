'use strict';

define(['react', 'messageList'], function (React, MessageList) {
    /**
     * The main React component for the dashboard.
     */
    return React.createClass({
        render: function () {
            return (
                <div className='dashboard'>
                    <h1 className='dashboard-title'>Dashboard</h1>
                    <MessageList />
                </div>
            );
        }
    });
});
