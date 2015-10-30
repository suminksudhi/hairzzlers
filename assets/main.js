//if (typeof define !== 'function') {
// to be able to require file from node
// var define = require('amdefine')(module);
//}

var requireConfig = {
    baseUrl: './',
    waitSeconds: 0,
    paths: {
        domReady: 'libs/domready/ready.min', //used to perform document ready ops
        /**
         * angular base modules
         */
        angular: 'libs/angular/angular', //main architectural base for app
        angularSanitize: 'libs/angular-sanitize/angular-sanitize.min', //for processing html snippets using angular scope
        /**
         * angular additional handlers
         */
        angularBootstrap: 'libs/angular-bootstrap/ui-bootstrap-tpls.min', //most of bootstrap operational handling
        angularUIRoute: 'libs/angular-ui-router/release/angular-ui-router.min', //alternative to angularRoute provides a state based transition
        angularMoment: "libs/angular-moment/index", //used for momentjs ops on angular
        angularLocalForage: "libs/angular-localforage/dist/angular-localForage.min", //used for web database ops
        angularSwitch: "libs/angular-switch/dist/switch.min", //for swicth
        angularX2JS: "libs/angular-x2js/dist/x2js.min",

        jquery: 'libs/jquery/dist/jquery.min', //jquery based operations
        jqueryUI: 'libs/jquery-ui/jquery-ui.min', //jquery based operations
        placeholders: 'js/plugins/placeholders', //u need some dummy text or an canvas image to replace original data placeholders is solution
        /**
         * some nice utilities
         */
        moment: "libs/moment/index", // for date ops in UI end
        X2JS: "libs/x2js/xml2json.min", // xml json convertor
        localforage: 'libs/localforage/dist/localforage.min', //for db ops in web databses follows a fallback mechanism
        Modernizr: 'js/plugins/modernizr.custom', //helps to detect html5 and css3 features native support for a browser

        /**
         * core application library
         */
        app: 'js/app',
        initapp: 'initapp',
        appConfig: 'appConfig',
        dependency: 'dependency',
        library: 'libs',
        'angular-ui-select': 'js/plugins/drifter/drifterselect', //@experimental for select2

        /** custom plugins **/
        portlet: 'js/portlet', //used for portlet animation and customization basically they are custom panels
    },
    shim: {
        socketio: {
            exports: 'io'
        },
        angular: {
            exports: 'angular'
        },
        'angularBootstrap': {deps: ['angular', 'jquery']},
        'angularUIRoute': {deps: ['angular']},
        'angularSanitize': {deps: ['angular']},
        'angularLocalForage': {deps: ['angular', 'localforage']},
        'angularMoment': {deps: ['angular', 'moment']},
        'angularX2JS': {deps: ['angular', 'X2JS']},
        'angular-ui-select': {deps: ['angular']},
        'initapp': {deps: ['jquery']},
        'app': {deps: ['jquery']},
        'portlet': {deps: ['jquery']},
    },
    deps: ['angular', 'jquery', 'debug']
};

require.config(requireConfig);
require(['bootapp'], function (resolver) {
});
