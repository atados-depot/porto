'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('NonprofitSignupCtrl', function($scope, $rootScope, $filter, $state, Auth, Photos, Restangular) {

  $scope.nonprofit = {
    hidden_address: false,
    address: {
      neighborhood:null,
      zipcode:null,
      addressline:null,
      addressnumber:null,
    },
    phone:null,
    description:null,
    name:null,
    details:null,
    user:{
      name:null,
      slug:null,
      email:null,
      password:null
    },
    facebook_page:null,
    google_page:null,
    twitter_handle:null,
    website:null,
    causes:[]
  };

  // Checking that email is valid and not already used.
  $scope.$watch('nonprofit.user.email', function (value) {
    Auth.isEmailUsed(value, function (response) {
      $scope.signupForm.email.alreadyUsed = response.alreadyUsed;
      $scope.signupForm.email.$invalid = response.alreadyUsed;
    });
  });

  $scope.$watch('nonprofit.user.slug', function (value) {
    // Checking that slug not already used.
    if (value) {
      if (value.indexOf(' ') >= 0) {
        $scope.signupForm.slug.$invalid = true;
        $scope.signupForm.slug.hasSpace = true;
      } else {
        $scope.signupForm.slug.$invalid = false;
        $scope.signupForm.slug.hasSpace = false;
        Auth.isSlugUsed(value, function (response) {
          $scope.signupForm.slug.alreadyUsed = response.alreadyUsed;
          $scope.signupForm.slug.$invalid = response.alreadyUsed;
        });
      }
    } else {
      $scope.signupForm.slug.alreadyUsed = false;
      $scope.signupForm.slug.hasSpace = false;
      $scope.signupForm.slug.$invalid = false;
    }
  });

  $scope.cityLoaded = false;

  $scope.$watch('nonprofit.address.state', function (value) {
    $scope.cityLoaded = false;
    $scope.stateCities = [];
    if (value && !value.citiesLoaded) {
      Restangular.all('cities').getList({page_size: 3000, state: value.id}).then(function (response) {
        response.forEach(function(c) {
          $scope.stateCities.push(c);
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
        if (c.state.id === $scope.nonprofit.address.state.id) {
          $scope.stateCities.push(c);
        }
      });
      $scope.cityLoaded = true;
    }
  });

  $scope.$watch('password + passwordConfirm', function() {
    $scope.signupForm.password.doesNotMatch = $scope.password !== $scope.passwordConfirm;
    $scope.signupForm.password.$invalid = $scope.signupForm.password.doesNotMatch;
  });

  $scope.uploadImageFile = function(files) {
    if (files) {
      if (!$scope.files) {
        $scope.files = new FormData();
      }
      $scope.files.append('image', files[0]);
      $scope.imageUploaded = true;
      $scope.$apply();
      return;
    }
    $scope.imageUploaded = false;
    $scope.$apply();
  };
  $scope.uploadCoverFile = function(files) {
    if (files) {
      if (!$scope.files) {
        $scope.files = new FormData();
      }
      $scope.files.append('cover', files[0]);
      $scope.coverUploaded = true;
      $scope.$apply();
      return;
    }
    $scope.coverUploaded = false;
    $scope.$apply();
  };

  $scope.signup = function () {
    $scope.nonprofit.user.password = $scope.password;

    $scope.facebook_page = 'http://facebook.com/' + $scope.facebook_page;
    $scope.google_page = 'http://plus.google.com/' + $scope.google_page;
    $scope.twitter_handle = 'http://www.twitter.com/' + $scope.twitter_handle;

    $scope.files.append('nonprofit', angular.toJson($scope.nonprofit));

    Auth.nonprofitSignup($scope.files, function () {
      Auth.login({
          username: $scope.nonprofit.user.email,
          password: $scope.nonprofit.user.password,
          remember: true
        }, function () {
          Auth.getCurrentUser().then(
            function (user) {
              $scope.loggedUser = user;
              toastr.success('Bem vinda ONG ao atados! Sua ONG ainda precisa ser aprovada. Espere pelo nosso email.');
              $state.transitionTo('root.home');
            }, function (error) {
              console.error(error);
              toastr.error('Sua ONG foi criada mas não coseguimos te logar. Clique no botão acima "ONG" e use seu email e senha para logar.');
              $state.transitionTo('root.home');
            });
        }, function () {
          $scope.error = 'Usuário ou senha estão errados :(';
        });
    },
    function (error) {
      console.error(error);
      toastr.error('Erro no servidor. Por favor entre em contato.');
    });
  };
});
