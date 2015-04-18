'use strict';

define([
    'react',
    'reactBootstrap',
    'config',
    'loadingMixin',
    'dashboard/messages/messageModalContent',
    'dashboard/messages/message'
], function (React, ReactBootstrap, Config, LoadingMixin, MessageModalContent,
             Message) {

    var ModalTrigger = ReactBootstrap.ModalTrigger;
    var Button = ReactBootstrap.Button;

    /**
     * A React component representing a new message modal dialog content.
     */
    var EditMessageModalContent = React.createClass({
        displayName: 'EditMessageModalContent',

        mixins: [LoadingMixin],

        onSave: function (event) {
            var target = this.refs.messageModal.getDateTime();
            var html = this.refs.messageModal.getHtml();
            var recurring = this.refs.messageModal.getRecurring();

            this.setState(React.addons.update(this.state, {
                loading: { $merge: { save: true } }
            }));

            jQuery.post('/api/update-message/', {
                message: {
                    id: this.props.message.id,
                    html: html,
                    recurring: recurring,
                    target: target.format(Config.dateTimeFormat)
                }
            }).done(function () {
                if (this.props.messageDelegate) {
                    this.props.messageDelegate.updateMessages(function () {
                        this.props.onRequestHide(event);
                    }.bind(this));
                }
            }.bind(this)).fail(function () {
                // TODO: Handle message update fail
                this.props.onRequestHide(event);
            });
        },

        onDelete: function (event) {
            this.setState(React.addons.update(this.state, {
                loading: { $merge: { delete: true } }
            }));

            jQuery.post('/api/remove-message/', {
                message: {
                    id: this.props.message.id,
                    html: this.props.message.html,
                    recurring: this.props.message.recurring,
                    target: this.props.message.target.format(Config.dateTimeFormat)
                }
            }).done(function () {
                if (this.props.messageDelegate) {
                    this.props.messageDelegate.updateMessages(function () {
                        this.props.onRequestHide(event);
                    }.bind(this));
                }
            }.bind(this)).fail(function () {
                // TODO: Handle message deletion fail
                this.props.onRequestHide(event);
            });
        },

        render: function () {
            return (
                React.createElement(MessageModalContent, React.__spread({ref: "messageModal", title: "Edit Message", 
                    message: this.props.message}, 
                    this.props), 
                    React.createElement(Button, {bsStyle: "danger", onClick: this.onDelete, 
                        className: "pull-left"}, 
                            this.getSpinner('delete', 'Delete')
                    ), 
                    React.createElement(Button, {onClick: this.props.onRequestHide}, "Close"), 
                    React.createElement(Button, {bsStyle: "primary", onClick: this.onSave}, 
                        this.getSpinner('save', 'Save')
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