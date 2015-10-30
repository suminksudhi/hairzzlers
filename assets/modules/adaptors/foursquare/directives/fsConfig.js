/**
 * Created by dev on 12/24/2014.
 */
;(function() {
    define(['modules/adaptors/foursquare/config/initModule','debug','jqueryUI'], function (Hairzzlers,debug) {
        'use strict';
        var logger,tracer,warn,info ;
        if(typeof debug=='undefined'){
            logger = console.log;
            tracer = console.trace;
            warn = console.warn;
            info = console.info;
        }else{
            logger = debug('social:foursquare:directives:naFsConfig:log');
            info = debug('social:foursquare:directives:naFsConfig:info');
            tracer = debug('social:foursquare:directives:naFsConfig:trace');
            warn = debug('social:foursquare:directives:naFsConfig:warn');
            tracer.log = console.trace ? console.trace.bind(console) : console.log.bind(console);
            warn.log = console.warn.bind(console);
            info.log = console.info.bind(console);
        }
        Hairzzlers.directive('naFsConfig', ['$timeout','$document','$filter','appSetting','foursquareService','toastr','$location', function($timeout,$document,$filter,appSetting,foursquareService,toastr,$location) {
            'use strict';
            return {
                restrict: 'AE',
                scope: {
                    width: '@width',
                    height: '@height',
                    cssclass: '@naFsConfigClass',
                    enablePanel: '@naFsShowPanel',
                    checkConfig: '@naFsCheckConfig'
                },
                replace: true,
                //templateUrl: '/partials/components/foursquareConfig.html',
                template: '<ng-include src="getTemplateUrl()"/>',
                controller: function($scope) {
                    //function used on the ng-include to resolve the template
                    $scope.getTemplateUrl = function() {
                        tracer();
                        var templateBase = '/partials/components/';
                        if($scope.checkConfig=='true'){
                            return templateBase+'foursquareConfig.html'
                        }else{
                            return null;
                        }
                    }
                },
                link: function(scope, element, attrs) {
                    info("do I need to check  config ? I think ",scope.checkConfig);

                    var isEmpty = $filter('isEmpty');
                    scope.hasFsToken = false;
                    scope.hasConfig = false;
                    var fsAccesstoken, //stores the access token
                        fsAccounts, //get the user account
                        fsAccountProperties,//get the account properties
                        fsProfiles;


                    scope.addNewConfig = function(){
                        scope.enableConfig = true;
                        scope.accountList = fsAccounts;
                        info('ok seems user is going for creating config get accounts');
                        getUserAccounts();
                    };


                    scope.selectAccount = function(id){
                        scope.selectedAccount= fsAccounts[id];
                        info('next get properties');
                        getFoursquareAccountProperties();
                    };

                    scope.selectProperty = function(id){
                        scope.selectedProperty=fsAccountProperties[id];
                        info('next get profileList');
                        getFoursquareAccountProfiles();
                    };

                    scope.selectProfile = function(id){
                        scope.selectedProfile= fsProfiles[id];
                    };

                    scope.loadfsData = function(){
                        if(isEmpty(scope.selectedConfig)){
                            toastr.warning("Seems you missed selecting a configuration","Config not selected");
                            return;
                        }
                        info('initiating load api');
                        foursquareService.loadData(scope.selectedConfig.name).then(function (data) {
                            if (data != null) {
                                toastr.success("Data loaded in Analytics", "Foursquare Data Loaded");
                                location.reload();
                            }
                            logger("after loadData", data, status);
                        },function(status){
                            if (status == 500) {
                                toastr.error("Seems some error occurred please contact support", "Error Occurred");
                            }
                            logger("after loadData", data, status);
                        })
                    };

                    /**
                     * set fsConfig config needed to load
                     * @param name
                     * @param token
                     */
                    scope.setfsConfig = function(name){
                        scope.selectedConfig ={
                            name: name
                        }
                    };



					/**
					*	check for the access token ie any account associated
					*/
                    var checkAccessToken = function () {
                        if(!scope.hasFsToken) {
                            info('ok now since we don\'t have access token first lets get one if associated to user');
                            toastr.info("Please wait..","Checking for any pre-registered foursquare account");
                            foursquareService.getRefreshToken().then(function (data) {
                                logger("data obtained for foursquare refresh Token", data, status);
                                if (data != null) {
									toastr.clear();
									toastr.info("Please wait..","Found an associate account");
                                    fsAccesstoken = data["gta"][0]["attributes_1_v"];
                                    logger('access token as obtained',fsAccesstoken);
                                    info('ok seems I got one token associated lets update hasFsToken flag and proceed to userConfig checking');
                                    scope.hasFsToken = true;
                                }
                            },function(status){
                                if (status == 0) {
                                    console.warn("ask the api support to provide cross origin access");
                                }else if (status == 403) {
                                    scope.$emit("tokenExpired",true);
                                } else if (status == 404) {
                                    toastr.info("Please login..","Found none");
                                    foursquareService.openAuthPopUp(scope);
                                }
                            });
                        }else{
                            info("ok  we do have an access token lets go for config checking");
                            getUserConfig();
                        }
                    };

					/**
					*	get the user config
					*/
                    var getUserConfig = function(){
                        toastr.info("Please wait..","Checking Foursquare Configuration");
                        info('lets fetch any associated configList from api');
                        foursquareService.getConfigList().then(function(data){
							toastr.clear();
                            if(data!=null) {
								toastr.info("Please proceed to load Analytics..","Associated config found");
                                logger("found config for foursquare", data, status);
                                var config = { configList : [] };
                                angular.forEach(data.uta,function(value,key){
                                    this.push({
                                        name:value.name
                                    })
                                },config.configList);
                                scope.hasConfig = true;
								scope.configList = config;
                                scope.$watch('hasConfig', broadcastEvent);
                            }
                        },function(status){
                            if(status==0){
                                warn("ask api developers to assign proper status");
                            }else if(status==404){
                                toastr.info("Please create a config now by clicking add config below","No associated config found");
                                warn("no config found for the user ask to create config");
                                scope.hasConfig = false;
                            }else if(status==403){
                                scope.$emit("tokenExpired",true);
                            }
                        });
                    };

                    var getUserAccounts = function () {
                        if(!isEmpty(fsAccesstoken)) {
							toastr.info("Please Wait..","getting your associate foursquare analytics account");
                            info('get the associate foursquare analytics account');
                            foursquareService.getFoursquareAccounts(fsAccesstoken).then(function (data) {
								toastr.clear();
                                logger("foursquare accounts", data, status);
                                if (data !=null) {
									toastr.info("Please select one account from dropdown  below..","Got associated foursquare accounts");
                                    fsAccounts = JSON.parse(data[0]["Errors"]["exceptionMessage"]);
                                    logger("foursquare accounts after parsing", fsAccounts);
									if(Object.keys(fsAccounts)==0)
										toastr.error("Try with some other account","Seems your account don't have associated accounts");
                                    scope.accountList = fsAccounts;
                                }
                            },function(){
                                warn('error retrieving foursquare account list');
                                toastr.error("Try after sometime","Seems their is some technical issue");
                            });
                        }else{
                            //checkAccessToken();
                        }
                    };

                    var getFoursquareAccountProperties = function () {
                        var params = {
                            refreshToken: fsAccesstoken,
                            accountId: scope.selectedAccount['id']
                        };
						toastr.info("Please wait..","Fetching account properties");
                        info('Fetching account properties');
                        foursquareService.getFoursquareAccountProperties(params).then(function (data) {
							toastr.clear();
                            if (data != null) {
								toastr.info("Please select one account from dropdown  below..","Got associated account properties");
                                fsAccountProperties = JSON.parse(data[0]["Errors"]["exceptionMessage"]);
                                logger("foursquare accounts propeties after parsing", fsAccountProperties);
                                scope.propertyList = fsAccountProperties;
                            }
                        },function(){
                            warn('issue fetching foursquare account properties');
                            toastr.error("Please try after sometime","There was some technical issue");
                        });
                    };

                    var getFoursquareAccountProfiles = function (accountId,propertyId) {
                        var params = {
                            refreshToken: fsAccesstoken,
                            accountId: scope.selectedAccount['id'],
                            propertyId:  scope.selectedProperty['id']
                        };
						toastr.info("Please wait..","you are one step ahead loading profile detail");
                        info('Fetching account profiles');
                        foursquareService.getFoursquareAccountProfiles(params).then(function (data) {
							toastr.clear();
                            if (data != null) {
								toastr.info("Please select one from dropdown below","Got foursquare profile associate");
                                fsProfiles = JSON.parse(data[0]["Errors"]["exceptionMessage"]);
                                logger("foursquare profile accounts after parsing", fsAccounts);
                                scope.profileList = fsProfiles;
                            }
                        },function(){

                            warn('issue fetching foursquare account profiles');
                            toastr.error("Please try after sometime","There was some technical issue");
                        });
                    };

                    scope.saveFoursquareConfig = function(){
                        var foursquareParams ={
                            viewId:scope.selectedProfile['id'],
                            accountName:scope.selectedAccount['name'],
                            refreshToken:fsAccesstoken
                        };
                        info('lets save the config now');
                        foursquareService.saveFoursquareConfig(foursquareParams).then(function(data){
                            logger("after saving config",data);
                            if(data!=null){
                                toastr.success('Saved Successfully', 'Foursquare Config');
                                info('ok config save now what lets update has config to true')
                                scope.hasConfig = true;
                                getUserConfig();
                            }
                        },function(){

                        });
                    };


                    /**
                     * listen to window closed event if closed recheck access token
                     * used in case of auth token
                     **/
                    scope.$on("popUpClosed",function(event,popUpStat){
                        if(popUpStat.popupName=='foursquare' && popUpStat.isClosed==true){
                            checkAccessToken();
                        }
                    });
                    var broadcastEvent = function(){
                        if(scope.hasConfig && (typeof scope.configList.configList!='undefined')) {
                            info("ok as we have config let the father know that target accomplished");
                            scope.$emit('fsConfigList', scope.configList)
                        }
                        enablePanel();
                    };

                    var enablePanel = function(){
                        if(scope.enablePanel=='y'){
                            info('seems panel explicitly enabled');
                            scope.showPanel = true;
                        }
                        else if(!scope.hasFsToken){
                            info('seems we don\'t have accesstoken enable panel(show trigger oauth popup)')
                            scope.showPanel = true;
                        }else if(scope.hasConfig){
                            info('since we have config disable panel');
                            warn('check point where the load panel to be enabled');
                            scope.showPanel = false;
                        }else{
                            info('seems we dont have config enable panel (ideally user should create a config now)')
                            scope.showPanel = true;
                        }
                    };

                    var toggleConfigCheck = function(data) {
                        if (data == "true") {
                            info('seems the checkconfig is enabled lets enable a watch for accessToken');
                            //once user config is found initiate api calls to get the analytics
                            //scope.$watch('hasConfig', broadcastEvent);
                            scope.$watch("hasFsToken", checkAccessToken);
                        }else{
                            warn('seems check for access token is disabled aborting ops');
                        }
                    };

                    //used to trigger whenever the checkconfig flag is updated
                    scope.$watch('checkConfig',toggleConfigCheck);

                }
            };
        }]);
    });
}());