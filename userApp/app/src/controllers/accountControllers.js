'use strict';
angular.module('myApp.accountControllers', [
        'myApp.services',
        'dls.filters'
])
    .controller("accountOrderDetailCtrl",['$scope','$cookies','$filter','$stateParams','account_order_titles','accountService'
        ,function($scope,$cookies,$filter,$stateParams,account_order_titles,accountService){
        $scope.account_order_titles = account_order_titles.titles;
        $scope.startDt = new Date();
        $scope.endDt = new Date();
            //$stateParams.odId;
        $scope.getDatas = function (start,end,odId) {
            odId = odId || $stateParams.odId;
            start = start || $scope.startDt;
            end = end || $scope.endDt;
            var per_page_items = 10;
            var csrfToken = $cookies.get('csrftoken');
            accountService.save({detail:"order/detail/list/dataTable",orderId:odId,start:$filter('dlsDateFilter')(start),end:$filter('dlsDateFilter')(end),csrfmiddlewaretoken:csrfToken},function(resp){
                // console.log(resp);
                if (!!resp.data.list.length) {
                    $scope.orderListDatas = resp.data;
                    $scope.orderLists = $scope.orderListDatas.list;
                    // console.log($scope.orderLists);
                    for(var i = 0,len = $scope.orderLists.length; i < len; i++) {
                        if ($scope.orderLists[i].roleName == '供应方') {
                            $scope.orderLists[i].incomeTotal = $scope.orderLists[i].total;
                            $scope.orderLists[i].incomeCurr = $scope.orderLists[i].curr;
                            $scope.orderLists[i].payTotal = '--';
                            $scope.orderLists[i].payCurr = '--';
                        } else {
                            $scope.orderLists[i].incomeTotal = '--';
                            $scope.orderLists[i].incomeCurr = '--';
                            $scope.orderLists[i].payTotal = $scope.orderLists[i].total;
                            $scope.orderLists[i].payCurr = $scope.orderLists[i].curr;
                        }
                    }
                    $scope.totalItems = $scope.orderListDatas.page.total_rows;
                    // $scope.total = $scope.orderListDatas.total;
                    // console.log($scope.total);
                    $scope.pageOptions = {
                        "total_items_num" : $scope.totalItems,   //总共的data数量
                        "total_pages_num" : Math.ceil($scope.totalItems/per_page_items),  //总共的page数量
                        "per_page_num" : per_page_items                   //单页page的data数量
                    };
                }
            });
        }
        $scope.getDatas();

    }])
    .controller("accountQuotaCtrl",['$scope','$cookies','userService','account_quota_titles',function($scope,$cookies,userService,account_quota_titles){
    	$scope.quotaTitles = account_quota_titles.titles;
        $scope.quotaUserDatas = {};
        $scope.quotaDatas = [];
        // $scope.curPage = 1;
        $scope.totalItems = 0;
        $scope.curPageNum = 1;
        $scope.pageOptions = {};

        var perPageNum = 10;    //分页每页显示内容的数量
        var csrfToken = $cookies.get('csrftoken');

        userService.save({detail:"limit/list/detail/user",csrfmiddlewaretoken:csrfToken},function(resp){
            if (0 === resp.status) {
                console.log("请求失败");
                return;
            } else if("0" === resp.data.status && "no login" === resp.data.retMsg) {
                $rootScope.isUserAuth = false;
            } else if (!!resp.data.memLmtBalance) {
                $scope.quotaUserDatas = resp.data.memLmtBalance;
                // console.log($scope.quotaUserDatas);
            }
        });

        $scope.getQuotaDatas = function (page) {
            page = page || $scope.curPage;
            userService.save({detail:"limit/list/detail/dataTable/user",page:page,csrfmiddlewaretoken:csrfToken},function(resp){
                // console.log(resp);
                if (0 === resp.status) {
                    console.log("请求失败");
                    return;
                } else if("0" === resp.data.status && "no login" === resp.data.retMsg) {
                    $rootScope.isUserAuth = false;
                } else if (!!resp.data.list.length) {
                    console.log(resp);
                    $scope.quotaDatas = resp.data.list;
                    $scope.totalItems = resp.data.page.total_rows;
                    $scope.pageOptions = {
                        "total_items_num" : resp.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : resp.data.page.total_pages,  //总共的page数量
                        "per_page_num" : resp.data.page.rows             //单页page的data数量
                    };
                }
            });
        }
        // $scope.getQuotaDatas();


        $scope.$watch("curPageNum",function(){
            // $scope.lists = $scope.quotaDatas.slice($scope.pageOptions.per_page_num*($scope.curPageNum-1),$scope.pageOptions.per_page_num*$scope.curPageNum);
            $scope.getQuotaDatas($scope.curPageNum);
        });


    }])
    .controller("accountClearingCtrl",function($rootScope,$scope,$cookies,accountService,account_quota_titles,DLS_years,DLS_months){
    	$scope.quotaTitles = account_quota_titles.titles;
        $scope.quotaDatas = {};
        $scope.memId = $rootScope.currentUser.username;
        $scope.years = DLS_years;
        $scope.months = DLS_months;
        var date = new Date();
        $scope.clearYear = date.getFullYear().toString();
        $scope.clearMonth= $scope.months.num[date.getMonth()];
        $scope.getDatas = function (year,month) {
            year = year || $scope.clearYear;
            month = month || $scope.clearMonth;
            var csrfToken = $cookies.get('csrftoken');
            accountService.save({detail:"report/institute/setl/check",clear_year:year,clear_month:month,csrfmiddlewaretoken:csrfToken},function(resp){
                // console.log(resp);
                if ("1" === resp.status && "清算信息下载中" === resp.msg) {

                    console.log("清算信息下载中");
                } else {
                    console.log("清算信息下载失败");
                }

            });
        };
        $scope.getDatas();
    })
    .controller("myAccountCtrl", ['$scope', '$rootScope', 'userService', function($scope, $rootScope, userService) {
        $scope.accountDatas = {
            orgFullNameCN: $rootScope.currentUser.company,
            deptName: $rootScope.currentUser.apartment,
        };

        var accountData = {};

        $scope.getData = function() {
            userService.save({
                detail: "user/account/list/",
            }, {
                prdtType: $scope.prdtType,
            }, function(backData) {
                $scope.prdtArr = [];
                $scope.accountDatas = Object.assign($scope.accountDatas, backData.data);
                $scope.prdtArr = $scope.accountDatas.list;
                if($scope.prdtArr) {
                    $scope.prdtArr.forEach(function(item, index){
                        if(index === 0){
                            $scope.prdtType = item.prdtType;
                            $scope.accountData = item;
                        }
                        accountData[item.prdtType] = item;
                    })
                    $scope.accountData = accountData[$scope.prdtType];
                }
            })
        }

        $scope.getData();

        $scope.selectPrdt = function(prdtType){
            $scope.prdtType = prdtType;
            $scope.accountData = accountData[prdtType];
        }
    }])
    .controller("accountFreezeCtrl", ['$scope', 'userService', function($scope, userService) {
        $scope.tradeType = [{
            label: '全部',
            value: '',
        },{
            label: '充值',
            value: '08',
        }, {
            label: '提现',
            value: '02',
        }];

        $scope.freType = [{
            label: '全部',
            value: '',
        },{
            label: '冻结',
            value: '02',
        }, {
            label: '解冻',
            value: '01',
        }];

        $scope.originDatas = [];
        $scope.startDt = new Date();
        $scope.endDt = new Date();

        $scope.pageOptions = {
            per_page_num: 10,
        }
        $scope.curPage = 1;

        $scope.$watch("startDt",function(){
            $scope.sd = $scope.startDt.toJSON().substring(0, 10);
        })

        $scope.$watch("endDt",function(){
            $scope.ed = $scope.endDt.toJSON().substring(0, 10);
        })

        $scope.getData = function() {
            $scope.sd = $scope.startDt.toJSON().substring(0, 10);
            $scope.ed = $scope.endDt.toJSON().substring(0, 10);
            userService.save({
                detail: "user/freeze/list/",
            }, {
                startTime: $scope.sd,
                endTime: $scope.ed,
                busType: $scope.selectType,
                freType: $scope.freezeType,
                page: $scope.curPage,
                rows: $scope.pageOptions.per_page_num,
            }, function(backData) {
                $scope.originDatas = backData.data.list;
                $scope.pageOptions = {
                    "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                    "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                    "per_page_num" : backData.data.page.rows             //单页page的data数量
                };
            })
        }

        $scope.search = function() {
            $scope.curPage = 1;
            $scope.getData();
        }

        $scope.$watch(function(){
            return $scope.selectType + '/' + $scope.freezeType
        }, function(newV, oldV){
            if(newV !== oldV) {
                $scope.search();
            }
        })

        $scope.$watch(function(){
            return $scope.curPage
        }, function(newV, oldV){
            if(newV !== oldV) {
                $scope.getData();
            }
        })

        $scope.getData();
    }])
    .controller("accountManageViewCtrl", ['$scope', function($scope) {

    }])
    .controller("accountTradeDetailCtrl", ['$scope', 'userService', '$sce', function($scope, userService, $sce) {
        $scope.tradeType = [{
            label: '全部',
            value: '',
        },{
            label: '营销产品',
            value: '03',
        }, {
            label: '征信产品',
            value: '02',
        }];

        $scope.setPopover = function(data){
            if(!data.remarks) {data.remarks = '--'}
            if(!data.remarks2) {data.remarks2 = '--'}
            if(!data.accountType) {data.accountType = '--'}
            if(!!data.settList) {
                var tmpStr = data.settList[0] + '<br/>';
                for (var i = 1; i < data.settList.length; i++) {
                    tmpStr += data.settList[i] + '<br/>';
                }
            }else {
                tmpStr = ""
            }
            var remark = '<div>申请备注： '+ data.remarks +'<br/> 审核备注： '+ data.remarks2 +'<br/> 调账类型： '+ data.accountType + '<br/> 结算单号： '+ tmpStr + '</div>'
            $scope.popoverDetail = $sce.trustAsHtml(remark)
        }

        $scope.startDt = new Date();
        $scope.endDt = new Date();

        $scope.originDatas = [];
        $scope.pageOptions = {
            per_page_num: 10,
        }

        $scope.curPage = 1;

        $scope.$watch("startDt",function(){
            $scope.sd = $scope.startDt.toJSON().substring(0, 10);
        })

        $scope.$watch("endDt",function(){
            $scope.ed = $scope.endDt.toJSON().substring(0, 10);
        })

        $scope.getData = function() {
            $scope.sd = $scope.startDt.toJSON().substring(0, 10);
            $scope.ed = $scope.endDt.toJSON().substring(0, 10);
            userService.save({
                detail: "user/transaction/list/",
            }, {
                startTime: $scope.sd,
                endTime: $scope.ed,
                busType: $scope.busType,
                prdtType: $scope.selectType,
                page: $scope.curPage,
                rows: $scope.pageOptions.per_page_num,
            }, function(backData) {
                $scope.originDatas = backData.data.list;
                $scope.pageOptions = {
                    "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                    "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                    "per_page_num" : backData.data.page.rows             //单页page的data数量
                };
            })
        }

        $scope.search = function() {
            $scope.curPage = 1;
            $scope.getData();
        }

        $scope.$watch(function(){
            return $scope.busType +"/"+ $scope.selectType
        }, function(newV, oldV){
            if(newV !== oldV) {
                $scope.search();
            }
        })

        $scope.$watch(function(){
            return $scope.curPage
        }, function(newV, oldV){
            if(newV !== oldV) {
                $scope.getData();
            }
        })

        $scope.getData();
    }])

