/**
 * Created by dev on 11/30/2014.
 */
define(['angular', 'domReady', 'initapp'], function (angular, domReady) {
    'use strict';
    domReady(function () {
        angular.bootstrap(document, ['Hairzzlers']);
    });
});