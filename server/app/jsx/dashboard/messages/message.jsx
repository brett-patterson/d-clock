'use strict';

/**
  * Evaluate a value that could have three possible states:
  * undefined, true, or false.
  * @param {boolean} value - The value to be evaluated
  * @param {any} truthy - The return value if `value` is truthy.
  * @param {any} falsy - The return value if `value` is falsy.
  * @param {any} undef - The return value if `value` is undefined.
  */
function triStateEvaluate(value, truthy, falsy, undef) {
    if (value === undefined) {
        return undef;
    }

    if (value) {
        return truthy;
    }

    return falsy;
}

define([
    'react',
    'jquery',
    'reactBootstrap',
    'config'
], function (React, jQuery, ReactBootstrap, Config) {
    /**
     * A React component representing a message. Intended for use inside of a
     * MessageList.
     */
    var OverlayTrigger = ReactBootstrap.OverlayTrigger;
    var Tooltip = ReactBootstrap.Tooltip;

    return React.createClass({
        displayName: 'Message',

        getInitialState: function () {
            var state = {};

            if (this.props.data !== undefined) {
                $.extend(state, this.props.data);
            }

            if (this.props.sent !== undefined) {
                state.sent = this.props.sent;
            }

            return state;
        },

        componentWillReceiveProps: function (nextProps) {
            var newState = {};
            jQuery.extend(newState, nextProps.data, { sent: nextProps.sent });
            this.setState(newState);
        },

        componentDidMount: function () {
            this.updateHtml();
        },

        componentDidUpdate: function (prevProps, prevState) {
            this.updateHtml();
        },

        updateHtml: function () {
            jQuery(this.refs.messageHtml.getDOMNode()).html(this.state.html);
        },

        render: function () {
            var state = this.state;
            var sentIcon = triStateEvaluate(this.state.sent,
                <i className='fa fa-lg fa-check-circle message-sent'></i>,
                <i className='fa fa-lg fa-dot-circle-o message-pending'></i>,
                <i className='fa fa-lg fa-question-circle message-unknown'></i>);
            var sentText = triStateEvaluate(this.state.sent,
                                            'Sent', 'Pending', 'Unknown');
            return (
                <div className='message' onClick={this.props.onClick}>
                    <div className='message-sent'>
                        <OverlayTrigger placement='right'
                            overlay={<Tooltip>{sentText}</Tooltip>}>
                            {sentIcon}
                        </OverlayTrigger>
                    </div>
                    <div className='message-html' ref='messageHtml'></div>
                    <div className='message-target'>
                        {state.target.format(Config.dateTimeDisplayFormat)}
                    </div>
                </div>
            );
        }
    });
});