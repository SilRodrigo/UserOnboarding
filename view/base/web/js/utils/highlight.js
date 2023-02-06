define([
    'jquery',
], function ($) {
    'use strict';

    /* Based on https://jsfiddle.net/1jvdacrk/2/ */

    class highlight {

        /**
         * @type {HTMLElement}
         */
        #currentlyHighlightedItem;

        /**
         * @type {HTMLElement}
         */
        #validSelectedElement;

        /**
         * @type {HTMLDivElement}
         */
        #highlight;

        /**
         * @type {Window}
         */
        #scopeWindow;

        /**
         * @type {Document}
         */
        #page;

        /**
         * @type {boolean}
         */
        #is_active = false;

        #actions = {
            click: function () { }
        };

        /**
         * @param {Document} page 
         * @param {Window} scopeWindow 
         * @param {Object} actions 
         */
        constructor(page, scopeWindow = null, actions = {}) {
            this.#highlight = this.#createHighlightElement();
            this.#page = page;
            this.#scopeWindow = scopeWindow || window;

            this.#page.addEventListener('mousemove', (e) => {
                if (!this.#is_active) return;
                this.#highlightElement(e.target);
            }, true);
            this.#page.addEventListener('mouseleave', (e) => {
                if (!this.#is_active) return;
                this.#highlight.remove();
                this.#currentlyHighlightedItem = null;
            });
            this.#page.addEventListener('mousedown', (e) => {
                if (!this.#is_active) return;
                e.preventDefault();
                this.#validSelectedElement = e.target;
                this.#highlight.style.pointerEvents = 'auto';
            });
            this.#page.addEventListener('mouseup', (e) => {
                if (!this.#is_active) return;
                e.preventDefault();
                this.#actions.click(this.validSelectedElement);
                this.#highlight.style.pointerEvents = 'none';
            });

            for (const key in actions) {
                this.#actions[key] = actions[key];
            }
        }

        #createHighlightElement() {
            let highlight = document.createElement('div');
            highlight.id = 'highlight';
            Object.assign(highlight.style, {
                'position': 'absolute',
                'background-color': 'blue',
                'opacity': '0.4',
                'border': '1px solid red',
                'pointer-events': 'none',
                'z-index': '999'
            });
            return highlight;
        }

        #highlightElement(element) {
            if (!element || this.#currentlyHighlightedItem == element) return;

            let rect = element.getBoundingClientRect();
            this.#highlight.style.left = (this.#scopeWindow.scrollX + rect.x) + "px";
            this.#highlight.style.top = (this.#scopeWindow.scrollY + rect.y) + "px";
            this.#highlight.style.width = rect.width + "px";
            this.#highlight.style.height = rect.height + "px";

            this.#page.prepend(this.#highlight);
            this.#currentlyHighlightedItem = element;
        }

        toggle() {
            this.isActive() ? this.#is_active = false : this.#is_active = true;
        }

        start() {
            this.#is_active = true;
        }

        stop() {
            this.#is_active = false;
        }

        isActive() {
            return this.#is_active;
        }

        get validSelectedElement() {
            return this.#validSelectedElement;
        }
    }

    return function (page, scopeWindow, actions) {
        return new highlight(page, scopeWindow, actions)
    }
});