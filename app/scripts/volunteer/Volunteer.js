'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.factory('Volunteer', function($http, $state, Restangular, Cleanup, api) {
  return {
    get: function(slug) {
      return Restangular.one('volunteers_public', slug).get().then(function(volunteer) {
        Cleanup.volunteer(volunteer);
        return volunteer;
      }, function() {
        $state.transitionTo('root.home');
        toastr.error('Voluntário não encontrado');
      });
    },
    save: function (volunteer, success, error) {
      var volunteerCopy = {};
      angular.copy(volunteer, volunteerCopy);

      var causes = [];
      volunteerCopy.causes.forEach(function(c) {
        causes.push(c.id);
      });
      volunteerCopy.causes = causes;

      var skills = [];
      volunteerCopy.skills.forEach(function(s) {
        skills.push(s.id);
      });
      volunteerCopy.skills = skills;

      if (volunteerCopy.address && volunteerCopy.address.city) {
        volunteerCopy.address.city = volunteerCopy.address.city.id;
        delete volunteerCopy.address.state;
      }
      volunteerCopy.user.address = volunteerCopy.address;

      if (volunteerCopy.birthDate) {
        if (typeof volunteerCopy.birthDate.getFullYear !== 'undefined') {
          volunteerCopy.birthDate = volunteerCopy.birthDate.getFullYear() + '-' + (volunteerCopy.birthDate.getMonth() + 1) + '-' + volunteerCopy.birthDate.getDate();
        }
      }

      delete volunteerCopy.projects;
      delete volunteerCopy.nonprofits;

      $http.put(api + 'volunteers/' + volunteerCopy.slug + '/.json', volunteerCopy)
        .success(success).error(error);
    }
  };
});
