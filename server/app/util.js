'use strict';

var underscore = require('underscore'),
    Q = require('q');

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

/**
 * An async promise-compatible while loop. Adapted from:
 * http://stackoverflow.com/questions/17217736/while-loop-with-promises
 * @param {function} condition - A function that returns a boolean; the
 *   condition for the while loop
 * @param {function} body - The function to call each iteration of the loop
 * @return {q.Promise} A promise for the completion of the loop
 */
var asyncWhile = function (condition, body) {
    var deferred = Q.defer();

    function loop() {
        if (!condition()) {
            return deferred.resolve();
        }

        Q.fcall(body).then(loop, deferred.reject);
    }

    Q.nextTick(loop);

    return deferred.promise;
};

module.exports = {
    indexOf: indexOf,
    asyncWhile: asyncWhile
};
