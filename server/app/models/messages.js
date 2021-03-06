'use strict';

var Q = require('q'),
    uuid = require('node-uuid'),
    users = require('./users'),
    config = require('../config'),
    db = require('orchestrate')(config.db.key),
    util = require('../util');

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
 * Get the front of the message queue for a user.
 * @param {string} email - The user's email address
 */
var queueFront = function (email) {
    var deferred = Q.defer();

    queue(email).then(function (result) {
        deferred.resolve(result[0]);
    }).fail(function (error) {
        deferred.reject(new Error(error.body));
    });

    return deferred.promise;
};

/**
 * Remove a message from a user's queue. Since these operations are done
 * asynchronously, we cannot guarantee the order of the queue, so we must
 * remove by id, rather than just popping off the front of the queue.
 * @param {string} email - The user's email address
 */
var dequeue = function (email, id) {
    var deferred = Q.defer();

    queue(email).then(function (result) {
        var qIndex = util.indexOf(result, id, function (message) {
            return message.id;
        });

        if (qIndex > -1) {
            result.splice(qIndex, 1);
            db.newPatchBuilder('messages', email).replace('queue', result)
                .apply().then(function () {
                    deferred.resolve(true);
                }).fail(function (error) {
                    deferred.reject(new Error(error.body));
                });
        } else {
            deferred.resolve(false);
        }
    }).fail(function (error) {
        deferred.reject(new Error(error.body));
    });

    return deferred.promise;
};

/**
 * Update a message for a user.
 * @param {string} email - The user's email address
 * @param {object} message - A message object
 */
var update = function (email, message) {
    var deferred = Q.defer();

    all(email).then(function (messages) {
        var mIndex = util.indexOf(messages, message.id, function (m) {
                return m.id;
            });
        if (mIndex > -1) {
            var patch = db.newPatchBuilder('messages', email)
                            .replace('messages.' + mIndex, message);

            queue(email).then(function (messageQueue) {
                var qIndex = util.indexOf(messageQueue, message.id, function (m) {
                    return m.id;
                });
                if (qIndex > -1) {
                    patch.replace('queue.' + qIndex, message);
                }
            }).fin(function () {
                patch.apply().then(function () {
                    deferred.resolve(true);
                }).fail(function (error) {
                    deferred.reject(new Error(error.body));
                });
            });
        } else {
            deferred.reject(new Error('Message not found'));
        }
    });

    return deferred.promise;
};

/**
 * Remove a user's message from the messages list and from the queue.
 * @param {string} email - The user's email address
 * @param {object} message - The message to remove
 */
var remove = function (email, message) {
    var deferred = Q.defer();

    all(email).then(function (messages) {
        var mIndex = util.indexOf(messages, message.id, function (m) {
            return m.id;
        });

        if (mIndex > -1) {
            messages.splice(mIndex, 1);
            var patch = db.newPatchBuilder('messages', email)
                            .replace('messages', messages);

            queue(email).then(function (messageQueue) {
                var qIndex = util.indexOf(messageQueue, message.id, function (m) {
                    return m.id;
                });
                if (qIndex > -1) {
                    messageQueue.splice(qIndex, 1);
                    patch.replace('queue', messageQueue);
                }
            }).fin(function () {
                patch.apply().then(function () {
                    deferred.resolve(true);
                }).fail(function (error) {
                    deferred.reject(new Error(error.body));
                });
            });
        } else {
            deferred.reject(new Error('Message not found'));
        }
    }).fail(function (error) {
        deferred.reject(new Error(error.body));
    });

    return deferred.promise;
}

module.exports = {
    all: all,
    add: add,
    queue: queue,
    queueFront: queueFront,
    dequeue: dequeue,
    update: update,
    remove: remove
};
