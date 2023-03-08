/**
  * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([], function () {
    'use strict';

    /**
     * 
     * @param {HTMLElement} el 
     */
    function getClassName(el) {
        if (!el.className) return;
        let classNames = el.className.split(' ');
        classNames = classNames.map(className => '.' + className);
        return classNames.join('');
    }

    return function (el) {
        let path = [],
            parent;
        while (parent = el.parentNode) {
            let tag = el.tagName,
                selector;

            if (el.id) {
                selector = `#${el.id}`;
            } else if (el.className) {
                selector = getClassName(el)
            } else {
                let siblings = parent.children;
                selector = [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag :
                    `${tag}:nth-child(${1 + [].indexOf.call(siblings, el)})`;
            }
            path.unshift(selector);
            el = parent;
        };
        return `${path.join(' > ')}`.toLowerCase();
    };
});