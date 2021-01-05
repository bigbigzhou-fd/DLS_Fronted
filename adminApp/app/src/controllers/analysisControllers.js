/**
 * Created by oxygen on 2017/7/3.
 */
'use strict';
angular.module('myApp.analysisControllers', [
    'myApp.services',
    'dls.filters',
    'dls.services.util'
])
    .controller("businessLogCtrl",["$scope","analysisService","$filter","dls_list_service","$state","localStorageService",function($scope,analysisService,$filter,dls_list_service,$state,localStorageService){
        $scope.prdtType = "03";
        $scope.pageOptions = {};
        $scope.curPageNum = 1;
        var per_page_num = 10;
        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };

        $scope.startDt = new Date();
        $scope.startDt.setDate($scope.startDt.getDate() - 1);
        $scope.endDt = new Date();
        $scope.start = $filter('dlsDateFilter')($scope.startDt);
        $scope.end = $filter('dlsDateFilter')($scope.endDt);

        if(!localStorageService.get('anal_start_time') && !localStorageService.get('anal_end_time')){
            localStorageService.set('anal_start_time',$scope.start);
            localStorageService.set('anal_end_time',$scope.end);
        }else{
            $scope.start = localStorageService.get('anal_start_time');
            $scope.end = localStorageService.get('anal_end_time');
            $scope.startDt = new Date($scope.start);
            $scope.endDt = new Date($scope.end);
        }

        $scope.$watch(function(){
            return $scope.startDt +"/"+ $scope.endDt;
        },function(newV){
            $scope.start = $filter('dlsDateFilter')($scope.startDt);
            $scope.end = $filter('dlsDateFilter')($scope.endDt);
            if($scope.end == "NaN-NaN-NaN" || $scope.start == "NaN-NaN-NaN"){
                $scope.end = "";
                $scope.start = "";
            }
            $scope.curPageNum = 1;
        },true);

        $("input[name='businessType']").on("change",function(){
            $scope.prdtType = $("input[name='businessType']:checked").val();
            $scope.curPageNum = 1;
            $scope.getData();
        });

        $scope.businessLogGrid = dls_list_service.businessLogGrid;

        $scope.getData = function(){
            if (new Date($scope.end).getTime()-new Date($scope.start).getTime() < 0) {
                modalData.content = "终止日期应在开始日期之后";
                $scope.$emit("setModalState",modalData);
                $scope.supNum = 0;
                $scope.demNum = 0;
                $scope.prdtNum = 0;
                $scope.trdTotNum = 0;
                $scope.prdtBuyNum = 0;
                $scope.prdtSoldNum = 0;
                $scope.prdtBuyNumTot = 0;
                $scope.prdtSoldNumTot = 0;
                $scope.originDatas = {};
                return ;
            }else{
                localStorageService.set('anal_start_time',$scope.start);
                localStorageService.set('anal_end_time',$scope.end);
                analysisService.save({
                    detail:"statistics/list/"
                },{
                    startTime : $scope.start,
                    endTime : $scope.end,
                    prdtType : $scope.prdtType,
                    page : $scope.curPageNum,
                    rows : per_page_num,
                },function(backData){
                    $scope.orgFullNameCN = backData.data.orgFullNameCN;
                    $scope.originDatas = backData.data.list;
                    $scope.deptName = backData.data.deptName;
                    $scope.supNum = backData.data.supNum;
                    $scope.demNum = backData.data.demNum;
                    $scope.prdtNum = backData.data.prdtNum;
                    $scope.trdTotNum = backData.data.trdTotNum;
                    $scope.prdtBuyNum = backData.data.prdtBuyNum;
                    $scope.prdtSoldNum = backData.data.prdtSoldNum;
                    $scope.prdtBuyNumTot = backData.data.prdtBuyNumTot;
                    $scope.prdtSoldNumTot = backData.data.prdtSoldNumTot;
                    $scope.updateTime = backData.data.updateTime;

                    $scope.pageOptions = {
                        "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                        "per_page_num" : per_page_num,
                    };
                })
            }
        }

        $scope.$watch('curPageNum',function(){
            $scope.getData();
        });

        $scope.detail = function(type,No){
            $state.go("dls.analysis.connDetail",{type:type,prdtType:$scope.prdtType,No:No,start:$scope.start,end:$scope.end});
        }
    }])
    .controller("connDetailCtrl",["$scope","$state","analysisService","dls_list_service",function($scope,$state,analysisService,dls_list_service){
        $scope.pageOptions = {};
        $scope.curPageNum = 1;

        var per_page_num = 10;

        if($state.params.type == "sup"){
            $scope.title = "互联供方详情";
            $scope.subTitle = "供方";
            $scope.supType = '1';
            if($state.params.prdtType == "03"){
                $scope.isSupCap = true;
                $scope.$watch("supType",function(){
                    if($scope.supType === '1'){
                        $scope.isSharedSup = true;
                        $scope.isBuyoutSup = false;
                        $scope.getData = function(){
                            analysisService.save({
                                detail : "statistics/sup/"
                            },{
                                prdtType : $state.params.prdtType,
                                prdtIdCd : $state.params.No,
                                startTime : $state.params.start,
                                endTime : $state.params.end,
                                page : $scope.curPageNum,
                                rows : per_page_num,
                            },function(backData){
                                $scope.num = backData.data.supNum;
                                $scope.sharedSupNum = backData.data.sharedSupNum;
                                $scope.buyOutSupNum = backData.data.buyOutSupNum;
                                $scope.prdtName = backData.data.prdtName;
                                $scope.originDatas = backData.data.list;
                                $scope.connDetailGrid = dls_list_service.capSupConnDetailGrid;

                                $scope.pageOptions = {
                                    "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                                    "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                                    "per_page_num" : per_page_num,
                                };
                            })
                        }
                    }else {
                        $scope.isSharedSup = false;
                        $scope.isBuyoutSup = true;
                        $scope.getData = function(){
                            analysisService.save({
                                detail : "statistics/sup/"
                            },{
                                prdtType : $state.params.prdtType,
                                prdtIdCd : $state.params.No,
                                startTime : $state.params.start,
                                endTime : $state.params.end,
                                page : $scope.curPageNum,
                                rows : per_page_num,
                            },function(backData){
                                $scope.originDatas = backData.data.list;
                                $scope.connDetailGrid = dls_list_service.capSupBoConnDetailGrid;

                                $scope.pageOptions = {
                                    "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                                    "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                                    "per_page_num" : per_page_num,
                                };
                            })
                        }
                    }
                    $scope.getData();
                })
            }else{
                $scope.connDetailGrid = dls_list_service.supDetailGrid;
                $scope.supType = "";
                $scope.getData = function(){
                    analysisService.save({
                        detail : "statistics/sup/"
                    },{
                        prdtType : $state.params.prdtType,
                        prdtIdCd : $state.params.No,
                        startTime : $state.params.start,
                        endTime : $state.params.end,
                        page : $scope.curPageNum,
                        rows : per_page_num,
                    },function(backData){
                        $scope.prdtName = backData.data.prdtName;
                        $scope.num = backData.data.supNum;
                        $scope.originDatas = backData.data.list;

                        $scope.pageOptions = {
                            "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                            "per_page_num" : per_page_num,
                        };
                    });
                }
            }

        }else{
            $scope.title = "互联需方详情";
            $scope.subTitle = "需方"
            $scope.connDetailGrid = dls_list_service.demDetailGrid;
            $scope.getData = function(){
                analysisService.save({
                    detail : "statistics/dem/"
                },{
                    prdtType : $state.params.prdtType,
                    prdtIdCd : $state.params.No,
                    startTime : $state.params.start,
                    endTime : $state.params.end,
                    page : $scope.curPageNum,
                    rows : per_page_num,
                },function(backData){
                    $scope.prdtName = backData.data.prdtName;
                    $scope.num = backData.data.demNum;
                    $scope.demMemName = backData.data.demMemName;
                    $scope.demDeptName = backData.data.demDeptName;
                    $scope.type = backData.data.type;
                    $scope.originDatas = backData.data.list;

                    $scope.pageOptions = {
                        "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                        "per_page_num" : per_page_num,
                    };
                });
            }
        }

        $scope.$watch("curPageNum",function(){
            if($scope.curPageNum){
                $scope.getData();
            }
        })

        $scope.listDetail = function(order){
            $state.go("dls.analysis.orderDetail",{type:$state.params.type,prdtIdCd:$state.params.No,prdtType:$state.params.prdtType,orderId:order['orderId'],supId:order['supMemId'],start:$state.params.start,end:$state.params.end,supType:$scope.supType})
        }

    }])
    .controller("orderDetailCtrl",["$scope","$state","analysisService","dls_list_service",function($scope,$state,analysisService,dls_list_service){
        $scope.pageOptions = {};
        $scope.curPageNum = 1;
        $scope.prdtType = $state.params.prdtType;

        var per_page_num = 10;

        if($state.params.type == "sup"){
            $scope.isSup = true;
            $scope.isDem = false;
            $scope.title = "互联供方详情";
            if($state.params.supType == 1){
                $scope.isCapSup = true;
                $scope.isBuyoutSup = false;
                $scope.memRole = "分成供方";
                $scope.orderDetailGrid = dls_list_service.orderSharedSupDetailGrid;
                $scope.getData = function(){
                    analysisService.save({
                        detail : "statistics/sup/orderList/"
                    },{
                        prdtIdCd : $state.params.prdtIdCd,
                        prdtType : $state.params.prdtType,
                        memId : $state.params.supId,
                        orderId : $state.params.orderId,
                        startTime : $state.params.start,
                        endTime : $state.params.end,
                        mode: "00",
                    },function(backData){
                        $scope.orderId = backData.data.orderId;
                        $scope.connNum = backData.data.connNum;
                        $scope.originDatas = backData.data.list;
                        $scope.supDeptName = backData.data.supDeptName;
                        $scope.supMemName = backData.data.supMemName;
                        $scope.type = backData.data.type;

                        $scope.pageOptions = {
                            "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                            "per_page_num" : per_page_num,
                        };
                    });
                }
            }else if($state.params.supType == 2){
                $scope.isBuyoutSup = true;
                $scope.isCapSup = false;
                $scope.memRole = "买断供方";
                $scope.orderDetailGrid = dls_list_service.orderCAPSupDetailGrid;
                $scope.getData = function(){
                    analysisService.save({
                        detail : "statistics/sup/cap/orderList/"
                    },{
                        prdtIdCd : $state.params.prdtIdCd,
                        prdtType : $state.params.prdtType,
                        memId : $state.params.supId,
                        orderId : $state.params.orderId,
                        startTime : $state.params.start,
                        endTime : $state.params.end,
                        mode: "01",
                    },function(backData){
                        $scope.orderId = backData.data.orderId;
                        $scope.connNum = backData.data.connNum;
                        $scope.originDatas = backData.data.list;
                        $scope.supDeptName = backData.data.supDeptName;
                        $scope.supMemName = backData.data.supMemName;
                        $scope.prdtName = backData.data.prdtName;
                        $scope.type = backData.data.type;

                        $scope.pageOptions = {
                            "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                            "per_page_num" : per_page_num,
                        };
                    });
                }
            }
            else{
                $scope.isCapSup = false;
                $scope.orderDetailGrid = dls_list_service.orderSupDetailGrid;
                $scope.getData = function(){
                    analysisService.save({
                        detail : "statistics/sup/orderList/"
                    },{
                        prdtIdCd : $state.params.prdtIdCd,
                        prdtType : $state.params.prdtType,
                        memId : $state.params.supId,
                        orderId : $state.params.orderId,
                        startTime : $state.params.start,
                        endTime : $state.params.end,
                    },function(backData){
                        $scope.orderId = backData.data.orderId;
                        $scope.connNum = backData.data.connNum;
                        $scope.originDatas = backData.data.list;
                        $scope.supDeptName = backData.data.supDeptName;
                        $scope.supMemName = backData.data.supMemName;
                        $scope.type = backData.data.type;

                        $scope.pageOptions = {
                            "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                            "per_page_num" : per_page_num,
                        };
                    });
                }
            }
        }else{
            $scope.isDem = true;
            $scope.isSup = false;
            $scope.title = "互联需方详情";
            $scope.orderDetailGrid = dls_list_service.orderDemDetailGrid;
            $scope.getData = function(){
                analysisService.save({
                    detail : "statistics/dem/orderList/"
                },{
                    prdtIdCd : $state.params.prdtIdCd,
                    prdtType : $state.params.prdtType,
                    orderId : $state.params.orderId,
                    startTime : $state.params.start,
                    endTime : $state.params.end,
                },function(backData){
                    $scope.orderId = backData.data.orderId;
                    $scope.connNum = backData.data.connNum;
                    $scope.originDatas = backData.data.list;
                    $scope.demDeptName = backData.data.demDeptName;
                    $scope.demMemName = backData.data.demMemName;
                    $scope.type = backData.data.type;

                    $scope.pageOptions = {
                        "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                        "per_page_num" : per_page_num,
                    };
                });
            }
        }

        $scope.getData()

        $scope.$watch("curPageNum",function(){
            if($scope.curPageNum){
                $scope.getData();
            }
        })
    }])