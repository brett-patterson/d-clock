'use strict';

define([
    'react',
    'jquery',
    'ckeditor'
], function (React, jQuery) {

    /**
     * A React component representing a WYIWYG HTML editor.
     */
    return React.createClass({
        displayName: 'Editor',

        getValue: function () {
            if (this.refs.editor) {
                return jQuery(this.refs.editor.getDOMNode()).val();
            }

            return undefined;
        },

        setValue: function (value) {
            if (this.refs.editor) {
                jQuery(this.refs.editor.getDOMNode()).val(value);
            }
        },

        componentDidMount: function () {
            jQuery(this.refs.editor.getDOMNode()).ckeditor();
        },

        render: function () {
            return (
                React.createElement("textarea", {ref: "editor"})
            );
        }
    });
});
