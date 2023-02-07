/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([], function () {
    'use strict';

    class OnboardingIframe {

        url;
        width;
        height;
        scope;

        constructor(url, width, height, scope) {
            this.url = url;
            this.width = width;
            this.height = height;
            this.scope = scope;
        }
    }

    return OnboardingIframe;
});