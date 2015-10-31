/**
 * Created by Sumin K Sudhi on 11/30/2014.
 */
;(function () {
    define(['angular',
        'modules/adaptors/foursquare/config/index'
    ], function (angular) {
        'use strict';
        return angular.module('Hairzzlers.Adaptor',[
            'Adaptor.Foursquare'
        ]).config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
            function ($httpProvider, $stateProvider, $urlRouterProvider) {

                // Now set up the states
                $stateProvider
                    .state('adaptor', {
                        url: '/adaptor',
                        bstract:true,
                        templateUrl: '/partials/adaptors/layouts/adaptors.html'
                    })
                    .state('adaptor.config', {
                        url: '/config',
                        templateUrl: '/partials/adaptors/home.html',
                        controller: ['$scope','adaptorList',function($scope,adaptorList){
                            $scope.adaptorList = adaptorList.data;
                        }]
                    })
            }]);

    });
}());
