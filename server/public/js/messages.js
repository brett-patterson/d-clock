'use strict';

/**
 * Evaluate a value that could have three possible states:
 * undefined, true, or false.
 * @param {boolean} value - The value to be evaluated
 * @param {any} truthy - The return value if `value` is truthy.
 * @param {any} falsy - The return value if `value` is falsy.
 * @param {any} undef - The return value if `value` is undefined.
 */
function triStateEvaluate(value, truthy, falsy, undef) {
    if (value === undefined) {
        return undef;
    }

    if (value) {
        return truthy;
    }

    return falsy;
}