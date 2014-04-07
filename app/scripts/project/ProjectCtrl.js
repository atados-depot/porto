'use strict';

/* global toastr: false */
/* global google: false */

var app = angular.module('portoApp');

app.controller('ProjectCtrl', function($scope, $rootScope, $state, $stateParams, $http, Auth, $modal, Volunteer, project, api, VOLUNTEER) {

  $scope.landing = false;
  $scope.markers = [];
  $scope.project = project;
  $scope.nonprofit = $scope.project.nonprofit;
  $scope.site.title = 'Ato - ' + $scope.project.name;
  $scope.markers.push(project.address);

  if ($scope.project.address) {
    $scope.options = {
      map: {
        center: new google.maps.LatLng($scope.project.address.latitude, $scope.project.address.longitude),
        zoom: 15,
      },
    };
  }

  if (!project.published && $scope.loggedUser && project.nonprofit.id !== $scope.loggedUser.id) {
    $state.transitionTo('root.home');
    toastr.error('Ato ainda não foi aprovado. Se isso é um erro entre em contato por favor.');
  }
  if ($scope.loggedUser && $scope.loggedUser.role === VOLUNTEER) {
    $http.get(api + 'has_volunteer_applied/?project=' + project.id.toString())
      .success(function (response) {
        if (response[0] === 'YES') {
          $scope.alreadyApplied = true;
        } else {
          $scope.alreadyApplied = false;
        }
      });
  }


  $scope.$watch('center', function(value) {
    if ($scope.project.address && value && value.d === 46) {
      $scope.center = new google.maps.LatLng($scope.project.address.latitude, $scope.project.address.longitude);
    }
  });
    
  function openApplyModal () {
    var template = '/partials/volunteerContractModal.html';
    var controller = 'ProjectModalCtrl';

    if ($scope.alreadyApplied) {
      template = '/partials/volunteerUnapplyModal.html';
      controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close();
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
          $scope.showApplyModal = false;
        };
      }];
    }

    var modalInstance = $modal.open({
      templateUrl: template,
      resolve: {
        nonprofit: function () {
          return $scope.project.nonprofit;
        },
        phone: function () {
          return $scope.loggedUser.user.phone;
        },
        name: function () {
          return $scope.loggedUser.user.name;
        }
      },
      controller: controller
    });

    modalInstance.result.then(function (modalDetails) {
      
      var volunteerMessage = '';
      var volunteerPhone = '';
      var volunteerName = '';

      if (modalDetails) {
        volunteerMessage = modalDetails.message;
        $scope.loggedUser.user.phone = volunteerPhone = modalDetails.phone;
        $scope.loggedUser.user.name = volunteerName = modalDetails.name;
      }

      $http.post(api + 'apply_volunteer_to_project/', {project: $scope.project.id, message: volunteerMessage, phone: volunteerPhone, name: volunteerName})
      .success(function (response) {
        if (response[0] === 'Applied') {
          $scope.project.volunteers.push($scope.loggedUser);
          $scope.alreadyApplied = true;
          toastr.success('Parabéns! Você é voluntário para ' + $scope.project.name);
        } else {
          $scope.project.volunteers.splice($scope.project.volunteers.indexOf($scope.loggedUser),1);
          $scope.alreadyApplied = false;
          toastr.success('Você não é mais voluntário para ' + $scope.project.name);
        }
      }).error(function (error) {
        console.error(error);
        if (error['403']) {
          $modal.open({
            template: '<div class="modal-body">' +
            '<p>Para ser voluntário, você precisar confirmar sua conta no Atados clicando no link que te mandamos por email quando você criou sua conta.</p>' +
            '<button class="btn btn-info" ng-click="ok()">Ok</button>' +
            '</div>',
            controller: function ($scope, $modalInstance) {
              $scope.ok = function () {
                $modalInstance.close();
              };
            }
          });
        } else {
          toastr.error('Não conseguimos te atar. Por favor mande um email para resolvermos o problema: contato@atados.com.br');
        }
      });
    }, function () {
    });
  }

  $rootScope.$on('userLoggedIn', function(/*event, user*/) {
    if ($state.is('root.project') && $scope.showApplyModal && !$scope.alreadyApplied) {
      openApplyModal();
    }
    else {
      $scope.showApplyModal = false;
    }
  });

  $rootScope.$on('userLoggedOut', function(/*event,*/) {
    $scope.alreadyApplied = false;
  });

  $scope.showApplyModal = false;

  $scope.applyVolunteerToProject = function () {
    if (!$scope.loggedUser) {
      $scope.openLogin();
      $scope.showApplyModal = true;
      toastr.info('Você tem que logar primeiro!');
    } else {
      openApplyModal();
    }
  };
});
