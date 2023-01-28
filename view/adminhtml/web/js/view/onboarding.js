/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2022 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_Base
 */

define([
    'jquery',
    'ko',
    'Magento_Ui/js/form/element/abstract',
    'highlight',
], function ($, ko, Abstract, highlight) {
    'use strict';

    const IFRAME_CONFIG = {
        WIDTH: '100%',
        HEIGHT: '500px'
    }

    return Abstract.extend({

        defaults: {
            iframe: {
                url: ko.observable(''),
                width: IFRAME_CONFIG.WIDTH,
                height: IFRAME_CONFIG.HEIGHT,
                scope: null
            },
        },

        initialize() {
            this._super();
            this.iframe.url.subscribe(() => {

            })
            return this;
        },

        startLoading() {
            $('body').trigger('processStart');
        },

        stopLoading() {
            $('body').trigger('processStop');
        },

        /**
         * @param {HTMLIFrameElement} scope 
         */
        setIframeScope(scope) {
            this.iframe.scope = scope;
            scope.addEventListener('load', () => {
                this.stopLoading();
            })
        },

        /**
         * @param {string} url 
         * @returns 
         */
        renderIframe(url) {
            if (url === this.iframe.url()) return;
            this.startLoading();
            this.iframe.url(url);
            this.visible(true);
        },

        startOnboardingCreation() {
            this.iframe.scope.parentElement.classList.add('creating');
            let currentBody = this.iframe.scope.contentDocument.querySelector('body'),
                scopeWindow = this.iframe.scope.contentWindow;
            highlight(currentBody, scopeWindow);
        },

        closeOnboardingCreation() {
            this.iframe.scope.parentElement.classList.remove('creating');
        }

    });

});