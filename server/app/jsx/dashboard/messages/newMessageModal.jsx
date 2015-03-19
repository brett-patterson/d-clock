'use strict';

define(['react', 'jquery', 'reactBootstrap',
        'dashboard/messages/messageModalContent'],
    function (React, jQuery, ReactBootstrap, MessageModalContent) {

    var ModalTrigger = ReactBootstrap.ModalTrigger;
    var Button = ReactBootstrap.Button;

    /**
     * A React component representing a new message modal dialog content.
     */
    var NewMessageModalContent = React.createClass({
        displayName: 'NewMessageModalContent',

        onSend: function (event) {
            var target = this.refs.messageModal.getDateTime();
            var html = this.refs.messageModal.getHtml();

            jQuery.post('/api/add-message/', {
                message: {
                    html: html,
                    target: target.format('MM-DD-YYYY HH:mm'),
                    recurring: 1
                }
            }).done(function () {
                if (this.props.messageDelegate) {
                    this.props.messageDelegate.fetchMessages();
                }
            }.bind(this)).fail(function () {
                // TODO: Handle message creation fail
            });

            this.props.onRequestHide(event);
        },

        render: function () {
            return (
                <MessageModalContent ref='messageModal' title='New Message'
                    {...this.props}>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                    <Button bsStyle='primary' onClick={this.onSend}>Send</Button>
                </MessageModalContent>
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
            var content = <NewMessageModalContent
                            messageDelegate={this.props.messageDelegate} />;

            return (
                <ModalTrigger modal={content}>
                    <Button className='fa fa-2x fa-pencil-square-o new-message-btn pull-right' />
                </ModalTrigger>
            );
        }
    });
});