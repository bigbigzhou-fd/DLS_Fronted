'use strict';

angular.module('myApp.logControllers', [
        'myApp.services',
        'myApp.apiServices'
    ])
    .controller("logCtrl",["$scope","dls_list_service","logService","$state","$filter","localStorageService",function($scope,dls_list_service,logService,$state,$filter,localStorageService){
        $scope.prdtType = "";
        $scope.pageOptions = {};
        $scope.curPageNum = 1;
        var url = "";
        var per_page_num = 10;

        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };

        switch($state.current.url){
            case "/capDemLog": $scope.prdtType = "03" ; url = "dem/cap/" ; $scope.logGrid = dls_list_service.logDemGrid;$scope.download="stt/log/export/dem/cap";break;
            case "/capSharedSupLog": $scope.isCapSup = "true";$scope.supType="分成模式";$scope.mode="00";console.log($scope.mode);$scope.prdtType = "03" ; url = "sup/cap/" ; $scope.logGrid = dls_list_service.logSharedSupGrid;$scope.download="stt/log/export/sup/cap";break;
            case "/capBuyoutSupLog": $scope.isCapSup = "true";$scope.supType="买断模式";$scope.mode="01";$scope.prdtType = "03" ; url = "buyOutSup/cap/" ; $scope.logGrid = dls_list_service.logbuyoutSupGrid;$scope.download="stt/log/export/sup/cap";break;
            case "/dmixDemLog": $scope.prdtType = "02" ; url = "dem/dmix/" ; $scope.logGrid = dls_list_service.logDemGrid;$scope.download="stt/log/export/dem/dmix";break;
            case "/dmixSupLog": $scope.prdtType = "02" ; url = "sup/dmix/" ; $scope.logGrid = dls_list_service.logSupGrid;$scope.download="stt/log/export/sup/dmix";break;
            case "/stdDemLog": $scope.prdtType = "01" ; url = "dem/std/" ; $scope.logGrid = dls_list_service.logDemGrid;$scope.download="stt/log/export/dem/std";break;
            case "/stdSupLog": $scope.prdtType = "01" ; url = "sup/std/" ; $scope.logGrid = dls_list_service.logSupGrid;$scope.download="stt/log/export/sup/std";break;
        }

        $scope.startDt = new Date();
        $scope.startDt.setDate($scope.startDt.getDate() - 1);
        $scope.endDt = new Date();
        $scope.start = $filter('dlsDateFilter')($scope.startDt);
        $scope.end = $filter('dlsDateFilter')($scope.endDt);

        if(!localStorageService.get('log_start_time') && !localStorageService.get('log_end_time')){
            localStorageService.set('log_start_time',$scope.start);
            localStorageService.set('log_end_time',$scope.end);
        }else{
            $scope.start = localStorageService.get('log_start_time');
            $scope.end = localStorageService.get('log_end_time');
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
        },true);

        $scope.getData = function(){
            if (new Date($scope.end).getTime()-new Date($scope.start).getTime() < 0) {
                modalData.content = "终止日期应在开始日期之后";
                $scope.$emit("setModalState",modalData);
                return ;
            }else{
                localStorageService.set('log_start_time',$scope.start);
                localStorageService.set('log_end_time',$scope.end);

                logService.save({
                    detail:url
                },{
                    startTime:$scope.start,
                    endTime:$scope.end,
                    prdtType : $scope.prdtType,
                    page : $scope.curPageNum,
                    rows : per_page_num,
                },function(backData){
                    var roleType = url.split("/")[0];
                    if(roleType == "sup" || roleType == "sharedSup" || roleType == "buyOutSup"){
                        $scope.deptName = backData.data.supDeptName;
                        $scope.memName = backData.data.supMemName;
                    }else if(roleType == "dem"){
                        $scope.deptName = backData.data.demDeptName;
                        $scope.memName = backData.data.demMemName;
                    }

                    $scope.originDatas = backData.data.list;
                    $scope.updateTime = backData.data.updateTime;
                    if(backData.data && backData.data.page){
                        $scope.pageOptions = {
                            "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                            "per_page_num" : per_page_num,
                        };
                    }
                })
            }
        }

        $scope.$watch("curPageNum",function(){
            $scope.getData();
        })

        $scope.listDetail = function(data){
            var type = $state.current.url.substr(1);
            if(data['orderId'] === 'ODN20171211000000876' || data['orderId'] === 'ODN20171211000000891' || data['orderId'] ===  'ODN20171211000000906'){
                return
            }
            $state.go("dls.log.logDetail",{type:type,No:data['orderId'],statDate:data['date'],orderName:data['orderName'],st:$scope.start,et:$scope.end});
        }
    }])
    .controller("logDetailCtrl",["$scope","dls_list_service","$state","logService",function($scope,dls_list_service,$state,logService){
        var fromUrl = $state.params.type;
        var orderId = $state.params.No;
        var statDate = $state.params.statDate;
        $scope.order_Name = $state.params.orderName;
        $scope.sett_type = fromUrl;
        $scope.curPageNum = 1;
        var per_page_num = 10;
        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };
        var url = "";
        $scope.pageOptions = {};
        switch(fromUrl){
            case "capDemLog": $scope.logDetailGrid = dls_list_service.logDemDetailGrid;url="dem/orderList/cap/";break;
            case "capSharedSupLog": $scope.logDetailGrid = dls_list_service.logSupDetailGrid;url="sup/orderList/cap/";break;
            case "dmixDemLog": $scope.logDetailGrid = dls_list_service.logDemDetailGrid;url="dem/orderList/dmix/";break;
            case "dmixSupLog": $scope.logDetailGrid = dls_list_service.logSupDetailGrid;url="sup/orderList/dmix/";break;
            case "stdDemLog": $scope.logDetailGrid = dls_list_service.logDemDetailGrid;url="dem/orderList/std/";break;
            case "stdSupLog": $scope.logDetailGrid = dls_list_service.logSupDetailGrid;url="sup/orderList/std/";break;
        }
        $scope.$watch("curPageNum",function(){
            if($scope.curPageNum){
                logService.save({
                    detail:url
                },{
                    orderId : orderId ,
                    statDate : statDate,
                    page : $scope.curPageNum,
                    rows : per_page_num,
                    startTime:$state.params.st,
                    endTime:$state.params.et,
                },function(backData){
                    $scope.statDate = backData.data.statDate;
                    $scope.orderId = backData.data.orderId;
                    $scope.orderName = backData.data.orderName;
                    $scope.type = backData.data.type;

                    $scope.originDatas = backData.data.list;

                    $scope.pageOptions = {
                        "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                        "per_page_num" : per_page_num,
                    };
                })
            }
        })
    }])

