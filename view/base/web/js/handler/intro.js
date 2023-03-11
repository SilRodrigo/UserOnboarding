/**
  * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    '../lib/intro',
    './abstract/onboarding-lib-handler'
], function (introJs, LibHandler) {
    'use strict';

    class IntroJs extends LibHandler {

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
            if (callback) introJs.onexit(callback);
            introJs.setOptions(options).start();
        }

        render() {
            return introJs();
        }
    }

    window.introJs = new IntroJs();
    return window.introJs;
});