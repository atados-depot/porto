'use strict';

var app = angular.module('atadosApp');

app.controller('VolunteerCtrl', function($scope, volunteer) {

  $scope.volunteer = volunteer;
  $scope.landing = false;
  $scope.site.title = 'Voluntário - ' + volunteer.slug;

  $scope.selectMarker = function (marker, object) {
    angular.element(document.querySelector('#card-' + object.slug))
      .addClass('hover');
  };

  $scope.removeMarker = function (marker, object) {
    angular.element(document.querySelector('#card-' + object.slug))
      .removeClass('hover');
  };
});
