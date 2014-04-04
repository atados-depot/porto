'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.factory('Project', function($http, Restangular, Site, Auth, Cleanup, $state, api) {
  return {
    create: function (project, files, success, error) {
      var projectCopy = {};
      angular.copy(project, projectCopy);
      var causes = [];
      projectCopy.causes.forEach(function(c) {
        causes.push(c.id);
      });
      projectCopy.causes = causes;

      var skills = [];
      projectCopy.skills.forEach(function(s) {
        skills.push(s.id);
      });
      projectCopy.skills = skills;

      files.append('project', angular.toJson(projectCopy));

      $http.post(api + 'create/project/', files, {
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
      }).success(success).error(error);
    },
    save: function (project, success, error) {
      var projectCopy = {};
      angular.copy(project, projectCopy);

      delete projectCopy.nonprofit;
      delete projectCopy.volunteers;
      delete projectCopy.volunteers_numbers;
      delete projectCopy.nonprofit_city_state;
      delete projectCopy.nonprofit_image;
      delete projectCopy.image_url;

      if (projectCopy.job) {
        projectCopy.job.start_date = new Date(projectCopy.job.start_date).getTime();
        projectCopy.job.end_date = new Date(projectCopy.job.end_date).getTime();
        delete projectCopy.work;
      } else if(projectCopy.work){
        delete projectCopy.job;
      }

      var causes = [];
      projectCopy.causes.forEach(function(c) {
        causes.push(c.id);
      });
      projectCopy.causes = causes;

      var skills = [];
      projectCopy.skills.forEach(function(s) {
        skills.push(s.id);
      });
      projectCopy.skills = skills;

      $http.put(api + 'save/project/', {'project': projectCopy})
        .success(success).error(error);
    },
    get: function(slug) {
      return Restangular.one('project', slug).get().then(function(project) {
        Cleanup.project(project);
        return project;
      }, function() {
        $state.transitionTo('root.home');
        toastr.error('Ato não encontrado.');
      });
    },
  };
});
