'use strict';
angular.module('myApp.signControllers', [
        'myApp.services',
        'dls.filters',
        'dls.services.util'
])
.controller("signUtilCtrl",['$scope','$filter','$cookies','DlsUtil','localStorageService'
  , function ($scope,$filter,$cookies,DlsUtil,localStorageService) {

    $scope.modalData = {
        templateUrl : './src/templates/modalViews/addToCartTipModal.html',
        content : ''
    };
    $scope.showMsg = function (msg) {
      $scope.modalData.content = msg;
      $scope.$emit("setModalState",$scope.modalData);
    };
    $scope.signStates = [{
        'value' : '00',
        'name' : '全部'
      },{
        'value' : '01',
        'name' : '未签约'
      },{
        'value' : '02',
        'name' : '签约中'
    },{
        'value' : '03',
        'name' : '已签约'
    },{
        'value' : '04',
        'name' : '签约失败'
    }];
    $scope.orgTypes = [{
    	'value' : '01',
    	'name' : '企业'
    },{
    	'value' : '02',
    	'name' : '个人'
    }];
    $scope.orgTypeCds = [{
    	'value' : '01',
    	'name' : '法人组织机构'
    },{
    	'value' : '02',
    	'name' : '非法人组织机构'
    }];
    $scope.moneyKinds = [{
    	'value' : '01',
    	'name' : '人民币'
    },{
    	'value' : '02',
    	'name' : '美元'
    }];



}])
.controller("signManageCtrl",['$scope','$filter','$cookies','DlsUtil','signManageService','signManageTitles', 'debounce','localStorageService'
  , function ($scope,$filter,$cookies,DlsUtil,signManageService,signManageTitles, debounce,localStorageService) {
    $scope.titles = signManageTitles.titles;
    console.log($scope.titles)
    $scope.datas = {
        list: []
    };
    $scope.pageOptions = {
      "total_items_num" : 0,
      "total_pages_num" : 1,
      "per_page_num" : 10
    };
    // $scope.curPageNum = 1;
    $scope.totalItems = 0;

    var  appStatus = localStorageService.get('appStatus');console.log(appStatus)
    $scope.keyword = !!appStatus ? appStatus.keyword : '';
    $scope.status = !!appStatus ? appStatus.status : '00';
    $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;
 
    $scope.getDatas = function () {
      signManageService.save({
          detail: "list"
      }, {
      	page: $scope.curPageNum,
        keyword:$scope.keyword,
        status:$scope.status
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
        return $scope.curPageNum + '/' + $scope.status
    }, function(){
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
        'status': $scope.status,
        'curPageNum': $scope.curPageNum
      };
      localStorageService.set('appStatus', appStatus);
    }

}])

.controller("signInfoCtrl",['$scope','$filter','$cookies','$stateParams','DlsUtil','signManageService'
  , function ($scope,$filter,$cookies,$stateParams,DlsUtil,signManageService) {
    $scope.memId = $stateParams.memId;
    $scope.accountId = $stateParams.accountId;
    $scope.pageType = 'info';
    $scope.editable = false;
    $scope.getDatas = function () {
      signManageService.save({
          detail: "info"
      }, {
        memId:$scope.memId,
        // accountId:$scope.accountId,
      }, function (resp) {
        $scope.datas = resp.data;
        $scope.noticeMode = resp.data.noticeMode;
        // $scope.noticeMode = ['0','3'];
      });
    };
    $scope.getDatas();

    $scope.saveDatas = function () {
      for (var i = 0; i < $scope.noticeMode.length; i++) {
        $scope.noticeMode[i] = !!$scope.noticeMode[i] ? $scope.noticeMode[i] : '0';
      }
      $scope.datas.noticeMode = $scope.noticeMode.toString();
      $scope.datas.memId = $scope.memId;
      $scope.datas.accountId = $scope.accountId;
    	// console.log($scope.datas);
    	signManageService.save({
          detail: ""
      }, $scope.datas, function (resp) {
        $scope.showMsg(resp.msg);
      });
    }


}])
.controller("signQueryCtrl",['$scope','$filter','$cookies','$stateParams','DlsUtil','signManageService'
  , function ($scope,$filter,$cookies,$stateParams,DlsUtil,signManageService) {
    $scope.memId = $stateParams.memId;
    $scope.accountId = $stateParams.accountId;
    $scope.marketSerial = $stateParams.num;
    $scope.pageType = 'query';
    $scope.editable = false;
    $scope.noticeMode = [true,true,false];
    $scope.getDatas = function () {
      signManageService.save({
          detail: "query"
      }, {
        marketSerial:$scope.marketSerial,
        // memId:'0000097',
      }, function (resp) {
        $scope.datas = resp.data;
        $scope.noticeMode = resp.data.noticeMode;
      });
    };
    $scope.getDatas();

    $scope.saveDatas = function () {
      console.log($scope.noticeMode);
    	$scope.datas.noticeMode = $scope.noticeMode.toString();
      $scope.datas.memId = $scope.memId;
    	// console.log($scope.datas);
    	signManageService.save({
          detail: ""
      }, $scope.datas, function (resp) {
        $scope.showMsg(resp.msg);
      });
    };

    $scope.refresh = function () {
      $scope.datas.signStatus = '';
    	signManageService.save({
    	    detail: "status"
    	}, {
    	  accountId:$scope.accountId,
    	  // memId:'0000097',
    	}, function (resp) {
    	  $scope.datas.signStatus = resp.data.status;
    	});
    }



}])
