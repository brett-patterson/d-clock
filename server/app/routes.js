'use strict';

var middleware = require('./middleware'),
    users = require('./models/users');

/**
 * Binds the public routes to an Express app.
 * @param {express.App} app - The express app to bind routes to
 */
var routes = function (app) {
    app.use(function (req, res, next) {
        // Inject the user object into the locals of the response.
        if (req.user !== undefined) {
            res.locals.user = req.user;
        }
        next();
    });

    app.get('/', function (req, res) {
        return res.render('index');
    });

    app.get('/sign-in/', function (req, res) {
        if (req.user !== undefined) {
            return res.redirect('/');
        }

        return res.render('sign-in', {
            hideUserInfo: true,
            nextPage: req.query.nextPage
        });
    });

    app.get('/sign-out/', function (req, res) {
        req.logout();
        return res.redirect('/');
    });

    app.get('/register/', function (req, res) {
        if (req.user !== undefined) {
            return res.redirect('/');
        }
        return res.render('register', { hideUserInfo: true });
    });

    app.get('/dashboard/', middleware.requireUser, function (req, res) {
        return res.render('dashboard');
    });
};

module.exports = routes;
