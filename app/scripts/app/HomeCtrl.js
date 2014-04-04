'use strict';

var app = angular.module('portoApp');

app.controller('HomeCtrl', function($scope, $sce) {
  $scope.site.title = 'Atados - Juntando Gente Boa';

  $scope.depoimentos = [{
    quote: 'Atar-se a alguém é de fato um ato de coragem  e essa é uma qualidade que não falta nos corações de quem é do Atados. Grande exemplo para aqueles que nasceram incomodados. Se voce é um tipo desses, experimente atar-se e nunca mais será o mesmo. Seja uma cartinha toda semana, um dia no asilo ou uma festa com gente de várias nações, viva a experiência!',
    name: 'Talyta Santos',
    where: $sce.trustAsHtml('Funcionária da <a href="http://www.boehringer-ingelheim.com.br/" target="_blank"><strong> Boehringer</strong></a>'),
    image: 'talyta.jpg'
  }, {
    quote: 'O Atados é um grupo de pessoas que quer mudar pessoas indignadas, que se juntaram para propiciar a outros novas possibilidades de ver e viver. Pessoas que acreditam que toda nova experiência e transformadora, e que querem tornar acessíveis diferentes formas de conhecer e de encontrar com o outro.',
    name: 'Marcela Aruda',
    where: $sce.trustAsHtml('Voluntária da <a ui-sref="root.nonprofit({slug: "mudacoletivo"})" target="_blank"><strong> Muda Coletivo</strong></a>'),
    image: 'marcela.jpg'
  }, {
    quote: 'Quando decidimos nos cadastrar no site sabíamos que lidaríamos com o mundo virtual, ou seja nada de contato pessoal. A grande surpresa é que essa relação passou do virtual para o real é como se vocês tivessem pulado da tela para trabalhar aqui do nosso lado e hoje somos amigos.',
    name: 'Dayse',
    where: $sce.trustAsHtml('Funcionária da ONG <a ui-sref="root.nonprofit({slug: "parceiros"})" target="_blank"><strong> Monte Azul</strong></a>'),
    image: 'dayse.jpg'
  }];
});
