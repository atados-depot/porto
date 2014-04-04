'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.factory('Nonprofit', function(Restangular, $state, $stateParams, Cleanup, $http, api) {
  return {
    get: function (slug) {
      return Restangular.one('nonprofit', slug).get().then(function(nonprofit) {
        if (!nonprofit.published) {
          $state.transitionTo('root.home');
          toastr.error('ONG ainda não foi aprovada. Se isso é um erro entre em contato por favor.');
        } else {
          Cleanup.nonprofit(nonprofit);
          return nonprofit;
        }
      }, function() {
        $state.transitionTo('root.home');
        toastr.error('ONG não existe.', $stateParams.slug);
      });
    },
    save: function (nonprofit) {
      var nonprofitCopy = {};
      angular.copy(nonprofit, nonprofitCopy);

      var causes = [];
      nonprofitCopy.causes.forEach(function(c) {
        causes.push(c.id);
      });
      nonprofitCopy.causes = causes;

      if (nonprofitCopy.website.substring(0,4) !== 'http') {
        nonprofitCopy.website = 'http://'  + nonprofitCopy.website;
      }
      if (nonprofitCopy.facebook_page_short) {
        nonprofitCopy.facebook_page = 'http://www.facebook.com/' + nonprofitCopy.facebook_page_short;
      } else {
        nonprofitCopy.facebook_page = null;
      }
      if (nonprofitCopy.google_page_short) {
        nonprofitCopy.google_page = 'http://plus.google.com/' + nonprofitCopy.google_page_short;
      } else {
        nonprofitCopy.google_page = null;
      }
      if (nonprofitCopy.twitter_handle_short) {
        nonprofitCopy.twitter_handle = 'http://twitter.com/' + nonprofitCopy.twitter_handle_short;
      } else {
        nonprofitCopy.twitter_handle = null;
      }

      nonprofitCopy.user.address.city = nonprofitCopy.address.city.id;
      
      delete nonprofitCopy.address;
      delete nonprofitCopy.projects;
      delete nonprofitCopy.image_url;
      delete nonprofitCopy.cover_url;
      delete nonprofitCopy.volunteers;
      delete nonprofitCopy.user.address.city_state;
      delete nonprofitCopy.user.address.state;
      
      $http.put(api + 'nonprofit/' + nonprofit.slug + '/.json', nonprofitCopy)
        .success(function() {
          toastr.success('Perfil da ONG salva!');
        }).error(function() {
          toastr.error('Problema ao salvar o perfil da ONG, por favor tente de novo');
        });
    }
  };
});
