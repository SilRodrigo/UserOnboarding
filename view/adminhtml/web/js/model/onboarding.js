/* 
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

define([
    'ko',
    '../config/onboarding',
], function (ko, config) {
    'use strict';

    const CONFIG = { ...config };

    class Onboarding {

        steps = ko.observableArray([]);
        hints = ko.observableArray([]);
        data = ko.observable('{}');
        data_lib = ko.observable('{}');

        add(collection_name, item, index) {
            let collection_reference = CONFIG.COLLECTION_REFERENCE[item.type];
            if (collection_reference !== collection_name) throw new Error(CONFIG.MESSAGE.INVALID_COLLECTION);
            let collection = this[collection_name]();
            if (typeof index === 'number') collection.splice(index, 0, item);
            else collection.push(item);
            this[collection_reference](collection);
        }

        delete(item, index) {
            let collection = this[CONFIG.COLLECTION_REFERENCE[item.type]]();
            collection.splice(index, 1);
            this[CONFIG.COLLECTION_REFERENCE[item.type]](collection);
            item.unlinkHtml();
        }

        getData() {
            return {
                steps: this.steps(),
            }
        }

        clear() {
            this.steps([]);
            this.hints([]);
            this.data('{}');
        }
    }

    return Onboarding;
});