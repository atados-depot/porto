'use strict';

var app = angular.module('portoApp');

app.factory('Site', function(Restangular, $http, storage, api) {
  var _causes = [];
  var _skills = [];
  var _cities = [];
  var _states = [];
  var _numbers = {
    projects: 0,
    nonprofits: 0,
    volunteers: 0
  };

  return {
    name : 'Porto Voluntário',
    title: 'Porto Voluntário',
    contactEmail: 'contato@atados.com.br',
    copyright: 'Atados, ' + (new Date()).getFullYear(),
    team: [{
      name: 'Marjori Pomarole',
      email: 'marjori@atados.com.br',
      photo: 'URL here',
      description: 'Hi I am the programmer',
      facebook: 'marjoripomarole'
    }],
    startup: function () {
      return $http.get(api + 'startup/')
        .then(function(response) {
          response = response.data;
          _numbers = response.numbers;

          _states = response.states;

          _cities = response.cities;
          _cities.splice(0, 0, {name: 'Todas Cidades', id: '', active: true, state: 0});

          _skills = response.skills;
          _skills.forEach(function (s) {
            s.image = storage + 'skill_' + s.id + '.png';
            s.class = 'skill_' + s.id;
          });
          _skills.splice(0, 0, {name: 'Todas Habilidades', id: ''});

          _causes = response.causes;
          _causes.forEach(function (c) {
            c.image = storage + 'cause_' + c.id + '.png';
            c.class = 'cause_' + c.id;
          });
          _causes.splice(0, 0, {name: 'Todas Causas', id: '', class: 'cause_0'});

          return true;
        });
    },
    causes: function () {
      return _causes;
    },
    skills: function () {
      return _skills;
    },
    cities: function () {
      return _cities;
    },
    states: function () {
      return _states;
    },
    numbers: function () {
      return _numbers;
    }
  };
});
