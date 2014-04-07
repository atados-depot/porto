'use strict';

/* global toastr: false */

var app = angular.module('portoApp');

app.controller('VolunteerEditCtrl', function($scope, $filter, Auth, Photos, Volunteer, $http, Restangular, $state, Site, api, VOLUNTEER) {

  $scope.$watch('loggedUser', function (user) {
    if (!user) {
      toastr.error('Voluntário não logado para editar.');
      $state.transitionTo('root.home');
    }
  });

  if ($scope.loggedUser && $scope.loggedUser.role === VOLUNTEER) {
    $scope.savedEmail = $scope.loggedUser.user.email;
    $scope.volunteer = $scope.loggedUser;
    window.volunteer = $scope.volunteer;
  } else {
    $state.transitionTo('root.home');
    toastr.error('Voluntário não logado para editar.');
  }

  $scope.cityLoaded = false;
  $scope.$watch('volunteer.address.state', function (value) {
    $scope.cityLoaded = false;
    $scope.stateCities = [];
    if (value && !value.citiesLoaded) {
      Restangular.all('cities').getList({page_size: 3000, state: value.id}).then(function (response) {
        response.forEach(function(c) {
          $scope.stateCities.push(c);
          if ($scope.volunteer.address.city && (c.id === $scope.volunteer.address.city.id)) {
            $scope.volunteer.address.city = c;
          }
          if (!c.active) {
            $scope.cities().push(c);
          }
        });
        value.citiesLoaded = true;
        $scope.cityLoaded = true;
      });
    } else if(value){
      var cities = $scope.cities();
      cities.forEach(function (c) {
        if (c.state.id === $scope.volunteer.address.state.id) {
          $scope.stateCities.push(c);
        }
      });
      $scope.cityLoaded = true;
    }
  });

  $scope.uploadProfileFile = function(files) {
    if (files) {
      var fd = new FormData();
      fd.append('file', files[0]);
      Photos.setVolunteerPhoto(fd, function(response) {
        $scope.volunteer.image_url = response.file;
        toastr.success('Foto do voluntário salva com sucesso.');
      }, function() {
        toastr.error('Error no servidor. Não consigo atualizar sua foto :(');
      });
    }
  };

  $scope.saveVolunteer = function () {
    
    Volunteer.save($scope.volunteer, function() {
      toastr.success('Perfil salvo!', $scope.volunteer.slug);
    }, function () {
      toastr.error('Problema em salvar seu perfil :(');
    });

    if ($scope.password && $scope.password === $scope.passwordConfirm) {
      Auth.changePassword({email: $scope.volunteer.user.email, password: $scope.password}, function () {
        toastr.success('Senha nova salva', $scope.volunteer.slug);
      }, function () {
        toastr.error('Não conseguimos atualizar sua senha :(');
      });
    }
  };

  $scope.$watch('volunteer.user.email', function (value, old) {
    if (value && value !== old && value !== $scope.savedEmail) {
      Auth.isEmailUsed(value, function (response) {
        $scope.volunteerEditForm.email.alreadyUsed = response.alreadyUsed;
        $scope.volunteerEditForm.email.$invalid = response.alreadyUsed;
      });
    } else {
      $scope.volunteerEditForm.email.$invalid = false;
      $scope.volunteerEditForm.email.alreadyUsed = false;
    }
  });

  $scope.getFacebookPhoto = function () {
    if ($scope.volunteer.facebook_uid) {
      Photos.getFacebookPhoto(function (response) {
        toastr.success('Foto do facebook salva com sucesso');
        $scope.volunteer.image_url = response;
      }, function (error) {
        console.error(error);
        toastr.error('Error no servidor. Não consigo pegar foto do Facebook.');
      });
    }
  };

  $scope.$watch('password + passwordConfirm', function() {
    $scope.volunteerEditForm.password.doesNotMatch = $scope.password !== $scope.passwordConfirm;
    $scope.volunteerEditForm.password.$invalid = $scope.volunteerEditForm.password.doesNotMatch;
  });
});
