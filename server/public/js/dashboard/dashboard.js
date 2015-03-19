'use strict';

define(['react', 'dashboard/messages/messageList'], function (React, MessageList) {
    /**
     * The main React component for the dashboard.
     */
    return React.createClass({
        displayName: 'Dashboard',

        render: function () {
            return (
                React.createElement("div", {className: "dashboard"}, 
                    React.createElement("h1", {className: "dashboard-title"}, "Dashboard"), 
                    React.createElement(MessageList, null)
                )
            );
        }
    });
});
