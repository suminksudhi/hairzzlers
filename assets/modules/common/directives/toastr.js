
/**
 * Created by dev on 12/24/2014.
 */
;(function() {
    define(['modules/common/config/initModule'], function (Hairzzlers) {
        'use strict';
        Hairzzlers.directive('toast', ['$compile', '$interval', 'toastr', function($compile, $interval, toastr) {
            return {
                replace: true,
                templateUrl: 'templates/toastr/toastr.html',
                link: function(scope, element, attrs) {
                    var timeout;
                    scope.toastClass = scope.options.toastClass;
                    scope.titleClass = scope.options.titleClass;
                    scope.messageClass = scope.options.messageClass;

                }
            };
        }])
            .constant('toastrConfig', {
                allowHtml: false,
                closeButton: false,
                closeHtml: '<button>&times;</button>',
                containerId: 'toast-container',
                extendedTimeOut: 1000,
                iconClasses: {
                    error: 'toast-error',
                    info: 'toast-info',
                    success: 'toast-success',
                    warning: 'toast-warning'
                },
                messageClass: 'toast-message',
                newestOnTop: true,
                positionClass: 'toast-top-right',
                tapToDismiss: true,
                timeOut: 5000,
                titleClass: 'toast-title',
                toastClass: 'toast'
            })
            .factory('toastr', ['$animate', '$compile', '$document', '$rootScope', '$sce', 'toastrConfig', '$q', function($animate, $compile, $document, $rootScope, $sce, toastrConfig, $q) {
                var container, index = 0, toasts = [];
                var containerDefer = $q.defer();
                var toastr = {
                    error: function(message, title, options){

                        console.log(options)
                        options = angular.extend({},options,{
                            type: 'danger'
                        });
                        return toast(message, title, options);
                    },
                    info: function(message, title, options){
                        options = angular.extend({},options,{
                            type: 'info'
                        });
                        return toast(message, title, options);
                    },
                    remove: function(message, title, options){
                        $('body .pgn').remove();
                    },
                    success: function(message, title, options){
                        options = angular.extend({},options,{
                            type: 'success'
                        });
                        return toast(message, title, options);
                    },
                    warning: function(message, title, options){
                        options = angular.extend({},options,{
                            type: 'warning'
                        });
                        return toast(message, title, options);
                    }
                };
                return toastr;

                function toast(message, title, options) {
                    console.log(options)
                    var style = options.style || 'circle', //bar,flip,circle,simple
                        position = (options.position || ((style=='bar')?'top':'top-right')), //top-right,top-left,bottom-right,bottom-left
                        timeout = (options.timeout || 1000),
                        image = (options.image || 1000),
                        type = (options.type || 'info'); //info,warning,success,danger,default



                    $('body').pgNotification({
                        style: style,
                        title: title,
                        message: message,
                        position: position,
                        timeout: 1000,
                        type: type,
                        thumbnail: '<img width="40" height="40" style="display: inline-block;" src="'+image+'" data-src="'+image+'" data-src-retina="'+image+'" alt="">'
                    }).show();

                    if(options.top){
                        $('body > .pgn-wrapper[data-position^="top-"]').css({'top':options.top+'px'})
                    }
                    return true;
                }
            }]);
    });
}());
