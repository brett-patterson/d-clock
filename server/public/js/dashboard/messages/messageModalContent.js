'use strict';

define([
    'react',
    'reactBootstrap',
    'config',
    'dateTimeInput',
    'editor',
    'dashboard/messages/recurringSelector'
], function (React, ReactBootstrap, Config, DateTimeInput, Editor,
             RecurringSelector) {

    var Modal = ReactBootstrap.Modal;
    var Input = ReactBootstrap.Input;

    /**
     * A React component representing a new message modal dialog content.
     */
    return React.createClass({
        displayName: 'MessageModalContent',

        componentDidMount: function () {
            if (!this.props.message) {
                // Configure for a new message
                this.setRecurring(Config.recurring.once);
                return;
            }

            if (this.props.message.html) {
                this.setHtml(this.props.message.html);
            }

            if (this.props.message.target) {
                this.setDateTime(this.props.message.target);
            }

            if (this.props.message.recurring) {
                this.setRecurring(this.props.message.recurring);
            }
        },

        setHtml: function (html) {
            if (this.refs.htmlInput) {
                this.refs.htmlInput.setValue(html);
            }
        },

        getHtml: function () {
            if (this.refs.htmlInput) {
                return this.refs.htmlInput.getValue();
            }

            return undefined;
        },

        setDateTime: function (dateTime) {
            if (this.refs.dateTimeInput) {
                this.refs.dateTimeInput.setValue(dateTime);
            }
        },

        getDateTime: function () {
            if (this.refs.dateTimeInput) {
                return this.refs.dateTimeInput.getValue();
            }

            return undefined;
        },

        setRecurring: function (recurring) {
            if (this.refs.recurringInput) {
                this.refs.recurringInput.setValue(recurring);
            }
        },

        getRecurring: function () {
            console.log(this.refs.recurringInput.getValue());
            if (this.refs.recurringInput) {
                return this.refs.recurringInput.getValue();
            }

            return undefined;
        },

        render: function () {
            return (
                React.createElement(Modal, React.__spread({},  this.props, {closeButton: false, 
                       className: "dashboard-modal"}), 

                    React.createElement("div", {className: "modal-body"}, 
                        React.createElement("form", {className: "form"}, 
                            React.createElement(DateTimeInput, {ref: "dateTimeInput"}), 
                            React.createElement(RecurringSelector, {ref: "recurringInput"}), 
                            React.createElement(Editor, {ref: "htmlInput"})
                        )
                    ), 

                    React.createElement("div", {className: "modal-footer"}, 
                        this.props.children
                    )

                )
            );
        }
    });
});