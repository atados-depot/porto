'use strict';

/* global toastr: false */

var app = angular.module('portoApp');

app.controller('RootCtrl', function ($scope, $rootScope, $state, Auth, loggedUser, NONPROFIT, storage) {
  $scope.loggedUser = loggedUser;

  if ($rootScope.modalInstance) {
    $rootScope.modalInstance.close();
  }

  if ($scope.loggedUser && $scope.loggedUser.role === NONPROFIT) {
    $scope.loggedUser.address = $scope.loggedUser.user.address;
    $scope.loggedUser.causes.forEach(function (c) {
      c.image = storage + 'cause_' + c.id + '.png';
    });
    $scope.loggedUser.projects.forEach(function (p) {
      p.causes.forEach(function (c) {
        c.image = storage + 'cause_' + c.id + '.png';
      });
    });
  }

  $rootScope.$on('userLoggedIn', function(event, user) {
    if (user) {
      if ($rootScope.modalInstance) {
        $rootScope.modalInstance.close();
      }
      $scope.loggedUser = user;
      toastr.success('Oi! Bom te ver por aqui :)', $scope.loggedUser.slug);
    }
  });

  $rootScope.explorerView = false;

  $scope.logout = function () {
    toastr.success('Tchau até a próxima :)', $scope.loggedUser.slug);
    $scope.$emit('userLoggedOut');
    Auth.logout();
    $scope.loggedUser = null;
    $state.transitionTo('root.home');
  };
});
