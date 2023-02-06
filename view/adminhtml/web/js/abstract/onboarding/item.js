/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'cssSelectorGenerator',
], function (selectorGen) {
    'use strict';

    let id = 1;

    class OnboardingItem {

        /**
         * @type {number}
         */
        #id;

        /**
         * @type {string}
         */
        #type;

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
         * @type {HTMLElement}
         */
        #item;

        /**
         * @type {string}
         */
        #elementSelector;

        /**
         * @type {HTMLElement}
         */
        #htmlContent;

        /**
         * @type {boolean}
         */
        #is_displayed = false;

        #generateHtmlContent() {
            if (!this.#content) return;
            let parser = document.createElement('div');
            parser.innerHTML = this.#content;
            this.#htmlContent = parser;
        }

        #generateSelectorPath() {
            if (!this.#element) return;
            this.#elementSelector = selectorGen(this.#element);
        }

        /**
         * 
         * @param {string} selector 
         * @param {HTMLElement} scope 
         * @returns 
         */
        #restoreElement(selector, scope) {
            let element = scope.querySelector(selector);
            if (element) return element;
        }

        constructor({ title, content, element, selector, scope, type }) {
            if (this.constructor == OnboardingItem) throw new Error("Abstract classes can't be instantiated.");
            if (!type) throw new Error("Item type cannot be null");
            this.#id = id++;
            this.#type = type;
            if (selector && scope) element = this.#restoreElement(selector, scope);
            this.save({ title, content, element })
        }

        get id() {
            return this.#id;
        }

        get type() {
            return this.#type;
        }

        get title() {
            return this.#title;
        }

        get content() {
            return this.#content;
        }

        get element() {
            return this.#element;
        }

        get selector() {
            return this.#elementSelector;
        }

        save({ title, content, element }) {
            this.#title = title;
            this.#content = content;
            this.#element = element;
            this.#generateSelectorPath();
            this.#generateHtmlContent();
        }

        /**
         * @param {HTMLHtmlElement} item
         */
        linkItemElement(item) {
            this.#item = item;
            if (!this.#element) return;
            item.addEventListener('mousemove', () => {
                if (this.#is_displayed) return;
                this.#is_displayed = true;
                this.#element.style.backgroundColor = '#9898ff';
            }, true);
            item.addEventListener('mouseleave', () => {
                if (!this.#is_displayed) return;
                this.#is_displayed = false;
                this.#element.style.backgroundColor = '';
            })
        }

        linkEditEvent(element, event) {
            element.onclick = event;
        }

        unlinkHtml() {
            this.#item.remove();
        }

        getSerializedData() {
            return {
                title: this.title,
                content: this.content,
                selector: this.selector,
                type: this.type
            }
        }

    }

    return OnboardingItem;
});