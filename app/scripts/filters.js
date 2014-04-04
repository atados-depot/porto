'use strict';

var app = angular.module('portoApp');

app.filter('as_location_string', function() {
  return function(address) {
    if (!address) {
      return 'Não tem endereço.';
    }

    if (address.city === 0) {
      return address.city_state;
    }

    var out = address.addressline + ', ';
    if (address.addressnumber) {
      out += address.addressnumber + ' - ';
    }
    if (address.addressline2) {
      out += address.addressline2 + ' - ';
    }
    if (address.neighborhood) {
      out += address.neighborhood + ' - ';
    }
    if (address.city_state) {
      out += address.city_state;
    }
    if (address.zipcode) {
      out += ' - ' + address.zipcode;
    }
    return out;
  };
});

app.filter('newlines', function ($sce) {
  return function(text) {
    if (text) {
      return $sce.trustAsHtml(text.replace(/\n/g, '<br/>'));
    }
  };
});

app.filter('noHTML', function () {
  return function(text) {
    if (text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;');
    }
  };
});
