/**
 * Created by Sumin K Sudhi on 3011140626
 * define the app level config here
 */
define(['angular'], function (angular) {
    'use strict';
    return angular.module('Hairzzlers.Constants', [])
        .constant('appConfig', {
            appUrl: window.location.origin,
            override:{
                isAppStore : true,
                state : 'adaptor.foursquare.search',
                param : {}
            }
        });
});
