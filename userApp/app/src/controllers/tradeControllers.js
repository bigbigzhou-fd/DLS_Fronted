'use strict';

angular.module('myApp.tradeControllers', [
        'myApp.services',
        'dls.services.util',
        'myApp.apiServices'
])
    .controller("tradeMallCtrl",['tagMAlgCatService','$rootScope','$scope','localStorageService','dls_list_service','tradeMallService','tradeMallTitles',
      function(tagMAlgCatService,$rootScope,$scope,localStorageService,dls_list_service,tradeMallService,tradeMallTitles){
        $scope.trade_scenario_btn_datas = dls_list_service.trade_scenario_btn_datas;
        $scope.transactionSwitchValue = '01'
        $scope.treeOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode"
            }
        };

        //$rootScope.trade_label_type_btn_datas = localStorageService.get('trade_label_type_btn_datas');
        //if (!$rootScope.trade_label_type_btn_datas) {
            tradeMallService.get({detail:"category/list"},function(resp){
                console.log(resp);
                if(!!resp.data.length){
                    var tree = [];
                    var data = resp.data;
                    var len = data.length;
                    var nodes = {};
                    for(var i=0; i<len; i++){
                        if (!data[i].name) {continue;}
                        var temp = {
                            pId:data[i].pId,
                            id:data[i].id,
                            label:data[i].name,
                            isParent:data[i].isParent
                        };
                        if(data[i].isParent){
                            temp.child = [];
                        }
                        nodes[data[i].id] = temp;
                    }
                    for(var key in nodes){
                        if(nodes[key].pId !== 0 && !!nodes[nodes[key].pId]){
                            if (!nodes[nodes[key].pId].isParent && !nodes[nodes[key].pId].child) {
                                nodes[nodes[key].pId].child = [];
                            }
                              nodes[nodes[key].pId].child.push(nodes[key]);
                        }else if(nodes[key].pId === 0){
                            tree.push(nodes[key]);
                        }
                    }
                    console.log(tree);
                    $rootScope.trade_label_type_btn_datas = tree;
                    localStorageService.set('trade_label_type_btn_datas',  tree);
                }
            });
            tagMAlgCatService.get({detail:"index/"},function(resp){
                 console.log(resp)
                 if(!!resp.data.length){
                    var tree = [];
                    var data = resp.data;
                    var len = data.length;
                    var nodes = {};
                    for(var i=0; i<len; i++){
                        if (!data[i].name) {continue;}
                        var temp = {
                            pId:data[i].pId,
                            id:data[i].id,
                            label:data[i].name,
                            isParent:data[i].isParent
                        };
                        if(data[i].isParent){
                            temp.child = [];
                        }
                        nodes[data[i].id] = temp;
                    }
                    for(var key in nodes){
                        if(nodes[key].pId !== 0 && !!nodes[nodes[key].pId]){
                            if (!nodes[nodes[key].pId].isParent && !nodes[nodes[key].pId].child) {
                                nodes[nodes[key].pId].child = [];
                            }
                              nodes[nodes[key].pId].child.push(nodes[key]);
                        }else if(nodes[key].pId === 0){
                            tree.push(nodes[key]);
                        }
                    }
                    console.log(tree);
                    $rootScope.trade_label_reckon_type_btn_datas = tree;
                    localStorageService.set('trade_label_reckon_type_btn_datas',tree);
                }

            });


        //}


        // $scope.trade_type_btn_datas = dls_list_service.trade_type_btn_datas;
        // $scope.tradeScenarioValue = localStorageService.get('tradeScenarioValue') || '03';
        // $scope.$watch(function(){
        //     return $scope.tradeScenarioValue;
        // },function(newV){
        //     localStorageService.set('tradeScenarioValue',$scope.tradeScenarioValue);
        // },true);
        $scope.tradeMallTitles = tradeMallTitles;

        $scope.tradeTypeValue = "";
        $scope.searchFullText = "";
        $scope.selectedNode = {
            pId : ""
        };

    }])
    .controller("goodsCategoryCtrl",['$scope','tradeMallService','tradeMallTitles','localStorageService','debounce','$timeout', 
        function($scope,tradeMallService,tradeMallTitles,localStorageService,debounce,$timeout){
        $scope.titles = tradeMallTitles;
        $scope.pageOptions = {
            "total_items_num" : 0,
            "total_pages_num" : 0,
            "per_page_num" : 10
        };
        var  appStatus = localStorageService.get('appStatus')
        console.log(appStatus)
        $scope.searchText = !!appStatus ? appStatus.searchText : '';
        $scope.curPage = !!appStatus ? appStatus.curPage : 1;
        $scope.tradeScenarioValue =  !!appStatus ? appStatus.tradeScenarioValue : '02';
        $scope.selectedNode.id = !!appStatus ? appStatus.pcode : '';
        console.log($scope.selectedNode.id)

        $scope.getDatas = function (page,pcode,category,text) {
            if($scope.transactionSwitchValue === '01'){
                tradeMallService.save({detail:"tradegood/list/"},{
                    page:$scope.curPage,
                    pcode:$scope.selectedNode.id,
                    type: $scope.tradeScenarioValue || category,
                    name:$scope.searchText
                },function(resp){
                    $scope.datas = resp.data.list;
                    $scope.pageOptions = {
                        "total_items_num" : resp.data.page.total_rows,
                        "total_pages_num" : resp.data.page.total_pages,
                        "per_page_num" : resp.data.page.rows
                    };
                });
            }else{
                tradeMallService.save({detail:"alg/product/list/"},{
                    page:$scope.curPage,
                    pcode:$scope.selectedNode.id,
                    name:$scope.searchText
                },function(resp){
                    console.log(resp)
                    $scope.datas = resp.data.list;
                    $scope.pageOptions = {
                        "total_items_num" : resp.data.page.total_rows,
                        "total_pages_num" : resp.data.page.total_pages,
                        "per_page_num" : resp.data.page.rows
                    };
                });            
            }

        };
        // $scope.getDatas();
        $scope.$watch(function(){
            return $scope.selectedNode.id +"/"+ $scope.curPage +"/"+ $scope.tradeScenarioValue
        },function(newV, oldV){
            if(newV !== oldV) {
                console.log($scope.selectedNode.id)

                var res = /^KY/.test($scope.selectedNode.id)
                var res1 = /^AG/.test($scope.selectedNode.id)
                console.log(res)
                if($scope.selectedNode.id === ""){
                    $scope.getDatas();
                }else{
                     if(res||res1){
                        $scope.getDatas();
                     }
                }
            }
        },true);

        $scope.$watch(function(){
            return $scope.transactionSwitchValue
        },function(newV,oldV){
            $scope.selectedNode.id = ''
            $scope.getDatas();
        })

        $scope.$watch('searchText',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        }, 350));

        $scope.setData = function (item) {
            localStorageService.set('goodsCategoryDatas',  item);
            var appStatus = {
                'searchText': $scope.searchText,
                'pcode': $scope.selectedNode.id,
                'tradeScenarioValue': $scope.tradeScenarioValue,
                'curPage': $scope.curPage,
            };
            localStorageService.set('appStatus', appStatus);
        };
    }])
    .controller("goodsItemCtrl",['$rootScope','$scope','$state','tradeMallService','tradeMallTitles','$stateParams','localStorageService',function($rootScope,$scope,$state,tradeMallService,tradeMallTitles,$stateParams,localStorageService){
        $scope.pageOptions = {
            "total_items_num" : 0,
            "total_pages_num" : 0,
            "per_page_num" : 10
        };
        $scope.curPage = 1;
        $scope.searchText = '';

        $scope.titles = tradeMallTitles;
        $scope.prdtIdCd = $stateParams.prdtId;
        $scope.prdtType = $stateParams.type;
        $scope.transactionSwitchValue = $stateParams.transactionSwitchValue;
        
        // if($scope.prdtType === "03") {
        //     $scope.detail = function(data){
        //         var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=view?prdtType=cap";
        //         $state.go("dls.provider.createItem",{data:data});
        //     }
        // }else{
        //     $scope.detail = function(data){
        //         var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=view?prdtType=crp";
        //         $state.go("dls.provider.createItem",{data:data});
        //     }
        // }
        if($scope.prdtType === "03") {
            $scope.detail = function(data){
                data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd + "?type=view?prdtType=cap";
                $state.go("dls.provider.createItem",{data:data});
            }
        }else{
             if($scope.transactionSwitchValue == '02'){
                 $scope.detail = function(data){
                     data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=view";
                     $state.go("dls.algorithm.createItem",{data:data});
                 }
             }else{
                 $scope.detail = function(data){
                     data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd + "?type=view?prdtType=crp";
                     $state.go("dls.provider.createItem",{data:data});
                 }
             }
        }

        $scope.goodsCategoryDatas = localStorageService.get('goodsCategoryDatas');
        // console.log($scope.goodsCategoryDatas);
        var url = '';
        if($scope.transactionSwitchValue === '01'){
            if ($scope.prdtType === '03') {
                url = "tradegood/capList/";
            } else if ($scope.prdtType === '02') {
                url = "tradegood/crpList/";
            }
        }else if($scope.transactionSwitchValue === '02'){
            url = "alg/product/search/";                
        }

        $scope.getDatas = function () {
            console.log(89898989)
            tradeMallService.save({detail:url},{
                page:$scope.curPage,
                prdtIdCd: $scope.prdtIdCd,
                keywords:$scope.searchText
            },function(resp){
                console.log(resp);
                $scope.datas = resp.data;
                $scope.pageOptions = {
                    "total_items_num" : resp.data.page.total_rows,
                    "total_pages_num" : resp.data.page.total_pages,
                    "per_page_num" : 10
                };
            });
        };

        $scope.$watch(function(){
            return $scope.curPage;
        },function(){
            $scope.getDatas();
        })

        $scope.searchItem = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.getDatas();
            }
        }

        $scope.addToCart = function (index,item) {
            console.log(item);
            tradeMallService.save({detail:"cart/addGoods/"},{
                prdtType:item.prdtType,
                connObjNo: item.connObjNo,
                connObjId: item.connObjId,
                supMemId: item.supMemId,
                connObjCatCd: item.connObjCatCd
            },function(resp){
                console.log(resp);
                if (resp.status === '1') {
                    $rootScope.cartNum = resp.data[0].cartNum;
                    localStorageService.set('cartNum', resp.data[0].cartNum);
                    console.log($scope.datas.list[index]);
                    $scope.datas.list[index].isInCart = true;
                }
                $scope.modalData.content = resp.msg;
                $scope.$emit("setModalState",$scope.modalData);
            });
        };

    }])

    .controller("tradeMallItemCtrl",function($rootScope,$scope,dls_datas,MALL_ITEMS_DATAS_LABEL,tradeMallService){
        var perPageNum = 24;    //分页每页显示内容的数量
        $scope.pageOptions = {};
        $scope.curPage = 1;
        $scope.selectedNode.id = '';
        //$scope.tradeScenarioValue = '02';
        $scope.tradeTypeValue = '';
        $scope.searchFullText = '';
        $scope.getItemsDatas = function(page,pcode,scenceCode,category,text){
            $scope.showSpinning = true;
            var itemsDatas = [];
            tradeMallService.save({detail:"prdt/search/"},{
            page:$scope.curPage,
            pcode:pcode,
            scenceCode:$scope.tradeScenarioValue,
            category:category,
            text:text,
            rows:perPageNum,
        },function(backData){
                $scope.showSpinning = false;
                if( !!backData.data.list ){
                    var data = backData.data.list;
                    $scope.showitemData = (data.length == 0)?false:true;
                    var len = data.length;
                    for(var i=0; i<len; i++){
                        var temp1 = {};
                        temp1.name = data[i].prdtName;
                        temp1.isInCart = data[i].isInCart,
                        temp1.contents = [];
                        temp1.originData = backData.data.list[i];
                        for(var key in MALL_ITEMS_DATAS_LABEL){
                            var temp2 = {};
                            temp2.key = MALL_ITEMS_DATAS_LABEL[key];
                            temp2.value = data[i][key];
                            temp1.contents.push(temp2);
                        }
                        itemsDatas.push(temp1);
                    }
                    $scope.tradeDatas = itemsDatas;
                    $scope.pageOptions = {
                        "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                        "per_page_num" : perPageNum                          //单页page的data数量
                    };
                }
            })
        }
        $scope.searchItem = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.searchFullText = $scope.searchText
                $scope.getItemsDatas($scope.curPage,$scope.selectedNode.id,$scope.tradeScenarioValue,$scope.tradeTypeValue,$scope.searchFullText);
            }
        }

        $scope.$watch(function(){
            return $scope.curPage;
        },function(){
            $scope.getItemsDatas($scope.curPage,$scope.selectedNode.id,$scope.tradeScenarioValue,$scope.tradeTypeValue,$scope.searchFullText);
        })

        $scope.$watch(function(){
            return $scope.selectedNode.id +"/"+ $scope.tradeScenarioValue +"/"+ $scope.tradeTypeValue;
        },function(newV){
            if($scope.curPage != 1){
                $scope.curPage = 1;
            }else{
                $scope.getItemsDatas($scope.curPage,$scope.selectedNode.id,$scope.tradeScenarioValue,$scope.tradeTypeValue,$scope.searchFullText);
            }
        },true)
    })
    .controller("tradeMallSetCtrl",["$scope","tradeMallService","dls_list_service","$compile","$state",function($scope,tradeMallService,dls_list_service,$compile,$state){
        $scope.tradeMallSetsGrid = dls_list_service.trade_mall_sets_grid;
        $scope.pageOptions = {};
        $scope.searchSet = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.curPage = 1;
                $scope.searchFullText = $scope.searchText;
                $scope.getSetsDatas($scope.curPage,$scope.selectedNode.id,$scope.searchFullText);
            }
        }
        $scope.getSetsDatas = function(page,pcode,text){
            var itemsDatas = [];
            var perPageNum = 10;
            tradeMallService.save({detail:"package/search/"},{
                page:page,
                pcode:pcode,
                text:text,
            },function(resp){
                if(!!resp.data.list) {
                    $scope.originDatas = resp.data.list;
                    $scope.showsetData = ($scope.originDatas == 0)?false:true;
                    $scope.pageOptions = {
                        "total_items_num": resp.data.page.total_rows,   //总共的data数量
                        "total_pages_num": resp.data.page.total_pages,  //总共的page数量
                        "per_page_num": perPageNum                          //单页page的data数量
                    };
                }
            })
        }

        $scope.detail = function(e){
            var data = $(e.target).attr("url")
            $state.go("dls.provider.itemDetail",{data:data});
        }

        $scope.showDetailData = function(index,event){
            var newTable = $($(event.target).parent()).next();
            if(newTable.hasClass('add-row-table')){
                $(newTable).remove();
            }else{
                if($scope.originDatas){
                    var info = $scope.originDatas[index].prdt_list;
                    var appendTr = $("<tr class='add-row-table'><td></td><td colspan='7'><table class='inner-table'></table></td></tr>")
                    var table = $($(appendTr).find("table"));
                    var thead = $("<thead><th style='min-width:50px;'>序号</th><th style='min-width:150px;'>互联对象编号</th><th style='min-width:70px;'>版本号</th><th style='min-width:150px;'>互联对象</th><th style='min-width:150px;'>标签</th><th style='min-width:150px;'>标签赋值类型</th></thead>")
                    table.append(thead);
                    var tbody = $("<tbody></tbody>")
                    var infoLen = (info).length;
                    for(var i=0; i<infoLen; i++){
                        var tr = $("<tr style='height:30px;line-height:30px;text-align:center'></tr>");
                        var infoData =  "connObjId="+info[i].connObjId+"?connObjNo="+info[i].connObjNo+"?tag_code="+info[i].prdtIdCd;
                        tr.append("<td>"+(i+1)+"</td><td>"+info[i].connObjNo+"</td><td class='f-col-3' url="+infoData+" ng-click='detail($event)'>"+info[i].connObjVer+"</td><td>"+info[i].prdtName+"</td><td>"+info[i].tag_name+"</td><td>"+info[i].tag_value_type+"</td>");
                        tbody.append(tr);
                    }
                    table.append(tbody);
                    $($(event.target).parent()).after($compile(appendTr)($scope))
                }
            }
        }

        $scope.$watch(function () {
            return $scope.curPage + "/" + $scope.selectedNode.id +"/"+ $scope.tradeScenarioValue;
        }, function (newV) {
            $scope.getSetsDatas($scope.curPage, $scope.selectedNode.id, $scope.searchFullText);
        }, true)
        $scope.getSetsDatas($scope.curPage,$scope.selectedNode.id,$scope.searchFullText);
    }])
    .controller("tradeCartListCtrl",['$rootScope','$scope','localStorageService','$state','dls_list_service','tradeMallService','tradeMallTitles',function($rootScope,$scope,localStorageService,$state,dls_list_service,tradeMallService,tradeMallTitles){
        $scope.trade_scenario_btn_datas = dls_list_service.trade_scenario_btn_datas;
        $scope.marketingCartListTitles = tradeMallTitles.marketingCartListTitles;
        $scope.creditCartListTitles = tradeMallTitles.creditCartListTitles;
        $scope.pageOptions = {
            "total_items_num" : 0,
            "total_pages_num" : 0,
            "per_page_num" : 100
        };
        $scope.curPage = 1;
        $scope.prdtType = "03";
        $scope.selectAll = function() {
            $scope.datas.forEach(function(item){
                item.checked = $scope.checkedAll;
                $scope.selectData();
            })
        }

        $scope.$watch('prdtType', function(){
            var data = "";
            if($scope.prdtType === "03") {
                $scope.detail = function(data){
                    data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd + "?type=view?prdtType=cap";
                    $state.go("dls.provider.createItem",{data:data});
                }
            }else if($scope.prdtType === "02"){
                $scope.detail = function(data){
                    data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd + "?type=view?prdtType=crp";
                    $state.go("dls.provider.createItem",{data:data});
                }
            }else{
                $scope.detail = function(data){
                    data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=view";
                    $state.go("dls.algorithm.createItem",{data:data});
                }
            }
        })

        $scope.getDatas = function () {
            tradeMallService.save({detail:"cart/listCart_new/"},{
                page:$scope.curPage,
                prdtType: $scope.prdtType,
                rows: $scope.pageOptions.per_page_num,
            },function(resp){
                $scope.datas = resp.data.list;
                $scope.pageOptions = {
                    "total_items_num" : resp.data.page.total_rows,
                    "total_pages_num" : resp.data.page.total_pages,
                    "per_page_num" : resp.data.page.rows
                };
            });
        };

        $scope.selectedConnObjNo = [];
        $scope.$watch(function(){
            return $scope.curPage + "/" + $scope.prdtType;
        },function(){
            $scope.getDatas();
            $scope.selectedConnObjNo = [];
        });
        $scope.selectData = function (checked,connObjId) {
            $scope.selectedConnObjNo = [];
            var orderItems = $scope.datas.filter(function (item) {
                console.log(item)
                return (item.checked === true);
            });
            console.log(orderItems,898989)
            for (var i = orderItems.length - 1; i >= 0; i--) {
                $scope.selectedConnObjNo.push(orderItems[i].connObjNo);
            }
        };
        $scope.createOrder = function () {
            
            localStorageService.set('selectedConnObjNo',$scope.selectedConnObjNo);
            localStorageService.set('prdtType',$scope.prdtType);
            localStorageService.set('viewMode','01'); //查看模式：00 编辑暂存  01 新生成  02 详情
            $state.go("dls.trade.cart");
        };
        $scope.deleteItem = function(index,connObjNo) {
            $scope.selectedConnObjNo = localStorageService.get('selectedConnObjNo');
            // console.log($scope.selectedConnObjNo);
            tradeMallService.save({detail:"cart/deleteCart_new/"},{
                connObjNo:connObjNo
            },function(resp){
                if (resp.status === 1) {
                    $scope.datas.splice(index,1);
                    $rootScope.cartNum --;
                    localStorageService.set('cartNum', $rootScope.cartNum);
                    $scope.selectedConnObjNo.deletItem(connObjNo);
                    localStorageService.set('selectedConnObjNo',$scope.selectedConnObjNo);
                }
                $scope.modalData.content = resp.msg;
                $scope.$emit("setModalState",$scope.modalData);
            });
        };
    }])
    .controller("tradeCartCtrl",['$rootScope','$scope','$state','localStorageService','tradeMallService','tradeMallTitles','selectOptions','$uibModal',function($rootScope,$scope,$state,localStorageService,tradeMallService,tradeMallTitles,selectOptions,$uibModal){
        $scope.titles = tradeMallTitles.cartOrderTitles;
        $scope.selectOptions = selectOptions;
        var arr;
        $scope.searchText = "你好";
        $scope.selectedConnObjNo = localStorageService.get('selectedConnObjNo');
        var prdtType = localStorageService.get('prdtType');
        var orderId = localStorageService.get('orderId');
        $scope.viewMode = localStorageService.get('viewMode');
        $scope.minDateMoment = moment().subtract(0, 'day');

        $scope.periodType = '03' === prdtType ? '02' : '01';
        $scope.priceType = '01';
        $scope.countType = '01';
        $scope.countGetType = '01';
        $scope.discountType = '01';
        $scope.clearType = '1';
        $scope.discount = '';
        $scope.priceHoldAmount = '';
        $scope.param1 = '';
        $scope.param2 = '';
        $scope.cartDictsDatas = {};
        $scope.editParam_1 = function(item, e){
            $scope.popData = [];

            if(item.CapRange){
                var temp = item.CapRange.split(';');
                temp.forEach(function(i){
                    $scope.popData.push({
                        min: Number(i.split(',')[0]),
                        max: Number(i.split(',')[1]),
                    })
                })
            }else{
                $scope.popData = [{
                    min: null,
                    max: null,
                }];
            }

            $scope.editItem = item;

            $scope.popRange = [];

            $('#popover').css({
                marginTop: e.pageY - 50 - 10,
                marginLeft: e.clientX - 225 - 190,
                zIndex: 1000,
                display: 'block',
            })

            var temp  = item.range.split(';');

            temp.forEach(function(i){
                var t = i.split(',');
                var temp = '['+t[0]+' ~  '+ t[1]+']'
                $scope.popRange.push(temp);
            })

            $scope.popRange = $scope.popRange.join('，');
        }

        $scope.cancelPop = function() {
            $('#popover').css({
                display: 'none',
            })
        }

        $scope.savePopItem = function() {
            var temp = [];
            var params = true;
            $scope.popData.forEach(function(item) {
                if((item.min || item.min == 0) && (item.max || item.max == 0)){
                    temp.push(item.min + ',' + item.max);
                }else{
                    params = false;
                    return;
                }
            })
            if(params){
                $scope.editItem.CapRange = temp.join(';')
                $('#popover').css({
                    display: 'none',
                })
            }else{
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                    content : '请完整填写参数'
                };
                $scope.$emit("setModalState",modalData);
            }
        }

        $scope.deletePopItem = function(index) {
            if($scope.popData.length > 1){
                $scope.popData.splice(index, 1);
            }
        }

        $scope.addPopItem = function() {
            $scope.popData.push({
                min: null,
                max: null,
            });
        }

        $scope.getDatas = function () {
            if ($scope.viewMode === '02' || $scope.viewMode === '00' ) {
                var reqObj = {
                    'mode': '00',
                    'orderId': localStorageService.get('orderId'),
                }
                console.log(reqObj)
                tradeMallService.save({detail:"marketi/list_new/"},reqObj,function(resp){
                    console.log(resp)
                    $scope.cartDictsDatas = resp.data;
                    arr = $scope.cartDictsDatas
                    // for(var i = 0;i<arr.list.length;i++){
                    //     console.log(arr.list)
                    //     if(i!==arr.list[i].list.length-1){
                    //         console.log(arr.list[i].list[arr.list[i].list.length-1])
                    //          arr.list[i].list[arr.list[i].list.length-1].opt = false;
                    //     }                          
                    //     for(var j = 0;j<arr.list[i].list.length-1;j++){
                    //         arr.list[i].list[j].opt = true;
                    //     }
                        
                    // }
                    // for(var i = 0;i<arr.list.length;i++){
                    //     for(var j = 0;j < arr.list[i].list.length;j++){
                    //         arr.list[i].list[j].note = "";
                    //     }
                    // }
                    $scope.periodType = $scope.cartDictsDatas.periodType;
                    $scope.selectedConnObjNo = [];
                    $scope.cartDictsDatas.list.forEach(function(item){
                        item.list.forEach(function(i){
                            $scope.selectedConnObjNo.push(i.connObjNo);
                        })
                    })
                    
                });
            }else{
                var reqObj = {
                    'prdtType': prdtType,
                    'connObjNoList': $scope.selectedConnObjNo.toString(),
                    'mode':$scope.viewMode || '01'
                };
                console.log(reqObj)
                tradeMallService.save({detail:"marketi/list_new/"},reqObj,function(resp){

                    $scope.cartDictsDatas = resp.data;
                     arr = $scope.cartDictsDatas
                    //  for(var i = 0;i<arr.list.length;i++){
                    //      for(var j = 0;j < arr.list[i].list.length;j++){
                    //          arr.list[i].list[j].note = "";
                    //      }
                    //  }
                });
            }      
        };
        $scope.getDatas();

        $scope.connObjNoList = [];

        // commitFlag: 01 保存, 02 提交
        $scope.confirmOrder = function (commitFlag) {
            $scope.connObjNoList = [];
            var paraList = [], obj = {}, orderList = [], selectRangeList = [], selectRangeStr = '', priceTypeList = [];
            for (var i = 0; i <= $scope.cartDictsDatas.list.length - 1; i++) {
                var aa = $scope.cartDictsDatas.list[i];
                for (var j = 0; j <= aa.list.length - 1; j++) {
                    priceTypeList.push(aa.list[j].price);
                    for (var k = 0; k <= aa.list[j].Paralist.length - 1; k ++) {
                        if (!!aa.list[j].Paralist[k] && aa.list[j].Paralist[k].type === '02') {
                            var rangelist = aa.list[j].Paralist[k].range;
                            selectRangeList = [], selectRangeStr = '';
                            for (var m = 0; m < rangelist.length; m++) {
                                if (rangelist[m].value) {selectRangeList.push(rangelist[m].name);}
                            }
                            selectRangeStr = selectRangeList.join(',');
                            aa.list[j].Paralist[k].range = selectRangeStr;
                        }else if(!!aa.list[j].Paralist[k] && aa.list[j].Paralist[k].type === '01') {
                            aa.list[j].Paralist[k].range = aa.list[j].Paralist[k].CapRange;
                        }
                    }
                    console.log(aa.list[j].Paralist)
                    // paraList.push(aa.list[j].Paralist);
                    obj = {
                        'connObjNo':aa.list[j].connObjNo,
                        'connObjId':aa.list[j].connObjId,
                        'paralist': JSON.stringify(aa.list[j].Paralist),
                        'busiId':aa.list[j].busiId,
                        'note':aa.list[j].note
                    }
                    orderList.push(obj);
                }     
            }
            $scope.temp = true;
            function unique(arr){
                   
                　　var newArr = [arr[0].busiId];
                    var newNo = [arr[0].connObjNo]
                    
               　　 for(var i=1;i<arr.length;i++){
                　　　　if(newArr.indexOf(arr[i].busiId) == -1 || newNo.indexOf(arr[i].connObjNo)){
                        　　 newArr.push(arr[i].busiId); 
                        　　 newArr.push(arr[i].connObjNo); 
                    　　 }else{
                        
                        $scope.modalData.content = "同一互联对象不可有相同的业务编号";
                        $scope.$emit("setModalState",$scope.modalData);
                        $scope.temp = false;
                        break;
                        }
                     }
                     for(var i=0;i<arr.length;i++){
                         if(arr[i].busiId===""){
                            $scope.modalData.content = "不可有空白的业务编号";
                            $scope.$emit("setModalState",$scope.modalData);
                            $scope.temp = false;
                            break;
                         }
                     }
                }
            if('03' === $scope.cartDictsDatas.prdtType){
                 unique(orderList);
            }

            var reqObj = {
                'commitFlag':commitFlag,
                'orderId': $scope.cartDictsDatas.orderId,
                'orderName': $scope.cartDictsDatas.orderName,
                'orderEffectTime': $scope.cartDictsDatas.orderEffectTime,
                'orderExpireTime': $scope.cartDictsDatas.orderExpireTime,
                'prdtType': $scope.cartDictsDatas.prdtType,
                'priceTypeList': priceTypeList.toString(),
                'orderList':JSON.stringify(orderList),
            }
            reqObj = angular.merge({},reqObj,{'connObjNoList': $scope.connObjNoList.toString()});
            if($scope.temp){
                tradeMallService.save({detail:"marketi/order_commit_new"},reqObj,function(resp){
                    if(resp.status === 1){
                        $rootScope.cartNum = resp.data[0];
                        localStorageService.set('cartNum', resp.data[0]);
                        $scope.cartDictsDatas = [];
                        $state.go("dls.trade.cartList");
                    } else {
                        $scope.getDatas();
                    }
                    $scope.modalData.content = resp.msg;
                    $scope.$emit("setModalState",$scope.modalData);
                });
            }
        };

        // angular.extend(dst, src);
        $scope.deleteItem = function (index,connObjNo,supMemId) {
            for (var i = 0; i <= $scope.cartDictsDatas.list.length - 1; i++) {
                var aa = $scope.cartDictsDatas.list[i];
                if (aa.supMemId === supMemId) {
                    $scope.cartDictsDatas.list[i].list.splice(index,1);

                     if($scope.cartDictsDatas.list[i].list.length==0){
                        for (var i = 0; i < $scope.selectedConnObjNo.length; i++) {
                            if ($scope.selectedConnObjNo[i] === connObjNo) {
                                $scope.selectedConnObjNo.splice(i,1);
                                $scope.selectedConnObjNo.deletItem(connObjNo);
                                localStorageService.set('selectedConnObjNo',$scope.selectedConnObjNo);
                            }
                        }
                     }                   
                }
            }

        };

        $scope.deleteConnObjInCart = function (index,connObjNo,supMemId,orderId,carIndex) {
            // $scope.selectedConnObjNo = localStorageService.get('selectedConnObjNo');
            if ($scope.viewMode === '00') {//编辑
                tradeMallService.save({detail:"marketi/connObjNo_delete/"},{
                    connObjNo:connObjNo,
                    orderId:orderId,
                    busiId:arr.list[carIndex].list[index].busiId
                },function(resp){

                        if(index !== 0){
                            // arr.list[carIndex].list[index+1].opt = "";
                            if(!arr.list[carIndex].list[index].opt){
                                arr.list[carIndex].list[index-1].opt = false;
                            }
                        }
                        $scope.deleteItem(index,connObjNo,supMemId);
                        // $scope.selectedConnObjNo.deletItem(connObjNo);
                        // localStorageService.set('selectedConnObjNo',$scope.selectedConnObjNo);
                });

            } else if ($scope.viewMode === '01') {
                if(index !== 0){
                    if(!arr.list[carIndex].list[index].opt){
                        arr.list[carIndex].list[index-1].opt = false;
                    }
                }
                $scope.deleteItem(index,connObjNo,supMemId);
            }
        };

        $scope.calcelOrder = function () {
            $state.go("dls.trade.cartList");
        };

        $("div:disabled").click(function(){
        })
        $scope.openModal = function (size, type ,index,carIndex) {
            var tplUrl = './src/templates/modalViews/' + type + '.html';
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: tplUrl,
                controller: 'DetailModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                resolve: {
                    modalDatas: function () {
                        arr.list[carIndex].ind = index;
                        return arr.list[carIndex];
                    }
                }
            });
            modalInstance.result.then(function (data) {
                arr.list[carIndex].list[index].busiId = data.busiIdList
                // arr.list[carIndex].list[index].note = data.noteList
            }, function () {
                // console.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.openModal1 = function (size, type ,index,carIndex) {
            var tplUrl = './src/templates/modalViews/' + type + '.html';
            // $scope.modalDatas = $scope.datas[index];
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: tplUrl,
                controller: 'DetailModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                resolve: {
                    modalDatas: function () {
                        return arr.list[carIndex].list[index]
                        // if(!!$scope.orderListDatas.orderList[carIndex].orderDtlInfoList){
                        //     return $scope.orderListDatas.orderList[carIndex].orderDtlInfoList[index];
                        //  }else{
                        //     return $scope.orderListDatas.orderList[carIndex].supInfoList[0].orderDtlInfoList[index];
                        //  } 
                    }
                }
            });
            modalInstance.result.then(function (datas) {
                var reqDatas = {
                    remarks: datas.remarks,
                    reqId: datas.reqId,
                    prepDays: datas.prepDays
                };
                demandService.save({
                    detail: "res/reqInfo/"
                }, reqDatas, function (resp) {
                    $scope.showMsg(resp.msg);
                    if (resp.status === 1) {
                        $scope.datas[index].responseNum += 1;
                        $scope.datas[index].respStatus = '02';
                    }
                });
            }, function () {
                // console.info('Modal dismissed at: ' + new Date());
            });
        }; 

        $scope.addTo = function(carIndex,index,item){
            var obj = JSON.parse(JSON.stringify(arr.list[carIndex].list[index]));
            console.log(67676767)
            obj.busiId = "";
            obj.note = "";
            if(obj.Paralist==true){
            }else{
                for(var i = 0;i<obj.Paralist.length;i++){
                    obj.Paralist[i].remarks=""
                    if(typeof obj.Paralist[i].range==="string"){
                        obj.Paralist[i].CapRange = ""
                    }else{
                        for(var j = 0;j<obj.Paralist[i].range.length;j++){
                            obj.Paralist[i].range[j].value = false;
                        }
                    }

                }
            };
            arr.list[carIndex].list.splice(index+1,0,obj)
            arr.list[carIndex].list[index].opt = true;
        };
    }])

    .controller("tradeOrderDetailCtrl",function($rootScope,$scope,$stateParams,tradeMallService){
        $scope.orderDetailTitles = ["流通对象编号","配送任务编号","类型","互联对象名称","版本号","标签名称","标签代码","计价方式","价格（元）"];
        var odId = $stateParams.odId;
        tradeMallService.get({detail:"order/detail",orderId:odId},function(resp){
            if (!!resp.data) {
                $scope.orderDatas = resp.data;
                $scope.orderDtlInfoList = resp.data.orderDtlInfoList;
            }
        });
    })
    .controller("tradeProviderConfirmCtrl",["$scope","tradeMallService","dls_list_service",function($scope,tradeMallService,dls_list_service){
        $scope.isOrderEmpty = true;             //判断订单是否为0
        tradeMallService.save({detail:"order/supConfirmPage/"},{
        },function(backData){
            if(backData.status == 1){
                $scope.tradeProviderConfirmDatas = backData;
            }
        })

        $scope.tradeProviderConfirmGrid = dls_list_service.tradeProviderConfirmGrid;

    }])
    .controller("tradeOrderListCtrl",['$rootScope','$scope','$cookies','$state','tradeMallService', 'localStorageService', 'debounce', function($rootScope,$scope,$cookies,$state,tradeMallService,localStorageService, debounce){
        $scope.orderListDatas = "";
        $scope.orderLists = [];

        $scope.totalItems = 0;
        $scope.searchOptions = "";
        $scope.searchType = '1';
        $scope.searchText = "";
        $scope.pageOptions = {};

        $scope.role = $state.params.role;

        $scope.searchStatus = [{
            name: '全部',
            value: '00',
        }
        //    ,{
        //    name: '新生成',
        //    value: '01',
        //}
            ,{
            name: '待确认',
            value: '02',
        },{
            name: '已确认',
            value: '03',
        },{
            name: '已过期',
            value: '04',
        },{
            name: '已生效',
            value: '05',
        },{
            name: '已失效',
            value: '06',
        }
        //,{
        //    name: '已拒绝',
        //    value: '07',
        //}
        ,{
            name: '部分确认',
            value: '08',
        }];

        var  appStatus = localStorageService.get('appStatus');
        $scope.searchText = !!appStatus ? appStatus.searchText : '';
        $scope.searchType = !!appStatus ? appStatus.searchType : '1';
        $scope.searchStatusVal = !!appStatus ? appStatus.searchStatusVal : '00';
        $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;

        $scope.searchKeyup = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.curPageNum = 1;
                $scope.getDatas();
            }
        }

        $scope.getDatas = function () {
            tradeMallService.save({
                detail:"order/list/"+$scope.role,
            },{
                type : $scope.searchType,
                keywords: $scope.searchText,
                status: $scope.searchStatusVal,
                page: $scope.curPageNum,
                row: 10,
            },function(backData){
                if (backData.status === 1) {
                    $scope.orderListDatas = backData.data.list;

                    $scope.pageOptions = {
                        "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                        "per_page_num" : 10,                  //单页page的data数量
                    };
                }
            });
        }

        $scope.$watch("curPageNum",function(){
            $scope.getDatas();
        });

        $scope.$watch('searchText',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        }, 350));

        $scope.$watch(function(){
            return $scope.searchType + '-' + $scope.searchStatusVal;
        },function (newV, oldV) {
            if (newV !== oldV) {
                $scope.curPageNum = 1;
                $scope.getDatas();
            }
        });

        $scope.searchItem = function () {
            $scope.curPageNum = 1;
            $scope.getDatas();
        }

        $scope.detail = function(item){
            var appStatus = {
                'searchText': $scope.searchText,
                'searchType': $scope.searchType,
                'searchStatusVal': $scope.searchStatusVal,
                'curPageNum': $scope.curPageNum,
            };
            localStorageService.set('appStatus', appStatus);

            if($scope.role === 'dem'){
                localStorageService.set('orderId',item.orderId);
                localStorageService.set('viewMode','02'); //查看模式：00 编辑暂存  01 新生成  02 详情
                $state.go("dls.trade.cart");
            }else{
                $state.go("dls.trade.orderDetail",{orderId:item.orderId, role:'sup'});
            }
        }

        $scope.edit = function(item){
            console.log(item)
            localStorageService.set('orderId',item.orderId);
            localStorageService.set('selectedConnObjNo');
            localStorageService.set('viewMode','00'); //查看模式：00 编辑暂存  01 新生成  02 详情
            $state.go("dls.trade.cart");
        }
    }])
    .controller("orderListDetailCtrl", ["$scope", "$state", "tradeMallService", "selectOptions",'$uibModal', function($scope, $state, tradeMallService, selectOptions,$uibModal){
        var orderId = $state.params.orderId;
        $scope.role = $state.params.role;

        if($scope.role === 'dem'){
            var url = 'detailInfoDem'
        }else if($scope.role === 'sup'){
            var url = 'detailInfoSup'
        }

        $scope.getDatas = function () {
            tradeMallService.save({
                detail:"order/"+url+"/",
            },{
                orderId : orderId,
            },function(backData){
                if (backData.status === 1) {
                    $scope.orderListDatas = backData.data;
                }
            });
        }

        $scope.openModal = function (size, type ,index) {
            console.log(index)
            var tplUrl = './src/templates/modalViews/' + type + '.html';
            // $scope.modalDatas = $scope.datas[index];
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: tplUrl,
                controller: 'DetailModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                resolve: {
                    modalDatas: function () {
                        return $scope.orderListDatas.orderDtlInfoList[index]
                        
                    }
                }
            });
            modalInstance.result.then(function (datas) {
                var reqDatas = {
                    remarks: datas.remarks,
                    reqId: datas.reqId,
                    prepDays: datas.prepDays
                };
                demandService.save({
                    detail: "res/reqInfo/"
                }, reqDatas, function (resp) {
                    $scope.showMsg(resp.msg);
                    if (resp.status === 1) {
                        $scope.datas[index].responseNum += 1;
                        $scope.datas[index].respStatus = '02';
                    }
                });
            }, function () {
                // console.info('Modal dismissed at: ' + new Date());
            });
        }; 

        $scope.selectOptions = selectOptions;

        $scope.getDatas();
    }])
    .controller("orderConfirmCtrl", ["$scope", "$state", "selectOptions", "tradeMallService",'$uibModal',function($scope, $state, selectOptions, tradeMallService,$uibModal) {
        $scope.role = $state.params.data;
        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };
        if($scope.role === 'dem') {
            $scope.orderType = "需方确认";
            var url = 'confirmPageDem';
            var confirm_url = 'confirmDem';
        }else{
            $scope.orderType = "供方确认";
            var url = 'confirmPageSup';
            var confirm_url = 'confirmSup';
        }

        $scope.selectOptions = selectOptions;

        $scope.getDatas = function () {
            tradeMallService.get({
                detail:"order/"+url+"/",
            },function(backData){
                if (backData.status === 1) {
                    $scope.orderListDatas = backData.data;
                    console.log($scope.orderListDatas)
                }
            });
        }

        $scope.getDatas();

        $scope.confirmOrder = function(orderId) {
            tradeMallService.save({
                detail:"order/"+confirm_url+"/",
            },{
                orderId: orderId,
                type: 'agree',
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                };
                modalData.content = backData.msg;
                $scope.$emit("setModalState",modalData);
                $scope.getDatas();
            });
        }

        $scope.cancelOrder = function(orderId) {
            tradeMallService.save({
                detail:"order/"+confirm_url+"/",
            },{
                orderId: orderId,
                type: 'cancel',
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                };
                modalData.content = backData.msg;
                $scope.$emit("setModalState",modalData);
                $scope.getDatas();
            });
        }

        $scope.agree = function(item, list) {
            var checkNum = /^(\+\d+|\d+|\-\d+|\d+\.\d+|\+\d+\.\d+|\-\d+\.\d+)$/;
            var flag = true;

            if(list.baseAmount !== '' && list.ceilingAmount !== '') {
                if(!checkNum.test(list.baseAmount) || !checkNum.test(list.ceilingAmount)){
                    modalData.content = '金额必须为数字！';
                    $scope.$emit("setModalState",modalData);
                    flag = false;
                    return;
                }

                list.baseAmount = Number(list.baseAmount);
                list.ceilingAmount = Number(list.ceilingAmount);

                if(list.baseAmount < 0 || list.ceilingAmount < 0) {
                    modalData.content = '金额不能为负数！';
                    $scope.$emit("setModalState",modalData);
                    flag = false;
                    return
                }

                if(list.baseAmount > list.ceilingAmount) {
                    modalData.content = '保底金额不应大于封底金额！';
                    $scope.$emit("setModalState",modalData);
                    flag = false;
                    return
                }
            } else if(list.baseAmount !== '' || list.ceilingAmount !== ''){
                if(list.baseAmount === '') {
                    flag = checkNum.test(list.ceilingAmount);
                    if(!flag) {
                        modalData.content = '金额必须为数字！';
                        $scope.$emit("setModalState",modalData);
                        return
                    }
                }
                if(list.ceilingAmount === '') {
                    flag = checkNum.test(list.baseAmount);
                    if(!flag) {
                        modalData.content = '金额必须为数字！';
                        $scope.$emit("setModalState",modalData);
                        return
                    }
                }
            }

            if(flag && item.priceType) {
                tradeMallService.save({
                    detail:"order/"+confirm_url+"/",
                },{
                    taskId: item.taskId,
                    type: 'agree',
                    discount: item.discount,
                    priceType: item.priceType,
                    priceModel: list.priceModel,
                    baseAmount: list.baseAmount,
                    ceilingAmount: list.ceilingAmount,
                },function(backData){
                    var modalData = {
                        templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                    };
                    modalData.content = backData.msg;
                    $scope.$emit("setModalState",modalData);
                    $scope.getDatas();
                });
            }else{
                modalData.content = '请填写价格类型！';
                $scope.$emit("setModalState",modalData);
            }
        }

        $scope.reject = function(item, list) {
            tradeMallService.save({
                detail:"order/"+confirm_url+"/",
            },{
                taskId: item.taskId,
                type: 'reject',
                discount: item.discount,
                priceModel: list.priceModel,
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                };
                modalData.content = backData.msg;
                $scope.$emit("setModalState",modalData);
                $scope.getDatas();
            });
        }

        $scope.checkNum = function(e,item){
            var numReg = new RegExp(/^100$|^(\d|[1-9]\d)(\.\d+)*$/);
            var num = $(e.target).val();
            item.numRight = !numReg.test(num)
        }
        $scope.openModal = function (size, type ,index,carIndex) {
            var tplUrl = './src/templates/modalViews/' + type + '.html';
            // $scope.modalDatas = $scope.datas[index];
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: tplUrl,
                controller: 'DetailModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                resolve: {
                    modalDatas: function () {
                         if(!!$scope.orderListDatas.orderList[carIndex].orderDtlInfoList){
                            return $scope.orderListDatas.orderList[carIndex].orderDtlInfoList[index];
                         }else{
                            return $scope.orderListDatas.orderList[carIndex].supInfoList[0].orderDtlInfoList[index];
                         }
                        
                    }
                }
            });
            modalInstance.result.then(function (datas) {
                var reqDatas = {
                    remarks: datas.remarks,
                    reqId: datas.reqId,
                    prepDays: datas.prepDays
                };
                demandService.save({
                    detail: "res/reqInfo/"
                }, reqDatas, function (resp) {
                    $scope.showMsg(resp.msg);
                    if (resp.status === 1) {
                        $scope.datas[index].responseNum += 1;
                        $scope.datas[index].respStatus = '02';
                    }
                });
            }, function () {
                // console.info('Modal dismissed at: ' + new Date());
            });
        }; 
    }])
;