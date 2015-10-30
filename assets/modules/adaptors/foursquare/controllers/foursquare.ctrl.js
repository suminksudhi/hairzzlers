/**
 * Created by SUMIN on 8/27/2014.
 */
;(function() {
    define(['modules/adaptors/foursquare/config/initModule','debug'
    ], function (Hairzzlers,debug) {
        'use strict';
		var logger,tracer,warn,info ;
		if(typeof debug=='undefined'){
			logger = console.log;
			tracer = console.trace;
			warn = console.warn;
			info = console.info;
		}else{
			logger = debug('social:facebook:controllers:DashboardCtrl:log');
			info = debug('social:facebook:controllers:DashboardCtrl:info');
			tracer = debug('social:facebook:controllers:DashboardCtrl:trace');
			warn = debug('social:facebook:controllers:DashboardCtrl:warn');
			tracer.log = console.trace ? console.trace.bind(console) : console.log.bind(console);
			warn.log = console.warn.bind(console);
			info.log = console.info.bind(console);
		}

        Hairzzlers.controller('FoursquareCtrl', ['$scope', '$rootScope','foursquareService', '$filter','$window','$compile', '$state', '$http', 'appSetting','toastr',
            function ($scope, $rootScope,foursquare,$filter,$window,$compile, $state, $http, appSetting,toastr) {

                $scope.showLoginButton = false; //flag to show up the login button adator config step1

                var createWorkFlow = function(name){
                    foursquare.createWorkFlow(name)
                        .then(function(data) {
                            console.log(data);
                        },function(data){
                            console.log(data);
                        });
                }


                var loadData = function(name){
                    console.log(name);
                    foursquare.loadData(name)
                        .then(function(data){
                            console.log(data);
                        },function(data){
                            console.log(data);
                        })
                }

                var saveConfig = function(){
                    var refreshToken = $scope.refreshToken;
                    var accountName = $scope.selectedAccount['name'];
                    var typeId = $scope.selectedProfileType['id'];
                    foursquare
                        .saveFoursquareConfig({
                            viewId:typeId,
                            accountName:accountName,
                            refreshToken:refreshToken
                        })
                        .then(function(data) {
                            console.log(data);
                            createWorkFlow('abc');
                        },function(data){
                            console.log(data);
                        });
                }

                var getFoursquareProfileType = function(){
                    var refreshToken = $scope.refreshToken;
                    var accountId = $scope.selectedAccount['id'];
                    var propertyId = $scope.selectedProfile['id'];
                    foursquare.getFoursquareProfileType({refreshToken:refreshToken,accountId:accountId,propertyId:propertyId})
                        .then(function(siteProfileType) {
                            console.log(siteProfileType);
                            $scope.selectedProfileType = siteProfileType.data[0];
                            saveConfig();
                        },function(data){
                            console.log(data);
                        });
                }

                var getFoursquareSiteProfile = function(){
                    var refreshToken = $scope.refreshToken;
                    var accountId = $scope.selectedAccount['id'];
                    foursquare.getFoursquareSiteProfile({refreshToken:refreshToken,accountId:accountId})
                        .then(function(siteProfiles) {
                            console.log(siteProfiles);
                            $scope.selectedProfile = siteProfiles.data[0];
                            getFoursquareProfileType()
                        },function(data){
                            console.log(data);
                        });
                }

                var getFoursquareAccount = function(){
                    var refreshToken = $scope.refreshToken;
                    console.log(refreshToken);
                    foursquare.getFoursquareAccounts(refreshToken).then(function(accountResponse) {
                        console.log(accountResponse);
                        $scope.selectedAccount = accountResponse.data[0];
                        getFoursquareSiteProfile();
                    },function(data){
                        console.log(data);
                    });
                }

                var getConfigurations = function(){
                    foursquare.getConfigList()
                        .then(function(configResponse) {
                            console.log(configResponse);
                            loadData(configResponse.data[0].name); //@todo to be remove
                        },function(data){
                            console.log(data);
                        });

                }

                var getRefreshToken = function(){
                    foursquare.getRefreshToken().then(function(tokenResponse) {
                        $scope.showLoginButton = false; //as we have token now
                        $scope.refreshToken = tokenResponse.data.val;
                        getFoursquareAccount(); //now lets get user account info
                    },function(data){
                        console.log(data);
                    });
                }

                $scope.$on('noTokenforfoursquare',function(){
                    $scope.showLoginButton = true; //as we dont have config
                    console.log('got no token foursquare in controller')
                })

                $scope.$on('foursquareToken',function(event,config){
                    $scope.showLoginButton = false; //as we have config
                    $scope.refreshToken = config.val;
                    console.log('token for foursquare found in controller',config);
                    getConfigurations();
                })

                $rootScope.$on('foursquarepopClosed',function(){
                    console.log('foursquare popup closed');
                    getRefreshToken();
                   // $state.go('dashboard', null, { reload: true });

                })

                $scope.login = function(){
                    foursquare.openAuthPopUp();
                }
            }]);
    });
}());