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
    'reactBootstrap'
], function (React, jQuery, ReactBootstrap) {
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

        componentWillReceiveProps: function(nextProps) {
            var newState = {};
            jQuery.extend(newState, nextProps.data, { sent: nextProps.sent });
            this.setState(newState);
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
                <tr className='message' onClick={this.props.onClick}>
                    <td>{state.html}</td>
                    <td className='target-cell'>{state.target.format('MM-DD-YYYY HH:mm')}</td>
                    <td className='sent-cell'>
                        <OverlayTrigger placement='right'
                            overlay={<Tooltip>{sentText}</Tooltip>}>
                            {sentIcon}
                        </OverlayTrigger>
                    </td>
                </tr>
            );
        }
    });
});