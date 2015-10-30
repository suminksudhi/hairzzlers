;(function () {
    define([
        'modules/common/config/initModule'
    ], function (Hairzzlers) {
        'use strict';
        Hairzzlers.factory('filterStabilize', [
            'memoize',
            function(memoize) {
                function service(fn) {
                    function filter() {
                        var args = [].slice.call(arguments);
                        // always pass a copy of the args so that the original input can't be modified
                        args = angular.copy(args);
                        // return the `fn` return value or input reference (makes `fn` return optional)
                        var filtered = fn.apply(this, args) || args[0];
                        return filtered;
                    }
                    var memoized = memoize(filter);
                    return memoized;
                }
                return service;
            }
        ])
        .factory('memoize', [
            function() {
                function service() {
                    return memoizeFactory.apply(this, arguments);
                }
                function memoizeFactory(fn) {
                    var cache = {};

                    function memoized() {
                        var args = [].slice.call(arguments);
                        var key = JSON.stringify(args);
                        if (cache.hasOwnProperty(key)) {
                            return cache[key];
                        }
                        cache[key] = fn.apply(this, arguments);
                        return cache[key];

                    }
                    return memoized;
                }
                return service;

            }
        ]);
    });
}());
