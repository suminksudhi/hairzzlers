/*!
 The store module consists of
 1) staticPages- static page
 2) verifyMail -
 3) AppPage - shows up the app listing
 4) Single Solution Page - displays the single app details
 5) Subscription/Payment Gatway Modules
 */
;(function () {
    define(['angular'
    ], function (angular) {
        'use strict';
        return angular.module('Hairzzlers.Common', [])
            .config([ 'appConfig','$locationProvider','$logProvider', '$httpProvider','$urlRouterProvider','$stateProvider','$localForageProvider','toastrConfig',
                function (appConfig,$locationProvider,$logProvider, $httpProvider, $urlRouterProvider,$stateProvider,$localForageProvider,toastrConfig) {
                $urlRouterProvider.otherwise("/search");
                $stateProvider
                    .state('common', {
                        templateUrl: 'partials/index.html'
                    })
                    .state('common.home', {
                        url: "/homepage",
                        resolve : {
                            isloggedIn: ['$state',function($state){
                                    var state = appConfig.override ? appConfig.override.state : {},
                                        param = appConfig.override ? appConfig.override.param : {};
                                    $state.go(state);
                            }]
                        }
                    })
            }])
            .run(function($window, $rootScope,$templateCache) {

                $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
                    $rootScope.$previousState = from;
                });

                $rootScope.online = navigator.onLine;
                $window.addEventListener("offline", function () {
                    $rootScope.$apply(function() {
                        $rootScope.online = false;
                    });
                }, false);
                $window.addEventListener("online", function () {
                    $rootScope.$apply(function() {
                        $rootScope.online = true;
                    });
                }, false);
            });
    });
}());
