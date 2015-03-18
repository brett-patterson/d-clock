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

define(['react', 'jquery'], function (React, jQuery) {
    /**
     * A React component representing a message. Intended for use inside of a
     * MessageList.
     */
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
            var displaySent = triStateEvaluate(this.state.sent,
                <i className='fa fa-lg fa-check-circle message-complete'></i>,
                <i className='fa fa-lg fa-dot-circle-o message-pending'></i>,
                <i className='fa fa-lg fa-question-circle message-unknown'></i>);
            return (
                <tr className='message' onClick={this.props.onClick}>
                    <td>{state.html}</td>
                    <td className='target-cell'>{state.target}</td>
                    <td className='sent-cell'>{displaySent}</td>
                </tr>
            );
        }
    });
});