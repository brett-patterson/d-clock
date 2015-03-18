'use strict';

define(['react', 'jquery', 'reactBootstrap', 'dateTimeInput'],
    function (React, jQuery, ReactBootstrap, DateTimeInput) {

    var Modal = ReactBootstrap.Modal;
    var ModalTrigger = ReactBootstrap.ModalTrigger;
    var Button = ReactBootstrap.Button;
    var Input = ReactBootstrap.Input;

    /**
     * A React component representing a new message modal dialog content.
     */
    var NewMessageModalContent = React.createClass({
        displayName: 'NewMessageModalContent',

        onSend: function (event) {
            var target = this.refs.dateTimeInput.getValue();
            var content = this.refs.contentInput.getValue();

            jQuery.post('/api/add-message/', {
                message: {
                    html: content,
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
                <Modal {...this.props} closeButton={false} backdrop='static'
                       className='dashboard-modal' title='New Message'>

                    <div className='modal-body'>
                        <form className='form'>
                            <DateTimeInput ref='dateTimeInput' />
                            <Input ref='contentInput'
                                   type='textarea' label='Content' />
                        </form>
                    </div>

                    <div className='modal-footer'>
                        <Button onClick={this.props.onRequestHide}>Close</Button>
                        <Button bsStyle='primary' onClick={this.onSend}>Send</Button>
                    </div>

                </Modal>
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
                    <Button className='fa fa-2x fa-plus-square new-message-btn pull-right' />
                </ModalTrigger>
            );
        }
    });
});