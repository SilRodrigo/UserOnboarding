/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'jquery',
    'ko',
    'Magento_Ui/js/modal/alert',
    'Magento_Ui/js/form/element/abstract',
    'Onboarding',
    'OnboardingStep',
    'OnboardingLibHandler',
    'OnboardingIframe',
    './onboarding/modal',
    '../config/onboarding',
    'highlight',
    'introJs',
], function (
    $,
    ko,
    alertWidget,
    Abstract,
    Onboarding,
    Step,
    LibHandler,
    Iframe,
    modal,
    config,
    highlight,
    currentLib
) {
    'use strict';

    const CONFIG = { ...config };
    const DEFAULT_MODE = CONFIG.CREATION_MODE.STEP;
    const CURRENT_LIB = CONFIG.LIB.INTROJS;

    return Abstract.extend({

        /**
         * @type {Onboarding}
         */
        onboarding: new Onboarding(),

        /**
         * @type {LibHandler}
         */
        lib: new LibHandler(CURRENT_LIB, currentLib),

        /**
         * @type {Iframe}
         */
        iframe: new Iframe(ko.observable(''), CONFIG.IFRAME.WIDTH, CONFIG.IFRAME.HEIGHT),

        /**
         * @type {highlight}
         */
        highlight: null,

        /**
         * @type {modal}
         */
        modal: null,

        /**
         * Base view model properties and functions
         * @var {Object} defaults
         */
        defaults: {
            creation_mode: ko.observable(DEFAULT_MODE),
            create: {
                step(element, data, index) {
                    let step = new Step({ ...data, element: element });
                    try {
                        this.onboarding.add(CONFIG.COLLECTION_REFERENCE.step, step, index)
                    } catch (error) {
                        alert('create.step: ' + error);
                    }
                }
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
        },

        /**
         * Checks if onboarding already has data stored and if so populates the view
         */
        loadData() {
            if (!this.value()) return;
            this.onboarding.clear();
            let data = JSON.parse(this.value());
            for (const key in data) {
                data[key].forEach(item => {
                    let create = this.create[item.type].bind(this);
                    create(null, { ...item, scope: this.iframe.scope.contentDocument });
                });
            }
        },

        // Getters

        /**
         * Returns a list of all creation type modes
         * @returns {Array<string>}
         */
        getCreationModeList() {
            let creationModeList = [];
            for (const KEY in CONFIG.CREATION_MODE) {
                creationModeList.push(CONFIG.CREATION_MODE[KEY]);
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
         * Sets onboarding scope based on HTMLIFrameElement passed
         * @param {HTMLIFrameElement} scope 
         */
        setIframeScope(scope) {
            this.iframe.scope = scope;
            scope.addEventListener('load', () => {
                let currentBody = scope.contentDocument.body,
                    scopeWindow = scope.contentWindow,
                    actions = {
                        click: e => { this.newItem(e) }
                    };
                this.highlight = highlight(currentBody, scopeWindow, actions);
                this.loadData();
                this.stopLoading();
            })
        },

        /**
         * Link a HTMLInputElement to observe any alteration on onboarding data
         * and later be processed to be saved on DB
         * @param {HTMLInputElement} element 
         */
        registerOnboardingField(element) {
            this.onboarding.data.subscribe(value => {
                $(element).val(value).change();
                this.source.data.data_lib = this.onboarding.data_lib();
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
            this.button.inspect.label(this.status.is_inspecting() ? $.mage.__('Inspecting') : $.mage.__('Inspect'));
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
            this.button.reproduce.label(this.status.is_reproducing() ? $.mage.__('Exit Preview') : $.mage.__('Preview'));
            if (this.status.is_reproducing()) {
                this.lib.start(this.onboarding, this.iframe.scope.contentDocument, this.iframe.scope.contentWindow);
            }
        },

        /**
         * Lock for new creations and editing
         * @param {boolean} status 
         */
        lock(status) {
            this.status.is_locked(status);
        },

        // View events

        /**
         * Evokes modal for creating/editing an Item
         * @param {Function} callback
         */
        callModal(callback, content) {
            if (this.status.is_locked()) return;
            this.lock(true);
            this.modal.call(callback, content);
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

        /**
         * Pops up current iframe for editing
         */
        startOnboardingCreation() {
            this.iframe.scope.parentElement.classList.add('creating');
            document.body.classList.add('overflow-hidden');
        },

        /**
         * Closes iframe popup and saves created onboardings
         */
        closeOnboardingCreation() {
            this.iframe.scope.parentElement.classList.remove('creating');
            document.body.classList.remove('overflow-hidden');
            this.save();
        },

        // Data handling

        /**
         * Returns a JSON with stringfied data from onboarding collections
         * @returns {JSON}
         */
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

        /**
         * Adds a Item to it's respective collection
         * @param {HTMLElement} target_element 
         */
        newItem(target_element) {
            this.callModal(data => {
                try {
                    let type = data.type.toLowerCase(),
                        callback = this.create[type].bind(this);
                    callback(target_element, data);
                } catch (error) {
                    alert('callModal: ' + error);
                }
            }, { type: DEFAULT_MODE });
        },

        /**
         * Changes data from an onboarding Item
         * @param {Item} item 
         * @param {number} current_index 
         */
        editItem(item, current_index) {
            this.callModal(data => {
                if (item.type !== data.type) return alert(CONFIG.MESSAGE.NOT_IMPLEMENTED);
                let collection = this.onboarding[CONFIG.COLLECTION_REFERENCE[data.type]](),
                    callback = this.create[data.type].bind(this);
                collection.splice(current_index, 1);
                callback(item.element, data, current_index);
            }, item.getSerializedData())
        },

        /**
         * Deletes a item from onboarding collection
         * @param {Item} item 
         * @param {number} current_index 
         */
        deleteItem(item, current_index) {
            const self = this;
            alertWidget({
                title: $.mage.__('Are you sure you want to delete this %1?').replace('%1', $.mage.__(item.type)),
                buttons: [
                    {
                        text: $.mage.__('Cancel'),
                        class: 'action-secondary action-dismiss',
                        click: function () {
                            this.closeModal(true);
                        }
                    },
                    {
                        text: $.mage.__('Delete'),
                        class: 'action-primary action-accept',
                        click: function () {
                            self.onboarding.delete(item, current_index);
                            this.closeModal(true);
                        }
                    },
                ]
            });
        },

        /**
         * Saves current onboarding data
         */
        save() {
            let serialized_data = this.serializeData(),
                data_lib = this.lib.getData(this.onboarding, this.iframe.scope.contentDocument, true)
            try {
                JSON.parse(serialized_data);
                data_lib = JSON.stringify(data_lib);
            } catch (error) {
                return alert('save: ' + error);
            }
            this.onboarding.data_lib(data_lib);
            this.onboarding.data(serialized_data);
        },

    });

});