/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define(['jquery'], function ($) {
    'use strict';

    class LibHandler {

        constructor() {
            if (this.constructor == LibHandler) throw new Error("Abstract classes can't be instantiated.");
        }

        /**
         * Returns an object with current Lib options to render it
         * 
         * @param {Object} data ex: {steps: [Step], hints: [Hint]}
         * @param {boolean} noQuery
         * @returns {Object}  
         */
        prepareData(data, noQuery) {
            return {};
        }

        /**
         * Receives an Onboarding object, extract its options and starts the onboarding tour
         * 
         * @param {Onboarding} onboarding 
         * @param {Function} callback this function will be executed when onboarding tour ends
         */
        start(onboarding, callback) { }
    }

    return LibHandler;
});