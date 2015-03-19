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
                React.createElement(Modal, React.__spread({},  this.props, {closeButton: false, backdrop: "static", 
                       className: "dashboard-modal", title: "Edit Message"}), 

                    React.createElement("div", {className: "modal-body"}, 
                        React.createElement("form", {className: "form"}, 
                            React.createElement(DateTimeInput, {ref: "dateTimeInput"}), 
                            React.createElement(Input, {ref: "contentInput", 
                                   type: "textarea", label: "Content"})
                        )
                    ), 

                    React.createElement("div", {className: "modal-footer"}, 
                        React.createElement(Button, {onClick: this.props.onRequestHide}, "Close"), 
                        React.createElement(Button, {bsStyle: "primary", onClick: this.onSave}, "Save")
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