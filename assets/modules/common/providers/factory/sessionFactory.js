/**
 * Created by Sumin K Sudhi on 11/11/2014.
 */

define(['modules/common/config/initModule'],function (Hairzzlers) {
    'use strict';
    Hairzzlers.factory('sessionInterceptor',['$q','$injector','$rootScope',function ($q,$injector,$rootScope) {
        var sessionRecoverer = {
            responseError: function(response) {
                var deferred = $q.defer();
                switch(response.status){
                    case 403:
                        //@todo handle it
                        break;
                    case -1:case 0:
                        //$injector.get('toastr').info('check internet','sorry',{style:'bar'});
                        break;
                }
                return deferred.promise;
            }
        };
        return sessionRecoverer;
    }]);
});