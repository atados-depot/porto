'use strict';

/* global toastr: false */
/* global google: false */
/* global constants: false */
/* global $: false */

var app = angular.module('portoApp');

app.controller('SearchCtrl', function ($scope, $http, $location, $anchorScroll, Search, $state, storage, defaultZoom, Cleanup) {

  $scope.search =  Search;
  window.map = constants.map;
  $scope.map = constants.map;

  var alreadySearchedProject = false;
  var alreadySearchedNonprofit = false;

  $scope.$watch('search.city', function (city) {
    $scope.zoom = defaultZoom;
    if (city.name === 'Sao Paulo') {
      $scope.center = new google.maps.LatLng(-23.5505199, -46.6333094);
    } else if (city.name === 'Curitiba') {
      $scope.center = new google.maps.LatLng(-25.4808762, -49.3044253);
    } else if (city.name === 'Brasilia') {
      $scope.center = new google.maps.LatLng(-15.79211, -47.897751);
    } else if (city.id === 0) {
      $scope.center = null;
      $scope.zoom  = 1;
    }
  });

  var typingTimer;
  var doneTyping = false;
  var doneTypingInterval = 1000;

  var search = function(value, old) {
    
    if (value !== old) {
      if ($scope.landing) {
        $state.transitionTo('root.explore');
      }
      alreadySearchedProject = false;
      alreadySearchedNonprofit = false;

      Search.filter(Search.query, Search.cause.id, Search.skill.id, Search.city.id);
      doneTyping = false;
    }
  };
  $scope.$watch('search.cause', function (value, old) {
    search(value, old);
  });
  $scope.$watch('search.skill', function (value, old) {
    search(value, old);
  });
  $scope.$watch('search.city', function (value, old) {
    search(value, old);
  });

  //on keyup, start the countdown
  $('#searchInput').keyup(function(){
    clearTimeout(typingTimer);
    typingTimer = setTimeout(setDoneTyping, doneTypingInterval);
  });

  //on keydown, clear the countdown 
  $('#searchInput').keydown(function(){
    clearTimeout(typingTimer);
  });

  //user is "finished typing," do something
  function setDoneTyping () {
    doneTyping = true;
    search($scope.search.query, '');
  }
  
  $scope.getMore = function () {
    if ($scope.landing) {
      var vars = {
        showProjects: $scope.search.showProjects,
        city: $scope.search.city,
        cause: $scope.search.cause,
        skill: $scope.search.skill
      };
      $scope.$emit('landingToExplorer', vars);
    }
    if ($scope.search.showProjects) {
      if ($scope.search.nextUrlProject()) {
        $http.get($scope.search.nextUrlProject()).success( function (response) {
          response.results.forEach(function (project) {
            Cleanup.projectForSearch(project);
            $scope.search.projects().push(project);
          });
          $scope.search.setNextUrlProject(response.next);
        }).error(function () {
          toastr.error('Erro ao buscar mais atos do servidor');
        });
      } else {
        if (!alreadySearchedProject) {
          toastr.error('Não conseguimos achar mais atos. Tente mudar os filtros.');
          alreadySearchedProject = true;
        }
      }
    } else {
      if ($scope.search.nextUrlNonprofit()) {
        $http.get($scope.search.nextUrlNonprofit()).success( function (response) {
          response.results.forEach(function (nonprofit) {
            Cleanup.nonprofitForSearch(nonprofit);
            $scope.search.nonprofits().push(nonprofit);
          });
          $scope.search.setNextUrlNonprofit(response.next);
        }).error(function () {
          toastr.error('Erro ao buscar mais ONGs do servidor');
        });
      } else {
        if (!alreadySearchedNonprofit) {
          toastr.error('Não conseguimos achar mais ONGs. Tente mudar os filtros.');
          alreadySearchedNonprofit = true;
        }
      }
    }
  };
});
