'use strict';

/* global toastr: false */
/* global google: false */

var app = angular.module('atadosApp');

app.controller('NonprofitCtrl', function($scope, $rootScope, $state, $http, nonprofit, api, VOLUNTEER) {

  $scope.landing = false;

  $scope.nonprofit = nonprofit;
  $scope.nonprofit.address = nonprofit.user.address;
  $scope.site.title = 'ONG - ' + $scope.nonprofit.name;
  $scope.activeProjects = true;
  $scope.markers = [];
  $scope.markers.push(nonprofit.address);

  $scope.causes().forEach(function(c) {
    $scope.nonprofit.causes.forEach(function(nc) {
      if (c.id === nc) {
        var i = $scope.nonprofit.causes.indexOf(nc);
        $scope.nonprofit.causes[i] = c;
      }
    });
  });

  if ($scope.nonprofit.address) {
    $scope.options = {
      map: {
        center: new google.maps.LatLng($scope.nonprofit.address.latitude, $scope.nonprofit.address.longitude),
        zoom: 15,
      },
    };
  }
  $scope.$watch('center', function(value) {
    if ($scope.nonprofit.address && value && value.d === 46) {
      $scope.center = new google.maps.LatLng($scope.nonprofit.address.latitude, $scope.nonprofit.address.longitude);
    }
  });


  $scope.getProjects  = function () {
    if (nonprofit.projects) {
      if ($scope.activeProjects) {
        return $scope.nonprofit.projects.filter(function (p) {
          if (!p.city_state && p.address) {
            p.city_state = p.address.city_state;
          }
          return !(p.closed || p.deleted);
        });
      } else {
        return $scope.nonprofit.projects.filter(function (p) {
          if (!p.city_state && p.address) {
            p.city_state = p.address.city_state;
          }
          return p.closed || p.deleted;
        });
      }
    }
  };

  function setVolunteerToNonprofit() {
    $http.post(api + 'set_volunteer_to_nonprofit/', {nonprofit: $scope.nonprofit.id})
      .success(function (response) {
        if (response[0] === 'Added') {
          $scope.alreadyVolunteer = true;
          $scope.nonprofit.volunteers.push($scope.loggedUser);
          toastr.success('Parabéns você foi adicionada(o) a lista de voluntários da ONG!', $scope.loggedUser.slug);
        } else {
          toastr.success('Você foi removida(o) da lista de voluntários da ONG. Ela vai sentir sua falta.', $scope.loggedUser.slug);
          var index = $scope.nonprofit.volunteers.indexOf($scope.loggedUser);
          if (index > -1) {
            $scope.nonprofit.volunteers.splice(index, 1);
          }
          $scope.alreadyVolunteer = false;
        }
      }).error(function () {
        toastr.error('Não conseguimos te adicionar a lista de voluntários da ONG :(');
      });
  }

  $scope.addVolunteerToNonprofit = function () {
    if (!$scope.loggedUser) {
      $scope.openLogin();
      toastr.info('Você tem que logar primeiro!');
    } else {
      setVolunteerToNonprofit();
    }
  };

  $scope.alreadyVolunteer = false;

  if ($scope.loggedUser && $scope.loggedUser.role === VOLUNTEER) {
    $http.get(api + 'is_volunteer_to_nonprofit/?nonprofit=' + $scope.nonprofit.id.toString() + '&id=' + new Date().getTime())
      .success(function (response) {
        if (response[0] === 'YES') {
          $scope.alreadyVolunteer = true;
        } else {
          $scope.alreadyVolunteer = false;
        }
      });
  }

  $rootScope.$on('userLoggedOut', function(/*event,*/) {
    $scope.alreadyVolunteer = false;
  });

  $scope.selectMarker = function (marker, object) {
    angular.element(document.querySelector('#card-' + object.slug))
      .addClass('hover');
  };

  $scope.removeMarker = function (marker, object) {
    angular.element(document.querySelector('#card-' + object.slug))
      .removeClass('hover');
  };
});
