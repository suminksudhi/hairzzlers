/**
 * Created by Sumin K Sudhi on 11/7/2014.
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
// Register as an anonymous AMD module:
        define([
            'jquery',
            'angular',
            'Modernizr',
            'js/pages'
        ], factory);
    } else {
        factory();
    }
}(function () {
    'use strict';
    (function ($, window, document, undefined) {



        $('.panel-collapse label').on('click', function (e) {
            e.stopPropagation();
        })


    }(jQuery, window, document))
}));
