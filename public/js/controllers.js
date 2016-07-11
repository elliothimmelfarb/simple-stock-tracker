'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, User) {
  console.log('mainCtrl!');

  $scope.quotes = [];

  $scope.quote = {};

  $scope.getQuote = (symbol) => {
    $scope.quote = {};
    User.getStock(symbol)
      .then(res => {
        $scope.quote = res.data;
      })
      .catch(err => {
        console.log(err);
      })
  }

  $scope.logout = () => {
    User.logout();
  };
});

app.controller('accountCtrl', function(CurrentUser, User, $scope) {
  console.log('accountCtrl!');
  console.log('CurrentUser:', CurrentUser.data);
  CurrentUser.data.symbols.forEach(symbol => {
    console.log(symbol)
    User.getStock(symbol)
      .then(res => {
        $scope.quotes.push(res.data);
      });
  });

  $scope.addSymbol = (symbol) => {
    User.addSymbol(CurrentUser.data._id, symbol.toUpperCase())
      .then(res => {
        User.getStock(res.data.symbols[res.data.symbols.length - 1])
          .then(res => {
            $scope.quotes.push(res.data);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  $scope.removeSymbol = (symbol) => {
    console.log('clicked', symbol)
    User.removeSymbol(CurrentUser.data._id, symbol)
      .then(res => {
        console.log(res);
        $scope.quotes = $scope.quotes.filter(quote => {
          console.log(symbol, quote.Symbol)
          return quote.Symbol !== symbol;
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

});

app.controller('loginRegisterCtrl', function($scope, $state, User) {

  $scope.currentState = $state.current.name;

  $scope.submit = () => {
    console.log('$scope.user:', $scope.user);

    if ($scope.currentState === 'login') {
      // login stuff
      User.login($scope.user)
        .then(res => {
          $state.go('home');
        })
        .catch(err => {
          console.log('err:', err);
          alert('Register failed. Error in console.');
        });
    } else {
      // register stuff

      if ($scope.user.password !== $scope.user.password2) {
        // passwords don't match
        $scope.user.password = null;
        $scope.user.password2 = null;
        alert('Passwords must match.  Try again.');
      } else {
        // passwords are good
        User.register($scope.user)
          .then(res => {
            $state.go('login');
          })
          .catch(err => {
            console.log('err:', err);
            alert('Register failed. Error in console.');
          });
      }
    }
  };

});
