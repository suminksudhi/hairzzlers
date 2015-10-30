/**
 * Header directive reusable component
 */
;(function() {
    define(['modules/common/config/initModule'], function (Hairzzlers) {
        'use strict';
        Hairzzlers.directive('hairzzlersHeader', ['$window', '$timeout','$document','$filter','$localForage','$rootScope', function($window, $timeout,$document,$filter,$localForage,$rootScope) {
            'use strict';

            return {
                restrict: 'AE',
                scope: {
                    width: '@width',
                    height: '@height',
                    color:  '@naHeaderBgColor',
                    cssclass: '@naHeaderClass',
                    brandName: '@naHeaderBrandName',
                    brandImgUrl: '@naHeaderBrandImgUrl',
                    openSettings: '&',
                    logOut: '&'
                },
                transclude: true,
                replace: true,
                templateUrl:  function(elem,attrs) {
                    var template = attrs.src || 'partials/components/header.html'
                    return template;
                },
                link: function(scope, element, attrs) {

                    console.log('headre invoked')
                    scope.display = {
                        settings: true,
                        admin: false,
                        notification : false
                    };


                    $rootScope.$on("$stateChangeSuccess", function (data,route) {
                        var template = 'home';
                        if(route.originalPath) {
                            if (route.originalPath.indexOf('explore') > -1)
                                template = 'explore';
                            else if (route.originalPath.indexOf('common') > -1)
                                template = 'common';
                            else if (route.originalPath.indexOf('demoReg') > -1)
                                template = 'demoReg';
                            else if (route.originalPath.indexOf('signIn') > -1)
                                template = 'signIn';
                        }

                        scope.template = template;
                    });

                    /**
                     * invoked for signup and demo panels
                     * will trigger the parent modal
                     * @param template
                     */
                    scope.openModal = function(template){
                        scope.$emit('triggerModal',{
                            name:template,
                            size:'md'
                        });
                    };

                    /**
                     * clear user session data
                     */
                    scope.logout= function(){
                        $localForage.clear().then(function(data){
                            console.log(data);
                            location.reload();
                        });
                    };

                    var updateLoginInfo = function() {
                        $localForage
                            .getItem('loggedInUserData') //ok lets get the data for offline access
                            .then(function (userInfo) { //got the data
                                if (userInfo!=null && typeof userInfo != 'undefined')
                                    scope.userInfo = {
                                        imageUrl: userInfo["image"],
                                        userName: userInfo["username"],
                                        displayName: userInfo["display_name"]
                                    }
                            });
                    }

                    if(scope.display.settings){
                        if((typeof scope.openSettings == 'undefined') || !angular.isFunction(scope.openSettings)){
                            console.warn("header settings cannot be enable please assign clickable openSettings");
                            scope.display.settings = false;
                        }
                    }

                    $rootScope.$on('loggedIn',updateLoginInfo);

                    // cleanup after ourselves
                    scope.$on('$destroy', function() {
                    });

                    scope.$on('LocalForageModule.setItem',function(event,data){
                       // console.log('something set of localdb',event,data)
                    });

                    scope.$on('LocalForageModule.removeItem',function(event,data){
                       // console.log('something removed of localdb',event,data)
                    });

                    var init = function(){
                        updateLoginInfo();
                    };
                    init();
                }
            };
        }]);
    });
}());