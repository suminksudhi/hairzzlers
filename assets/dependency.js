/**
 * Created by Sumin K Sudhi on 3011140626
 * define the app level config here
 */
define([
    'angular',
    'angularSanitize'
], function (angular) {
    'use strict';
    return angular.module('Hairzzlers.Dependency',
        ['ngSanitize']);
});
