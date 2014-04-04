'use strict';


var app = angular.module('atadosApp');

app.factory('Job', function($http, $q, api) {
  return {
    get: function(id) {
      var deferred = $q.defer();
      $http.get(api + 'jobs/'+ id + '/').success(function (job) {
        deferred.resolve(job);
      });
      return deferred.promise;
    }
  };
});
