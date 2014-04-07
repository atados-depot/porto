'use strict';

/* global $: false */

var app = angular.module('portoApp');

app.directive('projectCard', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/projectCard.html'
  };
});
app.directive('depoimento', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/depoimento.html'
  };
});


app.directive('atadosSearch', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/search.html',
    controller: 'SearchCtrl'
  };
});

app.directive('nonprofitCard', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/nonprofitCard.html'
  };
});

app.directive('phone', function () {
  return {
    restrict: 'E',
    scope: {
      number: '@'
    },
    template: '<p><i class="fa fa-phone"></i> {{number}}</p>'

  };
});

app.directive('phoneInput', function () {
  return {
    restrict: 'E',
    scope: {
      object: '=object',
      form: '=form',
    },
    templateUrl: '/partials/phoneInput.html',
    link: function() {
      $('#phoneInput').mask('(99) 9999?9-9999');
    },
  };
});

function validPortoSeguroEmail(email) {
  return email.indexOf('@portoseguro.com.br') >= 0;
}

app.directive('portoSeguroEmailInput', ['Auth', function(Auth){
  return {
    restrict: 'E',
    scope: {
      object: '=',
      form: '=',
      signup: '='
    },
    templateUrl: '/partials/portoSeguroEmailInput.html',
    link: function(scope) {
      window.form  = scope.form;
      scope.$watch('object', function (value) {
        if (value) {
          scope.form.email.$setValidity('notPortoSeguroEmail', validPortoSeguroEmail(value));
          Auth.isEmailUsed(value, function (response) {
            scope.form.email.$setValidity('alreadyUsed', !response.alreadyUsed);
            if (!scope.signup) {
              scope.form.email.$setValidity('alreadyUsed', true);
            }
          });
        } else {
          scope.form.email.$setValidity('alreadyUsed', true);
        }
      });
    }
  };
}]);

app.directive('causes', function () {
  return {
    restrict: 'E',
    scope: {
      selected: '=',
      all: '='
    },
    templateUrl: '/partials/causeInput.html',
    link: function(scope) {
      if (!scope.selected) {
        scope.selected = [];
      }
      scope.inSelected = function(cause) {
        if (scope.selected.length === 0) {
          scope.causeChosen = scope.$parent.causeChosen = false;
        } else {
          scope.causeChosen = scope.$parent.causeChosen = true;
        }
        return scope.selected.indexOf(cause) !== -1;
      };

      scope.addCause = function(cause) {
        var index = scope.selected.indexOf(cause);
        if (index !== -1) {
          scope.selected.splice(index, 1);
        } else {
          scope.selected.push(cause);
        }
      };
    }
  };
});

app.directive('skills', function () {
  return {
    restrict: 'E',
    scope: {
      selected: '=',
      all: '='
    },
    templateUrl: '/partials/skillInput.html',
    link: function(scope) {
      if (!scope.selected) {
        scope.selected = [];
      }
      scope.inSelected = function(skill) {
        if (scope.selected.length === 0) {
          scope.skillChosen = scope.$parent.skillChosen = false;
        } else {
          scope.skillChosen = scope.$parent.skillChosen = true;
        }
        return scope.selected.indexOf(skill) !== -1;
      };

      scope.addSkill = function(skill) {
        var index = scope.selected.indexOf(skill);
        if (index !== -1) {
          scope.selected.splice(index, 1);
        } else {
          scope.selected.push(skill);
        }
      };
    }
  };
});


app.directive('email', function () {
  return {
    restrict: 'E',
    scope: {
      email: '@'
    },
    template: '<p><i class="fa fa-laptop"></i> {{email}}</p>'
  };
});

app.directive('imgCropped', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { src:'@', selected:'&' },
    link: function(scope,element/*, attr */) {
      var myImg;
      var clear = function() {
        if (myImg) {
          myImg.next().remove();
          myImg.remove();
          myImg = undefined;
        }
      };
      scope.$watch('src', function(nv) {
        clear();
        if (nv) {
          element.after('<img />');
          myImg = element.next();
          myImg.attr('src',nv);
          $(myImg).Jcrop({
            trackDocument: true,
            onSelect: function(x) {
              scope.$apply(function() {
                scope.selected({cords: x});
              });
            }
          });
        }
      });
      
      scope.$on('$destroy', clear);
    }
  };
});
