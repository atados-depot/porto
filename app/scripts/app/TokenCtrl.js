'use strict';

/* global toastr: false */

var app = angular.module('portoApp');

app.controller('TokenCtrl', function($scope, api, $http, $location, $state) {
  $scope.site.title = 'Atados - Juntando Gente Boa';

  var token = $location.search().token;

  if (token) {
    $http.put(api + 'confirm_email/', {'token': token}).success(function (response) {
      $state.transitionTo('root.explore');
      toastr.success('Email confirmado com successo!', response.data);
    }).error(function () {
      toastr.error('Não conseguimos confirmar seu email. Entre em contato conosco para resolver seu problema.');
    });
  }
});
