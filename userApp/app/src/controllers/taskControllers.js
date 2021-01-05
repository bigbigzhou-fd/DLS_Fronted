'use strict';
angular.module('myApp.taskControllers', [
        'myApp.services',
        'dls.filters'
    ])
    .controller("taskCtrl", ['$scope', function ($scope) {

        $scope.modalData = {
            templateUrl: './src/templates/taskViews/task1.html',
            content: ''
        };
        $scope.showMsg = function (msg) {
            $scope.modalData.content = msg;
            $scope.$emit("setModalState", $scope.modalData);
        };

    }])
  