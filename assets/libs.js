/**
 * Created by Sumin K Sudhi on 3011140626
 * define the app level config here
 */
define([
    'angular',
    'angularBootstrap',
    'angularUIRoute',
    'placeholders',
    'angularMoment',
    'angularLocalForage'
], function (angular) {
    'use strict';
    return angular.module('Hairzzlers.libs',
        ['ui.bootstrap',
            'ui.router',
            'ngSanitize',
            'placeholders',
            'angularMoment',
            'LocalForageModule']).config(['$localForageProvider', function ($localForageProvider) {
            /**
             * localforage configuartiion for leverage browser storage
             */
            $localForageProvider.config({
                // driver      : 'localStorageWrapper', // if you want to force a driver
                name: 'hairzzlers1', // name of the database and prefix for your data, it is "lf" by default
                // version     : 3.0, // version of the database, you shouldn't have to use this
                storeName: 'startuppulse', // name of the table
                description: 'local db for hairzzlers startupPulse'
            });
            $localForageProvider.setNotify(true, true);
        }]);
});
