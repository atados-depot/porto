'use strict';

var app = angular.module('portoApp');

app.factory('Work', function($http, $q, api) {
  return {
    get: function(id) {
      var deferred = $q.defer();
      $http.get(api + 'works/'+ id + '/').success(function (work) {
        deferred.resolve(work);
      });
      return deferred.promise;
    }
  };
});
