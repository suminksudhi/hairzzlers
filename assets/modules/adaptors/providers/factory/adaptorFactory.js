/*!
   AppSetting factory act as setting processor at app initialization
 */
define(['modules/adaptors/config/initModule'], function (Hairzzlers) {
    'use strict';
    Hairzzlers.factory('adaptor', ['$http','$q','$localForage','appSetting',function ($http,$q,$localForage,appSetting) {
        var settings = {
            /**
             * get the list of adaptors applicable for a user
             * @param userId
             */
            getAdaptorList:function (userId) {
                // readLeadItem
            },
            /**
             * get the list of users using a particular adaptor
             * @param adaptorsId
             */
            getAdaptorUsers : function(adaptorsId){}
        }
        return settings;
    }]);
});