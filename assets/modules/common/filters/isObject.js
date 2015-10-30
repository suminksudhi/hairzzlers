define(['modules/common/config/initModule'],function (Hairzzlers) {
    'use strict';
    Hairzzlers.filter('isObject', function () {
        return function (input) {
            return angular.isObject(input);
        };
    });
});