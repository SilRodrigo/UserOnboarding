/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    '../../abstract/onboarding/item'
], function (OnboardingItem) {
    'use strict';

    const TYPE = 'step'

    class Step extends OnboardingItem {

        constructor(data) {
            super({ ...data, type: TYPE })
        }
    }

    return Step;
});