'use strict';

define([
    'react',
    'jquery',
    'reactBootstrap',
    'config',
    'loadingMixin',
    'dashboard/messages/messageModalContent'
], function (React, jQuery, ReactBootstrap, Config, LoadingMixin,
             MessageModalContent) {

    var ModalTrigger = ReactBootstrap.ModalTrigger;
    var Button = ReactBootstrap.Button;

    /**
     * A React component representing a new message modal dialog content.
     */
    var NewMessageModalContent = React.createClass({
        displayName: 'NewMessageModalContent',

        mixins: [LoadingMixin],

        onSend: function (event) {
            this.setState(React.addons.update(this.state, {
                loading: { $merge: { send: true } }
            }));

            var target = this.refs.messageModal.getDateTime();
            var html = this.refs.messageModal.getHtml();
            var recurring = this.refs.messageModal.getRecurring();

            jQuery.post('/api/add-message/', {
                message: {
                    html: html,
                    target: target.format(Config.dateTimeFormat),
                    recurring: recurring
                }
            }).done(function () {
                if (this.props.messageDelegate) {
                    this.props.messageDelegate.updateMessages(function () {
                        this.props.onRequestHide(event);
                    }.bind(this));
                }
            }.bind(this)).fail(function () {
                // TODO: Handle message creation fail
                this.props.onRequestHide(event);
            });
        },

        render: function () {
            return (
                React.createElement(MessageModalContent, React.__spread({ref: "messageModal", title: "New Message", 
                    backdrop: "static"},  this.props), 
                    React.createElement(Button, {onClick: this.props.onRequestHide}, "Close"), 
                    React.createElement(Button, {bsStyle: "primary", onClick: this.onSend}, 
                        this.getSpinner('send', 'Send')
                    )
                )
            );
        }
    });

    /**
     * A React component representing the trigger for a new message modal
     * dialog.
     */
    return React.createClass({
        displayName: 'NewMessageModal',

        render: function () {
            var content = React.createElement(NewMessageModalContent, {
                            messageDelegate: this.props.messageDelegate});

            return (
                React.createElement(ModalTrigger, {modal: content}, 
                    React.createElement(Button, {className: "fa fa-2x fa-pencil-square-o new-message-btn pull-right"})
                )
            );
        }
    });
});