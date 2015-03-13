'use strict';

var Q = require('q'),
    uuid = require('node-uuid'),
    users = require('./users'),
    config = require('../config'),
    db = require('orchestrate')(config.db.key);

/**
 * Get all messages for a user.
 * @param {string} email - The user's email address
 */
var all = function (email) {
    var deferred = Q.defer();

    db.get('messages', email).then(function (result) {
        deferred.resolve(result.body.messages);
    }).fail(function (error) {
        if (error.body.code === 'items_not_found') {
            deferred.resolve([]);
        } else {
            deferred.reject(new Error(error.body));
        }
    });

    return deferred.promise;
};

/**
 * Add a message for a user.
 * @param {string} email - The user's email address
 * @param {object} message - A message object
 */
var add = function (email, message) {
    var deferred = Q.defer();

    // Assign a randomly generated id to the message
    message.id = uuid.v4();

    all(email).then(function (messages) {
        if (messages.length > 0) {
            // Update database entry
            db.newPatchBuilder('messages', email)
                .add('/messages/-', message).add('/queue/-', message)
                .apply().then(function () {
                    deferred.resolve(true);
                }).fail(function (error) {
                    deferred.reject(new Error(error.body));
                });
        } else {
            // Create database entry
            db.put('messages', email, {
                messages: [message],
                queue: [message]
            }).then(function () {
                deferred.resolve(true);
            }).fail(function (error) {
                deferred.reject(new Error(error.body));
            });
        }
    }).fail(function (error) {
        deferred.reject(new Error(error.body));
    });

    return deferred.promise;
};

/**
 * Get the message queue for a user.
 * @param {string} email - The user's email address
 */
var queue = function (email) {
    var deferred = Q.defer();

    db.get('messages', email).then(function (result) {
        deferred.resolve(result.body.queue);
    }).fail(function (error) {
        if (error.body.code === 'items_not_found') {
            deferred.resolve([]);
        } else {
            deferred.reject(new Error(error.body));
        }
    });

    return deferred.promise;
};

/**
 * Remove the first message from a user's queue.
 * @param {string} email - The user's email address
 */
var dequeue = function (email) {
    var deferred = Q.defer();

    queue(email).then(function (result) {
        result.shift();
        db.newPatchBuilder('messages', email).replace('queue', result)
            .apply().then(function () {
                deferred.resolve(true);
            }).fail(function (error) {
                deferred.reject(new Error(error.body));
            });
    }).fail(function (error) {
        deferred.reject(new Error(error.body));
    });

    return deferred.promise;
};

module.exports = {
    all: all,
    add: add,
    queue: queue,
    dequeue: dequeue
};