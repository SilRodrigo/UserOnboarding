/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'jquery',
    'ko',
    'cssSelectorGenerator'
], function ($, ko, selectorGen) {
    'use strict';

    class OnboardingItem {

        /**
         * @type {string}
         */
        #title;

        /**
         * @type {string}
         */
        #content;

        /**
         * @type {string}
         */
        #element;

        /**
         * @type {string}
         */
        #elementSelector;

        /**
         * @type {HTMLElement}
         */
        #htmlContent;

        #generateHtmlContent() {
            if (!this.#content) return;
            let parser = document.createElement('div');
            parser.innerHTML = this.#content;
            this.#htmlContent = parser.firstChild;
        }

        #generateSelectorPath() {
            if (!this.#element) return;
            this.#elementSelector = selectorGen(this.#element);
        }

        constructor({ title, content, element }) {
            if (this.constructor == OnboardingItem) throw new Error("Abstract classes can't be instantiated.");
            this.save({ title, content, element })
        }

        get title() {
            return this.#title;
        }

        get content() {
            return this.#content;
        }

        save({ title, content, element }) {
            this.#title = title;
            this.#content = content;
            this.#element = element;
            this.#generateSelectorPath();
            this.#generateHtmlContent();
            console.log(this);
        }

    }

    return OnboardingItem;
});