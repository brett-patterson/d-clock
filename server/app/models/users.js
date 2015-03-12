'use strict';

var bcrypt = require('bcryptjs'),
    Q = require('q'),
    config = require('../config'),
    db = require('orchestrate')(config.db.key);

var register = function (email, password) {
    var deferred = Q.defer(),
        hash = bcrypt.hashSync(password),
        user = {
            'email': email,
            'password': hash
        };

    db.get('users', email).then(function () {
        // Email already exists.
        deferred.resolve(false);
    }).fail(function (result) {
        if (result.body.code === 'items_not_found') {
            // Email does not exist in the database.
            db.put('users', email, user).then(function () {
                deferred.resolve(user);
            }).fail(function (error) {
                deferred.reject(new Error(error.body));
            });
        } else {
            deferred.reject(new Error(result.body));
        }
    });

    return deferred.promise;
};

var authenticate = function (email, password) {
    var deferred = Q.defer();

    db.get('users', email).then(function (result) {
        // Email exists.
        var hash = result.body.password;
        if (bcrypt.compareSync(password, hash)) {
            deferred.resolve(result.body);
        } else {
            deferred.resolve(false);
        }
    }).fail(function (error) {
        // No email found.
        if (error.body.code === 'items_not_found') {
            deferred.resolve(false);
        } else {
            deferred.resolve(new Error(error.body));
        }
    });

    return deferred.promise;
};

var get = function (email) {
    var deferred = Q.defer();

    db.get('users', email).then(function (result) {
        deferred.resolve(result.body);
    }).fail(function (error) {
        if (error.body.code === 'items_not_found') {
            deferred.resolve(false);
        } else {
            deferred.resolve(new Error(error.body));
        }
    });

    return deferred.promise;
};

module.exports = {
    register: register,
    authenticate: authenticate,
    get: get
};
