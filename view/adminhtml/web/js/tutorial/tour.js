define([
    'jquery',
    'introJs',
], function ($, introJs) {
    'use strict';

    const INTRO_TEXT_LIST = [
        $.mage.__('Hi, lets start a quick tour on User Onboarding!'),
        $.mage.__("This option enables or disables this onboarding for frontend users."),
        $.mage.__("Set a name for your onboarding for later reference."),
        $.mage.__("Input an Url from your website to start creating an onboarding."),
        $.mage.__("After you informed a valid Url, you'll be able to access it and start creating your onboarding.")
    ];

    return function (config, element) {
        $(element).on('click', () => {
            let intro = introJs.render().setOptions({
                showProgress: true,
                tooltipClass: 'quick-tour',
                steps: [{
                    title: $.mage.__('Quick tour'),
                    intro: INTRO_TEXT_LIST[0]
                },
                {
                    element: document.querySelector('.admin__field:nth-of-type(2)'),
                    title: $.mage.__('Enable'),
                    intro: INTRO_TEXT_LIST[1],
                    position: 'top',
                },
                {
                    element: document.querySelector('.admin__field:nth-of-type(4)'),
                    title: $.mage.__('Name'),
                    intro: INTRO_TEXT_LIST[2],
                    position: 'top',
                },
                {
                    element: document.querySelector('.admin__field:nth-of-type(5)'),
                    title: $.mage.__('Page Url'),
                    intro: `
                    <div class="onboarding_tour_step">
                        <p>${INTRO_TEXT_LIST[3]}</p>
                        <img src="${require.toUrl('Rsilva_UserOnboarding/images/onboarding-tuto-1.gif')}">
                    </div>`
                },
                {
                    title: $.mage.__('Onboarding'),
                    intro: `
                    <div class="onboarding_tour_step">
                        <p>${INTRO_TEXT_LIST[4]}</p>
                        <img src="${require.toUrl('Rsilva_UserOnboarding/images/onboarding-tuto-2.gif')}">
                    </div>`
                },
                ]
            })
            intro.start();
        })
    }
});