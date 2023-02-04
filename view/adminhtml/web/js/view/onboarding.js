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
    'introJs',
    'OnboardingStep',
], function ($, ko, Abstract, highlight, modal, introJs, Step) {
    'use strict';

    const MESSAGES = {}

    /**
     * @var {Object} IFRAME_CONFIG
     * @var {string} IFRAME_CONFIG.WIDTH
     * @var {string} IFRAME_CONFIG.HEIGHT
     */
    const IFRAME_CONFIG = {
        WIDTH: '100%',
        HEIGHT: '500px'
    };

    /**
     * @var {Object} CREATION_MODE
     * @var {string} CREATION_MODE.STEP
     * @var {string} CREATION_MODE.HINT
     */
    const CREATION_MODE = {
        STEP: 'STEP',
        HINT: 'HINT'
    }

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
                data: ko.observable('{}')
            },
            create: {
                step: function (element, data) {
                    let step = new Step({ ...data, element: element });
                    try {
                        let current_steps = this.onboarding.steps();
                        current_steps.push(step);
                        this.onboarding.steps(current_steps);
                    } catch (error) {
                        alert('create.step: ' + error);
                    }
                },
                hint: () => { }
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
                    label: ko.observable('Preview'),
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

        loadData() {
            if (this.value() && Object.keys(JSON.parse(this.value())).length) {
                let data = JSON.parse(this.value());
                this.creation_mode(CREATION_MODE.STEP);
                data.steps.forEach(step => {
                    this.create.step.bind(this)(null, { ...step, scope: this.iframe.scope.contentDocument })
                });
                this.creation_mode('');
                return;
            }
            this.value('{}');
        },

        // Getters

        /**
         * Returns a list of all creation type modes
         * @returns {Array<string>}
         */
        getCreationModeList() {
            let creationModeList = [];
            for (const KEY in CREATION_MODE) {
                creationModeList.push(CREATION_MODE[KEY]);
            }
            return creationModeList;
        },

        /**
         * Returns an array for html select
         * @returns Array
         */
        getCreationModeOptions() {
            let modes = this.getCreationModeList(),
                options = []
            modes.forEach(mode => { options.push({ value: mode, label: mode }) });
            return options;
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
                    };
                scopeWindow.introJs = introJs;
                this.highlight = highlight(currentBody, scopeWindow, actions);
                this.loadData();
                this.stopLoading();
            })
        },

        registerOnboardingField(element) {
            this.onboarding.data.subscribe(value => {
                $(element).val(value).change();
            })
        },

        // Trigger and toggles events

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
            this.button.reproduce.enable(!this.button.reproduce.enable());
            this.button.close.enable(!this.button.close.enable());
            this.status.is_inspecting(!this.status.is_inspecting());
            this.button.inspect.label(this.status.is_inspecting() ? 'Inspecting' : 'Inspect');
            this.highlight.toggle();
        },

        /**
         * Toggle onboarding preview
         */
        toggleReproduceOnboarding() {
            this.button.inspect.enable(!this.button.inspect.enable());
            this.button.inspect.visible(!this.button.inspect.visible());
            this.button.close.enable(!this.button.close.enable());
            this.button.close.visible(!this.button.close.visible());
            this.status.is_reproducing(!this.status.is_reproducing());
            this.button.reproduce.label(this.status.is_reproducing() ? 'Exit Preview' : 'Preview');
            if (this.status.is_reproducing()) {
                this.startIntroJs();
            }
        },

        /**
         * Lock for new creations and editing
         * @param {boolean} status 
         */
        lock(status) {
            this.status.is_locked(status);
        },

        /**
         * Call editing modal
         * @param {HTMLElement} element 
         */
        callModal(element) {
            if (this.status.is_locked()) return;
            this.lock(true);
            this.modal.call(data => {
                try {
                    let type = data.type.toLowerCase(),
                        callback = this.create[type].bind(this);
                    callback(element, data);
                } catch (error) {
                    alert('callModal: ' + error);
                }
            });
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
         * Closes iframe popup and saves created onboardings
         */
        closeOnboardingCreation() {
            this.iframe.scope.parentElement.classList.remove('creating');
            this.save(this.serializeData());
        },

        serializeData() {
            let steps = [];
            this.onboarding.steps().forEach((step, i) => {
                let serialized_data = step.getSerializedData();
                serialized_data.index = i;
                steps.push(serialized_data);
            })

            return JSON.stringify({
                steps: steps,
            });
        },

        save(serialized_data) {
            try {
                JSON.parse(serialized_data).steps;
            } catch (error) {
                return alert(error);
            }
            this.onboarding.data(serialized_data);
        },

        // Validations

        /**
         * @param {string} creation_mode 
         * @returns boolean
         */
        isValidCreationMode(creation_mode) {
            let is_valid = !!this.getCreationModeList().find(valid_mode => valid_mode === creation_mode);
            return is_valid;
        },

        // Lib IntroJs

        prepareStepsForIntroJs() {
            let stepsCollection = this.onboarding.steps();
            let steps = [{
                title: 'Preview',
                intro: $.mage.__('This is a preview of your Onboarding')
            }];
            stepsCollection.forEach(step => {
                steps.push(step.prepareDataForIntroJs(this.iframe.scope.contentDocument));
            })
            return { steps: steps };
        },

        startIntroJs() {
            let options = { ...this.prepareStepsForIntroJs() },
                intro = introJs();
            intro.setOptions(options).start();
        },

    });

});