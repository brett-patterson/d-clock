'use strict';

var underscore = require('underscore');

/**
 * A modified indexOf function that allows a custom key function.
 * @param {array} array - the array to search
 * @param {any} needle - the element to search for
 * @param {function} key - an optional function that takes the current array
 *      element as an argument and returns the value to compare with the needle
 * @return {int} the index of the needle or -1
 */
var indexOf = function (array, needle, key) {
    var i;

    if (!underscore.isFunction(key)) {
        return underscore.indexOf(array);
    }

    for (i = 0; i < array.length; i++) {
        if (key(array[i]) === needle) {
            return i;
        }
    }

    return -1;
};

module.exports = {
    indexOf: indexOf
};
