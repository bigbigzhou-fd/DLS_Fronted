'use strict';
angular.module('myApp.settlementControllers', [
        'myApp.services',
        'dls.filters',
])
    .controller("settlementSummaryCtrl",['$scope','$cookies','$filter','settlement_summary_titles','settlementService','Excel','$timeout'
    	,function($scope,$cookies,$filter,settlement_summary_titles,settlementService,Excel,$timeout){
        $scope.titles = settlement_summary_titles.titles;
        $scope.prdtType = '01';
        $scope.memId = '';
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
        	var memId = $scope.memId;

        	if (new Date(endTime).getTime()-new Date(startTime).getTime() < 0) {
                modalData.content = "终止日期应在开始日期之后";
                $scope.$emit("setModalState",modalData);
                return ;
            }
         //    if (!!memId) {
        	//     modalData.content = "请输入会员编号";
        	//     $scope.$emit("setModalState",modalData);
        	//     return ;
        	// }


        	startTime = $filter('dlsDateFilter')(new Date(startTime));
        	endTime = $filter('dlsDateFilter')(new Date(endTime));
        	settlementService.save({detail:"sett/admin/list",page:curPageNum,memId:memId,startTime:startTime,endTime:endTime,prdtType:prdtType,csrfmiddlewaretoken:csrfToken}
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
        $scope.$watch("curPageNum",function(){
            $scope.getDatas($scope.curPageNum);
        });
    }])

    .controller("settlementDetailCtrl",['$scope','$cookies','$filter','settlementDetailTitles','settlementService','$stateParams'
    	,function($scope,$cookies,$filter,settlementDetailTitles,settlementService,$stateParams){
        
        var csrfToken = $cookies.get('csrftoken');
        $scope.settNo = $stateParams.settNo;
        $scope.memRole = $stateParams.memRole;
        console.log($scope.memRole);
        var subUrl = '';
        if ('05' === $scope.memRole) {
            subUrl = 'sett/dataTable/buyOutSup';
            $scope.titles = ['序号','交易品编号','交易品名称','互联对象编号','互联对象名称','计费数量（次）','标准单价（元）','业务结算金额（元）'];
        } else if ('02' === $scope.memRole) {
            subUrl = 'sett/dataTable/admin';
            $scope.titles = settlementDetailTitles.titles;
        } else {
            subUrl = 'sett/dataTable/admin';
            $scope.titles = ['序号','订单编号','订单名称','互联方机构名称','互联方部门名称','交易品编号','交易品名称','互联对象编号','互联对象名称','计费数量（次）','应付金额（元）'];
        }
        settlementService.save({detail:subUrl,settNo:$scope.settNo,csrfmiddlewaretoken:csrfToken}
        	,function(resp){
                console.log(resp);
                if (1 === resp.status) {
                	$scope.datas = resp.data;

                }
        });
    }])

    .controller("settlementManageCtrl", ['$scope','$filter','$stateParams','$cookies','settlementManageTitles','settlementService', 'localStorageService', 'debounce',
        function ($scope,$filter,$stateParams,$cookies,settlementManageTitles,settlementService,localStorageService,debounce) {
        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };
        $scope.titles = settlementManageTitles.titles;
        $scope.settlementManageDatas = {
            list: []
        };
        $scope.startTime = !!$stateParams.startTime ? new Date($stateParams.startTime) : new Date();
        $scope.endTime = !!$stateParams.endTime ? new Date($stateParams.endTime) : new Date();

        $scope.$watch("startTime",function(){
            $scope.startTime_format = $filter('dlsDateFilter')($scope.startTime);
            $scope.getDatas();
        });
        $scope.$watch("endTime",function(){
            $scope.endTime_format = $filter('dlsDateFilter')($scope.endTime);
            $scope.getDatas();
        });


        $scope.pageOptions = {
            "total_items_num": 0,
            "total_pages_num": 1,
            "per_page_num" : 10
        };
        $scope.totalItems = 0;

        var  appStatus = localStorageService.get('appStatus');
        $scope.keywords = !!appStatus ? appStatus.keywords : '';
        $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;
        $scope.startTime = !!appStatus ? new Date(appStatus.startTime) : $scope.startTime;
        $scope.endTime = !!appStatus ? new Date(appStatus.endTime) : $scope.endTime;

        $scope.getDatas = function (page) {
            if (new Date($scope.endTime).getTime()-new Date($scope.startTime).getTime() < 0) {
                modalData.content = "终止日期应在开始日期之后";
                $scope.$emit("setModalState",modalData);
                return ;
            }

            settlementService.save({
                detail: "sett/dataTable/manage",
                startTime: $scope.startTime_format,
                endTime: $scope.endTime_format,
                keyword: $scope.keywords,
                page: $scope.curPageNum,
                csrfToken: $cookies.get('csrftoken')
            }, function (resp) {
                // console.log(resp);
                if (!resp.data.list) {
                    $scope.settlementManageDatas = {};
                    $scope.totalItems = 0;
                    $scope.pageOptions = {
                        "total_items_num": 0,
                        "total_pages_num": 1,
                        "per_page_num" : 10
                    };
                    return;
                }
                $scope.settlementManageDatas = resp.data;
                $scope.totalItems = resp.data.page.total_rows;
                $scope.pageOptions = {
                    "total_items_num" : $scope.totalItems,   //总共的data数量
                    "total_pages_num" : resp.data.page.total_pages,  //总共的page数量
                    "per_page_num" : 10                   //单页page的data数量
                };
            });
        };
        $scope.$watch("curPageNum",function(){
            $scope.getDatas();
        });

        $scope.$watch('keywords',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        }, 350));

        $scope.setData = function (item) {
            var appStatus = {
                'keywords': $scope.keywords,
                'curPageNum': $scope.curPageNum,
                'startTime': $scope.startTime,
                'endTime': $scope.endTime
            };
            localStorageService.set('appStatus', appStatus);
        };

    }])
    .controller("settlementInfoCtrl", ['$scope','$filter','$stateParams','$state','settlementService','settlementInfoTitles', function ($scope,$filter,$stateParams,$state,settlementService,settlementInfoTitles) {
        $scope.memId = $stateParams.memId;
        $scope.startTime = $stateParams.startTime;
        $scope.endTime = $stateParams.endTime;
        $scope.startTime_format = $filter('dlsDateFilter')($scope.startTime);
        $scope.endTime_format = $filter('dlsDateFilter')($scope.endTime);
        $scope.pageOptions = {
            "total_items_num": 0,
            "total_pages_num": 0,
            "per_page_num" : 10
        };
        $scope.curPageNum = 1;
        $scope.totalItems = 0;
        $scope.titles = settlementInfoTitles.titles;

        $scope.getDatas = function (page) {
            var startTime = $filter('dlsDateFilter')(new Date($scope.startTime));
            var endTime = $filter('dlsDateFilter')(new Date($scope.endTime));

            settlementService.save({
                detail: "sett/admin/list",
                startTime: startTime,
                endTime: endTime,
                memId: $scope.memId,
                page: page
            }, function (resp) {
                // console.log(resp);
                if (!resp.data) {
                    $scope.settlementInfoDatas = {};
                    return;
                }
                $scope.settlementInfoDatas = resp.data[1];
                $scope.totalItems = resp.data[1].page.total_rows;
                $scope.pageOptions = {
                    "total_items_num" : $scope.totalItems,   //总共的data数量
                    "total_pages_num" : resp.data[1].page.total_pages,  //总共的page数量
                    "per_page_num" : 10                   //单页page的data数量
                };
            });
        };
        $scope.$watch("curPageNum",function(){
            $scope.getDatas($scope.curPageNum);
        });

        $scope.settNoList = [];
        $scope.isSelected = function (index) {
            if ($scope.settlementInfoDatas.list[index].checked) {
                // $scope.settlementInfoDatas.list[index].checked = true;
                $scope.settNoList.push($scope.settlementInfoDatas.list[index].settNo);
            } else {
                // $scope.settlementInfoDatas.list[index].checked = false;
                $scope.settNoList.removeByValue($scope.settlementInfoDatas.list[index].settNo);
            }
            console.log($scope.settNoList);
        };

        $scope.selectAll = function () {
            if (!!$scope.checkedAll) {
                $scope.settNoList = [];
                for (var i = $scope.settlementInfoDatas.list.length - 1; i >= 0; i--) {
                    $scope.settlementInfoDatas.list[i].checked = true;
                    $scope.settNoList.push($scope.settlementInfoDatas.list[i].settNo);
                }
            } else {
                for (var i = $scope.settlementInfoDatas.list.length - 1; i >= 0; i--) {
                    $scope.settlementInfoDatas.list[i].checked = false;
                    $scope.settNoList = [];
                }
            }
        };
    }])
    .controller("settlementCurrencyCtrl", ['$scope','$filter','$stateParams','$state','settlementCurrencyTitles','settlementService','settlementInfoTitles', function ($scope,$filter,$stateParams,$state,settlementCurrencyTitles,settlementService,settlementInfoTitles) {
        var settNo = $stateParams.settNo;
        var taskId = $stateParams.taskId;
        $scope.titles = settlementCurrencyTitles.titles;
        $scope.pageOptions = {
            "total_items_num": 0,
            "total_pages_num": 0,
            "per_page_num" : 10
        };
        $scope.curPageNum = 1;
        $scope.totalItems = 0;

        $scope.getDatas = function (page) {

            settlementService.save({
                detail: "sett/dataTable/flowsheet",
                settNo: settNo,
                taskId: taskId,
                page: page
            }, function (resp) {
                if (1 !== resp.status) {return;}
                $scope.datas = resp.data[1];
                console.log(resp.data);
                $scope.totalItems = resp.data[1].page.total_rows;
                $scope.pageOptions = {
                    "total_items_num" : $scope.totalItems,   //总共的data数量
                    "total_pages_num" : resp.data[1].page.total_pages,  //总共的page数量
                    "per_page_num" : 10                   //单页page的data数量
                };
            });
        };

        $scope.$watch("curPageNum",function(){
            $scope.getDatas($scope.curPageNum);
        });

    }])

