'use strict';

// Code adapted from:
// https://clozeit.wordpress.com/2014/01/08/bootstrap-modals-and-popover-in-react-js/

define(['react', 'jquery'], function (React, jQuery) {
    /**
     * A React component representing the content of a modal.
     */
    var ModalContent = React.createClass({
        componentDidMount: function () {
            $(this.getDOMNode()).modal({
                background: true,
                keyboard: true,
                show: false
            });
        },

        componentWillUnmount: function () {
            $(this.getDOMNode()).off('hidden');
        },

        handleClick: function (event) {
            event.stopPropagation();
        },

        render: function () {
            return (
                <div className='modal fade' role='dialog'
                     onClick={this.handleClick}>
                     <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div class='modal-header'>{this.props.header}</div>
                            <div class='modal-body'>{this.props.body}</div>
                            <div class='modal-footer'>{this.props.footer}</div>
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
        handleClick: function (event) {
            $(this.refs.payload.getDOMNode()).modal();
        },

        render: function () {
            return (<div>
                    {this.props.trigger}
                    <ModalContent ref='payload'
                           header={this.props.header}
                           body={this.props.body}
                           footer={this.props.footer} />
            </div>);
        }
    });
});