'use strict';

var Q = require('q'),
    users = require('./users'),
    config = require('../config'),
    db = require('orchestrate')(config.db.key);


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

var add = function (email, message) {
    var deferred = Q.defer();

    all(email).then(function (messages) {
        if (messages.length > 0) {
            // Update database entry
            db.newPatchBuilder('messages', email)
                .add('/messages/-', message).apply().then(function () {
                    deferred.resolve(true);
                }).fail(function (error) {
                    deferred.reject(new Error(error.body));
                });
        } else {
            // Create database entry
            db.put('messages', email, {
                messages: [message]
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

module.exports = {
    all: all,
    add: add
};