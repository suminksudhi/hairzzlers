define(['modules/common/config/initModule'],function (Hairzzlers) {
    'use strict';
    Hairzzlers.filter('isEmpty', function () {
        var bar;
        return function (value) {

            if (typeof value === 'undefined' || value === null)
                return true;
            else if (typeof value === 'object') {
                return (Object.keys(value).length == 0) ? true : false;
                /**
                 * check all sub vals
                 for (bar in value) {
                    if (value.hasOwnProperty(bar)) {
                        return false;
                    }
                }
                 */
            } else if (typeof value === 'string')
                value = value.toLowerCase().trim();

            switch (value) {
                case "null":
                case "undefined":
                case null:
                case "":
                    return true;
                default:
                    return false;
            }
        };
    });
});