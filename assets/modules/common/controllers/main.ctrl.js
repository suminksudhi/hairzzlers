/**
 * Created by SUMIN on 8/27/2014.
 */

define(['modules/common/config/initModule'
    ],function (Hairzzlers) {
    'use strict';

    Hairzzlers.controller('MainCtrl', ['appConfig','$scope','$rootScope','$state', '$filter', '$location', '$http','appSetting','toastr',
        function (appConfig,$scope,$rootScope,$state, $filter, $location, $http,appSetting,toastr) {

            $rootScope.module = 'store';
            $scope.sampleText = '5p4s';
            $scope.ishome = false;
            $scope.logCaptureEnabled = false;

            var currentDate = new Date();
            var currentYear = currentDate.getFullYear();
            $rootScope.currentYear = currentYear;

            /**
             * open up a modal window
             */
            $rootScope.openModal = function(name,size){
                /**
                $rootScope.$broadcast('triggerModal',{
                        name : name,
                        size : size
                })
                 **/
            }



            $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                console.log(event, toState, toParams, fromState, fromParams, error);
                console.log(error);
                if(error.status=='ACCESSDENIED') {
                    toastr.remove();
                    var displayName = ((error.data && error.data.display_name)?error.data.display_name:'');
                    var userImage = ((error.data && error.data.image)?error.data.image:'')
                    toastr.error('Sorry, Access denied','Hello, '+displayName,{image:userImage})
                    $state.go('common.home');
                    /*
                    $rootScope.$evalAsync(function() {
                        $location.path('/login');
                    });
                    */
                }else if(error.status=='NOTLOGGEDIN'){
                    toastr.remove();
                    toastr.error('Please login in to access dashboard','Hello, there ',{style:'flip',top:20})
                    $state.go('common.home');
                }else{
                    var state = appConfig.override.state,
                        param = appConfig.override.param || {};
                    $state.go(state,param);
                }
                /** $rootScope.$broadcast('triggerModal',{
                         name : 'signIn',
                         size : 'md'
                    })**/
            });

            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                //console.trace();
                //console.log('start',event, toState, toParams, fromState, fromParams);
                var path = $location.path();
                $scope.ishome = (toState.name == 'common.main')?true:false;

                if(toState.name == 'common.launch'){
                    $rootScope.exploreState = {
                        name : fromState.name,
                        params : fromParams
                    }
                    console.log({
                        name : fromState.name,
                        params : fromParams
                    })
                }

            });

            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                //console.log('success',event, toState, toParams, fromState, fromParams);
                if (toState.name.indexOf('subscribe')>-1) {
                    $scope.restrictNav = true;
                } else {
                    $scope.restrictNav = false;
                }
                require(['js/waves'],function(Waves){
                    Waves.attach('.btn',['waves-float']);
                    Waves.init();
                });
            });


            /**
             * is invoken when the log switch is toggled
             * @param flag
             * @param oldflag
             */
            var toggleLogging = function(flag,oldflag){
                if(flag) {
                    (function () {
                        //saving the original console.log function
                        var preservedConsoleLog = console.warn;
                        //overriding console.log function
                        console.warn = function () {
                            preservedConsoleLog.apply(console, arguments);
                            setting.emit('appStore:log',{userAgent:navigator.userAgent,url:location.href,message:arguments[1]});
                        }
                    })();
                    console.warn('appError','from next app');
                }
            }

            $scope.$watch('logCaptureEnabled',toggleLogging);
            var setUserOS = function(){
                var OSName = "";
                if (navigator.appVersion.indexOf("Win") != -1) OSName = "windows";
                if (navigator.appVersion.indexOf("Mac") != -1) OSName = "mac";
                if (navigator.appVersion.indexOf("X11") != -1) OSName = "unix";
                if (navigator.appVersion.indexOf("Linux") != -1) OSName = "linux";

                $rootScope.OSName = OSName;
            }

            var setUserAgent = function(){
                if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
                    $rootScope.device = 'mobile';
                } else {
                    $rootScope.device = 'desktop';
                    if (navigator.userAgent.match(/MSIE 9.0/)) {
                        $rootScope.device ='desktop ie9';
                    }
                }
            };

            $scope.myInterval = 5000;
            var slides = $scope.slides = [];
            $scope.addSlide = function() {
                //var newWidth = 600 + slides.length + 1;
                slides.push({
                    image: '/images/banners/10'+[slides.length % 5]+'.jpg',
                    text: ['Fresh analytics delivered specially for you',
                        'Instant analytics for you',
                        'Affordable analytics for you',
                        'Analytics for everyone, everywhere',
                        'Business insights made simple for you'][slides.length % 5]
                });
            };
            for (var i=0; i<=4; i++) {
                $scope.addSlide();
            }

            var init = function() {

                var d = new Date();
                var n = d.getFullYear();
                $scope.CurrentYear = n;
                setUserOS();
                setUserAgent();
            };

            init();
        }])
});