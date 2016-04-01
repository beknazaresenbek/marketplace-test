/**
 * @author Francisco de la Vega <fdelavega@conwet.com>
 *         Jaime Pajuelo <jpajuelo@conwet.com>
 */

(function () {

    'use strict';

    angular
        .module('app')
        .directive('bsTooltip', bsTooltipDirective)
        .directive('fileModel', fileModelDirective)
        .directive('noImage', noImageDirective)
        .directive('fieldUnique', fieldUniqueDirective)
        .directive('priceplanForm', priceplanFormDirective)
        .directive('priceplanTable', priceplanTableDirective)
        .directive('fieldArray', fieldArrayDirective);

    function bsTooltipDirective() {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element) {
            element.tooltip();
        }
    }

    function fileModelDirective($parse) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var fileSetter = $parse(attrs.fileModel).assign;

            element.on('change', function () {
                scope.$apply(function () {
                    fileSetter(scope, element[0].files[0]);
                });
            });
        }
    }

    function noImageDirective(URLS) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {

            scope.$watch(function () {
                return attrs.ngSrc;
            }, function () {

                if (!attrs.ngSrc) {
                    setDefaultImage(element);
                }
            });

            element.bind('error', function () {
                setDefaultImage(element);
            });
        }

        function setDefaultImage(element) {
            element.attr('src', URLS.IMAGE + '/default-no-image.png');
        }
    }

    function fieldUniqueDirective($http, $injector) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {

                scope.$watch(attrs.ngModel, function (newValue) {
                    var params = {};

                    if (newValue && $injector.has(attrs.fieldUnique)) {
                        if (attrs.fieldOriginalValue != newValue) {
                            params[attrs.name] = newValue;

                            $injector.get(attrs.fieldUnique).exists(params).then(function (found) {
                                controller.$setValidity('unique', !found);
                            });
                        }
                    }
                });
            }
        };
    }

    function priceplanFormDirective() {
        return {
            restrict: 'E',
            scope: {
                form: '=',
                priceplan: '=data',
                vm: '=controller'
            },
            templateUrl: 'directives/forms/priceplan'
        };
    }

    function priceplanTableDirective() {
        return {
            restrict: 'E',
            scope: {
                priceplans: '=data',
                vm: '=controller'
            },
            templateUrl: 'directives/tables/priceplan'
        };
    }

    function fieldArrayDirective($http, $injector) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {

                scope.$watch(attrs.ngModel + ".length", function (arrayLength) {
                    var params = {};

                    if (arrayLength != null) {
                        controller.$setValidity('limitFrom', arrayLength >= parseInt(attrs.limitFrom));
                    }
                });
            }
        };
    }

})();
