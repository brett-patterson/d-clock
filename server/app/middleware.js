'use strict';

var basicAuth = require('basic-auth'),
    users = require('./models/users');

var requireUser = function (req, res, next) {
    if (req.user !== undefined) {
        next();
    } else {
        res.redirect('/sign-in?nextPage=' + req.path);
    }
};

var requireApiUser = function (req, res, next) {
    function reqAuth() {
        if (req.user !== undefined) {
            next();
        } else {
            res.set('WWW-Authenticate',
                'Basic realm=Authorization Required');
            res.sendStatus(401);
        }
    }

    var auth = basicAuth(req);
    if (auth !== undefined) {
        users.authenticate(auth.name, auth.pass).then(function (user) {
            if (user) {
                req.user = user;
                next();
            } else {
                reqAuth();
            }
        }).fail(function () {
            reqAuth();
        });
    }
};

module.exports = {
    requireUser: requireUser,
    requireApiUser: requireApiUser
};