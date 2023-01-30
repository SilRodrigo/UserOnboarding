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
    'highlight',
    'introJs',
    './onboarding/modal',
], function ($, ko, uiRegistry, Abstract, highlight, introJs, modal) {
    'use strict';

    const IFRAME_CONFIG = {
        WIDTH: '100%',
        HEIGHT: '500px'
    };

    return Abstract.extend({

        // Configurations triggered by afterRender

        /**
         * Instantiate editing modal
         * @param {HTMLElement} e 
         */
        initModal(e) {
            const self = this;
            this.modal = modal($(e), {
                buttons: [{
                    text: $.mage.__('Confirm'),
                    class: 'primary',
                    click: function () {
                        /* Add confirmation logic here */
                        this.closeModal();
                    }
                }]
            });
        },

        /**
         * @param {HTMLIFrameElement} scope 
         */
        setIframeScope(scope) {
            this.iframe.scope = scope;
            scope.addEventListener('load', () => {
                let currentBody = scope.contentDocument.querySelector('body'),
                    scopeWindow = scope.contentWindow,
                    actions = {
                        click: (e) => this.callModal(e)
                    }
                this.highlight = highlight(currentBody, scopeWindow, actions);
                this.stopLoading();
            })
        },

        /**
         * @var {Object} defaults
         */
        defaults: {
            iframe: {
                url: ko.observable(''),
                width: IFRAME_CONFIG.WIDTH,
                height: IFRAME_CONFIG.HEIGHT,
                scope: null
            },
            highlight: null,
            modal: null
        },

        startLoading() {
            $('body').trigger('processStart');
        },

        stopLoading() {
            $('body').trigger('processStop');
        },

        /**
         * Toggle iframe inspecting mode
         */
        toggleInspecting() {
            this.highlight.toggle();
        },

        /**
         * Call editing modal
         */
        callModal() {
            this.modal.call();
        },

        /**
         * Pops up current iframe for editing
         */
        startOnboardingCreation() {
            this.iframe.scope.parentElement.classList.add('creating');
        },

        /**
         * Closes iframe popup
         */
        closeOnboardingCreation() {
            this.iframe.scope.parentElement.classList.remove('creating');
            if (this.highlight) this.highlight.stop();
        },

        /**
         * Render passing url to iframe element
         * @param {string} url 
         * @returns 
         */
        renderIframe(url) {
            if (url === this.iframe.url()) return;
            this.startLoading();
            this.iframe.url(url);
            this.visible(true);
        },

    });

});