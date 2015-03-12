'use strict';

require.config({
    baseUrl: './js/',
    paths: {
        flight: '../lib/flight/lib'
    }
});

require(['flight/debug'], function(debug) {
    debug.enable(true);
    DEBUG.events.logAll();

    require(['app'], function(app) {
        app.initialize();
    });
});
