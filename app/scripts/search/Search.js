'use strict';

var app = angular.module('portoApp');

app.factory('Search', function (Restangular, Cleanup, ENV) {
  var _query = '';
  var _cause = {};
  var _skill = {};
  var _city = {};
  
  var _highlightedProjects = [];

  var _projects = [];
  var _nonprofits = [];

  var _nextUrlProject = '';
  var _nextUrlNonprofit = '';

  var _projectCount = 0;
  var _nonprofitCount = 0;

  var _loading = false;

  var toHttps = function (url) {
    if (url && ENV === 'production') {
      return url.replace('http','https');
    }
    return url;
  };

  var fixProject = function (projects) {
    projects.forEach(Cleanup.projectForSearch);
    if (projects._resultmeta) {
      _nextUrlProject = toHttps(projects._resultmeta.next);
      _projectCount = projects._resultmeta.count;
    } else {
      _nextUrlProject = '';
    }
    return projects;
  };

  var fixNonprofit = function (nonprofits) {
    nonprofits.forEach(Cleanup.nonprofitForSearch);
    if (nonprofits._resultmeta) {
      _nextUrlNonprofit = toHttps(nonprofits._resultmeta.next);
      _nonprofitCount = nonprofits._resultmeta.count;
    } else {
      _nextUrlNonprofit = '';
    }
    return nonprofits;
  };

  function searchProjects(query, cause, skill, city) {
    var urlHeaders = {
      page_size: 20,
      query: query,
      cause: cause,
      skill: skill,
      city: city,
    };
    _loading = true;
    Restangular.all('projects').getList(urlHeaders).then( function(response) {
      _projects = [];
      _projects = fixProject(response);
      _loading = false;
    }, function () {
      console.error('Não consegui pegar os atos do servidor.');
      _loading = false;
    });
  }

  var searchNonprofits = function (query, cause, city) {
    var urlHeaders = {
      page_size: 20,
      query: query,
      cause: cause,
      city: city,
    };
    _loading = true;
    Restangular.all('nonprofits').getList(urlHeaders).then( function (response) {
      _nonprofits = [];
      _nonprofits = fixNonprofit(response);
      _loading = false;
    }, function () {
      console.error('Não consegui pegar ONGs do servidor.');
      _loading = false;
    });
  };

  searchProjects(null, null, null, null);
  searchNonprofits(null, null, null, null);

  return {
    filter: function (query, cause, skill, city) {
      _projects = [];
      _nonprofits = [];
      searchProjects(query, cause, skill, city);
      searchNonprofits(query, cause, city);
    },
    query: _query,
    cause: _cause,
    skill: _skill,
    city: _city,
    loading: function () {
      return _loading;
    },
    showProjects: true,
    projectCount: function () {
      return _projectCount;
    },
    nonprofitCount: function () {
      return _nonprofitCount;
    },
    nextUrlProject: function () {
      return _nextUrlProject;
    },
    nextUrlNonprofit: function () {
      return _nextUrlNonprofit;
    },
    setNextUrlProject: function (url) {
      _nextUrlProject = toHttps(url);
    },
    setNextUrlNonprofit: function (url) {
      _nextUrlNonprofit = toHttps(url);
    },
    projects: function () {
      return _projects;
    },
    nonprofits: function () {
      return _nonprofits;
    },
    getHighlightedProjects: function () {
      return Restangular.all('porto/highlights').getList().then( function(response) {
        _highlightedProjects = fixProject(response);
        return;
      }, function () {
        console.error('Não consegui pegar os atos em destaque do servidor.');
      });
    },
    highlightedProjects: function () {
      return _highlightedProjects;
    }
  };
});
