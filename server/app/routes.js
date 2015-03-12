var passport = require('passport');
var users = require('./users');

var requireUser = function(req, res, next) {
    if (req.user !== undefined)
        next();
    else
        res.redirect('/sign-in?nextPage=' + req.path);
};

var routes = function(app) {
    app.use(function(req, res, next) {
        // Inject the user object into the locals of the response.
        if (req.user !== undefined)
            res.locals.user = req.user;
        next();
    });

    app.get('/', function(req, res) {
        return res.render('index');
    });

    app.get('/sign-in/', function(req, res) {
        if (req.user !== undefined)
            return res.redirect('/');

        return res.render('sign-in', {
            hideUserInfo: true,
            nextPage: req.query.nextPage
        });
    });

    app.get('/sign-out/', function(req, res) {
        req.logout();
        return res.redirect('/');
    });

    app.get('/register/', function(req, res) {
        if (req.user != undefined)
            return res.redirect('/');
        return res.render('register', { hideUserInfo: true });
    });

    app.post('/auth-sign-in/', function(req, res, next) {
        var options = {
            failureRedirect: '/sign-in/',
            successRedirect: '/',
            failureFlash: true
        };

        var nextPage = req.body.nextPage;
        if (nextPage !== 'undefined')
            options.successRedirect = nextPage;

        passport.authenticate('local-sign-in', options)(req, res, next);
    });

    app.post('/auth-register/', passport.authenticate('local-register', {
        failureRedirect: '/register/',
        successRedirect: '/',
        failureFlash: true
    }));

    app.get('/dashboard/', requireUser, function(req, res) {
        return res.render('dashboard');
    })

    app.ws('/', function(ws, req) {
        users.authenticate(req.query.email,
            req.query.password).then(function(user) {
                // Successful user authentication
                ws.send(JSON.stringify([{
                    'html': '<b>Hello</b>, world!',
                    'recurring': 1,
                    'target': moment().add(1, 'm').format('MM-DD-YYYY HH:mm')
                }]));
            }).fail(function(error) {
                // Unsuccessful user authentication
                ws.close();
            });
    });
};

module.exports = routes;
