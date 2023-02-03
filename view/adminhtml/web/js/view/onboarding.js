/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'jquery',
    'ko',
    'Magento_Ui/js/form/element/abstract',
    'highlight',
    './onboarding/modal',
    './onboarding/intro',
    'OnboardingStep',
], function ($, ko, Abstract, highlight, modal, introJs, Step) {
    'use strict';

    const MESSAGES = {
        INVALID_CREATION_MODE: $.mage.__('Invalid Creation Mode!')
    }

    const IFRAME_CONFIG = {
        WIDTH: '100%',
        HEIGHT: '500px'
    };

    const CREATION_MODE = {
        STEPS: 'STEPS',
        HINTS: 'HINTS'
    }

    /**
     * @type {string}
     */
    const DEFAULT_MODE = CREATION_MODE.STEPS;

    return Abstract.extend({

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
            onboarding: {
                steps: ko.observableArray([]),
                hints: ko.observableArray([]),
            },
            modeFunctions: {
                steps: () => { },
                hints: () => { }
            },
            button: {
                inspect: {
                    visible: ko.observable(true),
                    enable: ko.observable(true),
                    label: ko.observable('Inspect'),
                    css: ko.observable('inspect-icon-after'),
                },
                reproduce: {
                    visible: ko.observable(true),
                    enable: ko.observable(true),
                    label: ko.observable('Reproduce'),
                    css: ko.observable('play-icon-after'),
                },
                close: {
                    visible: ko.observable(true),
                    enable: ko.observable(true)
                }
            },
            status: {
                is_locked: ko.observable(false),
                is_reproducing: ko.observable(false),
                is_inspecting: ko.observable(false)
            },
            highlight: null,
            modal: null,
            creation_mode: ko.observable(''),
        },

        initialize() {
            this._super();
            this.modeFunctions.steps = this.createStep;
            this.modeFunctions.hints = this.createHint;
            return this;
        },

        // Configurations triggered by afterRender

        /**
         * Instantiate editing modal
         * @param {HTMLElement} e 
         */
        initModal(e) {
            const self = this;
            this.modal = modal($(e), {
                'closed': function () {
                    self.lock(false);
                },
            });
        },

        /**
         * @param {HTMLIFrameElement} scope 
         */
        setIframeScope(scope) {
            this.iframe.scope = scope;
            scope.addEventListener('load', () => {
                let currentBody = scope.contentDocument.body,
                    scopeWindow = scope.contentWindow,
                    actions = {
                        click: e => { this.callModal(e) }
                    }
                this.highlight = highlight(currentBody, scopeWindow, actions);
                this.stopLoading();
            })
        },

        // Simple events

        startLoading() {
            $('body').trigger('processStart');
        },

        stopLoading() {
            $('body').trigger('processStop');
        },

        /**
         * Call editing modal
         * @param {string} onboarding_mode 
         */
        callModal(element, onboarding_mode = DEFAULT_MODE) {
            let callback = this.modeFunctions[onboarding_mode.toLowerCase()].bind(this);
            if (!callback || this.status.is_locked()) return;
            this.lock(true, onboarding_mode);
            this.modal.call(data => {
                callback(element, data);
            });
        },

        /**
         * Lock for new creations and editing
         * @param {boolean} status 
         */
        lock(status, creation_mode) {
            if (status && !this.isValidCreationMode(creation_mode)) throw new Error('Invalid parameters for locking');
            this.creation_mode(creation_mode || DEFAULT_MODE);
            this.status.is_locked(status);
        },

        /**
         * Toggle iframe inspecting mode
         */
        toggleInspecting() {
            this.button.reproduce.enable(!this.button.reproduce.enable());
            this.button.close.enable(!this.button.close.enable());
            this.status.is_inspecting(!this.status.is_inspecting());
            this.button.inspect.label(this.status.is_inspecting() ? 'Inspecting' : 'Inspect');
            this.highlight.toggle();
        },

        toggleReproduceOnboarding() {
            this.button.inspect.enable(!this.button.inspect.enable());
            this.button.inspect.visible(!this.button.inspect.visible());
            this.button.close.enable(!this.button.close.enable());
            this.button.close.visible(!this.button.close.visible());
            this.status.is_reproducing(!this.status.is_reproducing());
            this.button.reproduce.label(this.status.is_reproducing() ? 'Reproducing' : 'Reproduce');
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

        // Creation events

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
        },

        /**
         * @returns Array
         */
        getCreationModeList() {
            let creationModeList = [];
            for (const KEY in CREATION_MODE) {
                creationModeList.push(CREATION_MODE[KEY]);
            }
            return creationModeList;
        },

        getCreationModeOptions() {
            let modes = this.getCreationModeList(),
                options = []
            modes.forEach(mode => { options.push({ value: mode }) });
            return options;
        },

        createStep(element, data) {
            if (this.creation_mode() !== CREATION_MODE.STEPS) throw new Error(MESSAGES.INVALID_CREATION_MODE);
            let step = new Step({ ...data, element: element });
            let current_steps = this.onboarding.steps();
            current_steps.push(step);
            this.onboarding.steps(current_steps);
        },

        createHint(data) {
            if (this.creation_mode() !== CREATION_MODE.HINTS) throw new Error(MESSAGES.INVALID_CREATION_MODE);

        },

        // Validations

        /**
         * @param {string} creation_mode 
         * @returns boolean
         */
        isValidCreationMode(creation_mode) {
            let is_valid = !!this.getCreationModeList().find(valid_mode => valid_mode === creation_mode);
            return is_valid;
        }

    });

});