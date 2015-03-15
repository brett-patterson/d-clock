'use strict';

define(['react', 'messageList'], function (React, MessageList) {
    /**
     * The main React component for the dashboard.
     */
    return React.createClass({
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
