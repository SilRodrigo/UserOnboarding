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

    const MODAL_OPTIONS = {
        type: 'popup',
        responsive: true,
        title: $.mage.__('Add your instructions'),
        buttons: [{
            text: $.mage.__('Confirm'),
            class: 'primary',
            click: function () {
                this.closeModal();
            }
        }]
    }
    const WYSIWYG_REGISTRY = 'user_onboarding_form.user_onboarding_form.onboarding_field.wysiwyg';

    class OnboardingModal {

        modal;

        #init(modal_scope, options) {
            this.modal = $(modal_scope);
            modal(options, this.modal);
        }

        constructor(modal_scope, options = MODAL_OPTIONS) {
            this.#init(modal_scope, { ...MODAL_OPTIONS, ...options });
        }

        setWysiwygPosition() {
            uiRegistry.get(WYSIWYG_REGISTRY, wysiwyg => {
                let $wysiwyg = this.modal.find(`[data-index="${wysiwyg.index}"]`);
                if ($wysiwyg.length) return;
                this.modal.append(wysiwyg.fieldElement);
                wysiwyg.$wysiwygEditorButton[0].click();
                wysiwyg.$wysiwygEditorButton[0].click();
                wysiwyg.visible(true);
                this.wysiwyg = wysiwyg;
            });
        }

        call() {
            this.setWysiwygPosition();
            this.modal.modal('openModal');
        }
    }

    return function (scope, options) {
        return new OnboardingModal(scope, options);
    }
});