'use strict';

define([
    'react',
], function (React) {
    /**
     * A React mixin for managing a loading state and spinner.
     */
     return {
        getInitialState: function () {
            return {
                loading: {}
            };
        },

        getSpinner: function (key, defaultVal) {
            if (this.state.loading[key] ||
                    (key === undefined && defaultVal === undefined)) {
                return React.createElement("i", {className: "fa fa-lg fa-spinner fa-spin"});
            }

            return defaultVal;
        }
     }
});
