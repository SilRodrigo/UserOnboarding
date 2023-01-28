define([
    'jquery',
], function ($) {
    'use strict';

    /* Based on https://jsfiddle.net/1jvdacrk/2/ */

    let currentlyHighlightedItem = null;

    function createHighlight() {
        let highlight = document.createElement('div');
        highlight.id = 'highlight';
        Object.assign(highlight.style, {
            'position': 'absolute',
            'background-color': 'blue',
            'opacity': '0.4',
            'border': '1px solid red',
            'pointer-events': 'none',
            'z-index': '750'
        });
        return highlight;
    }

    /**
     * @param {string} page Page selector to be highlighted
     * @param {Window} scopeWindow
     */
    return function (page, scopeWindow = null) {

        let highlight = createHighlight();
        if (!scopeWindow) scopeWindow = window;

        function highlightElement(element) {
            if (currentlyHighlightedItem == element) return;

            let rect = element.getBoundingClientRect();
            highlight.style.left = (scopeWindow.scrollX + rect.x) + "px";
            highlight.style.top = (scopeWindow.scrollY + rect.y) + "px";
            highlight.style.width = rect.width + "px";
            highlight.style.height = rect.height + "px";

            page.appendChild(highlight);
            currentlyHighlightedItem = element;
        }

        page.addEventListener("mousemove", e => {
            highlightElement(e.target)
        }, true);
        page.addEventListener('click', e => {
            e.preventDefault();
        });
        page.addEventListener("mouseleave", function (e) {
            highlight.remove();
            currentlyHighlightedItem = null;
        });
    }
});