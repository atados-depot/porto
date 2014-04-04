'use strict';

/* global toastr: false */

var app = angular.module('portoApp');

app.factory('Photos', function($http, $FB, api) {

  return {
    getFacebookPhoto: function (success, error) {
      $FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          if (response.authResponse) {
            response.authResponse.getPhoto = true;
            $http.post(api + 'facebook/', response.authResponse).success( function(response) {
              success(response.user.image_url);
            }).error(error);

          } else {
            toastr.error('Could not get facebook credentials');
            error();
          }
        }
      });
    },
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
