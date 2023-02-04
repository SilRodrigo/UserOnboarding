/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'jquery',
    'ko',
    'uiRegistry',
    'Magento_Ui/js/modal/modal',
], function ($, ko, uiRegistry, modal) {
    'use strict';

    const CONFIG = {
        TITLE_ID: '#title',
        TYPE_ID: '#creation_type',
        WYSIWYG_IFRAME_ID: '#user_onboarding_form_wysiwyg_ifr',
        WYSIWYG_REGISTRY: 'user_onboarding_form.user_onboarding_form.onboarding_field.wysiwyg',
    }

    class OnboardingModal {

        /**
         * @type {$}
         */
        modal;

        /**
         * @type {Object}
         */
        wysiwyg;

        /**
         * @type {Function}
         */
        callback;

        #getModalOptions() {
            const self = this;
            return {
                type: 'popup',
                responsive: true,
                title: $.mage.__('Add your instructions'),
                buttons: [{
                    text: $.mage.__('Confirm'),
                    class: 'primary',
                    click: function () {
                        if (self.callback) self.callback(self.getContent());
                        this.closeModal();
                    }
                }]
            }
        }

        constructor(modal_scope, custom_options = {}) {
            this.modal = $(modal_scope);
            const modal_options = this.#getModalOptions() || {};
            modal({ ...modal_options, ...custom_options }, this.modal);
            this.modal.on('modalclosed', () => {
                this.setContent({});
            })
        }

        setWysiwygPosition() {
            uiRegistry.get(CONFIG.WYSIWYG_REGISTRY, wysiwyg => {
                let $wysiwyg = this.modal.find(`[data-index="${wysiwyg.index}"]`);
                if ($wysiwyg.length) return;
                this.modal.append(wysiwyg.fieldElement);
                wysiwyg.$wysiwygEditorButton[0].click();
                wysiwyg.$wysiwygEditorButton[0].click();
                wysiwyg.visible(true);
                this.wysiwyg = wysiwyg;
            });
        }

        setWysiwygContent(content = '') {
            this.wysiwyg.value(content);
            let wysiwyg_iframe = this.modal.find(CONFIG.WYSIWYG_IFRAME_ID);
            if (wysiwyg_iframe.length) {
                wysiwyg_iframe[0].contentDocument.querySelector('body').innerHTML = content;
            }
        }

        call(callback, content) {
            this.setWysiwygPosition();
            this.callback = callback;
            this.setContent(content);
            this.modal.modal('openModal');
        }

        getContent() {
            return {
                type: this.modal.find(CONFIG.TYPE_ID).val().toLowerCase(),
                title: this.modal.find(CONFIG.TITLE_ID).val(),
                content: this.wysiwyg.value()
            }
        }

        /**
         * @param {string} type
         * @param {string} title
         * @param {string} content
         */
        setContent({ type, title, content }) {
            if (type) this.modal.find(CONFIG.TYPE_ID).val(type.toUpperCase());
            this.modal.find(CONFIG.TITLE_ID).val(title);
            this.setWysiwygContent(content);
        }
    }

    return function (scope, options) {
        return new OnboardingModal(scope, options);
    }
});