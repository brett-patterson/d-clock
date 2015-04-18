'use strict';

define([
    'react',
    'reactBootstrap',
    'config'
], function (React, ReactBootstrap, Config) {
    var ButtonGroup = ReactBootstrap.ButtonGroup;

    var RadioButton = React.createClass({
        displayName: 'RadioButton',

        render: function () {
            return (
                <label className='btn btn-default' onClick={this.props.onClick}>
                    <input type='radio' value={this.props.value} />
                    {this.props.label}
                </label>
            );
        }
    });

    /**
     * A React component representing a radio selector for the different
     * types of recurring messages.
     */
    return React.createClass({
        displayName: 'RecurringSelector',

        getInitialState: function () {
            return {
                current: undefined
            };
        },

        getValue: function () {
            return this.state.current;
        },

        setValue: function (value) {
            var key = undefined;
            jQuery.each(Config.recurring, function (rKey, rValue) {
                if (rValue === value) {
                    key = rKey;
                }
            });

            if (this.refs[key]) {
                var radioButton = this.refs[key].getDOMNode();
                $(radioButton).addClass('active');
            }
        },

        buttonClicked: function (event) {
            this.setState({
                current: parseInt($('input', event.currentTarget).val())
            });
        },

        render: function () {
            var buttons = jQuery.map(Config.recurring, function (value, key) {
                var text = key.charAt(0).toUpperCase() + key.slice(1);
                return <RadioButton value={value} key={key} ref={key}
                                    label={text} onClick={this.buttonClicked} />;
            }.bind(this));

            return (
                <div className='recurring-container'>
                    <ButtonGroup data-toggle='buttons' ref='buttonGroup'>
                        {buttons}
                    </ButtonGroup>
                </div>
            );
        }
    });
});
