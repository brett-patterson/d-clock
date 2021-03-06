'use strict';

var http = require('http'),
    path = require('path'),

    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    flash = require('express-flash'),
    session = require('express-session'),

    passport = require('passport'),
    LocalStrategy = require('passport-local'),

    config = require('./config'),
    messageServer = require('./messageServer'),
    users = require('./models/users');

// Create express application
var app = express(),
    server = http.createServer(app);

// Create message web socket server
messageServer(server);

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set application middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(path.dirname(__dirname), 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Set application routes and api
require('./routes')(app);
require('./api')(app);

// Configure passport authentication
passport.use('local-register', new LocalStrategy({
    usernameField: 'email'
}, function (email, password, done) {
    users.register(email, password).then(function (user) {
        var info = {};
        if (!user) {
            info.message = 'Username already in use';
        }
        done(null, user, info);
    }).fail(function (error) {
        done(error);
    });
}));

passport.use('local-sign-in', new LocalStrategy({
    usernameField: 'email'
}, function (email, password, done) {
    users.authenticate(email, password).then(function (user) {
        var info = {};
        if (!user) {
            info.message = 'Invalid credentials';
        }
        done(null, user, info);
    }).fail(function (error) {
        done(error);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    users.get(email).then(function (user) {
        done(null, user);
    }).fail(function (error) {
        done(error);
    });
});

module.exports = server;
