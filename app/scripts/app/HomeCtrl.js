'use strict';

var app = angular.module('portoApp');

app.controller('HomeCtrl', function($scope) {
  $scope.site.title = 'Atados - Juntando Gente Boa';

  $scope.depoimentos = [{
    quote: 'Ser voluntário para mim é ser doador do bem, isso dá proposito para minha vida! Aprendi a vencer obstáculos e quebrar paradigmas sociais! Ser voluntário é ser doador de amor, mantendo uma porta aberta para esperança e para o novo! A ação voluntária mudou minha vida, sou mais feliz, assim, posso fazer outras pessoas felizes também. Aprendi a dividir o que já tenho e a conquistar o que desejo.',
    name: 'Bruna Pereira',
    where: 'Agronegócios',
    image: 'bruna.jpg'
  }, {
    quote: 'É a peça do quebra-cabeça da vida que faltava para eu entender o sentido da minha. É estar motivado para participar, ajudar, mudar, sorrir e receber como recompensa outro sorriso. É estar alinhado com os valores de uma empresa e com verdadeiros valores de um ser humano que compartilha o bem. É saber viver e amar a tudo e a todos. É a melhor parte da minha vida',
    name: 'Danilo Barros',
    where: 'Segurança da Informação',
    image: 'danilo.jpg'
  }, {
    quote: 'A ação voluntária é algo especial, é um tempo que dedicamos para conquista do bem interior. Ganhamos em troca novas experiências com a alegria de outras pessoas, lugares, atitudes, momentos inesquecíveis ou todo carinho que pode ter no coração de uma criança.',
    name: 'Alexandre Estevan',
    where: 'Analise de Resultado Auto',
    image: 'alexandre.jpg'
  }];
});
