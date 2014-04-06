'use strict';

/* global toastr: false */

var app = angular.module('portoApp');

app.controller('VolunteerSignupCtrl', function($scope, $rootScope, Auth) {

  $scope.$watch('slug', function (value) {
    if (value) {
      if (value.indexOf(' ') >= 0) {
        $scope.signupForm.slug.$invalid = true;
        $scope.signupForm.slug.hasSpace = true;
        $scope.signupForm.slug.alreadyUsed = false;
      } else if (value.indexOf('.') >= 0) {
        $scope.signupForm.slug.$invalid = true;
        $scope.signupForm.slug.hasDot = true;
        $scope.signupForm.slug.alreadyUsed = false;
      } else {
        $scope.signupForm.slug.hasSpace = false;
        $scope.signupForm.slug.hasDot = false;
        $scope.signupForm.slug.$invalid = false;
        Auth.isSlugUsed(value, function (response) {
          $scope.signupForm.slug.alreadyUsed = response.alreadyUsed;
          $scope.signupForm.slug.$invalid = response.alreadyUsed;
        });
      }
    } else {
      $scope.signupForm.slug.alreadyUsed = false;
      $scope.signupForm.slug.hasSpace = false;
      $scope.signupForm.slug.hasDot = false;
      $scope.signupForm.slug.$invalid = false;
    }
  });
  
  $scope.$watch('password + passwordConfirm', function() {
    $scope.passwordDoesNotMatch = $scope.password !== $scope.passwordConfirm;
  });

  $scope.signup = function () {
    if ($scope.signupForm.$valid) {
      Auth.volunteerSignup({
          slug: $scope.slug,
          email: $scope.email,
          password: $scope.password
        },
        function () {
          Auth.login({
            username: $scope.email,
            password: $scope.password,
            remember: $scope.remember
          }, function (response) {
            Auth.getCurrentUser(response.access_token).then(
              function (user) {
                $rootScope.$emit('userLoggedIn', user);
              }, function (error) {
                toastr.error(error);
              });
          }, function () {
            $scope.error = 'Usuário ou senha estão errados :(';
          });
        },
        function (error) {
          console.error(error);
          toastr.error('Não conseguimos criar sua conta agora. :(');
        });
    }
  };
});
