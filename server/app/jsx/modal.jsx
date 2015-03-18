'use strict';

// Code adapted from:
// https://clozeit.wordpress.com/2014/01/08/bootstrap-modals-and-popover-in-react-js/

define(['react', 'jquery', 'bootstrap'], function (React, jQuery) {
    /**
     * A React component representing the content of a modal.
     */
    var ModalContent = React.createClass({
        render: function () {
            return (
                <div className='modal fade' role='dialog' aria-hidden='true'
                     id={this.props.id} onClick={this.handleClick}>
                     <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>{this.props.header}</div>
                            <div className='modal-body'>{this.props.body}</div>
                            <div className='modal-footer'>{this.props.footer}</div>
                        </div>
                     </div>
                </div>
            );
        }
    });

    /**
     * A React component representing a modal dialog with trigger and content.
     */
    return React.createClass({
        getInitialState: function () {
            return {
                trigger: <span></span>,
                preRenderId: ''
            };
        },

        getDefaultProps: function () {
            return {
                header: <span></span>,
                body: <span></span>,
                footer: <span></span>,
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

            return <ModalContent id={this.state.preRenderId}
                                 header={header} body={body} footer={footer} />;
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