/*!
   AppSetting factory act as setting processor at app initialization
 */
define(['modules/common/config/initModule', 'appConfig'], function (Hairzzlers) {
    'use strict';
    Hairzzlers.factory('appSetting', ['$http','$window', function ($http,$window) {
        var settings = {

        }
        return settings;
    }]);
});