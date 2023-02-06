/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'jquery'
], function ($) {
    'use strict';

    const CONFIG = {
        IFRAME: {
            WIDTH: '100%',
            HEIGHT: '500px'
        },
        CREATION_MODE: {
            STEP: 'STEP',
        },
        COLLECTION_REFERENCE: {
            step: 'steps',
        },
        LIB: {
            INTROJS: 'introjs'
        },
        MESSAGE: {
            NOT_IMPLEMENTED: $.mage.__('This function is not implemented yet'),
            INVALID_COLLECTION: $.mage.__('Invalid collection reference'),
        },
    }

    return CONFIG;
});