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
        Hairzzlers.directive('hairzzlersMap', ['$timeout','$document','$filter','appSetting','foursquareService','toastr','$window', function($timeout,$document,$filter,appSetting,foursquareService,toastr,$window) {
            'use strict';
            console.log('map')
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
                templateUrl: '/partials/components/map.html',
                controller: function($scope) {
                },
                link: function(scope, element, attrs) {

                    console.log('map')

                    //listen to call back for map api
                    $window.initMap = function(){
                        var myLatLng = {lat: -25.363, lng: 131.044};

                        // Create a map object and specify the DOM element for display.
                        var map = new google.maps.Map(document.getElementById('map'), {
                            center: myLatLng,
                            scrollwheel: false,
                            zoom: 4
                        });

                        // Create a marker and set its position.
                        var marker = new google.maps.Marker({
                            map: map,
                            position: myLatLng,
                            title: 'Hello World!'
                        });
                    }

                    require(["async!https://maps.googleapis.com/maps/api/js?key=AIzaSyB5_OkF6PlOMZhBPc9hijH6hr0Rfb-wsl8"],function(){
                        initMap()
                    })

                }
            };
        }]);
    });
}());