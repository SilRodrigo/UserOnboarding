/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'jquery',
    'ko',
    'uiRegistry',
    'Magento_Ui/js/form/element/abstract',
    'Magento_Ui/js/modal/alert',
], function ($, ko, uiRegistry, Abstract, alert) {
    'use strict';

    const URL_CONFIG = {
        PROTOCOL: location.protocol,
        HOST: location.host,
        ORIGIN: location.protocol + '//' + location.host + '/'
    }
    const ONBOARDING_REGISTRY = 'user_onboarding_form.user_onboarding_form.onboarding_field.onboarding';

    return Abstract.extend({

        defaults: {
            onboardingComponent: null,
            placeholder: 'ex: /customer/account/',
            listens: {
                value: 'renderUrl'
            }
        },

        initialize() {
            this._super();
            const self = this;
            this.source.data = new Proxy(this.source.data, {
                set(obj, prop, value) {
                    if (prop === 'page_url') obj[prop] = self.value();
                    else obj[prop] = value;
                    return true;
                },
            });
            return this;
        },

        /**
         * @param {string} url 
         * @returns string
         */
        prepareUrl(url) {
            if (!url) return;
            if (this.validateUrl(url)) {
                if (!this.compareUrl(url)) throw new Error();
                return url;
            }
            url = url.replace(URL_CONFIG.HOST, '');
            url = url.replace(/^\//, '');
            url = URL_CONFIG.ORIGIN + url;
            return this.prepareUrl(url);
        },

        /**
         * @param {string} url 
         * @returns boolean
         */
        validateUrl(url) {
            try {
                url = new URL(url);
                return true;
            } catch (error) {
                return false;
            }
        },

        /**
         * @param {string} protocol 
         * @param {string} host 
         * @returns boolean
         */
        compareUrl(url) {
            url = new URL(url);
            return url.protocol === URL_CONFIG.PROTOCOL && url.host === URL_CONFIG.HOST;
        },

        /**
         * Checks if input value is a valid URL and set it to iframe on onboarding component
         */
        renderUrl() {
            try {
                let valid_url = this.prepareUrl(this.value());
                if (!valid_url) return;
                this.value(valid_url);
                this.source.data.page_url = valid_url;
                uiRegistry.get(ONBOARDING_REGISTRY, onboarding => {
                    onboarding.renderIframe(valid_url)
                });
            } catch (error) {
                $(`[name="${this.inputName}"]`).val('').change();
                alert({ title: $.mage.__('Invalid URL, please review your Page Url input.') });
            }
        },

    });

});