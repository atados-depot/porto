'use strict';

/* global $: false */

var app = angular.module('portoApp');

app.factory('Auth', function($http, Cookies, Cleanup, api, accessTokenCookie, authApi, grantType) {
  
  function setAuthHeader(accessToken) {
    if (accessToken) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
    }
  }

  return {
    getCurrentUser: function (token) {
      if (!token) {
        token = Cookies.get(accessTokenCookie);
      }
      if (token) {
        setAuthHeader(token);
        return $http.get(api + 'current_user/?id=' + new Date().getTime())
          .then(function (response) {
            Cleanup.currentUser(response.data);
            return response.data;
          });
      }
    },
    resetPassword: function (email, success, error) {
      $http.post(api + 'password_reset/', {email: email})
        .success( function(){
          success();
        }).error(error);
    },
    // Both email and password field need to be set on data object
    changePassword: function (data, success, error) {
      $http.put(api + 'change_password/', data)
        .success( function() {
          success();
        }).error(error);
    },
    isEmailUsed: function (email, success) {
      if (email) {
        $http.get(api + 'check_email/?email=' + email + '?id=' + new Date().getTime())
          .success(success);
      }
    },
    isSlugUsed: function (slug, success) {
      $http.get(api + 'check_slug/?slug=' + slug)
        .success(success);
    },
    volunteerSignup: function(volunteer, success, error) {
      $http.post(api + 'create/volunteer/', volunteer).success( function() {
        success();
      }).error(error);
    },
    nonprofitSignup: function(data, success, error) {
      $http.post(api + 'create/nonprofit/', data, {
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
      }).success( function() {
        success();
      }).error(error);
    },
    login: function(user, success, error) {
      user.grant_type = grantType;
      $http.get(authApi)
        .success(function (response) {
          user.client_id = response.id;
          user.client_secret = response.secret;
          $http({
            method: 'POST',
            url: api + 'oauth2/access_token/',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param(user)
          }).success( function(response){
              setAuthHeader(response.access_token);
              if (user.remember) {
                Cookies.set(accessTokenCookie, response.access_token, { expires: 30, path: '/' });
              } else {

              }
              success(response);
            }).error(error);
        });
    },
    logout: function() {
      $http.post(api + 'logout/');
      Cookies.delete(accessTokenCookie);
      delete $http.defaults.headers.common.Authorization;
    }
  };
});
