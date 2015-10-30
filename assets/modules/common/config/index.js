/**
 * Created by Sumin K Sudhi on 11/10/2014.
 */
;(function(){
    define([
        'modules/common/controllers/main.ctrl',    //root controller processing everything
        'modules/common/controllers/modal.ctrl',   //used for modal box
        'modules/common/providers/factory/stabilizer', //filterStabilize and memoize for memory itensive array processing
        'modules/common/providers/factory/appSettingFactory', //AppSetting factory act as setting processor at app initialization
        'modules/common/providers/factory/utilityFactory', //supportive factory for all authentication based processing
        'modules/common/providers/factory/sessionFactory', //some utility for http intercepting

        'modules/common/directives/header', //directive component for processing header
        'modules/common/directives/toastr', //toast messages
        'modules/common/filters/groupBy', //used to groupBy a key value
        'modules/common/filters/isEmpty', //used to check if empty thing string,object or anything
        'modules/common/filters/isObject' //used to check if object or not
    ], function() {'use strict';});
}());