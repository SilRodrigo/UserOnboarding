/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define(['jquery'], function ($) {
    'use strict';

    class LibHandler {

        #name;

        constructor(lib_name, lib) {
            this.#name = lib_name;
            this.lib = lib;
        }

        prepareData(item, scope = document, noQuery) {
            return {
                title: item.title,
                intro: item.content,
                element: noQuery ? item.selector : scope.querySelector(item.selector)
            }
        }

        prepareSteps(onboarding, scope, noQuery) {
            let stepsCollection = onboarding.steps(),
                steps = [],
                preview = {
                    title: 'Preview',
                    intro: $.mage.__('This is a preview of your Onboarding')
                }
            if (!noQuery) steps.push(preview);
            stepsCollection.forEach(step => {
                steps.push(this.prepareData(step, scope, noQuery));
            })
            return { steps: steps };
        }

        getData(onboarding, scope, noQuery) {
            return { ...this.prepareSteps(onboarding, scope, noQuery) }
        }

        start(onboarding, scope) {
            let options = this.getData(onboarding, scope),
                lib = this.lib();
            lib.setOptions(options).start();
        }
    }

    return LibHandler;
});