define([
    'introJs',
], function (introJs) {
    'use strict';

    let current_scope;

    return function (scope) {
        if (scope) current_scope = scope;
        if (current_scope) {
            if (!current_scope.introJs) current_scope.introJs = introJs;
            return current_scope.introJs
        }
        return introJs;
    }
});