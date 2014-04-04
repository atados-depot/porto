'use strict';

var app = angular.module('portoApp');

app.controller('AboutCtrl', function ($scope) {
  $scope.site.title = 'Atados - Sobre';

  $scope.team = [
    {
      name: 'André Cervi',
      image: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/c205.44.550.550/s160x160/417055_10152269035845293_1847417011_n.jpg',
      where: 'Atados São Paulo',
      description: 'Blah blah'
    },
    {
      name: 'André Cervi',
      image: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/c205.44.550.550/s160x160/417055_10152269035845293_1847417011_n.jpg',
      where: 'Atados São Paulo',
      description: 'Blah blah'
    },
  ];
});
