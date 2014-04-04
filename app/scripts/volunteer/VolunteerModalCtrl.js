'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('VolunteerModalCtrl', function($scope, $rootScope, Auth) {

  $scope.loginActive = true;
  $scope.switchLoginActive = function () {
    $scope.loginActive = !$scope.loginActive;
  };
});
