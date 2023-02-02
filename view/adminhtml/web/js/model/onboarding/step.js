/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'jquery',
    'ko',
    '../../abstract/onboarding/item'
], function ($, ko, OnboardingItem) {
    'use strict';

    class Step extends OnboardingItem {
        constructor(data) {
            super(data)
        }
    }

    return Step;
});