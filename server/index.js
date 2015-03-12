'use strict';

var app = require('./app/app'),
    config = require('./app/config');

app.listen(config.server.port);
