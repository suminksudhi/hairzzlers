/**
 * Created by Sumin K Sudhi on 11/30/2014.
 * loads sub modules and wraps them up into the main module.
 * This should be used for top-level module definitions only.
 */
define(['angular',
    //app level constants are defined here
    'appConfig',
    'dependency',
    'library',
    'modules/adaptors/config/index',
    'modules/common/config/index',
    'app'
], function (angular) {
    'use strict';
    angular.module('Hairzzlers', [
        'Hairzzlers.Constants',
        'Hairzzlers.libs',
        'Hairzzlers.Dependency',
        'Hairzzlers.Adaptor',
        'Hairzzlers.Common'
    ]);
});
