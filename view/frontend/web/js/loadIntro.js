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
            $('body').ready(() => this.loadIntro());
            return this;
        },

        loadIntro: function () {
            try {
                if (!this.config?.onboarding?.data_lib) return;
                const options = JSON.parse(this.config.onboarding.data_lib);
                introJs.render().setOptions(options).start();
            } catch (error) {
                console.warn(error);
            }
        },
    })

});
