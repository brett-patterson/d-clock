'use strict';

// Code adapted from:
// https://clozeit.wordpress.com/2014/01/08/bootstrap-modals-and-popover-in-react-js/

/**
 * A React component representing a modal dialog with trigger and content.
 */
var Modal = React.createClass({displayName: "Modal",
    handleClick: function (event) {
        $(this.refs.payload.getDOMNode()).modal();
    },

    render: function () {
        return (React.createElement("div", null, 
                this.props.trigger, 
                React.createElement(ModalContent, {ref: "payload", 
                       header: this.props.header, 
                       body: this.props.body, 
                       footer: this.props.footer})
        ));
    }
});


/**
 * A React component representing the content of a modal.
 */
var ModalContent = React.createClass({displayName: "ModalContent",
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
            React.createElement("div", {className: "modal fade", role: "dialog", 
                 onClick: this.handleClick}, 
                 React.createElement("div", {className: "modal-dialog"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {class: "modal-header"}, this.props.header), 
                        React.createElement("div", {class: "modal-body"}, this.props.body), 
                        React.createElement("div", {class: "modal-footer"}, this.props.footer)
                    )
                 )
            )
        );
    }
});