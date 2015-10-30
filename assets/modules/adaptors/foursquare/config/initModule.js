/**
 * Created by Sumin K Sudhi on 11/30/2014.
 */
;(function () {
    define(['angular'], function (angular) {
        'use strict';
        return angular.module('Adaptor.Foursquare',[])
            .config(['$httpProvider','$stateProvider',function($httpProvider,$stateProvider){
                $httpProvider.defaults.timeout = 500;
                $stateProvider
                    .state('adaptor.foursquare', {
                        abstract:true
                    })
                    .state('adaptor.foursquare.search', {
                        templateUrl: 'partials/adaptors/home.html',
                        url: "/search"
                    })
            }])
            .run(['$window','$rootScope',function($window, $rootScope) {
            }]);
    });
}());