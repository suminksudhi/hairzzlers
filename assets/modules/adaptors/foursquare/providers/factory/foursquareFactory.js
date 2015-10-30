/**
 * Created by dev on 11/27/2014.
 * This factory is used to provide twitter api services
 */
;(function() {
    define(['modules/adaptors/foursquare/config/initModule','debug','moment'], function (Hairzzlers,debug,moment) {
        'use strict';
        var logger,tracer,warn,info ;
        if(typeof debug=='undefined'){
            logger = console.log;
            tracer = console.trace;
            warn = console.warn;
            info = console.info;
        }else{
            logger = debug('social:foursquare:factory:foursquareService:log');
            info = debug('social:foursquare:factory:foursquareService:info');
            tracer = debug('social:foursquare:factory:foursquareService:trace');
            warn = debug('social:foursquare:factory:foursquareService:warn');
            tracer.log = console.trace ? console.trace.bind(console) : console.log.bind(console);
            warn.log = console.warn.bind(console);
            info.log = console.info.bind(console);
        }
        Hairzzlers.factory('foursquareService',['$q','$state','appSetting','appUtil','$window','$filter','$http','$localForage',function($q,$state,appSetting,appUtil,$window,$filter,$http,$localForage) {

            var authorizationResult = false;
            var appConfig = appSetting.config;
            var foursquareAuthUrl = appConfig.apiUrl + '/HairzzlersAdaptor/auth/hairzzlersfoursquarelogin';
            var apiDoUrl = appConfig.apiUrl + appConfig.doServerUrl;
            var getFoursquareAccountsUrl = appConfig.apiUrl +'/DataObjectServer/nanomartservices/nanomartstore/foursquare/account';
            var getFoursquarePropertiesUrl = appConfig.apiUrl +'/DataObjectServer/nanomartservices/nanomartstore/foursquare/property';
            var getFoursquareProfilesUrl = appConfig.apiUrl +'/DataObjectServer/nanomartservices/nanomartstore/foursquare/view';
            var getFoursquareAdaptorUrl = appConfig.apiUrl +'/HairzzlersAdaptor/api/adaptor/foursquareadaptor';
            var saveFoursquareConfigUrl = appConfig.apiUrl +'/DataObjectServer/data/do/kvc';
            var workflowUrl =  appConfig.apiUrl +"/WorkFlowService/Adaptor/AdaptorWorkflow";

            var isEmpty = $filter('isEmpty');
            /** check user data **/
            var userInfo = $window.localStorage.getItem('hairzzlers.loggedInUserData') || '';
            userInfo = !isEmpty(userInfo) && JSON.parse(userInfo);
            var token = !isEmpty(userInfo) && userInfo['token'];

            return {
                getLocationBasedOnLatLong :function(params,callback){
                    return $http.get('http://maps.foursquareapis.com/maps/api/geocode/json',{
                        params: {latlng:params.lat+','+params.long,sensor:true},
                        timeout :appUtil.timeOutPromise()
                    }).success(callback).error(callback);
                },
                /**
                 * opeup the foursquare authentication popup
                 * @param scope
                 */
                openAuthPopUp : function(scope){
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                appUtil.PopupCenter({
                                    popupName: 'foursquare',
                                    url: foursquareAuthUrl + "?mode=update&token=" + userInfo['token'],
                                    title: 'Foursquare Configuration',
                                    h: '500',
                                    w: '900',
                                    scope: scope
                                });

                            }
                        });
                },
                /**
                 * get the foursquare RefreshToken based on tenantID
                 * @param callback
                 * @returns {*}
                 */
                getRefreshToken: function(){
                    var deferred = $q.defer();
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                var params = {
                                    ot: 'gta',
                                    an: 'nbmdm_tenants_row_id',
                                    av: userInfo["tenantId"],
                                    o: '=',
                                    t: userInfo['token']
                                };
                                return $http.get(appSetting.doUrl(), {
                                    params: params,
                                    timeout :appUtil.timeOutPromise()
                                }).success(function(data){
                                    var config = {};
                                    angular.forEach(data.gta,function(value,key){
                                        config = {
                                            name : 'refresh_token',
                                            id : value.nbmdm_tenant_attr,
                                            val : value.attributes_1_v
                                        }
                                    },config)
                                    deferred.resolve({status:"GOTREFRESHTOKEN",data:config});
                                }).error(function(message,status){
                                    deferred.reject({status:"NOREFRESHTOKEN",data:message});
                                });
                            }
                        });
                    return deferred.promise
                },
                /**
                 * get All the accounts associated with a user based on refreshToken
                 * @param refreshToken
                 * @param callback
                 */
                getFoursquareAccounts: function(refreshToken) {
                    var deferred = $q.defer();
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                var params = {
                                    token: userInfo['token'],
                                    foursquarerefreshtoken: refreshToken,
                                    tokenid: userInfo['token']
                                };
                                $http.get(getFoursquareAccountsUrl, {
                                    params: params,
                                    timeout :appUtil.timeOutPromise()
                                }).success(function(data){
                                    if(data[0]["statusCode"]==0) {
                                        var account = JSON.parse(data[0]["Errors"]["exceptionMessage"])
                                        deferred.resolve({status: "GOTFOURSQUAREACCOUNTS", data: account});
                                    }else{
                                        deferred.reject({status: "SOMETHINGNOTEXPECTEDFORNOW"});
                                    }
                                }).error(function(data,status){
                                    if(data && data[0]["Errors"]["errorCode"]==2035){
                                        $state.go('auth.relogin');
                                        deferred.reject({status: "SESSIONEXPIRED", msg: data});
                                    }else {
                                        deferred.reject({status: "ERRGETTINFSCCOUNTINFO", msg: data});
                                    }
                                });
                            }else{
                                deferred.reject({status:"NOTLOGGEDIN",msg:"must be logged in for access foursquare account"});
                            }
                        },function(){
                            deferred.reject({status:"ERRACCESSINGUSERINFO"});
                        });
                    return  deferred.promise;
                },
                /**
                 * get the properties associated to a user account
                 * @param refreshToken
                 * @param callback
                 * @returns {*} {refreshToken:'',accountId:''}
                 */
                getFoursquareSiteProfile : function(foursquareParams) {
                    var deferred = $q.defer();
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                var params = {
                                    token: userInfo['token'],
                                    foursquarerefreshtoken: foursquareParams['refreshToken'],
                                    foursquareaccountId: foursquareParams['accountId'],
                                    tokenid: userInfo['token']
                                };
                                $http.get(getFoursquarePropertiesUrl, {
                                    params: params,
                                    timeout :appUtil.timeOutPromise()
                                }).success(function(data){
                                    if(data[0]["statusCode"]==0) {
                                        var siteProfiles = JSON.parse(data[0]["Errors"]["exceptionMessage"])
                                        deferred.resolve({status: "GOTSITEPROFILES", data: siteProfiles});
                                    }else{
                                        deferred.reject({status: "SOMETHINGNOTEXPECTEDFORNOW"});
                                    }
                                }).error(function(data,status){
                                    deferred.reject({status:"ERRGETTINGGOTSITEPROFILES",msg:data});
                                });
                            }else{
                                deferred.reject({status:"NOTLOGGEDIN",msg:"must be logged in for access foursquare account"});
                            }
                        },function(){
                            deferred.reject({status:"ERRACCESSINGUSERINFO"});
                        });

                    return  deferred.promise;
                },
                /**
                 * get the Foursquare profile data
                 * @param refreshToken
                 * @param callback
                 * @returns {*}
                 */
                getFoursquareProfileType : function(foursquareParams) {
                    var deferred = $q.defer();
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                var params = {
                                    token: userInfo['token'],
                                    foursquarerefreshtoken: foursquareParams['refreshToken'],
                                    foursquareaccountId: foursquareParams['accountId'],
                                    webPropertyId: foursquareParams['propertyId'],
                                    tokenid: userInfo['token']
                                };
                                var callback = (callback || angular.noop);
                                return $http.get(getFoursquareProfilesUrl, {
                                    params: params,
                                    timeout :appUtil.timeOutPromise()
                                }).success(function(data){
                                    if(data[0]["statusCode"]==0) {
                                        var profileTypes = JSON.parse(data[0]["Errors"]["exceptionMessage"]);
                                        deferred.resolve({status: "GOTPROFILETYPES", data: profileTypes});
                                    }else{
                                        deferred.reject({status: "SOMETHINGNOTEXPECTEDFORNOW"});
                                    }
                                    deferred.resolve(data);
                                }).error(function(data,status){
                                    deferred.reject({status:"ERRGETTINGPROFILETYPES",msg:data});
                                });
                            }else{
                                deferred.reject({status:"NOTLOGGEDIN",msg:"must be logged in for access foursquare account"});
                            }
                        },function(){
                        deferred.reject({status:"ERRACCESSINGUSERINFO"});
                    });

                    return  deferred.promise;
                },
                /**
                 * get the Foursquare profile data
                 * @param refreshToken
                 * @param callback
                 * @returns {*}
                 */
                saveFoursquareConfig : function(foursquareParams) {
                    var deferred = $q.defer();
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                var username = userInfo['username'].replace(/\./, '');
                                var username = username.slice(0, username.indexOf("@"));
                                var dates = appUtil.calculateDates('weekly');
                                var userData = [{
                                    name: (username + foursquareParams["viewId"]).replace(/\./, ''),
                                    description: "config by " + username + " for startupPulse",
                                    accountname: foursquareParams['accountName'],
                                    propertyname: foursquareParams['accountName'],
                                    viewname: foursquareParams['accountName'],
                                    viewid: foursquareParams["viewId"],
                                    loadmode: "REPLACE",
                                    category: JSON.stringify(["foursquare_analytics_spend_stg", "foursquare_analytics_visitors_day_stg"]),
                                    profiletype: "WEB",
                                    hairzzlers_user_name: userInfo['username'],
                                    refresh_token: foursquareParams['refreshToken'],
                                    nbmds_user_row_id: userInfo['userid'],
                                    foursquare_user_name: userInfo['username'],
                                    access_token: foursquareParams['refreshToken'],
                                    start_date: dates.startDate,
                                    end_date: dates.endDate,
                                    mart_name: "Foursquare Analytics Spend",
                                    type: "refresh_token"
                                }];
                                logger("userConfigData before saving", userData);
                                var params = {
                                    ot: "uta",
                                    kv: JSON.stringify(userData),
                                    t: userInfo['token']
                                };
                                var callback = (callback || angular.noop);
                                $http({
                                    url: saveFoursquareConfigUrl,
                                    method: "POST",
                                    transformRequest: appUtil.transformRequestAsFormPost,
                                    data: params,
                                    timeout :appUtil.timeOutPromise()
                                }).success(function(data){
                                    deferred.resolve({status:"FOURSQUARECONFIGSAVEDSUCCESSFULLY",data:data});
                                }).error(function(data,status){
                                    deferred.reject({status:"ERRSAVINGFOURSQUARECONFIG",data:data});
                                });
                            }
                        });

                    return  deferred.promise;
                },
                /**
                 * get all the config created for the user uptill now
                 * @param callback
                 * @returns {*}
                 */
                getConfigList : function(){
                    var deferred = $q.defer();
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                var params = {
                                    ot: 'uta',
                                    an: 'nbmds_user_row_id~nbmdm_usr_atr_tps_row_id',
                                    av: userInfo["userid"] + '~foursquare53-2bfe-4613-84c1-4e578943',
                                    o: '=~=',
                                    t: userInfo['token']
                                };
                                $http.get(appSetting.doUrl(), {
                                    params: params,
                                    timeout :appUtil.timeOutPromise()
                                }).success(function(data){
                                    var adaptorConfig = [];
                                    angular.forEach(data.uta,function(value,key){
                                        this.push({
                                            id : value.row_id,
                                            name:value.name,
                                            start_date : value.start_date,
                                            end_date : value.end_date,
                                            loadmode:value.loadmode,
                                            viewid:value.viewid,
                                            viewname:value.viewname,
                                            access_token:value.access_token,
                                            loadfrequency: appUtil.getFrequency(value.start_date,value.end_date)
                                        });
                                    },adaptorConfig);
                                    deferred.resolve({status:"GOTFOURSQUARECONFIG",data:adaptorConfig});
                                }).error(function(msg,status){
                                    if(status==404){
                                        deferred.reject({status: "NOFOURSQUARECONFIGFOUND", msg: msg});
                                    }else {
                                        deferred.reject({status: "ERRGETTINGFOURSQUARECONFIG", msg: msg});
                                    }
                                });
                            }
                        });
                    return deferred.promise;
                },
                /**
                 * load the foursquare data from analytics to internal db
                 * @param callback
                 * @returns {*}
                 */
                loadData : function(configName) {
                    var deferred = $q.defer();
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                var params = {
                                    token: userInfo['token'],
                                    configname: configName.replace(/\./, ''),
                                    userid: userInfo["userid"],
                                    tenantid: userInfo["tenantId"],
                                    tokenid: userInfo['token']
                                };
                                $http.get(getFoursquareAdaptorUrl, {
                                    params: params,
                                    timeout :appUtil.timeOutPromise()
                                }).success(function(data){
                                    deferred.resolve({status:"FOURSQUAREDATALOADED",data:data});
                                }).error(function(data,status){
                                    deferred.resolve({status:"FOURSQUAREDATALOADISSUE",data:data});
                                });
                            }
                        });

                    return  deferred.promise;
                },
                createWorkFlow: function(configName) {
                    var deferred = $q.defer();
                    $localForage
                        .getItem('loggedInUserData') //ok lets get the data for offline access
                        .then(function(userInfo) { //got the data
                            if (typeof userInfo != 'undefined') {
                                var cronExp = null;
                                appSetting.getSolutionMapId()
                                    .then(function(solutionResponse){
                                        if(solutionResponse.status=="GOTSID"){
                                            var solutionMapId = solutionResponse.data;
                                            var options = {};
                                            options.period = 'weekly';
                                            switch (options.period) {
                                                case 'weekly':
                                                default:
                                                    cronExp = '0 0 12 ? * MON *';
                                                    break;
                                                case 'quarterly':
                                                    cronExp = '0 0 12 1/15 1/1 ? *';
                                                    break;
                                                case 'monthly':
                                                    cronExp = '0 0 12 ? 1/1 MON#1 *';
                                                    break;
                                                case 'yearly':
                                                    cronExp = '0 0 12 ? 1 MON#1 *';
                                                    break;
                                            }
                                            var username = userInfo['username'];
                                            var username = username.slice(0, username.indexOf("@"));
                                            var dates = appUtil.calculateDates('weekly');
                                            var params = {
                                                tenantid: userInfo["tenantId"],
                                                token: '${tokenid}',
                                                configname: configName.replace(/\./, ''),
                                                userid: userInfo["userid"],
                                                tokenid: '${tokenid}',
                                                start_date: dates.startDateWKformat,
                                                end_date: dates.endDateWKformat
                                            };

                                            return $http({
                                                url: workflowUrl + '?token=' + userInfo["token"] + '&time_zone=GMT+05:30',
                                                method: "POST",
                                                transformRequest: appUtil.transformRequestAsFormPost,
                                                data: {
                                                    adaptor_param: JSON.stringify({
                                                        webservice: getFoursquareAdaptorUrl,
                                                        adaptorParams: params,
                                                        serviceType: 'GET',
                                                        si_id: solutionMapId
                                                    }),
                                                    workflow_name: params.configname,
                                                    schedule_name: params.configname,
                                                    cron_exp: cronExp
                                                },
                                                timeout :appUtil.timeOutPromise()
                                            }).success(function(data){
                                                deferred.resolve({status:"WORKFLOWCREATED",data:data});
                                            }).error(function(msg,status){
                                                deferred.reject({status:"WORKFLOWCREATIONISSUE",msg:msg});
                                            });
                                        }else{
                                            deferred.reject({status:"NOSOLUTIONMAPID"});
                                        }
                                    });
                            }else{
                                deferred.reject({status:"NOTLOGGEDIN"});
                            }
                        });
                    return  deferred.promise;
                }
            }
        }]);
    });
}());