define([
    'jquery',
    'introJs',
], function ($, introJs) {
    'use strict';

    return function (config, element) {
        $(element).on('click', () => {
            let intro = introJs.render().setOptions({
                showProgress: true,
                tooltipClass: 'quick-tour',
                steps: [{
                    title: $.mage.__('Quick tour'),
                    intro: $.mage.__('Hi, let\'s start a quick tour on User Onboarding')
                },
                {
                    element: document.querySelector('.admin__field:nth-of-type(2)'),
                    title: $.mage.__('Enable'),
                    intro: $.mage.__('This option enables or disables this onboarding for frontend users.'),
                    position: 'top',
                },
                {
                    element: document.querySelector('.admin__field:nth-of-type(4)'),
                    title: $.mage.__('Name'),
                    intro: $.mage.__('Set a name for your onboarding for later reference.'),
                    position: 'top',
                },
                {
                    element: document.querySelector('.admin__field:nth-of-type(5)'),
                    title: $.mage.__('Page Url'),
                    intro: $.mage.__('Input an Url from your website to start creating it\'s onboarding.'),
                    position: 'top',
                },
                {
                    title: $.mage.__('Onboarding'),
                    intro: $.mage.__(`<div id="onboarding_tour_step">
                        <p>After you informed a valid Url, you'll be able to access it's page
                        and start creating your onboarding.</p>
                        <img src="${require.toUrl('Rsilva_UserOnboarding/images/onboarding-tuto-1.gif')}">
                    </div>`),
                    position: 'top',
                },
                ]
            })
            intro.start();
        })
    }
});