'use strict';

define([
    'react',
    'dateTimePicker'
], function (React) {

    /**
     * A React component representing a date/time input.
     */
    return React.createClass({
        displayName: 'DateTimeInput',

        getValue: function () {
            if (this.refs.picker) {
                return jQuery(this.refs.picker.getDOMNode())
                    .data('DateTimePicker').date();
            }

            return undefined;
        },

        setValue: function (value) {
            if (this.refs.picker) {
                jQuery(this.refs.picker.getDOMNode())
                    .data('DateTimePicker').date(value);
            }
        },

        componentDidMount: function () {
            jQuery(this.refs.picker.getDOMNode()).datetimepicker({
                inline: true,
                sideBySide: true
            });
        },

        render: function () {
            return (
                <div ref='picker'></div>
            );
        }
    });
});
