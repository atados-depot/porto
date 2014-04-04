'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('NonprofitEditCtrl', function($scope, $http, $state, $stateParams, $timeout,
      Restangular, Photos, Cleanup, api, VOLUNTEER, NONPROFIT, Nonprofit) {

  $scope.$watch('loggedUser', function (user) {
    if (!user || (user && user.role === VOLUNTEER)) {
      $state.transitionTo('root.home');
      toastr.error('Apenas ONGs tem acesso ao Painel de Controle');
      return;
    }  else if (user.role === NONPROFIT) {
      $scope.nonprofit = $scope.loggedUser;
      Cleanup.nonprofitForEdit($scope.nonprofit);
    }
  });

  $scope.save = function(nonprofit) {
    Nonprofit.save(nonprofit);
  };

  $scope.uploadProfileFile = function(files) {
    if (files) {
      var fd = new FormData();
      fd.append('file', files[0]);
      Photos.setNonprofitProfilePhoto(fd, function(response) {
        $scope.nonprofit.image_url = response.file;
        toastr.success('Logo da ONG salva com sucesso.');
      }, function() {
        toastr.error('Error no servidor. Não consigo atualizar sua foto :(');
      });
    }
  };
  $scope.uploadCoverFile = function(files) {
    if (files) {
      var fd = new FormData();
      fd.append('file', files[0]);
      Photos.setNonprofitCoverPhoto(fd, function(response) {
        $scope.nonprofit.cover_url = response.file;
        toastr.success('Foto cover da ONG salva com sucesso.');
      }, function() {
        toastr.error('Error no servidor. Não consigo atualizar sua foto :(');
      });
    }
  };
});
