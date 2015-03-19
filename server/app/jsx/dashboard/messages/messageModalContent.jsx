'use strict';

define(['react', 'reactBootstrap', 'dateTimeInput'],
        function (React, ReactBootstrap, DateTimeInput) {

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
                jQuery(this.refs.htmlInput.getDOMNode()).find('textarea').val(html);
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
                <Modal {...this.props} closeButton={false} backdrop='static'
                       className='dashboard-modal'>

                    <div className='modal-body'>
                        <form className='form'>
                            <DateTimeInput ref='dateTimeInput' />
                            <Input ref='htmlInput'
                                   type='textarea' label='Content' />
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