'use strict';

define([
    'react',
    'jquery',
    'reactBootstrap',
    'dashboard/messages/messageModalContent',
    'dashboard/messages/message'
], function (React, jQuery, ReactBootstrap, MessageModalContent, Message) {

    var ModalTrigger = ReactBootstrap.ModalTrigger;
    var Button = ReactBootstrap.Button;

    /**
     * A React component representing a new message modal dialog content.
     */
    var EditMessageModalContent = React.createClass({
        displayName: 'EditMessageModalContent',

        onSave: function (event) {
            var target = this.refs.messageModal.getDateTime();
            var html = this.refs.messageModal.getHtml();

            // TODO: Implement saving of edited messages

            this.props.onRequestHide(event);
        },

        onDelete: function (event) {
            jQuery.post('/api/remove-message', {
                message: {
                    id: this.props.message.id,
                    html: this.props.message.html,
                    recurring: this.props.message.recurring,
                    target: this.props.message.target.format('MM-DD-YYYY HH:mm')
                }
            }).done(function () {
                if (this.props.messageDelegate) {
                    this.props.messageDelegate.updateMessages();
                }
            }.bind(this)).fail(function () {
                // TODO: Handle message deletion fail
            });

            this.props.onRequestHide(event);
        },

        render: function () {
            return (
                React.createElement(MessageModalContent, React.__spread({ref: "messageModal", title: "Edit Message", 
                    html: this.props.message.html, 
                    target: this.props.message.target}, 
                    this.props), 
                    React.createElement(Button, {bsStyle: "danger", onClick: this.onDelete, 
                            className: "pull-left"}, "Delete"), 
                    React.createElement(Button, {onClick: this.props.onRequestHide}, "Close"), 
                    React.createElement(Button, {bsStyle: "primary", onClick: this.onSave}, "Save")
                )
            );
        }
    });

    /**
     * A React component representing the trigger for a new message modal
     * dialog.
     */
    return React.createClass({
        displayName: 'EditMessageModal',

        getDefaultProps: function () {
            return {
                message: {}
            };
        },

        render: function () {
            var content = React.createElement(EditMessageModalContent, {message: this.props.message, 
                            messageDelegate: this.props.messageDelegate});

            return (
                React.createElement(ModalTrigger, {modal: content}, 
                    React.createElement(Message, {data: this.props.message, sent: this.props.sent})
                )
            );
        }
    });
});