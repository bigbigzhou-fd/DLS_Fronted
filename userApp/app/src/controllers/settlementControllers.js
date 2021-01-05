'use strict';
angular.module('myApp.settlementControllers', [
        'myApp.services',
        'dls.filters',
])
    .controller("settlementSummaryCtrl",['$scope','$cookies','$filter','settlement_summary_titles','settlementService','Excel','$timeout'
    	,function($scope,$cookies,$filter,settlement_summary_titles,settlementService,Excel,$timeout){
        $scope.titles = settlement_summary_titles.titles;
        $scope.prdtType = '01';
        var csrfToken = $cookies.get('csrftoken');
        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };
        $scope.startTime = new Date();
        $scope.endTime = new Date();
        $scope.pageOptions = {
            "per_page_num" : 10,     //分页每页显示内容的数量
        };
        $scope.curPageNum = 1;
        $scope.totalItems = 0;

        $scope.getDatas = function (curPageNum,prdtType,startTime,endTime) {
        	prdtType = prdtType || $scope.prdtType;
        	startTime = startTime || $scope.startTime;
            endTime = endTime || $scope.endTime;
        	curPageNum = curPageNum || $scope.curPageNum;

        	if (new Date(endTime).getTime()-new Date(startTime).getTime() < 0) {
        	    modalData.content = "终止日期应在开始日期之后";
        	    $scope.$emit("setModalState",modalData);
        	    return ;
        	}

        	startTime = $filter('dlsDateFilter')(new Date(startTime));
        	endTime = $filter('dlsDateFilter')(new Date(endTime));
        	settlementService.save({detail:"sett/list/user",page:curPageNum,startTime:startTime,endTime:endTime,prdtType:prdtType,csrfmiddlewaretoken:csrfToken}
        		,function(resp){
        	        console.log(resp);
        	        if (1 === resp.status) {
        	        	$scope.settlementDatas = resp.data;
                        $scope.totalItems = $scope.settlementDatas.page.total_rows;
                        $scope.pageOptions = {
                            "total_items_num" : $scope.totalItems,   //总共的data数量
                            "total_pages_num" : $scope.settlementDatas.page.total_pages,  //总共的page数量
                            "per_page_num" : 10                   //单页page的data数量
                        };

        	        }
        	});
        };
        // $scope.getDatas();
        $scope.$watch("curPageNum",function(){
            $scope.getDatas($scope.curPageNum);
        });
    }])

    .controller("settlementDetailCtrl",['$scope','$cookies','$filter','permissions','settlementDetailTitles','settlementService','$stateParams'
    	,function($scope,$cookies,$filter,permissions,settlementDetailTitles,settlementService,$stateParams){
        $scope.titles = settlementDetailTitles.titles;
        $scope.permissions = permissions;
        var csrfToken = $cookies.get('csrftoken');
        $scope.settNo = $stateParams.settNo;
        settlementService.save({detail:"sett/dataTable/user",settNo:$scope.settNo,csrfmiddlewaretoken:csrfToken}
        	,function(resp){
                console.log(resp);
                if (1 === resp.status) {
                	$scope.datas = resp.data;

                }
        });
    }])
