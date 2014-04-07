'use strict';

/* global $: false */

var app = angular.module('portoApp',
    ['restangular', 'ui.router', 'ui.bootstrap', 'atadosConstants']);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: '/partials/root.html',
      controller: 'RootCtrl',
      resolve: {
        site: ['Site', function(Site) {
          return Site.startup();
        }],
        loggedUser: ['Auth', function (Auth) {
          return Auth.getCurrentUser();
        }]
      }
    })
    .state('root.home', {
      url: '/',
      templateUrl: '/partials/home.html',
      controller: 'HomeCtrl',
      resolve: {
        projects: ['Search', function(Search) {
          return Search.getHighlightedProjects();
        }]
      }
    })
    .state('root.404', {
      url: '/ops',
      templateUrl: '/partials/404.html'
    })
    .state('root.explore', {
      url: '/explore',
      templateUrl: '/partials/explore.html',
      controller: 'ExplorerCtrl'
    })
    .state('root.nonprofit', {
      url: '/ong/:slug',
      templateUrl: '/partials/nonprofitProfile.html',
      controller: 'NonprofitCtrl',
      resolve: {
        nonprofit: ['Nonprofit', '$stateParams', function (Nonprofit, $stateParams) {
          return Nonprofit.get($stateParams.slug);
        }]
      }
    });

  $urlRouterProvider.otherwise('/ops');
  $locationProvider.html5Mode(true).hashPrefix('!');
});

app.config(function ($httpProvider, accessTokenCookie, csrfCookie, sessionIdCookie) {

  var securityInterceptor = ['$location', '$q', function($location, $q) {

    function success(response) { return response; }

    function error(response) {
      // This is when the user is not logged in
      if (response.status === 401) {
        return $q.reject(response);
      } else if (response.status === 403) {
        $.removeCookie(accessTokenCookie);
        $.removeCookie(csrfCookie);
        $.removeCookie(sessionIdCookie);
        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    }

    return function(promise) {
      return promise.then(success, error);
    };
  }];

  $httpProvider.responseInterceptors.push(securityInterceptor);
});

app.config(function(RestangularProvider, api) {
  RestangularProvider.setBaseUrl(api);
  RestangularProvider.setDefaultHttpFields({cache: true});
  RestangularProvider.setRequestSuffix('/?format=json');
  RestangularProvider.setRestangularFields({
    id: 'slug'
  });
  // This function is used to map the JSON data to something Restangular expects
  RestangularProvider.setResponseExtractor( function(response, operation) {
    if (operation === 'getList') {
      // Use results as the return type, and save the result metadata
      // in _resultmeta
      var newResponse = response.results;
      newResponse._resultmeta = {
        'count': response.count,
        'next': response.next,
        'previous': response.previous,
      };
      return newResponse;
    }
    return response;
  });
});
