/**
  * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    '../lib/intro',
    './abstract/onboarding-lib-handler',
    'ko'
], function (introJs, LibHandler, ko) {
    'use strict';

    class IntroJs extends LibHandler {

        #onexit(callback) {
            this.active(false);
            if (callback) callback();
        }

        active = ko.observable(false);

        /**
         * @param {Item} step 
         * @param {boolean} noQuery 
         * @returns {Object}
         */
        prepareStep(step, noQuery) {
            return {
                title: step.title,
                intro: step.content,
                element: noQuery ? step.selector : document.querySelector(step.selector)
            }
        }

        /**
         * @inheritdoc
         */
        prepareData(data, noQuery) {
            let steps = [];
            data?.steps.forEach(step => {
                steps.push(this.prepareStep(step, noQuery));
            })
            return { steps: steps };
        }

        /**
         * @inheritdoc
         */
        start(onboarding, callback) {
            let options = this.prepareData(onboarding.getData());
            let introJs = this.render().setOptions(options);
            introJs.onexit(() => this.#onexit(callback));
            introJs.setOptions(options).start();
        }

        render() {
            let rendered = introJs();
            this.active(true);
            rendered.onexit(() => this.#onexit());
            return rendered;
        }
    }

    window.introJs = new IntroJs();
    return window.introJs;
});