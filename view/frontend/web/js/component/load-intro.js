/**
  * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'jquery',
    'uiComponent',
    'introJs'
], function ($, Component, introJs) {
    'use strict';

    return Component.extend({
        initialize: function (config) {
            this._super();
            this.config = config;
            $('body').ready(() => {
                if (!config?.onboardings) return;
                this.render(config.onboardings)
            });
            return this;
        },

        /**
         * 
         * @param {Array} onboardings 
         */
        render(onboardings) {
            try {
                const onboarding = JSON.parse(onboardings.shift());
                this.load(onboarding, onboardings);
            } catch (error) {
                console.warn(error);
            }
        },

        /**
         * 
         * @param {Onboarding} onboarding 
         * @param {Array<Onboarding>} onboardings 
         */
        load(onboarding, onboardings) {
            const options = JSON.parse(onboarding.data_lib);
            let intro = introJs.render().setOptions(options);
            if (onboardings[0]) intro.onexit(this.render(onboardings));
            intro.start();
        }
    })

});
