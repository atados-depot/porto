'use strict';

var app = angular.module('portoApp');

app.factory('Photos', function($http, api) {

  return {
    setVolunteerPhoto: function (file, success, error) {
      $http.post(api + 'upload_volunteer_image/', file, {
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
        }).success(success).error(error);
    },
    setProjectPhoto: function (file, projectId, success, error) {
      $http.post(api + 'upload_project_image/?id=' + projectId, file, {
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
        }).success(success).error(error);
    },
    setNonprofitProfilePhoto: function (file, success, error) {
      $http.post(api + 'upload_nonprofit_profile_image/', file, {
        headers: {'Content-Type': undefined },
        transformRequest: angular.indenty
      }).success(success).error(error);
    },
    setNonprofitCoverPhoto: function (file, success, error) {
      $http.post(api + 'upload_nonprofit_cover_image/', file, {
        headers: {'Content-Type': undefined },
        transformRequest: angular.indenty
      }).success(success).error(error);
    },
  };
});
