'use strict';

// Code adapted from:
// https://clozeit.wordpress.com/2014/01/08/bootstrap-modals-and-popover-in-react-js/

define(['react', 'jquery', 'bootstrap'], function (React, jQuery) {
    /**
     * A React component representing the content of a modal.
     */
    var ModalContent = React.createClass({displayName: "ModalContent",
        render: function () {
            return (
                React.createElement("div", {className: "modal fade", role: "dialog", "aria-hidden": "true", 
                     id: this.props.id, onClick: this.handleClick}, 
                     React.createElement("div", {className: "modal-dialog"}, 
                        React.createElement("div", {className: "modal-content"}, 
                            React.createElement("div", {className: "modal-header"}, this.props.header), 
                            React.createElement("div", {className: "modal-body"}, this.props.body), 
                            React.createElement("div", {className: "modal-footer"}, this.props.footer)
                        )
                     )
                )
            );
        }
    });

    /**
     * A React component representing a modal dialog with trigger and content.
     */
    return React.createClass({
        getInitialState: function () {
            return {
                trigger: React.createElement("span", null),
                preRenderId: ''
            };
        },

        getDefaultProps: function () {
            return {
                header: React.createElement("span", null),
                body: React.createElement("span", null),
                footer: React.createElement("span", null),
                preRender: false
            };
        },

        getPayload: function () {
            var header, body, footer;

            if (jQuery.isFunction(this.props.header)) {
                header = this.props.header();
            } else {
                header = this.props.header;
            }

            if (jQuery.isFunction(this.props.body)) {
                body = this.props.body();
            } else {
                body = this.props.body;
            }

            if (jQuery.isFunction(this.props.footer)) {
                footer = this.props.footer();
            } else {
                footer = this.props.footer;
            }

            return React.createElement(ModalContent, {id: this.state.preRenderId, 
                                 header: header, body: body, footer: footer});
        },

        componentWillReceiveProps: function (nextProps) {
            if (nextProps.trigger) {
                var triggerClone = React.addons.cloneWithProps(
                    nextProps.trigger, {
                        onClick: this.handleClick,
                        key: nextProps.trigger.key
                });

                this.setState({
                    trigger: triggerClone
                });
            }

            if (nextProps.preRender) {
                jQuery('#' + this.state.preRenderId).remove();

                this.setState({
                    preRenderId: 'modal' + Date.now()
                }, function() {
                    jQuery(React.renderToString(this.getPayload()))
                        .appendTo(document.body);
                });
            }
        },

        handleClick: function (event) {
            var modalElement;
            
            if (this.props.preRender) {
                modalElement = jQuery('#'+this.state.preRenderId);
            } else {
                modalElement = jQuery(React.renderToString(this.getPayload()));
                modalElement.on('hidden.bs.modal', function(event) {
                    $(event.target).remove();
                });
            }

            modalElement.modal();
        },

        render: function () {
            return this.state.trigger;
        }
    });
});