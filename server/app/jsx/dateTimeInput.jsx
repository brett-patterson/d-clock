'use strict';

define(['react', 'jquery', 'reactBootstrap', 'dateTimePicker'],
    function (React, jQuery, ReactBootstrap) {
    var Input = ReactBootstrap.Input;

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
