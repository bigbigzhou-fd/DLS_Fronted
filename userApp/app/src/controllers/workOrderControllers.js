/**
 * Created by oxygen on 2017/9/5.
 */
'use strict';

angular.module('myApp.workOrderControllers', [
    'myApp.services',
    'dls.services.util',
    'myApp.apiServices'
])
    .controller("workOrderListCtrl", ["$scope", "$state", "localStorageService", "workOrderService", "debounce", function($scope, $state, localStorageService, workOrderService,debounce){
        $scope.workOrderStatusData = [{
            name: '全部',
            value: '00',
        },{
            name: '未配置路由',
            value: '01',
        },{
            name: '已配置路由',
            value: '02',
        },
        //    {
        //    name: '不可配送',
        //    value: '03',
        //},
            {
            name: '已失效',
            value: '04',
        }]

        /*设置默认单页list的item条数、工单状态值、 搜索内容*/
        var perPageNum = 10;

        var  appStatus = localStorageService.get('appStatus');
        $scope.searchContent = !!appStatus ? appStatus.searchContent : '';
        $scope.workOrderStatus = !!appStatus ? appStatus.workOrderStatus : '00';
        $scope.curPage = !!appStatus ? appStatus.curPage : 1;

        $scope.role = $state.params.type;

        /*设置默认单页list的item条数、工单状态值、 搜索内容*/
        if($scope.role === "dem"){
            $scope.getData = function(){
                workOrderService.save({
                    detail: "list/",
                },{
                    searchContent: $scope.searchContent,
                    status: $scope.workOrderStatus,
                    page: $scope.curPage,
                },function(backData){
                    if(backData.status === 1){
                        $scope.listDatas = backData.data.list;

                        $scope.pageOptions = {
                            "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                            "per_page_num" : perPageNum                          //单页page的data数量
                        };
                    }
                })
            }
        }

        if($scope.role === "sup"){
            $scope.getData = function(){
                workOrderService.save({
                    detail: "list/sup",
                },{
                    searchContent: $scope.searchContent,
                    status: $scope.workOrderStatus,
                    page: $scope.curPage,
                },function(backData){
                    if(backData.status === 1){
                        $scope.listDatas = backData.data.list;

                        $scope.pageOptions = {
                            "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                            "per_page_num" : perPageNum                          //单页page的data数量
                        };
                    }
                })
            }

            $scope.detail = function(data){
                $state.go("dls.workOrder.workOrderDetail",{data:data.jobId})
            }
        }

        $scope.order = function(orderId){
            var appStatus = {
                'searchContent': $scope.searchContent,
                'workOrderStatus': $scope.workOrderStatus,
                'curPage': $scope.curPage,
            };
            localStorageService.set('appStatus', appStatus);

            if($scope.role === 'dem'){
                localStorageService.set('orderId',orderId);
                localStorageService.set('viewMode','02'); //查看模式：00 编辑暂存  01 新生成  02 详情
                $state.go("dls.trade.cart");
            }else{
                $state.go("dls.trade.orderDetail",{orderId:orderId, role:'sup'});
            }
        }

        $scope.search = function(){
            $scope.isSearch = true;
            $scope.curPage = 1;
            $scope.getData();
            $scope.isSearch = false;
        }

        $scope.$watch("curPage",function(){
            if(!$scope.isSearch){
                $scope.getData();
            }
        })

        $scope.$watch('searchContent',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getData();
            }
        }, 350));
        $scope.$watch('searchContent',function () {

                $scope.getData();
            }
          );

        $scope.$watch('workOrderStatus',function (newV, oldV) {
            if (newV !== oldV) {
                $scope.curPage = 1;
                $scope.getData();
            }
        });

        $scope.routerConfig = function(item) {
            var appStatus = {
                'searchContent': $scope.searchContent,
                'workOrderStatus': $scope.workOrderStatus,
                'curPage': $scope.curPage,
            };
            localStorageService.set('appStatus', appStatus);
            var data = item.jobId;
            $state.go("dls.workOrder.routerConfig",{data:data})
        }
    }])
    .controller("routerConfigCtrl", ["$scope", "$state", "$timeout", "workOrderService", function($scope, $state, $timeout, workOrderService){
        var jobId = $state.params.data;

        workOrderService.save({
            detail: 'route',
        }, {
            jobId : jobId,
        },function(backData){
            if(backData.status === 1){
                $scope.orderId = backData.data.orderId;
                $scope.orderState = backData.data.orderState;
                $scope.jobId = backData.data.jobId;
                $scope.jobStatus = backData.data.jobStatus;
                $scope.sessionCount = backData.data.sessionCount;

                $scope.routerType = backData.data.routeMode?backData.data.routeMode : '01';
                $scope.dynamicRouterType = backData.data.routePolicy?backData.data.routePolicy : '01';
                $scope.dispatchType = backData.data.dispMode?backData.data.dispMode : '02';
                $scope.maxDelay = backData.data.maxDelay;

                $scope.sessionLists = backData.data.list;
                $scope.prdtType = backData.data.prdtType;
                if($scope.prdtType !== '02') {
                    $scope.sessionLists.forEach(function(pItem){
                        pItem.taskInfo.forEach(function(item){
                            item.qryIdType = item.qryIdType?item.qryIdType:'01';
                            item.keyQryType = item.keyQryType?item.keyQryType:'01';
                        })
                    })
                }else{
                    $scope.sessionLists.forEach(function(pItem){
                        pItem.taskInfo.forEach(function(item){
                            if(item.prdtQryIdType){
                                var items = item.prdtQryIdType.split(',');
                                if(items.length === 2){
                                    item.IDTypeData = [{
                                        name: 'EXID',
                                        value: '01',
                                    },{
                                        name: 'XID',
                                        value: '02'
                                    }];
                                    item.qryIdType = item.qryIdType?item.qryIdType:'01';
                                }else{
                                    if(items[0] === '01'){
                                        item.IDTypeData = [{
                                            name: 'EXID',
                                            value: '01',
                                        }];
                                        item.qryIdType = '01';
                                    }else{
                                        item.IDTypeData = [{
                                            name: 'XID',
                                            value: '02'
                                        }]
                                        item.qryIdType = '02';
                                    }
                                }
                            }
                        })
                    })
                }
            }
        })

        $scope.dispatchTypeData = [{
            name: '实时配送',
            value: '01',
        },{
            name: '异步配送',
            value: '02',
        },{
            name: '异步碰撞配送',
            value: '03',
        }];

        $scope.routerTypeData = [{
            name: '静态路由',
            value: '01',
        },{
            name: '动态路由',
            value: '02',
        }];

        $scope.dynamicRouterTypeData = [{
            name: '质量优先',
            value: '01',
        },{
            name: '价低优先',
            value: '02',
        },{
            name: '随机选择',
            value: '03',
        }];

        $scope.IDTypeData = [{
            name: 'EXID',
            value: '01',
        },{
            name: 'XID',
            value: '02'
        }]

        $scope.isPeopleSetData = [{
            name: '标签数据',
            value: '00',
        },{
            name: '人群包',
            value: '01',
        }]

        $scope.taskManageData = [{
            name: '开启',
            value: "01",
        },{
            name: '关闭',
            value: "02",
        }];

        var sessionArr = [];

        $scope.checkNum = function(e){
            if($(e.target).val() > $scope.sessionCount){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                };
                modalData.content = "序号不能超过"+$scope.sessionCount;
                $scope.$emit("setModalState",modalData);
                $(e.target).val("")
            }
        }

        $scope.checkMaxDelay = function() {
            var maxDelayStr = $scope.maxDelay.toString();
            if(maxDelayStr.length >= 10){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                };
                modalData.content = '最长等待时间超过最大限制！';
                $scope.$emit("setModalState",modalData);
                $scope.maxDelay = 1;
            }
            if($scope.maxDelay < 0){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                };
                modalData.content = '最长等待时间不能为负数！';
                $scope.$emit("setModalState",modalData);
                $scope.maxDelay = 1;
            }
        }

        $scope.setTask = function(e, item){
            var value = $(e.target).val();
            if(value){
                $timeout(function(){
                    item.taskInfo.forEach(function(i){
                        i.status = value;
                    })
                }, 100)
            }
        }

        $scope.save = function(){
            var routeOrderIsEmpty = false;
            if($scope.dispatchType != '01' && $scope.maxDelay){
                $scope.sessionLists.forEach(function(item){
                    if(!item.routeOrder){
                        routeOrderIsEmpty = true;
                    }
                })
                if(!routeOrderIsEmpty){
                    var data = {
                        jobId: $scope.jobId,
                        jobStatus: $scope.jobStatus,
                        orderId: $scope.orderId,
                        orderStatus: $scope.orderState,
                        routeMode: $scope.routerType,
                        routePolicy: $scope.dynamicRouterType,
                        dispMode: $scope.dispatchType,
                        maxDelay: $scope.maxDelay,
                        sessionInfo: angular.toJson($scope.sessionLists),
                    }

                    workOrderService.save({
                        detail:'route/save'
                    }, data, function(backData){
                        var modalData = {
                            templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                        };
                        modalData.content = backData.msg;
                        $scope.$emit("setModalState",modalData);
                        if(backData.status == 1){
                            history.go(-1);
                        }
                    })
                }else{
                    var modalData = {
                        templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                    };
                    modalData.content = '序号不能为空！';
                    $scope.$emit("setModalState",modalData);
                }
            }else if($scope.dispatchType == '01'){
                $scope.sessionLists.forEach(function(item){
                    if(!item.routeOrder){
                        routeOrderIsEmpty = true;
                    }
                })
                if(!routeOrderIsEmpty){
                    var data = {
                        jobId: $scope.jobId,
                        jobStatus: $scope.jobStatus,
                        orderId: $scope.orderId,
                        orderStatus: $scope.orderState,
                        routeMode: $scope.routerType,
                        routePolicy: $scope.dynamicRouterType,
                        dispMode: $scope.dispatchType,
                        maxDelay: $scope.maxDelay,
                        sessionInfo: angular.toJson($scope.sessionLists),
                    }

                    workOrderService.save({
                        detail:'route/save'
                    }, data, function(backData){
                        var modalData = {
                            templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                        };
                        modalData.content = backData.msg;
                        $scope.$emit("setModalState",modalData);
                        if(backData.status == 1){
                            history.go(-1);
                        }
                    })
                }else{
                    var modalData = {
                        templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                    };
                    modalData.content = '序号不能为空！';
                    $scope.$emit("setModalState",modalData);
                }
            }
        }

        $scope.cancel = function(){
            history.go(-1);
        }
    }])
    .controller("workOrderDetailCtrl", ["$scope", "$state", "workOrderService", function($scope, $state, workOrderService) {
        var jobId = $state.params.data;

        workOrderService.save({
            detail: 'route/sup',
        }, {
            jobId : jobId,
        },function(backData){
            console.log(backData);
            if(backData.status === 1){
                $scope.orderId = backData.data.orderId;
                $scope.orderState = backData.data.orderState;
                $scope.jobId = backData.data.jobId;
                $scope.jobStatus = backData.data.jobStatus;
                $scope.sessionCount = backData.data.sessionCount;
                $scope.prdtType = backData.data.prdtType;

                $scope.routerType = backData.data.routeMode;
                $scope.dynamicRouterType = backData.data.routePolicy;
                $scope.dispatchType = backData.data.dispMode;
                $scope.maxDelay = backData.data.maxDelay;
                $scope.prepareTime = backData.data.prepareTime;

                $scope.listDatas = backData.data.list;
            }
        })
    }])

