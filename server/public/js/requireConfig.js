'use strict';

require.config({
    baseUrl: '/js/',
    paths: {
        'jquery': '/lib/jquery/dist/jquery',
        'react': '/lib/react/react-with-addons',
        'bootstrap': '/lib/bootstrap/dist/js/bootstrap',
        'reactBootstrap': '/lib/react-bootstrap/react-bootstrap',
        'dateTimePicker': '/lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
        'moment': '/lib/moment/moment',
        'ckeditor': '/lib/ckeditor/adapters/jquery'
    },
    shim: {
        ckeditor: {
            deps: ['/lib/ckeditor/ckeditor.js']
        }
    }
});
