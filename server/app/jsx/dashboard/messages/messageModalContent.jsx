'use strict';

define([
    'react',
    'reactBootstrap',
    'dateTimeInput',
    'editor'
], function (React, ReactBootstrap, DateTimeInput, Editor) {

    var Modal = ReactBootstrap.Modal;
    var Input = ReactBootstrap.Input;

    /**
     * A React component representing a new message modal dialog content.
     */
    return React.createClass({
        displayName: 'MessageModalContent',

        componentDidMount: function () {
            if (this.props.html) {
                this.setHtml(this.props.html);
            }

            if (this.props.target) {
                this.setDateTime(this.props.target);
            }
        },

        setHtml: function (html) {
            if (this.refs.htmlInput) {
                this.refs.htmlInput.setValue(html);
            }
        },

        getHtml: function () {
            if (this.refs.htmlInput) {
                return this.refs.htmlInput.getValue();
            }

            return undefined;
        },

        setDateTime: function (dateTime) {
            if (this.refs.dateTimeInput) {
                this.refs.dateTimeInput.setValue(dateTime);
            }
        },

        getDateTime: function () {
            if (this.refs.dateTimeInput) {
                return this.refs.dateTimeInput.getValue();
            }

            return undefined;
        },

        render: function () {
            return (
                <Modal {...this.props} closeButton={false}
                       className='dashboard-modal'>

                    <div className='modal-body'>
                        <form className='form'>
                            <DateTimeInput ref='dateTimeInput' />
                            <Editor ref='htmlInput' />
                        </form>
                    </div>

                    <div className='modal-footer'>
                        {this.props.children}
                    </div>

                </Modal>
            );
        }
    });
});