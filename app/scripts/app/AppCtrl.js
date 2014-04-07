'use strict';

var app = angular.module('portoApp');

app.controller('AppCtrl', function($scope, $rootScope, $modal, $state, $location, $anchorScroll, Site, Search, storage) {
  
  $scope.site = Site;
  $scope.search = Search;
  $rootScope.modalInstance = null;
  $scope.storage = storage;
  $scope.causes = Site.causes;
  $scope.skills = Site.skills;
  $scope.cities = Site.cities;
  $scope.states = Site.states;
  $scope.numbers = Site.numbers;

  $scope.citySearch = function (city) {
    $scope.cities().forEach(function (c) {
      if (c.name === city) {
        $scope.search.city = c;
        $location.hash('top');
        $anchorScroll();
        return;
      }
    });
  };

  $scope.siteSearch = function () {
    $state.transitionTo('root.explore');
    $scope.search.query = $scope.search.landingQuery;
    $scope.search.landingQuery = '';
    Search.filter(Search.query, Search.cause.id, Search.skill.id, Search.city.id);
  };

  $scope.openLogin = function() {
    $rootScope.modalInstance = $modal.open({
      templateUrl: '/partials/loginModal.html'
    });
  };

  $scope.openTermsModal = function() {
    $rootScope.modalInstance = $modal.open({
      templateUrl: '/partials/termsModal.html'
    });
  };

  $rootScope.closeNonprofitLoginModal = function () {
    $rootScope.modalInstance.close();
  };

  $scope.goToExplore = function () {
    $state.transitionTo('root.explore');
  };
});
