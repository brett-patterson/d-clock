'use strict';

define([
    'react',
    'jquery',
    'reactBootstrap',
    'config',
    'dashboard/messages/messageModalContent',
    'dashboard/messages/message'
], function (React, jQuery, ReactBootstrap, Config, MessageModalContent, Message) {

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

            jQuery(this.refs.saveButton.getDOMNode())
                .html('<i class="fa fa-spinner fa-pulse"></i>');

            jQuery.post('/api/update-message/', {
                message: {
                    id: this.props.message.id,
                    html: html,
                    recurring: this.props.message.recurring,
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
            jQuery(this.refs.deleteButton.getDOMNode())
                .html('<i class="fa fa-spinner fa-pulse"></i>');

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
                <MessageModalContent ref='messageModal' title='Edit Message'
                    html={this.props.message.html}
                    target={this.props.message.target}
                    {...this.props}>
                    <Button bsStyle='danger' ref='deleteButton'
                            onClick={this.onDelete} className='pull-left'>
                            Delete
                    </Button>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                    <Button bsStyle='primary' ref='saveButton'
                            onClick={this.onSave}>Save</Button>
                </MessageModalContent>
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
            var content = <EditMessageModalContent message={this.props.message}
                            messageDelegate={this.props.messageDelegate} />;

            return (
                <ModalTrigger modal={content}>
                    <Message data={this.props.message} sent={this.props.sent} />
                </ModalTrigger>
            );
        }
    });
});