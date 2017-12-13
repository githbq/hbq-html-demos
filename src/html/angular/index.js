(function () {
  var app = angular.module('myApp', [])
  app.controller('myCtrl', function ($scope, $http) {
    $http({
      method: 'GET',
      url: 'localhost:6000/demo/test/request'
    }).then(function successCallback (response) {
      debugger
      // 请求成功执行代码
    }, function errorCallback (response) {
      // 请求失败执行代码
    })
  })
})()
