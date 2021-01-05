'use strict';
angular.module('myApp.productAccountControllers', [
        'myApp.services',
        'dls.filters',
        'dls.services.util'
])
.controller("productAccountUtilCtrl",['$scope','$filter','$cookies','DlsUtil','localStorageService'
  , function ($scope,$filter,$cookies,DlsUtil,localStorageService) {

    $scope.modalData = {
        templateUrl : './src/templates/modalViews/addToCartTipModal.html',
        content : ''
    };
    $scope.showMsg = function (msg) {
      $scope.modalData.content = msg;
      $scope.$emit("setModalState",$scope.modalData);
    };
    $scope.checkStates = [{
        'value' : '00',
        'name' : '全部'
      },{
        'value' : '01',
        'name' : '待审核'
      },{
        'value' : '02',
        'name' : '已通过'
    },{
        'value' : '03',
        'name' : '已拒绝'
    }];
    $scope.searchDates = [{
        'value' : '01',
        'name' : '申请时间'
      },{
        'value' : '02',
        'name' : '审核时间'
      }];

}])
.controller("productAccountCtrl",['$scope','$filter','$cookies','DlsUtil','prdtAccountService','productAccountTitles', 'debounce', 'localStorageService'
  , function ($scope,$filter,$cookies,DlsUtil,prdtAccountService,productAccountTitles, debounce, localStorageService) {
    $scope.titles = productAccountTitles.titles;
    $scope.datas = {
        list: []
    };
    $scope.pageOptions = {
      "total_items_num" : 0,
      "total_pages_num" : 1,
      "per_page_num" : 10
    };
    $scope.totalItems = 10;

    var  appStatus = localStorageService.get('appStatus');
    $scope.keyword = !!appStatus ? appStatus.keyword : '';
    $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;
    $scope.getDatas = function () {
      prdtAccountService.save({
        page:$scope.curPageNum,
          detail: "memAccount/list"
      }, {
        keyword:$scope.keyword,
      }, function (resp) {
        $scope.datas = resp.data;
        $scope.pageOptions = {
            "total_items_num" : resp.data.page.total_rows,
            "total_pages_num" : resp.data.page.total_pages,
            "per_page_num" : resp.data.page.rows
        };
      });
    };
    $scope.$watch("curPageNum",function(){
        $scope.getDatas();
    });
    $scope.$watch('keyword',debounce(function (newV, oldV) {
        if (newV !== oldV) {
            $scope.getDatas();
        }
    }, 350));

    $scope.setStatus = function () {
      var appStatus = {
        'keyword': $scope.keyword,
        'curPageNum': $scope.curPageNum
      };
      localStorageService.set('appStatus', appStatus);
    };

}])
.controller("productAccountCheckHistoryCtrl",['$scope','$filter','$cookies','$stateParams','DlsUtil','localStorageService','prdtAccountService','productAccountCheckHistoryTitles'
  , function ($scope,$filter,$cookies,$stateParams,DlsUtil,localStorageService,prdtAccountService,productAccountCheckHistoryTitles) {
    $scope.titles = productAccountCheckHistoryTitles.titles;
    $scope.memId = $stateParams.memId;
    $scope.type = '01';
    $scope.status = '00';

    $scope.pageOptions = {
      "total_items_num" : 0,
      "total_pages_num" : 1,
      "per_page_num" : 10
    };
    $scope.curPageNum = 1;
    $scope.totalItems = 0;

    $scope.getDatas = function () {
      prdtAccountService.save({
        page:$scope.curPageNum,
          detail: "review/his"
      }, {
        page: $scope.curPageNum,
        memId:$scope.memId,
        type:$scope.type,
        beginTime:$scope.beginTime,
        endTime:$scope.endTime,
        status:$scope.status,
      }, function (resp) {
        $scope.datas = resp.data;
        $scope.pageOptions = {
            "total_items_num" : resp.data.page.total_rows,
            "total_pages_num" : resp.data.page.total_pages,
            "per_page_num" : resp.data.page.rows
        };
      });
    };
    $scope.$watch(function(){
        return $scope.curPageNum +"/"+ $scope.status;
    },function(newV){
        $scope.getDatas();
    });

}])
.controller("productQueryCtrl",['$scope','$filter','$cookies','$stateParams','$uibModal','DlsUtil','prdtAccountService','checkRecordTitles'
  , function ($scope,$filter,$cookies,$stateParams,$uibModal,DlsUtil,prdtAccountService,checkRecordTitles) {
    $scope.titles = checkRecordTitles.titles;
    $scope.memId = $stateParams.memId;
    $scope.addPrdtFlag = true;
    $scope.getDatas = function () {
      prdtAccountService.save({
          detail: "info"
      }, {
        memId:$scope.memId,
      }, function (resp) {
        $scope.datas = resp.data;
      });
    };
    $scope.getDatas();

    $scope.openModel = function (size) {
      var tplUrl = './src/templates/modalViews/productQueryModal.html';
      $scope.modalDatas = $scope.datas;
      $scope.modalDatas.prdtTypeList = Object.assign({},$scope.datas.prdtAccountStatus);

      // console.log(modalDatas);

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: tplUrl,
        bindToController: true,
        controller: 'appModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: size,
        resolve: {
          modalDatas: function () {
            return $scope.modalDatas;
          }
        }
      });
      modalInstance.result.then(function (datas) {
        var prdtTypeList = [];
        for(var item in datas.prdtTypeList) {
          !!datas.prdtTypeList[item] && !$scope.datas.prdtAccountStatus[item] && prdtTypeList.push(item);
        }
        if (prdtTypeList.length === 0) {
          $scope.showMsg('未选择新产品！');
          return;
        }
        // console.log(prdtTypeList);
        prdtAccountService.save({
          page:$scope.curPageNum,
            detail: "apply"
        }, {
          memId:$scope.memId,
          accountId: $scope.datas.accountId,
          prdtTypeList: prdtTypeList.toString()
        }, function (resp) {
          console.log(resp);
          $scope.datas.prdtAccountStatus = datas.prdtTypeList;
          $scope.showMsg(resp.msg);
        });
      }, function () {
        // console.info('Modal dismissed at: ' + new Date());
      });
    };

}])
.controller("productAccountCheckCtrl",['$scope','$filter','$cookies','$uibModal','DlsUtil','localStorageService','prdtAccountService','productAccountCheckTitles', 'debounce'
  , function ($scope,$filter,$cookies,$uibModal,DlsUtil,localStorageService,prdtAccountService,productAccountCheckTitles, debounce) {
    $scope.titles = productAccountCheckTitles.titles;
    $scope.keyword = '';
    $scope.status = '00';
    $scope.pageOptions = {
      "total_items_num" : 0,
      "total_pages_num" : 1,
      "per_page_num" : 10
    };
    $scope.totalItems = 0;

    var  appStatus = localStorageService.get('appStatus');
    $scope.keyword = !!appStatus ? appStatus.keyword : '';
    $scope.status = !!appStatus ? appStatus.status : '00';
    $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;

    $scope.getDatas = function () {
      prdtAccountService.save({
          detail: "review/list"
      }, {
        page: $scope.curPageNum,
        keyword:$scope.keyword,
        status:$scope.status
      }, function (resp) {
        if (resp.status === 0) {
          $scope.showMsg(resp.msg);
          $scope.datas = null;
          return;
        }
        $scope.datas = resp.data;
        $scope.pageOptions = {
            "total_items_num" : resp.data.page.total_rows,
            "total_pages_num" : resp.data.page.total_pages,
            "per_page_num" : resp.data.page.rows
        };
      });
    };

    $scope.$watch(function(){
        return $scope.curPageNum +"/"+ $scope.status;
    },function(newV){
        $scope.getDatas();
    });

    $scope.$watch('keyword',debounce(function (newV, oldV) {
        if (newV !== oldV) {
            $scope.getDatas();
        }
    }, 350));

    $scope.search= function(e){
        var keycode = window.event ? e.keyCode : e.which;//获取按键编码
        if (keycode == 13) {
            $scope.getDatas();
        }
    };

    $scope.setStatus = function () {
      var appStatus = {
        'keyword': $scope.keyword,
        'status': $scope.status,
        'curPageNum': $scope.curPageNum
      };
      localStorageService.set('appStatus', appStatus);
    };

    $scope.openCheck = function (size, applyNo,index) {
      var modalDatas = {};
      prdtAccountService.save({
          detail: "apply/info"
      }, {
        applyNo: applyNo
      }, function (resp) {
          modalDatas = resp.data;

          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: './src/templates/modalViews/productAccountCheck.html',
            controller: 'appModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            resolve: {
              modalDatas: function () {
                return modalDatas;
              }
            }
          });
          modalInstance.result.then(function (datas) {
            console.log(datas);
            prdtAccountService.save({
                detail: "review"
            }, {
              applyNo: applyNo,
              result: !!datas.result ? '02' : '03',
              notes: datas.notes
            }, function (resp) {
              console.log(resp);
              $scope.showMsg(resp.msg);
              if (resp.status === 1) {
                !!datas.result ? $scope.datas.list[index].status = '02' : $scope.datas.list[index].status = '03';
              }
            });
          }, function () {
            // console.info('Modal dismissed at: ' + new Date());
          });
      });


    };

}])

.controller("productCheckInfoCtrl",['$scope','$filter','$cookies','$stateParams','$uibModal','DlsUtil','prdtAccountService','checkRecordTitles'
  , function ($scope,$filter,$cookies,$stateParams,$uibModal,DlsUtil,prdtAccountService,checkRecordTitles) {
    $scope.titles = checkRecordTitles.titles;
    $scope.memId = $stateParams.memId;
    $scope.addPrdtFlag = false;

    $scope.getDatas = function () {
      prdtAccountService.save({
          detail: "info"
      }, {
        memId:$scope.memId,
      }, function (resp) {
        $scope.datas = resp.data;
        $scope.datas.prdtTypeList = [];
      });
    };
    $scope.getDatas();
}])

