/**
 * Created by dev on 12/24/2014.
 */
;(function() {
    define(['modules/common/config/initModule','modules/common/providers/factory/stabilizer'],function (Hairzzlers) {
        'use strict';
        Hairzzlers.filter('groupBy',['$parse', 'filterStabilize', function ($parse, filterStabilize) {
            function groupBy(input, prop) {
                if (!input) { return; }
                var grouped = {};
                input.forEach(function(item) {
                    var key = $parse(prop)(item);
                    grouped[key] = grouped[key] || [];
                    grouped[key].push(item);
                });
                return grouped;
            }

            return filterStabilize(groupBy);
        }]);
    });
}());
