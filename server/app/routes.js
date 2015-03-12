var moment = require('moment');
var passport = require('passport');

var routes = function(app) {
    app.get('/', function(req, res) {
        return res.render('index', {user: req.user});
    });

    app.get('/sign-in/', function(req, res) {
        if (req.user)
            return res.redirect('/');
        return res.render('sign-in', { hideUserInfo: true });
    });

    app.get('/sign-out/', function(req, res) {
        req.logout();
        return res.redirect('/');
    });

    app.get('/register/', function(req, res) {
        if (req.user)
            return res.redirect('/');
        return res.render('register', { hideUserInfo: true });
    });

    app.post('/auth-sign-in/', passport.authenticate('local-sign-in', {
        failureRedirect: '/sign-in/',
        successRedirect: '/',
        failureFlash: true
    }));

    app.post('/auth-register/', passport.authenticate('local-register', {
        failureRedirect: '/register/',
        successRedirect: '/',
        failureFlash: true
    }));

    app.ws('/', function(ws, req) {
        ws.send(JSON.stringify([{
            'html': '<b>Hello</b>, world!',
            'recurring': 1,
            'target': moment().add(1, 'm').format('MM-DD-YYYY HH:mm')
        }]));
    });
};

module.exports = routes;
