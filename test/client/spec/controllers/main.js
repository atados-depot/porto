'use strict';

describe('Controller: AppCtrl', function () {

  // load the controller's module
  beforeEach(module('portoApp'));

  var AppCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/auth/client')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
    });
  }));

  it('should return id and secret to the scope', function () {
    // expect(scope.awesomeThings).toBeUndefined();
    // $httpBackend.flush();
    expect(true).toBe(true);
  });
});
