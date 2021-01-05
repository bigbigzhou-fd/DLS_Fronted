'use strict';

angular.module('myApp.demPublishControllers', [
        'myApp.services',
        'myApp.apiServices'
    ])
    .controller("demManageCtrl",["$scope","$state","$filter","localStorageService","demandService", function($scope,$state,$filter,localStorageService,demandService){
        var postData = {};
        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
        };
        $scope.pageOptions = {};

        var  appStatus = localStorageService.get('appStatus');

        $scope.curPage = appStatus && appStatus.curPage ? appStatus.curPage : 1;
        if(appStatus && appStatus.startDt) {
            $scope.startDt = new Date(appStatus.startDt)
        }else{
            $scope.startDt = new Date();
            $scope.startDt.setDate($scope.startDt.getDate() - 1);
        }
        $scope.endDt = appStatus && appStatus.endDt ? new Date(appStatus.endDt) : new Date();
        $scope.searchText = appStatus && appStatus.searchText ? appStatus.searchText : "";
        $scope.searchStatus = appStatus && appStatus.searchStatus ? appStatus.searchStatus : "";
        $scope.chooseType = appStatus && appStatus.chooseType ? appStatus.chooseType : "01";

        $scope.getData = function(){
            $scope.start = $filter('dlsDateFilter')($scope.startDt);
            $scope.end = $filter('dlsDateFilter')($scope.endDt);

            if (new Date($scope.end).getTime()-new Date($scope.start).getTime() < 0) {
                modalData.content = "终止日期应在开始日期之后";
                $scope.$emit("setModalState",modalData);
                return ;
            }else{
                postData = {
                    type: $scope.chooseType,
                    startTime: $scope.start,
                    endTime: $scope.end,
                    keyword: $scope.searchText,
                    status: $scope.searchStatus,
                    page: $scope.curPage,
                }

                demandService.save({
                    detail: "myTransaction/"
                },postData, function(backData) {
                    $scope.datas = backData.data.list;
                    $scope.totNum = backData.data.page.total_rows;
                    $scope.pageOptions = {
                        "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                        "per_page_num" : 10,                                 //单页page的data数量
                    };
                })
            }
        }

        $scope.$watch(function(){
            return $scope.startDt + "-" + $scope.endDt + "-" + $scope.searchText + "-" + $scope.searchStatus
        }, function(newV, oldV) {
            console.log(newV)
            console.log(oldV)
            if($scope.startDt && $scope.endDt && newV !== oldV) {
                $scope.curPage = 1;
                $scope.getData();
            }
        })
        $scope.$watch("curPage", function(newV, oldV) {
            if(newV !== oldV) {
                $scope.getData();
            }
        })
        $scope.choose = function(type) {
            $scope.chooseType = type;
            $scope.searchStatus = "";
            if(type === '01') {
                $scope.demPubStates = [{
                    name: "全部",
                    value: ""
                },{
                    name: "待发布",
                    value: "01"
                },{
                    name: "已发布",
                    value: "02"
                },{
                    name: "已失效",
                    value: "03"
                }
                //    , {
                //    name: "已删除",
                //    value: "-1"
                //}
                ]
            }else{
                $scope.demPubStates = [{
                    name: "全部",
                    value: ""
                },{
                    name: "已关注",
                    value: "01"
                },{
                    name: "已响应",
                    value: "02"
                },{
                    name: "已失效",
                    value: "03"
                }
                //    ,{
                //    name: "已删除",
                //    value: "-1"
                //}
                ]
            }
            $scope.getData();
        }
        $scope.choose($scope.chooseType);
        $scope.editReq = function(reqId) {
            $scope.setAppStatus();
            $state.go("dls.demPublish.demPublish", {reqId: reqId})
        }

        $scope.viewReq = function(reqId, status) {
            $scope.setAppStatus();

            if($scope.chooseType === '01') {
                $state.go("dls.demand.bill", {reqId: reqId, type: $scope.chooseType});
                if(status === '03') {
                    $state.go("dls.demand.bill", {reqId: reqId, type: $scope.chooseType, status: 1});
                }
            }else{
                var flag = 0;
                if(status === '02'){
                    flag = 1;
                }else if(status === '03') {
                    flag = 2;
                }
                $state.go("dls.demand.bill", {reqId: reqId, type: $scope.chooseType, status: flag});
            }
        }

        $scope.deleteReq = function(reqId, type) {
            demandService.save({
                detail:"setStatus/"
            },{
                reqId: reqId,
                status: "00",
                type: type
            },function(backData) {
                modalData.content = backData.msg;
                $scope.$emit("setModalState",modalData);
                $scope.getData();
            })
        }

        $scope.closeReq = function(reqId, type) {
            demandService.save({
                detail:"setStatus/"
            },{
                reqId: reqId,
                status: "01",
                type: type
            },function(backData) {
                modalData.content = backData.msg;
                $scope.$emit("setModalState",modalData);
                $scope.getData();
            })
        }

        $scope.dismiss = function(reqId, type) {
            demandService.save({
                detail:"setStatus/"
            },{
                reqId: reqId,
                status: "02",
                type: type
            },function(backData) {
                modalData.content = backData.msg;
                $scope.$emit("setModalState",modalData);
                $scope.getData();
            })
        }

        $scope.go = function(url, reqId) {
            $scope.setAppStatus();
            $state.go(url, {reqId: reqId})
        }

        $scope.setAppStatus = function() {
            var obj = {
                curPage: $scope.curPage,
                startDt: $scope.startDt,
                endDt: $scope.endDt,
                searchText: $scope.searchText,
                chooseType: $scope.chooseType,
                searchStatus: $scope.searchStatus,
            }
            localStorageService.set('appStatus', obj);
        }
    }])
    .controller("demPublishCtrl",["$scope","$state","$filter","demandService", function($scope,$state,$filter,demandService) {
        var base = {};
        var reqId = $state.params.reqId;
        var assign = function(obj, a, b){
            if(b) {
                obj[a] = b;
            }
        }
        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
        };
        var originData = {
            price: [],
        };
        $scope.$watch("demDesc", function(newV, oldV) {
            $scope.demDescNum = $scope.demDesc ? $scope.demDesc.length : 0 ;
            if(newV && newV.length > 500) {
                $scope.demDesc = $scope.demDesc.substr(0, 500);
            }
        })

        $scope.$watch("keyword", function(newV, oldV) {
            $scope.keywordNum = $scope.keyword ? $scope.keyword.length : 0;
            if(newV && newV.length > 150) {
                $scope.keyword = $scope.keyword.substr(0, 150);
            }
        })

        $scope.scene = {}, $scope.selectedIdAttr = [], $scope.selectedIndustryAttr = [], $scope.selectedAreaAttr = [], $scope.price = [], $scope.processWay = [];;
        if(reqId) {                     // 编辑
            $scope.reqId = reqId;
            demandService.save({
                detail: "req/dtl/"
            }, {
                reqId: reqId
            }, function(backData) {
                $scope.price = [];
                $scope.idAttr_str = backData.data.idCatgoryInfo;
                $scope.industryTree = backData.data.industryInfo;
                $scope.areaTree = backData.data.areaInfo;
                base.reqId = reqId;
                var scene = backData.data.scene;
                if(scene) {
                    if(scene.indexOf("03") !== -1){
                        $scope.scene.s01 = "03";
                    }
                    if(scene.indexOf("02") !== -1){
                        $scope.scene.s02 = "02";
                    }
                    if(scene.indexOf("04") !== -1){
                        $scope.scene.s03 = "04";
                    }
                    if(scene.indexOf("99") !== -1){
                        $scope.scene.s04 = "99";
                    }
                }
                assign($scope, "demDesc", backData.data.prdtIdDesc);
                assign($scope, "keyword", backData.data.keyword);
                assign($scope, "contactName", backData.data.contactName);
                assign($scope, "contact", backData.data.contact);
                assign(originData, "demDesc", backData.data.prdtIdDesc);
                assign(originData, "keyword", backData.data.keyword);
                assign(originData, "contactName", backData.data.contactName);
                assign(originData, "contact", backData.data.contact);

                if(backData.data.idCdList1) {
                    $scope.selectedIdAttr = angular.fromJson(backData.data.idCdList1);
                    originData.selectedIdAttr = angular.fromJson(backData.data.idCdList1);
                }
                assign($scope, "frequency", backData.data.freqLoop);
                assign($scope, "freUnit", backData.data.freUnit);
                assign($scope, "period", backData.data.dataLoop);
                //assign("perUnit", backData.data.perUnit);
                //assign("freUnit", backData.data.freUnit);
                assign($scope, "unit1", backData.data.valuationModeCd);
                assign($scope, "unit2", backData.data.valuationCountCd);

                assign(originData, "frequency", backData.data.freqLoop);
                assign(originData, "freUnit", backData.data.freUnit);
                assign(originData, "period", backData.data.dataLoop);
                assign($scope, "perUnit", backData.data.perUnit);
                assign($scope, "freUnit", backData.data.freUnit);
                assign(originData, "perUnit", backData.data.perUnit);
                assign(originData, "freUnit", backData.data.freUnit);
                assign(originData, "unit1", backData.data.valuationModeCd);
                assign(originData, "unit2", backData.data.valuationCountCd);
                var expectPrice = backData.data.valuationPrice;
                if(expectPrice) {
                    $scope.price[0] = expectPrice.split(",")[0];
                    $scope.price[1] = expectPrice.split(",")[1];
                    originData.price[0] = expectPrice.split(",")[0];
                    originData.price[1] = expectPrice.split(",")[1];
                }
                var timeRange = backData.data.timeRange;
                if(timeRange) {
                    $scope.startDt = new Date(backData.data.timeRange.split(',')[0]);
                    $scope.endDt = new Date(backData.data.timeRange.split(',')[1]);
                    originData.startDt = new Date(backData.data.timeRange.split(',')[0]);
                    originData.endDt = new Date(backData.data.timeRange.split(',')[1]);
                }
                assign($scope, "priceNotes", backData.data.remarks);
                assign($scope, "valueType", backData.data.valueType);
                assign($scope, "valueNotes", backData.data.valueEx);
                assign(originData, "priceNotes", backData.data.remarks);
                assign(originData, "valueType", backData.data.valueType);
                assign(originData, "valueNotes", backData.data.valueEx);

                if(backData.data.multiSelcategory1) {
                    $scope.selectedIndustryAttr = angular.fromJson(backData.data.multiSelcategory1);
                    originData.selectedIndustryAttr = angular.fromJson(backData.data.multiSelcategory1);
                }
                if( backData.data.processType) {
                    assign($scope, "processWay", backData.data.processType.split(','));
                    assign(originData, "processWay", backData.data.processType.split(','));
                }


                if(backData.data.multiSelgeo1) {
                    $scope.selectedAreaAttr = angular.fromJson(backData.data.multiSelgeo1);
                    originData.selectedAreaAttr = angular.fromJson(backData.data.multiSelgeo1);
                }

                assign($scope, "coverAreaNotes", backData.data.multiSelgeoRemarks);
                assign($scope, "expectCoverTot", backData.data.expCvgAmount);
                assign($scope, "expectData", backData.data.expDateScale);
                assign($scope, "maxDelayTime", backData.data.maxDelay);
                assign($scope, "concurrency", backData.data.expConcurrency);
                assign(originData, "coverAreaNotes", backData.data.multiSelgeoRemarks);
                assign(originData, "expectCoverTot", backData.data.expCvgAmount);
                assign(originData, "expectData", backData.data.expDateScale);
                assign(originData, "maxDelayTime", backData.data.maxDelay);
                assign(originData, "concurrency", backData.data.expConcurrency);
            })
        }else{                         // 新建
            $scope.type = "new";

            demandService.save({
                detail: "reqDist/"
            },function(backData) {
                if(backData.status == 1) {
                    $scope.idAttr_str = backData.data.idTree;
                    $scope.industryTree = backData.data.idustryTree;
                    $scope.areaTree = backData.data.areaTree;
                }
            })

        }

        var unique = function(node, event, arr) {
            var flag = true;
            arr.forEach(function(item){
                if(item.id === node.id) {
                    flag = false;
                }
            })
            if(flag) {
                arr.push(node);
            }
        };

        $scope.idAttrOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedIdAttr);
            }
        };

        $scope.industryOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedIndustryAttr);
            }
        };

        $scope.areaTreeOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedAreaAttr);
                for(var i=0; i<$scope.selectedAreaAttr.length; i++) {
                    if($scope.selectedAreaAttr[i].id === '000000') {
                        $scope.selectedAreaAttr = [$scope.selectedAreaAttr[i]];
                    }
                }
            }
        };

        $scope.removeIdAttr = function(index){
            $scope.selectedIdAttr.splice(index,1);
        }

        $scope.removeIndustryAttr = function(index){
            $scope.selectedIndustryAttr.splice(index,1);
        }

        $scope.removeAreaAttr = function(index){
            $scope.selectedAreaAttr.splice(index,1);
        }

        $scope.timeArr = [{
            name: "日",
            value: "01"
        },{
            name: "周",
            value: "02"
        },{
            name: "月",
            value: "03"
        },{
            name: "年",
            value: "04"
        },{
            name: "小时",
            value: "05"
        },{
            name: "分钟",
            value: "06"
        }];

        $scope.timeArr1 = [{
            name: "日",
            value: "01"
        },{
            name: "周",
            value: "02"
        },{
            name: "月",
            value: "03"
        },{
            name: "年",
            value: "04"
        }];

        $scope.priceTimesArr = [{
            name: "按次",
            value: "01"
        },{
            name: "按千次",
            value: "02"
        },{
            name: "按百万次",
            value: "03"
        },{
            name: "按条",
            value: "04"
        },{
            name: "按千条",
            value: "05"
        }];

        $scope.priceModeArr = [{
            name: "查询计数",
            value: "01"
        },{
            name: "查得计数",
            value: "02"
        }]

        $scope.valueTypeArr = [{
            name: "布尔型",
            value: "1"
        },{
            name: "数值型",
            value: "2"
        },{
            name: "数值",
            value: "3"
        },{
            name: "文件",
            value: "4"
        },{
            name: "数值区间",
            value: "5"
        },{
            name: "字符串型",
            value: "6"
        }]

        $scope.longestDelayArr = [{
            name: "s",
            value: "00"
        },{
            name: "ms",
            value: "01"
        }]

        $scope.currentArr = [{
            name: "条/s",
            value: "1"
        },{
            name: "条/ms",
            value: "2"
        }]

        $scope.amountArr = [{
            name: "条",
            value: "1"
        },{
            name: "千条",
            value: "2"
        },{
            name: "万条",
            value: "3"
        }]

        $scope.cancel = function() {
            $state.go("dls.demPublish.demManage");
        }

        $scope.remove = function(step) {
            console.log(originData)
            if(step === 1) {
                $scope.selectedIdAttr = originData.selectedIdAttr
            }else if(step == 2) {
                $scope.startDt = $filter('dlsDateFilter')(originData.startDt);
                $scope.endDt = $filter('dlsDateFilter')(originData.endDt);
                $scope.frequency = originData.frequency;
                $scope.freUnit = originData.freUnit;
                $scope.period = originData.period;
                $scope.perUnit = originData.perUnit;
                $scope.frequency = originData.frequency;
            }else if(step == 3) {
                $scope.unit1 = originData.unit1;
                $scope.unit2 = originData.unit2;
                $scope.price[0] = originData.price[0];
                $scope.price[1] = originData.price[1];
                $scope.priceNotes = originData.priceNotes;
            }else if(step == 4) {
                $scope.valueType = originData.valueType;
                $scope.valueNotes = originData.valueNotes;
            }else if(step == 5) {
                $scope.selectedIndustryAttr = originData.selectedIndustryAttr;
                $scope.selectedAreaAttr = originData.selectedAreaAttr;
                $scope.maxDelayTime = originData.maxDelayTime;
                $scope.concurrency = originData.concurrency;
                $scope.processWay = angular.merge([], originData.processWay);
                $scope.coverAreaNotes = originData.coverAreaNotes;
                $scope.concurrency = originData.concurrency;
                $scope.expectCoverTot = originData.expectCoverTot;
                $scope.expectCoverTotUnit = originData.expectCoverTotUnit;
                $scope.expectData = originData.expectData;
                $scope.expectDataUnit = originData.expectDataUnit;
            }
        }

        $scope.submit = function(step) {
            var arr = [];

            if($scope.scene) {
                for (var i in $scope.scene) {
                    if($scope.scene[i]) {
                        arr.push($scope.scene[i]);
                    }
                }
            }

            if(arr.length === 0 || !$scope.demDesc || !$scope.keyword) {
                modalData.content = "请填写必填内容！"
                $scope.$emit("setModalState",modalData);
                return
            }

            arr = arr.join(",");

            base = angular.merge(base, {
                reqId: $scope.reqId ? $scope.reqId : "",
                scene: arr,
                demDesc: $scope.demDesc,
                keyword: $scope.keyword,
                contactName: $scope.contactName,
                contact: $scope.contact
            });

            var data = {};
            var postData = {};
            if(step == 1) {
                var ids = [];
                for(var i=0; i<$scope.selectedIdAttr.length; i++) {
                    var obj = {
                        id: $scope.selectedIdAttr[i].id,
                        name: $scope.selectedIdAttr[i].name,
                    }
                    ids.push(obj);
                }
                data.idType = angular.toJson(ids);
                data.saveType = "00";
            }else if(step == 2) {
                $scope.statisticStartTime = $scope.startDt ? $filter('dlsDateFilter')($scope.startDt) : "";
                $scope.statisticEndTime = $scope.endDt ? $filter('dlsDateFilter')($scope.endDt) : "";
                var timeArr = [];
                if(!!$scope.statisticStartTime && $scope.statisticStartTime != "NaN-NaN-NaN") {
                    timeArr.push($scope.statisticStartTime);
                }
                if(!!$scope.statisticEndTime && $scope.statisticEndTime != "NaN-NaN-NaN") {
                    timeArr.push($scope.statisticEndTime);
                }
                data = {
                    frequency: $scope.frequency,
                    freUnit: $scope.freUnit,
                    period: $scope.period,
                    perUnit: $scope.perUnit,
                    statisticTime: timeArr.join(','),
                    saveType: "01",
                }
                if($scope.timeForm.frequency.$invalid || $scope.timeForm.period.$invalid) {
                    return
                }
            }else if(step == 3) {
                data = {
                    unit1: $scope.unit1,
                    unit2: $scope.unit2,
                    expectPrice: $scope.price.join(","),
                    priceNotes: $scope.priceNotes,
                    saveType: "02",
                }
                if($scope.priceForm.price1.$invalid || $scope.priceForm.price2.$invalid) {
                    return
                }
            }else if(step == 4) {
                data = {
                    valueType: $scope.valueType,
                    valueNotes: $scope.valueNotes,
                    saveType: "03",
                }
            }else if(step == 5) {
                var industry = [], area = [];
                for(var i=0; i<$scope.selectedIndustryAttr.length; i++) {
                    var obj = {
                        id: $scope.selectedIndustryAttr[i].id,
                        name: $scope.selectedIndustryAttr[i].name,
                    }
                    industry.push(obj);
                }
                for(var i=0; i<$scope.selectedAreaAttr.length; i++) {
                    var obj = {
                        id: $scope.selectedAreaAttr[i].id,
                        name: $scope.selectedAreaAttr[i].name,
                    }
                    area.push(obj);
                }

                data = {
                    saveType: "04",
                    Industry: angular.toJson(industry),
                    maxDelayTime: $scope.maxDelayTime,
                    //delayTimeUnit: $scope.delayTimeUnit,
                    concurrency: $scope.concurrency,
                    //concurrencyUnit: $scope.concurrencyUnit,
                    processWay: $scope.processWay.join(),
                    coverAreaNotes: $scope.coverAreaNotes,
                    coverArea: angular.toJson(area),
                    expectCoverTot: $scope.expectCoverTot,
                    expectCoverTotUnit: $scope.expectCoverTotUnit,
                    expectData: $scope.expectData,
                    expectDataUnit: $scope.expectDataUnit,
                }

                if($scope.limitForm.maxDelayTime.$invalid || $scope.limitForm.concurrency.$invalid || $scope.limitForm.expectCoverTot.$invalid || $scope.limitForm.expectData.$invalid) {
                    return
                }
            }else if(step === 'all') {
                var ids = [],industry = [], area = [];
                for(var i=0; i<$scope.selectedIdAttr.length; i++) {
                    var obj = {
                        id: $scope.selectedIdAttr[i].id,
                        name: $scope.selectedIdAttr[i].name,
                    }
                    ids.push(obj);
                }
                for(var i=0; i<$scope.selectedIndustryAttr.length; i++) {
                    var obj = {
                        id: $scope.selectedIndustryAttr[i].id,
                        name: $scope.selectedIndustryAttr[i].name,
                    }
                    industry.push(obj);
                }
                for(var i=0; i<$scope.selectedAreaAttr.length; i++) {
                    var obj = {
                        id: $scope.selectedAreaAttr[i].id,
                        name: $scope.selectedAreaAttr[i].name,
                    }
                    area.push(obj);
                }
                $scope.statisticStartTime = $filter('dlsDateFilter')($scope.startDt);
                $scope.statisticEndTime = $filter('dlsDateFilter')($scope.endDt);

                var timeArr = [];
                if(!!$scope.statisticStartTime && $scope.statisticStartTime != "NaN-NaN-NaN") {
                    timeArr.push($scope.statisticStartTime);
                }
                if(!!$scope.statisticEndTime && $scope.statisticEndTime != "NaN-NaN-NaN") {
                    timeArr.push($scope.statisticEndTime);
                }

                data = {
                    idType: angular.toJson(ids),
                    frequency: $scope.frequency,
                    freUnit: $scope.freUnit,
                    period: $scope.period,
                    perUnit: $scope.perUnit,
                    statisticTime: timeArr.join(","),
                    unit1: $scope.unit1,
                    unit2: $scope.unit2,
                    expectPrice: $scope.price.join(","),
                    priceNotes: $scope.priceNotes,
                    Industry: JSON.stringify(industry),
                    maxDelayTime: $scope.maxDelayTime,
                    delayTimeUnit: $scope.delayTimeUnit,
                    concurrency: $scope.concurrency,
                    concurrencyUnit: $scope.concurrencyUnit,
                    processWay: $scope.processWay.join(),
                    coverAreaNotes: $scope.coverAreaNotes,
                    coverArea: JSON.stringify(area),
                    expectCoverTot: $scope.expectCoverTot,
                    valueType: $scope.valueType,
                    valueNotes: $scope.valueNotes,
                    //expectCoverTotUnit: $scope.expectCoverTotUnit,
                    expectData: $scope.expectData,
                    //expectDataUnit: $scope.expectDataUnit,
                    saveType: "05",
                }
            }

            postData = angular.merge(base, data);

            demandService.save({
                detail: "reqDist/save/"
            },postData, function(backData) {
                modalData.content = backData.msg;
                if(backData.data.reqId) {
                    $scope.reqId = backData.data.reqId;
                }
                $scope.$emit("setModalState",modalData);
                if(step === "all") {
                    setTimeout(function() {
                        $scope.$emit("cancelModalState");
                        $state.go("dls.demPublish.demManage");
                    }, 1000)
                }
            })
        }
    }])
    .controller("supResponseCtrl",["$scope","$state","$filter","localStorageService","demandService",function($scope,$state,$filter,localStorageService,demandService){
        $scope.pageOptions = {};
        $scope.curPage = 1;
        var reqId = $state.params.reqId;

        $scope.getData = function() {
            demandService.save({
                detail: "supResp/list/"
            },{
                reqId: reqId,
                page: $scope.curPage
            }, function(backData) {
                $scope.reqId = backData.data.reqId;
                $scope.keyword = backData.data.keyword;
                $scope.disTime = backData.data.disTime;
                $scope.respNum = backData.data.respNum;
                $scope.datas = backData.data.list;
                $scope.pageOptions = {
                    "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                    "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                    "per_page_num" : 10,                                 //单页page的data数量
                };
            })
        }

        $scope.$watch("curPage", function() {
            $scope.getData();
        })
    }])
    .controller("similarityCtrl",["$scope","$state","$filter","localStorageService","demandService", function($scope,$state,$filter,localStorageService,demandService){
        $scope.pageOptions = {};
        $scope.curPage = 1;
        var reqId = $state.params.reqId;

        $scope.getData = function() {
            demandService.save({
                detail: "simiDegree/list/"
            },{
                reqId: reqId,
                page: $scope.curPage
            }, function(backData) {
                $scope.reqID = backData.data.reqID;
                $scope.maxSimiDegree = backData.data.maxSimiDegree;
                $scope.datas = backData.data.list;
                $scope.pageOptions = {
                    "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                    "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                    "per_page_num" : 10,                                 //单页page的data数量
                };
            })
        }

        $scope.detail = function(data){
            var rdata = {};
            var type = data.prdtType;
            if(type === "03") {
                rdata = "connObjId=0"+"?connObjNo="+data.connObjNo+"?tag_code="+data.tag_code+"?type=view?prdtType=cap";
            }else if(type === "02") {
                rdata = "connObjId=0"+"?connObjNo="+data.connObjNo+"?tag_code="+data.tag_code+"?type=view?prdtType=crp";
            }
            $state.go("dls.provider.createItem",{data:rdata});
        }

        $scope.$watch("curPage", function() {
            $scope.getData();
        })

    }])
