'use strict';

var app = angular.module('portoApp');

app.controller('LandingCtrl', function ($scope, $rootScope) {

  $rootScope.explorerView = false;
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.landing = true;

  $scope.selectMarker = function (marker, object) {
    angular.element(document.querySelector('#card-' + object.slug))
      .addClass('hover');
  };

  $scope.removeMarker = function (marker, object) {
    angular.element(document.querySelector('#card-' + object.slug))
      .removeClass('hover');
  };
});
