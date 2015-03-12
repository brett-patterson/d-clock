'use strict';

var moment = require('moment'),
    passport = require('passport'),

    middleware = require('./middleware'),
    messages = require('./models/messages'),
    users = require('./models/users');

function apiResponse(success, res, info) {
    if (success) {
        res.status(200);
    } else {
        res.status(400);
    }

    if (info !== undefined) {
        res.json(info);
    }
}

var api = function (app) {
    app.post('/api/auth-sign-in/', function (req, res, next) {
        var nextPage = req.body.nextPage,
            options = {
                failureRedirect: '/sign-in/',
                successRedirect: '/',
                failureFlash: true
            };

        if (nextPage !== 'undefined') {
            options.successRedirect = nextPage;
        }

        passport.authenticate('local-sign-in', options)(req, res, next);
    });

    app.post('/api/auth-register/', passport.authenticate('local-register', {
        failureRedirect: '/register/',
        successRedirect: '/',
        failureFlash: true
    }));

    app.post('/api/messages/', middleware.requireApiUser, function (req, res) {
        messages.all(req.user.email).then(function (result) {
            apiResponse(true, res, result);
        }).fail(function (error) {
            apiResponse(false, res, { error: error });
        });
    });

    app.post('/api/add-message/', middleware.requireApiUser, function (req, res) {
        messages.add(req.user.email, JSON.parse(req.body.message))
            .then(function (result) {
                apiResponse(result, res);
            }).fail(function (error) {
                apiResponse(false, res, {error: error});
            });
    });

    app.ws('/api/messages/', function (ws, req) {
        users.authenticate(req.query.email,
                req.query.password).then(function (user) {
            // Successful user authentication
            ws.send(JSON.stringify([{
                'html': '<b>Hello</b>, world!',
                'recurring': 1,
                'target': moment().add(1, 'm').format('MM-DD-YYYY HH:mm')
            }]));
        }).fail(function () {
            // Unsuccessful user authentication
            ws.close();
        });
    });
};

module.exports = api;