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
                this.wysiwyg.value('');
                this.modal.find(CONFIG.TITLE_ID).val('').change();
                let wysiwyg_iframe = this.modal.find(CONFIG.WYSIWYG_IFRAME_ID);
                if (wysiwyg_iframe.length) {
                    wysiwyg_iframe[0].contentDocument.querySelector('body').firstChild?.remove();
                }
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

        call(callback) {
            this.callback = callback;
            this.setWysiwygPosition();
            this.modal.modal('openModal');
        }

        getContent() {
            return {
                title: this.modal.find(CONFIG.TITLE_ID).val(),
                content: this.wysiwyg.value()
            }
        }
    }

    return function (scope, options) {
        return new OnboardingModal(scope, options);
    }
});