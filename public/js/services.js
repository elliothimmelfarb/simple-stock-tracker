'use strict';

var app = angular.module('myApp');


app.service('User', function($http, $rootScope, $cookies, $state, $q, TOKENNAME) {

  this.getStock = (symbol) => {
    return $http.jsonp(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${symbol}&callback=JSON_CALLBACK`);
  };

  this.addSymbol = (id, symbol) => {
    return $http.put(`/api/users/${id}/addSymbol`, { symbol });
  }

  this.removeSymbol = (id, symbol) => {
    return $http.delete(`/api/users/${id}/${symbol}`);
  }

  this.getAccount = () => {
    return $http.get('/api/users/profile');
  };

  this.readToken = () => {
    let token = $cookies.get(TOKENNAME);

    if (typeof token === 'string') {
      let payload = JSON.parse(atob(token.split('.')[1]));
      $rootScope.currentUser = payload;
    }
  };

  this.register = userObj => {
    return $http.post('/api/users/register', userObj);
  };

  this.login = userObj => {
    return $http.post('/api/users/login', userObj)
      .then(res => {
        $rootScope.currentUser = res.data;
        return $q.resolve(res);
      });
  };

  this.logout = () => {
    $cookies.remove(TOKENNAME);
    $rootScope.currentUser = null;
    $state.go('home');
  };

});
