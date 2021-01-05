'use strict';

angular.module('myApp.providerControllers', [
    'myApp.services',
    'ui.grid',
    'dls.services.util'
])
    .controller("providerItemManagerCtrl",function($rootScope,$scope,$state,dls_list_service,i18nService,tradeMallService,providerService,transferData,$http,Excel,$timeout,localStorageService){
        $scope.selectedNode = {
            id : ""
        };
        // $scope.trade_label_type_btn_datas = {};
        var  appStatus = localStorageService.get('appStatus');
        $scope.selectData = !!appStatus ? appStatus.selectData : 'CAP';
        $scope.selectState = !!appStatus ? appStatus.selectState : "全部";
        $scope.selectStateNum = !!appStatus ? appStatus.status : '';

        $scope.selectedCapDatas = []; //多行选择

        $scope.getItemsDatas = function(){}; //获取数据
        // $scope.trade_label_type_btn_datas = $rootScope.trade_label_type_btn_datas;

        $scope.pushItems = function(){
            $scope.selectedCapDatas = []; //多行选择

            $("input[name='selectCAPs']:checked").each(function(){
                $scope.selectedCapDatas.push($(this).val())
            })

            providerService.save({
                detail:'trade/updateStatus/',
            },{
                type:'carriage',
                value:$scope.selectedCapDatas,
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                    content : backData.msg
                };
                $scope.$emit("setModalState",modalData);
                $scope.selectedCapDatas = $scope.selectedCapDatas.unique();
                if(backData.status == 1){
                    $scope.$broadcast("bulk-operation");
                    $scope.selectedCapDatas = [];
                }
            })
        }

        $scope.pullItems = function(){
            $scope.selectedCapDatas = []; //多行选择

            $("input[name='selectCAPs']:checked").each(function(){
                $scope.selectedCapDatas.push($(this).val())
            })

            providerService.save({
                detail:'trade/update/',
            },{
                type:'undercarriage',
                value:$scope.selectedCapDatas,
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                    content : backData.msg
                };
                $scope.$emit("setModalState",modalData);
                $scope.selectedCapDatas = $scope.selectedCapDatas.unique();
                if(backData.status == 1){
                    $scope.$broadcast("bulk-operation");
                    $scope.selectedCapDatas = [];
                }
            })
        }

        $scope.pullCrps = function(){
            $scope.selectedCapDatas = []; //多行选择

            $("input[name='selectCAPs']:checked").each(function(){
                $scope.selectedCapDatas.push($(this).val())
            })

            providerService.save({
                detail:'trade/batch_underCarriage/',
            },{
                type:'undercarriage',
                connObjNo:$scope.selectedCapDatas.join(),
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                    content : backData.msg
                };
                $scope.$emit("setModalState",modalData);
                $scope.selectedCapDatas = $scope.selectedCapDatas.unique();
                if(backData.status == 1){
                    $scope.$broadcast("bulk-operation");
                    $scope.selectedCapDatas = [];
                }
            })
        }

        $scope.pushAudit = function(){
            $scope.selectedCrpDatas = []; //多行选择

            $("input[name='selectCAPs']:checked").each(function(){
                $scope.selectedCrpDatas.push($(this).val())
            })

            providerService.save({
                detail : "trade/submit_review/"
            },{
                connObjNo: $scope.selectedCrpDatas.join(),
            },function(backData){
                if(backData.status == 1){
                    $scope.$broadcast("bulk-operation");
                    $scope.selectedCrpDatas = [];
                }
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                };
                modalData.content = backData.msg;
                $scope.$emit("setModalState",modalData);
            })
        }

        $scope.$on('textChange', function(e, data) {
            $scope.searchFullText = data.text;
        })

        $rootScope.$on('setCrp', function(){
            $scope.selectData = 'CRP';
        });

        $scope.treeOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode"
            }
        };

        $scope.trade_type_btn_datas = dls_list_service.trade_type_btn_datas;

        $scope.dataSelect = function(value){
            $scope.selectData = value;
        };

        i18nService.setCurrentLang("zh-cn");
        $scope.setState = function(state){
            switch(state){
                case 'all' : {$scope.selectState = "全部";$scope.selectStateNum = ""}break;
                case 'to-be-added' : {$scope.selectState = "待上架";$scope.selectStateNum = 1}break;
                case 'have-been-added' : {$scope.selectState = "已上架";$scope.selectStateNum = 2} break;
                case 'have-been-undercarriaged' : {$scope.selectState = "已下架";$scope.selectStateNum = 3} break;
                case 'expired' : {$scope.selectState = "已失效";$scope.selectStateNum = 4} break;
                case 'deleted' : {$scope.selectState = "已删除";$scope.selectStateNum = -1} break;
            }
        };
    })
    .controller("providerItemMItemCtrl",["$scope","$rootScope","providerService","$timeout","dls_list_service","$state","localStorageService", function($scope,$rootScope,providerService,$timeout,dls_list_service,$state,localStorageService){
        $scope.curPage = 1;
        $scope.pageOptions = {};
        $scope.itemGridOptions = dls_list_service.providerItemGrid;

        var  appStatus = localStorageService.get('appStatus');
        $scope.searchText = !!appStatus ? appStatus.searchText : '';
        $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;

        $scope.$watch("selectData",function(){
            if($scope.selectData === 'CAP'){
                $scope.getItemsDatas = function(){
                    var perPageNum = 10;
                    providerService.save({
                        detail : "trade/capList/"
                    },{
                        text:$scope.searchText,
                        pcode:$scope.selectedNode.id,
                        status:$scope.selectStateNum,
                        page:$scope.curPage,
                        rows:perPageNum,
                    },function(backData){
                        if(backData.status == 1){
                            $scope.itemDatas = backData.data.list;
                            console.log($scope.itemDatas)
                            $scope.showitemData = ($scope.itemDatas.length == 0)?false:true;
                            $scope.pageOptions = {
                                "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                                "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                                "per_page_num" : perPageNum                          //单页page的data数量
                            };
                        }
                    })
                }

                $scope.detail = function(data){
                    var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=view?prdtType=cap";
                    var appStatus = {
                        'searchText': $scope.searchText,
                        'pcode': $scope.selectedNode.id,
                        'status': $scope.selectStateNum,
                        'page': $scope.curPage,
                        'selectState': $scope.selectState,
                        'selectData': $scope.selectData,
                    };
                    localStorageService.set('appStatus', appStatus);

                    $state.go("dls.provider.createItem",{data:data});
                }

                $scope.pushData = function(data){
                    if(data.price && data.valuationCountCd && data.valuationModeCd){
                        providerService.save({
                            detail:'trade/updateStatus/',
                        },{
                            type:'carriage',
                            value:[data.id],
                        },function(backData){
                            var modalData = {
                                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                                content : backData.msg
                            };
                            $scope.$emit("setModalState",modalData);
                            if(backData.status == 1){
                                $scope.getItemsDatas($scope.curPage,$scope.selectedNode.id,$scope.selectStateNum,$scope.searchFullText);
                            }
                        })
                    }else{
                        alert("请填写价格相关内容后再上架！")
                    }

                }

                $scope.editData = function(data){
                    var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=edit?prdtType=cap";
                    $state.go("dls.provider.createItem",{data:data});
                }

                $scope.pullData = function(data){
                    providerService.save({
                        detail:'trade/update/',
                    },{
                        type:'undercarriage',
                        value:[data.id],
                    },function(backData){
                        var modalData = {
                            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                            content : backData.msg
                        };
                        $scope.$emit("setModalState",modalData);
                        if(backData.status == 1){
                            $scope.getItemsDatas($scope.curPage,$scope.selectedNode.id,$scope.selectStateNum,$scope.searchFullText);
                        }
                    })
                }

                $scope.invalidData = function(data){
                    providerService.save({
                        detail:'trade/update/',
                    },{
                        type:'diseffect',
                        value:[data.id],
                    },function(backData){
                        var modalData = {
                            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                            content : backData.msg
                        };
                        $scope.$emit("setModalState",modalData);
                        if(backData.status == 1){
                            $scope.getItemsDatas($scope.curPage,$scope.selectedNode.id,$scope.selectStateNum,$scope.searchFullText);
                        }
                    })
                }

                $scope.deleteData = function(data){
                    providerService.save({
                        detail:'trade/update/',
                    },{
                        type:'delete',
                        value:[data.id],
                    },function(backData){
                        if(backData.status == 1){
                            $scope.getItemsDatas($scope.curPage,$scope.selectedNode.id,$scope.selectStateNum,$scope.searchFullText);
                        }
                        var modalData = {
                            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                            content : backData.msg
                        };
                        $scope.$emit("setModalState",modalData);
                    })
                }

                $scope.searchItem = function(e){
                    var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    if (keycode == 13) {
                        $scope.searchFullText = $scope.searchText;
                        $scope.curPage = 1;
                        $scope.getItemsDatas($scope.curPage,$scope.selectedNode.id,$scope.selectStateNum,$scope.searchFullText);
                    }
                }

                $scope.editPrice = function(data){
                    data.isSelected = !data.isSelected;
                }

                $scope.surePrice = function($event, data){
                    var price = $($($event.target).parents('tr').find('.price')).val();
                    var priceUnit = $($($event.target).parents('tr').find('.selection1')).val();
                    var priceCountUnit = $($($event.target).parents('tr').find('.selection2')).val();
                    var priceReg = new RegExp(/^\d+(\.\d+)?$/);
                    if(priceReg.test(price)){
                        providerService.save({
                            detail : "trade/priceSave/"
                        },{
                            valuationModeCd: priceUnit,
                            valuationCountCd: priceCountUnit,
                            price: price,
                            connObjNo: data.connObjNo,
                        },function(backData){
                            if(backData.status == 1){
                                $scope.getItemsDatas();
                            };
                        })
                    }else{
                        alert("请填写正确的数字！")
                    }

                }
            }else{
                $scope.getItemsDatas = function(){
                    var perPageNum = 10;
                    providerService.save({
                        detail : "trade/crpList/"
                    },{
                        text:$scope.searchText,
                        pcode:$scope.selectedNode.id,
                        status:$scope.selectStateNum,
                        page:$scope.curPage,
                        rows:perPageNum,
                    },function(backData){
                        if(backData.status == 1){
                            $scope.itemDatas = backData.data.list;
                            $scope.showitemData = ($scope.itemDatas.length == 0)?false:true;
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
                        $scope.curPage = 1;
                        $scope.getItemsDatas();
                    }
                }

                $scope.auditData = function(data){
                    if(data.price && data.valuationModeCd && data.valuationCountCd){
                        providerService.save({
                            detail : "trade/submit_review/"
                        },{
                            connObjNo: data.connObjNo,
                        },function(backData){
                            if(backData.status == 1){
                                var modalData = {
                                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                                };
                                modalData.content = "操作成功！";
                                $scope.$emit("setModalState",modalData);
                                $scope.getItemsDatas();
                            }else{
                                var modalData = {
                                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                                };
                                modalData.content = backData.msg;
                                $scope.$emit("setModalState",modalData);
                            }
                        })
                    }else{
                        var modalData = {
                            templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                        };
                        modalData.content = "请填写价格相关的内容！";
                        $scope.$emit("setModalState",modalData);
                        $scope.getItemsDatas();
                    }
                }

                $scope.editData = function(data){
                    var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=edit?prdtType=crp";
                    $state.go("dls.provider.createItem",{data:data});
                }

                $scope.detail = function(data){
                    var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=view?prdtType=crp";
                    var appStatus = {
                        'searchText': $scope.searchText,
                        'pcode': $scope.selectedNode.id,
                        'status': $scope.selectStateNum,
                        'page': $scope.curPage,
                        'selectState': $scope.selectState,
                        'selectData': $scope.selectData,
                    };
                    console.log(appStatus)
                    localStorageService.set('appStatus', appStatus);
                    $state.go("dls.provider.createItem",{data:data});
                }

                $scope.surePrice = function($event, data){
                    var price = $($($event.target).parents('tr').find('.price')).val();
                    var priceUnit = $($($event.target).parents('tr').find('.selection1')).val();
                    var priceCountUnit = $($($event.target).parents('tr').find('.selection2')).val();
                    providerService.save({
                        detail : "trade/priceSave/"
                    },{
                        valuationModeCd: priceUnit,
                        valuationCountCd: priceCountUnit,
                        price: price,
                        connObjNo: data.connObjNo,
                    },function(backData){
                        if(backData.status == 1){
                            $scope.getItemsDatas();
                        };
                    })
                }

                $scope.pullData = function(data){
                    providerService.save({
                        detail:'trade/batch_underCarriage/',
                    },{
                        type:'undercarriage',
                        connObjNo:data.connObjNo,
                    },function(backData){
                        var modalData = {
                            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                            content : backData.msg
                        };
                        $scope.$emit("setModalState",modalData);
                        if(backData.status == 1){
                            $scope.getItemsDatas();
                        }
                    })
                }
            }
            $scope.getItemsDatas();

        })
        $scope.$on("bulk-operation",function(){
            $scope.getItemsDatas();
        });

        $scope.$watch(function(){
            return $scope.curPage;
        },function(newV, oldV){
            if(newV !== oldV) {
                $scope.getItemsDatas();
            }
        },true)

        $scope.$watch(function(){
            return $scope.selectedNode.id +"/"+ $scope.selectStateNum;
        },function(newV, oldV){
            if(newV !== oldV) {
                $scope.curPage = 1;
                $scope.getItemsDatas();
            }
        },true)

        $scope.$watch(function(){
            return $scope.searchText;
        },function(newV, oldV){
            if(newV !== oldV) {
                $scope.curPage = 1;
                $scope.getItemsDatas();
                $scope.$emit('textChange', {text: $scope.searchText})
            }
        },true)
    }])
    .controller("providerCreateItemCtrl",["$scope","$state","$rootScope","$timeout","providerService","tradeMallService","$compile","fileUpload",function($scope,$state,$rootScope,$timeout,providerService,tradeMallService,$compile,fileUpload){
        $scope.lblMorph = 'int'
        $scope.dataType = [{
            name: '整数',
            value: 'int',
        },{
            name: '浮点数',
            value: 'float',
        },{
            name: '日期时间',
            value: 'date',
        },{
            name: '字串',
            value: 'string',
        },{
            name: '二进制(Binary)',
            value: 'binary',
        }]
        $scope.lblScale = '01'
        $scope.dataScale = [{
            name: '名义',
            value: '01',
        },{
            name: '有序',
            value: '02',
        },{
            name: '计量',
            value: '03',
        }]
        $scope.setLabelType = function(type){
            $scope.selectLabelValue = type;
            switch(type) {
                case '00' : $scope.selectlabelText = "全部";break;
                case '02' : $scope.selectlabelText = "征信类产品";break;
                case '03' : $scope.selectlabelText = "营销类产品";break;
            }
        }
        $scope.selectLabelValue = '00';
        $scope.selectlabelText = "全部";
        $scope.pageOptions = {}
        $scope.selectedNode = {id : "KY08"};
        $scope.selectedIdAttr = [] , $scope.selectedDataOrigin = [] , $scope.selectedApplyScene = [] , $scope.map1Selected = [] , $scope.applicationIndustrySelSelected = [];

        $scope.setEvaluationType = function(type){
            $scope.searchFullText = type;
            switch(type) {
                case '1' : $scope.selectEvaluationText = "单值列表";break;
                case '2' : $scope.selectEvaluationText = "多值列表";break;
                case '3' : $scope.selectEvaluationText = "分段";break;
                case '4' : $scope.selectEvaluationText = "命中";break;
                case '5' : $scope.selectEvaluationText = "数据项";break;
            }
        }

        $scope.addItem = function(item) {
            item.arr.push({
                min: null,
                max: null,
            })
        }

        $scope.removeItem = function(item, index) {
            item.arr.splice(index, 1);
        }

        $scope.searchItem = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.curPage = 1;
                $scope.searchFullText = $scope.searchText
                $scope.getLabelDatas($scope.selectLabelValue,$scope.searchFullText,$scope.selectedNode.id,$scope.curPage,10);
            }
        }

        $scope.getLabelDatas = function(type,cont,pcode,page,rows) {
            providerService.save({
                detail: "trade/tagItem/"
            }, {
                type:type,
                cont:cont,
                pcode:pcode,
                page:page,
                rows:rows,
            }, function (backData) {
                if (backData.status == 1) {
                    $scope.labelDatas = backData.data.list
                    $scope.totalItems =
                        $scope.pageOptions = {
                            "total_items_num": backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num": backData.data.page.total_pages,   //总共的page数量
                            "per_page_num": 10                  //单页page的data数量
                        };
                }
            })
        }

        $scope.$watch(function () {
            return $scope.curPage + "/" + $scope.selectedNode.id +"/"+ $scope.selectLabelValue +"/"+ $scope.searchFullText;
        }, function (newV) {
            $scope.getLabelDatas($scope.selectLabelValue,$scope.searchFullText,$scope.selectedNode.id,$scope.curPage,10);
        }, true)

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
        }
        $scope.coverAreaSumIsRight = true;
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
        $scope.dataOriginOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedDataOrigin);
            }
        };
        $scope.applySceneOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedApplyScene);
            }
        };
        $scope.applicationIndustrySelOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.applicationIndustrySelSelected);
            }
        };
        $scope.create_options = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedArea);
                for(var i=0; i<$scope.selectedArea.length; i++) {
                    if($scope.selectedArea[i].id === '000000') {
                        $scope.selectedArea = [$scope.selectedArea[i]];
                    }
                }
            }
        };
        $scope.timeLabel = [{label:'日',value:'01'},{label:'周',value:'02'},{label:'月',value:'03'},{label:'年',value:'04'},{label:'小时',value:'05'},{label:'分钟',value:'06'}]

        $scope.goBack = function(index){
            $scope.step = index;
            $($(".create-item .breadcrumb li")[index]).removeClass("active");
            $($(".create-item .breadcrumb li")[index-1]).removeClass("visited").addClass("active");
            if(index == 6){
                $scope.showAll = false;
                $scope.idAttrOptions.addBtn = true;
                $scope.dataOriginOptions.addBtn = true;
                $scope.applySceneOptions.addBtn = true;
                $scope.create_options.addBtn = true;
                $scope.create_options.disabled = false;
                $scope.selectDisabled = false;
            }
        }

        $scope.cancelCreate = function(){
            history.back()
        }

        var cap = function(){
            $scope.addSelection1 = function(){
                $scope.selection_1.push({
                    value1: "",
                    value2: "",
                    value3: "",
                })
            }
            $scope.goToStep3 = function(){
                $scope.createFullData.multi_selid = "";
                $scope.createFullData.tagName = $scope.tagName;
                if($scope.selectedIdAttr){
                    var arr = [];
                    $scope.selectedIdAttr.forEach(function(item){
                        arr.push(item.id)
                    })
                    $scope.createFullData.multi_selid = arr.join();
                }
                if($scope.selectedIdAttr.length !== 0){
                    $scope.step = 3;
                    $($(".create-item .breadcrumb li")[1]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[2]).addClass("active");
                }
            }
            $scope.goToStep4 = function(){
                if($scope.prdtDesc){
                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        'limitDesc': $scope.prdtDesc,
                    })
                    $scope.step = 4;
                    $($(".create-item .breadcrumb li")[2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[3]).addClass("active");
                }
            }
            $scope.goToStep5 = function(){
                if($scope.createItemForm_step4.valuestr.$valid){
                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        'value_set': $scope.valueStr,
                        lblMorph:$scope.lblMorph,
                        lblScale:$scope.lblScale
                    })

                    $scope.step = 5;

                    $($(".create-item .breadcrumb li")[3]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[4]).addClass("active");

                    $scope.showOptions = false;
                    $scope.removeDataOrigin = function(index){
                        $scope.selectedDataOrigin.splice(index,1)
                    };
                    $scope.removeApplyScene = function(index){
                        $scope.selectedApplyScene.splice(index,1)
                    };
                    $scope.removeSelectedArea = function(index){
                        $scope.selectedArea.splice(index,1);
                    }

                    $scope.uploadFile = function(item, e){
                        var uploadUrl = "../../api/sup/trade/fileSave/";
                        $(e.target).parents('form').ajaxSubmit({
                            type: "POST",
                            url: uploadUrl,
                            data: {
                                connObjNo:$scope.fullData.connObjNo,
                                name:item.name,
                                type: 3,
                            },
                            success:function(msg){
                                msg = JSON.parse(msg);
                                $scope.$apply(function(){
                                    $scope.paramsFile = msg.data.range;
                                    item.setValue = msg.data.range;
                                })
                            }
                        })
                    }
                }
            }
            $scope.goToStep6 = function(){
                var NumReg = new RegExp(/^\d+$/);
                if($scope.coverAreaSum){
                    $scope.coverAreaSumIsRight = NumReg.test($scope.coverAreaSum);
                }else{
                    $scope.coverAreaSumIsRight = true;
                }

                var paramter_str = [];
                $scope.param_flag = false;
                if($scope.paramter_str) {
                    $scope.paramter_str.forEach(function(item, index) {
                        if (item.type === '01') {
                            var arr = [];
                            item.arr.forEach(function(i){
                                if((!!i.min || i.min == 0) && (!!i.max || i.max == 0)){
                                    var temp = i.min +','+ i.max;
                                    arr.push(temp);
                                }else{
                                    $scope.param_flag = true;
                                }
                            })

                            item.setValue = arr.join(';');

                            paramter_str.push(item);

                        }else if (item.type === '02') {
                            var ids = [];
                            $("input[name=checkbox_"+ item.id +"]:checked").each(function(){
                                ids.push($(this).val());
                            })

                            if(!$scope.param_flag){
                                if($("input[name=checkbox_"+ item.id +"]:checked").length === 0){
                                    $scope.param_flag = true;
                                }else{
                                    $scope.param_flag = false;
                                }
                            }
                            item.setValue = ids.join();
                            paramter_str.push(item);
                        }else if(item.type === '03'){
                            if($scope.paramsFile){
                                item.setValue = $scope.paramsFile;
                            }
                            if(!$scope.param_flag) {
                                if(!item.setValue){
                                    $scope.param_flag = true;
                                }else{
                                    $scope.param_flag = false;
                                }
                            }
                            paramter_str.push(item);
                        }
                    })
                }

                if($scope.param_flag) {
                    var modalData = {
                        templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                        content : '请正确填写参数相关内容'
                    };
                    $scope.$emit("setModalState",modalData);
                }

                if(!$scope.param_flag && $scope.selectedApplyScene.length != 0 && $scope.selectedDataOrigin.length != 0 && $scope.coverAreaSumIsRight){
                    $scope.step = 6;
                    var qltEvlStatus = $("input[name='capEvaluation']:checked").val();

                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        "cover-total": $scope.coverAreaSum,
                        "qltEvlStatus" : qltEvlStatus,
                        "para_sel_str" : angular.toJson(paramter_str),
                    })

                    var selectedAreaArr = [];
                    for(var i=0; i<$scope.selectedArea.length;i++){
                        selectedAreaArr.push($scope.selectedArea[i].id);
                    }
                    $scope.createFullData.multiSelgeo = selectedAreaArr.join();

                    if($scope.selectedDataOrigin){
                        $scope.createFullData.multiSelcertify = "";
                        var arr = [];
                        for(var i=0; i<$scope.selectedDataOrigin.length; i++){
                            arr.push($scope.selectedDataOrigin[i].id);
                        }

                        $scope.createFullData.multiSelcertify = arr.join();
                    }

                    if($scope.selectedApplyScene){
                        $scope.createFullData.multi_selscene_limit = "";

                        var arr = [];
                        for(var i=0; i<$scope.selectedApplyScene.length; i++){
                            arr.push($scope.selectedApplyScene[i].id);
                        }
                        $scope.createFullData.multi_selscene_limit = arr.join();

                    }

                    var select2 = [];

                    for(var i=0; i<$("input[name='selection_2']").length; i++){
                        var target = $("input[name='selection_2']")[i];
                        if(target.checked){
                            select2.push($(target).val())
                        }
                    }

                    $($(".create-item .breadcrumb li")[4]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[5]).addClass("active");
                }
                console.log($scope.createFullData)
            }
            $scope.goToStep7 = function(){
                if($scope.createItemForm_step6.datastay.$valid && $scope.createItemForm_step6.freqloop.$valid){
                    $scope.step = 7;
                    $scope.createFullData = angular.extend({},$scope.createFullData,{
                        "freqLoop":$scope.freqLoop,
                        "dataStay":$scope.dataStay,
                        "freqLoopUnit" : $scope.freqLoopUnitVal,
                        "dataStayUnit" : $scope.dataStayUnitVal,
                    })

                    $scope.showAll = true;
                    $($(".create-item .breadcrumb li")[5]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[6]).addClass("active");

                    $scope.submitData = function(){
                        providerService.save({
                                detail: "trade/capSave/"
                            },
                            $scope.createFullData,function(backData){
                                var modalData = {
                                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                                };
                                modalData.content = backData.msg;
                                $scope.$emit("setModalState",modalData);
                                if(backData.status == '1'){
                                    history.go(-1)
                                    $scope.showAll = false;
                                }
                            })
                    }

                    $scope.idAttrOptions.addBtn = false;
                    $scope.dataOriginOptions.addBtn = false;
                    $scope.applySceneOptions.addBtn = false;
                    $scope.create_options.addBtn = false;
                    $scope.create_options.disabled = true;
                    $scope.selectDisabled = true;
                }
            }
        }

        $scope.selection_1 = [{
            label: 's',
            value: '1',
        }, {
            label: 'ms',
            value: '2',
        }]

        $scope.selection_2 = [{
            label: 's/条',
            value: '1',
        }, {
            label: 'ms/条',
            value: '2',
        }]

        var crp = function(){
            $scope.uploadAPIFile = function(){
                var uploadUrl = "../../api/sup/trade/crp/fileSave/";
                $($("form[name='uploadAPI']:visible").find("input[type='file']")).each(function(index,item){
                    var fileTypeArr = (item.files[0].name).split('.');
                    var len = fileTypeArr.length - 1;
                    var fileType = fileTypeArr[len];
                    if(fileType === 'doc' || fileType === 'docx' || fileType === 'pdf'){
                        $("form[name='uploadAPI']:visible").ajaxSubmit({
                            type: "POST",
                            url: uploadUrl,
                            data: {
                                connObjNo:$scope.fullData.connObjNo,
                            },
                            success:function(backData){
                                backData = JSON.parse(backData);
                                $scope.$apply(function(){
                                    $scope.apiFileHref = backData.data;
                                    $scope.haveApiFile = true;
                                })
                            }
                        })
                    }else{
                        alert("请上传word或pdf格式的文件！")
                    }
                })
            }
            $scope.goToStep3 = function(){
                $scope.createFullData.dataIdSel = "";
                var selectedId = [];
                if($scope.selectedEXID){
                    selectedId.push("01");
                }
                if($scope.selectedXID){
                    selectedId.push("02");
                }
                $scope.createFullData.qryIdType = selectedId.join();

                if($scope.selectedIdAttr){
                    var idsArr = [];
                    $scope.selectedIdAttr.forEach(function(item){
                        idsArr.push(item.id)
                    });
                    $scope.createFullData.dataIdSel =idsArr.join();
                }
                if($scope.selectedEXID || $scope.selectedXID){
                    $scope.step = 3;
                    $($(".create-item .breadcrumb li")[1]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[2]).addClass("active");
                }

            }
            $scope.goToStep4 = function(){
                if($scope.prdtDesc){
                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        'prdtDesc': $scope.prdtDesc,
                    })
                    $scope.step = 4;
                    $($(".create-item .breadcrumb li")[2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[3]).addClass("active");
                }
            }
            $scope.goToStep5 = function(){
                if($scope.valueStr && $scope.msgSample && $scope.errCodeList && $scope.haveApiFile){
                    $scope.step = 5;
                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        value: $scope.valueStr,
                        msgSample: $scope.msgSample,
                        errCodeList: $scope.errCodeList,
                        lblMorph:$scope.lblMorph,
                        lblScale:$scope.lblScale
                    });

                    $($(".create-item .breadcrumb li")[3]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[4]).addClass("active");



                    $scope.$watch("selectedApplyScene",function(){
                        if($scope.selectedApplyScene.length === 1){
                            $scope.applySceneOptions.addBtn = false;
                        }else{
                            $scope.applySceneOptions.addBtn = true;
                        }
                    },true)

                    $scope.removeapplicationIndustry = function(index){
                        $scope.applicationIndustrySelSelected.splice(index,1)
                    }

                    $scope.removeApplyScene = function(index){
                        $scope.selectedApplyScene.splice(index,1)
                    }

                    $timeout(function(){
                        $($("select[name='maxDelayTime']").find("option")).each(function(index, item){
                            if($(item).text() === $scope.selection_1_val){
                                $("select[name='maxDelayTime']").val($(this).attr("value"));
                            };
                        })

                        $($("select[name='concurrency']").find("option")).each(function(index, item){
                            if($(item).text() === $scope.selection_2_val){
                                $("select[name='concurrency']").val($(this).attr("value"));
                            };
                        })
                    },200)
                }
            }
            $scope.goToStep6 = function(){
                if($scope.crp_step5.maxDT.$valid && $scope.crp_step5.cc.$valid && $scope.concurrency && $scope.applicationIndustrySelSelected.length !== 0 && $scope.selectedApplyScene.length !== 0 && $scope.qltEvlStatus){
                    $scope.step = 6;
                    var qltEvlStatus = $("input[name='crpEvaluation']:checked").val();

                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        maxDelayTime: $scope.maxDelayTime + ',' + $scope.selection_1_val,
                        concurrency: $scope.concurrency + ',' + $scope.selection_2_val,
                        qltEvlStatus: qltEvlStatus,
                    })

                    if($scope.selectedApplyScene){
                        $scope.createFullData.multi_selscene_limit = ""
                        var ids = [];
                        for(var i=0; i<$scope.selectedApplyScene.length; i++){
                            ids.push($scope.selectedApplyScene[i].id);
                        }
                        $scope.createFullData.multi_selscene_limit = ids.join();
                    }

                    if($scope.applicationIndustrySelSelected){
                        $scope.createFullData.applicationIndustrySel = "";
                        var ids = [];
                        for(var i=0; i<$scope.applicationIndustrySelSelected.length; i++){
                            ids.push($scope.applicationIndustrySelSelected[i].id);
                        }
                        $scope.createFullData.applicationIndustrySel = ids.join();
                    }

                    $scope.addFeeCode = function(){
                        $scope.feeCode.push({value:""});
                    }

                    $scope.addNonFeeCode = function(){
                        $scope.nonFeeCode.push({value:""});
                    }

                    $scope.deleteFeeItem = function(i){
                        if($scope.feeCode.length > 1){
                            $scope.feeCode.splice(i,1)
                        }
                    }

                    $scope.deleteNonFeeItem = function(i){
                        if($scope.nonFeeCode.length > 1){
                            $scope.nonFeeCode.splice(i,1)
                        }
                    }

                    $($(".create-item .breadcrumb li")[4]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[5]).addClass("active");

                    }
                }
            $scope.goToStep7 = function(){
                $scope.feeCode.forEach(function(item, index){
                    if(!item.value) {
                        $scope.feeCodeIsEmpty = true;
                    }
                })

                $scope.nonFeeCode.forEach(function(item, index){
                    if(!item.value) {
                        $scope.nonFeeCodeIsEmpty = true;
                    }
                })

                if(!$scope.feeCodeIsEmpty && !$scope.nonFeeCodeIsEmpty){
                    $scope.step = 7;
                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        chargeRspList : angular.toJson($scope.feeCode),
                        freeRspList : angular.toJson($scope.nonFeeCode),
                    })

                    $scope.showAll = true;
                    $($(".create-item .breadcrumb li")[5]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[6]).addClass("active");

                    $scope.submitData = function(){
                        providerService.save({
                                detail: "trade/crpSave/"
                            },
                            $scope.createFullData,function(backData){
                                var modalData = {
                                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                                };
                                modalData.content = backData.msg;
                                $scope.$emit("setModalState",modalData);
                                if(backData.status == '1'){
                                    $rootScope.$broadcast('setCrp');
                                    history.go(-1)
                                    $scope.showAll = false;
                                }
                            })
                    }

                    $scope.idAttrOptions.addBtn = false;
                    $scope.dataOriginOptions.addBtn = false;
                    $scope.applySceneOptions.addBtn = false;
                    $scope.create_options.addBtn = false;
                    $scope.create_options.disabled = true;
                    $scope.selectDisabled = true;
                }
            }
        }

        if($state.params.data){                              // 非新建模式
            $scope.step = 2;
            console.log($state.params.data)
            var urlArr = $state.params.data.split("?");
            var data = {
                connObjId : (urlArr[0].split("="))[1],
                connObjNo : (urlArr[1].split("="))[1],
                tag_code : (urlArr[2].split("="))[1],
                type : (urlArr[3].split("="))[1],
                prdtType : (urlArr[4].split("="))[1],
            }


            $scope.showType = data.prdtType;
            var postData = {
                type : '02',
                tag_code : data.tag_code,
                connObjNo : data.connObjNo,
            };

            $scope.selection_1 = [{
                label: 's',
                value: '1',
            }, {
                label: 'ms',
                value: '2',
            }]

            $scope.selection_2 = [{
                label: 's/条',
                value: '1',
            }, {
                label: 'ms/条',
                value: '2',
            }]

            if(data.type === 'view'){                                       // 查看模式
                $timeout(function(){
                    $scope.idAttrOptions.addBtn = false;
                    $scope.dataOriginOptions.addBtn = false;
                    $scope.applySceneOptions.addBtn = false;
                    $scope.create_options.addBtn = false;
                    $scope.create_options.disabled = true;
                    $scope.selectDisabled = true;
                },200)
                $scope.isView = true;
                $scope.showAll = true;

                if(data.prdtType === 'cap'){
                    providerService.save({
                        detail : "trade/capCreate/"
                    },postData,function(backData) {
                        if (backData) {
                            $scope.fullData = backData.data;
                            $scope.idAttr_str = backData.data.dataId_str;
                            $scope.connObjId = backData.data.connObjId;
                            $scope.selectedIdAttr = backData.data.prdtIdRelList;
                            $scope.selectedDataOrigin = !backData.data.contextDict[1030]?[]:backData.data.contextDict[1030];
                            $scope.selectedApplyScene = !backData.data.contextDict[1011]?[]:backData.data.contextDict[1011];
                            $scope.valueStr = !backData.data.contextDict[1029]?"":backData.data.contextDict[1029];
                            $scope.prdtIdRelList = backData.data.prdtIdRelList;
                            $scope.dataScene_str = backData.data.dataScene_str;
                            $scope.tagName = backData.data.tagDict.tagName;
                            $scope.tagTypeName = backData.data.tagDict.tagTypeName;
                            $scope.prdtName = backData.data.prdtBaseInfo.prdtName;
                            $scope.prdtDesc = backData.data.prdtBaseInfo.prdtDesc;
                            $scope.dataOrigin_str = backData.data.dataCertify_str;
                            $scope.dataScene_str = backData.data.dataScene_str;
                            $scope.sourceIndustry = backData.data.dataIndustry_str;
                            $scope.dataArea_str = backData.data.dataArea_str;
                            $scope.freqLoop = backData.data.contextDict[1020];
                            $scope.dataStay = backData.data.contextDict[1022];
                            $scope.coverAreaSum = backData.data.contextDict[1014];
                            $scope.qltEvlStatus =backData.data.prdtBaseInfo.qltEvlStatus;
                            if(backData.data.areaNumStrList_str){
                                $scope.coverNum = backData.data.areaNumStrList_str[0]
                            }
                            $scope.selectedArea = backData.data.areaStrList_str;
                            $scope.map = backData.data.dataArea_str;
                            $scope.paramter_str = backData.data.paramter_str;
                            $scope.para_sel_str = backData.data.para_sel_str;

                            $scope.paramter_str.forEach(function(item) {
                                if (item.type === '02') {
                                    item.ranges = [];
                                    var ranges = item.range.split(',');
                                    ranges.forEach(function(i, n){
                                        item.ranges.push({
                                            name: i,
                                            id: n,
                                        })
                                    })

                                    if($scope.para_sel_str){
                                        $scope.para_sel_str.forEach(function(i){
                                            if(item.name === i.name){
                                                item.setValue = i.range;
                                                var arr = i.range.split(',');
                                                $timeout(function(){
                                                    $("input[name=checkbox_"+item.id+"]").each(function(){
                                                        if($.inArray($(this).attr('value'), arr) !== -1){
                                                            $(this).prop('checked',true);
                                                        }
                                                    })
                                                },100)

                                            }
                                        })
                                    }
                                }
                                if(item.type === '03'){
                                    if($scope.para_sel_str){
                                        $scope.para_sel_str.forEach(function(i){
                                            if(item.name === i.name){
                                                item.setValue = i.range;
                                            }
                                        })
                                    }
                                }

                                if(item.type === '01'){
                                    item.section = [];
                                    var arrayTemp = item.range.split(';');
                                    arrayTemp.forEach(function(i) {
                                        var temp1 = i.split(',')[0];
                                        var temp2 = i.split(',')[1];
                                        var temp = temp1 + ' ~ ' + temp2;
                                        item.section.push(temp);
                                    })
                                    item.section.join(';');

                                    if($scope.para_sel_str){
                                        item.arr = [];
                                        $scope.para_sel_str.forEach(function(i){
                                            if(item.name === i.name){
                                                var arr = i.range.split(';');
                                                for(var i=0; i<arr.length; i++) {
                                                    item.arr[i] = {
                                                        min: Number(arr[i].split(',')[0]),
                                                        max: Number(arr[i].split(',')[1]),
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }
                            })

                            switch (backData.data.tagDict.valueType) {
                                case 1 :
                                    $scope.valueType = "单值列表";
                                    break;
                                case 2 :
                                    $scope.valueType = "多段列表";
                                    break;
                                case 3 :
                                    $scope.valueType = "分段";
                                    break;
                                case 4 :
                                    $scope.valueType = "命中";
                                    break;
                                case 5 :
                                    $scope.valueType = "数据项";
                                    break;
                            }
                            switch (backData.data.contextDict[1019]) {
                                case '01' :
                                    $scope.freqLoopUnit = "日";
                                    $scope.freqLoopUnitVal = "01";
                                    break;
                                case '02' :
                                    $scope.freqLoopUnit = "周";
                                    $scope.freqLoopUnitVal = "02";
                                    break;
                                case '03' :
                                    $scope.freqLoopUnit = "月";
                                    $scope.freqLoopUnitVal = "03";
                                    break;
                                case '04' :
                                    $scope.freqLoopUnit = "年";
                                    $scope.freqLoopUnitVal = "04";
                                    break;
                                case '05' :
                                    $scope.freqLoopUnit = "小时";
                                    $scope.freqLoopUnitVal = "05";
                                    break;
                                case '06' :
                                    $scope.freqLoopUnit = "分钟";
                                    $scope.freqLoopUnitVal = "06";
                                    break;
                            }
                            switch (backData.data.contextDict[1021]) {
                                case '01' :
                                    $scope.dataStayUnit = "日";
                                    $scope.dataStayUnitVal = "01";
                                    break;
                                case '02' :
                                    $scope.dataStayUnit = "周";
                                    $scope.dataStayUnitVal = "02";
                                    break;
                                case '03' :
                                    $scope.dataStayUnit = "月";
                                    $scope.dataStayUnitVal = "03";
                                    break;
                                case '04' :
                                    $scope.dataStayUnit = "年";
                                    $scope.dataStayUnitVal = "04";
                                    break;
                                case '05' :
                                    $scope.dataStayUnit = "小时";
                                    $scope.dataStayUnitVal = "05";
                                    break;
                                case '06' :
                                    $scope.dataStayUnit = "分钟";
                                    $scope.dataStayUnitVal = "06";
                                    break;
                            }

                            $timeout(function(){
                                $("input:radio[name='capEvaluation']:visible").each(function(index, item){
                                    if(item.value === $scope.qltEvlStatus) {
                                        $(this).prop("checked",true)
                                    }
                                })
                            },100)

                        }
                    })
                }else{
                    providerService.save({
                        detail: "trade/crpCreate/"
                    },postData,function(backData) {
                        if (backData.status == 1) {
                            $scope.selectedIdAttr = backData.data.prdtIdRelList;
                            $scope.prdtDesc = backData.data.prdtDesc;
                            $scope.valueStr = backData.data.tagDict.valueStr;
                            $scope.msgSample = backData.data.msgSample;
                            $scope.errCodeList = backData.data.errCodeList;
                            $scope.isIDSel = backData.data.isIDSel;
                            $scope.qltEvlStatus = backData.data.qltEvlStatus;
                            $scope.IdAttr_str = backData.data.dataId_str;
                            $scope.idCdList = backData.data.idCdList;
                            $scope.fullData = backData.data;
                            $scope.valueType = backData.data.tagDict.valueType;
                            $scope.applicationIndustry = backData.data.applicationIndustry;
                            $scope.applicationIndustrySelSelected = backData.data.applicationIndustrySel?backData.data.applicationIndustrySel:[];
                            $scope.selectedApplyScene = backData.data.multi_selscene_limit?backData.data.multi_selscene_limit:[];
                            $scope.dataScene_str = backData.data.dataScene_str;
                            $scope.nonFeeCode = backData.data.chargeRspList?JSON.parse(backData.data.chargeRspList):[{value: "",}];
                            $scope.feeCode = backData.data.freeRspList?JSON.parse(backData.data.freeRspList):[{value: "",}];
                            if(backData.data.maxDelayTime){
                                $scope.maxDelayTime = backData.data.maxDelayTime.split(',')[0];
                                $scope.selection_1_val = backData.data.maxDelayTime.split(',')[1];
                            }
                            if(backData.data.concurrency){
                                $scope.concurrency = backData.data.concurrency.split(',')[0];
                                $scope.selection_2_val = backData.data.concurrency.split(',')[1];
                            }
                            $scope.qryIdType = backData.data.qryIdType;
                            if($scope.qryIdType){
                                var qryIdTypeArr = $scope.qryIdType.split(",");
                            }
                            if(qryIdTypeArr){
                                if(qryIdTypeArr.length === 2){
                                    $scope.selectedEXID = true;
                                    $scope.selectedXID = true;
                                }else{
                                    if(qryIdTypeArr[0] === '01') {
                                        $scope.selectedEXID = true;
                                    } else if(qryIdTypeArr[0] === '02'){
                                        $scope.selectedXID = true;
                                    }
                                }
                            }

                            if(backData.data.apiDoc){
                                $scope.apiFileHref = backData.data.apiDoc;
                                $scope.haveApiFile = true;
                            }
                            if(backData.data.maxDelayTime){
                                $scope.maxDelayTime = backData.data.maxDelayTime.split(',')[0];
                                $scope.selection_1_val = backData.data.maxDelayTime.split(',')[1];
                            }
                            if(backData.data.concurrency){
                                $scope.concurrency = backData.data.concurrency.split(',')[0];
                                $scope.selection_2_val = backData.data.concurrency.split(',')[1];
                            }

                            $timeout(function(){
                                $("input:radio[name='crpEvaluation']:visible").each(function(index, item){
                                    if(item.value === $scope.qltEvlStatus) {
                                        $(this).prop("checked",true)
                                    }
                                })
                            },100)

                            $scope.createFullData = {
                                connObjId : $scope.fullData.connObjId,
                                prdtIdCd : $scope.fullData.prdtIdCd,
                            }
                            if($scope.fullData.connObjNo){
                                $scope.createFullData.connObjNo = $scope.fullData.connObjNo;
                            }
                        }
                    })
                }

                $scope.back = function(){
                    history.go(-1);
                }
            }

            if(data.type === 'edit'){
                $scope.step = 2;
                $scope.removeIdAttr = function(index){
                    $scope.selectedIdAttr.splice(index,1);
                }

                if($scope.showType === 'cap'){                                // CAP 编辑页面
                    providerService.save({
                        detail : "trade/capCreate/"
                    },postData,function(backData) {
                        if (backData) {
                            $scope.fullData = backData.data;
                            $scope.idAttr_str = backData.data.dataId_str;
                            $scope.connObjId = backData.data.connObjId;
                            $scope.selectedIdAttr = backData.data.prdtIdRelList;
                            $scope.selectedDataOrigin = !backData.data.contextDict[1030]?[]:backData.data.contextDict[1030];
                            $scope.selectedApplyScene = !backData.data.contextDict[1011]?[]:backData.data.contextDict[1011];
                            $scope.valueStr = !backData.data.contextDict[1029]?"":backData.data.contextDict[1029];
                            $scope.prdtIdRelList = backData.data.prdtIdRelList;
                            $scope.dataScene_str = backData.data.dataScene_str;
                            $scope.tagName = backData.data.tagDict.tagName;
                            $scope.tagTypeName = backData.data.tagDict.tagTypeName;
                            $scope.tagName = backData.data.tagDict.tagName;
                            $scope.prdtName = backData.data.prdtBaseInfo.prdtName;
                            $scope.prdtDesc = backData.data.prdtBaseInfo.prdtDesc;
                            $scope.dataOrigin_str = backData.data.dataCertify_str;
                            $scope.dataScene_str = backData.data.dataScene_str;
                            $scope.sourceIndustry = backData.data.dataIndustry_str;
                            $scope.dataArea_str = backData.data.dataArea_str;
                            $scope.freqLoop = backData.data.contextDict[1020];
                            $scope.dataStay = backData.data.contextDict[1022];
                            $scope.coverAreaSum = backData.data.contextDict[1014];
                            if(backData.data.areaNumStrList_str){
                                $scope.coverNum = backData.data.areaNumStrList_str[0]
                            }
                            $scope.selectedArea = backData.data.areaStrList_str;
                            $scope.map = backData.data.dataArea_str;
                            $scope.paramter_str = backData.data.paramter_str;
                            $scope.qltEvlStatus =backData.data.prdtBaseInfo.qltEvlStatus;
                            $scope.para_sel_str = backData.data.para_sel_str;

                            $scope.paramter_str.forEach(function(item) {
                                if (item.type === '02') {
                                    item.ranges = [];
                                    var ranges = item.range.split(',');
                                    ranges.forEach(function(i, n){
                                        item.ranges.push({
                                            name: i,
                                            id: n,
                                        })
                                    })

                                    if($scope.para_sel_str){
                                        $scope.para_sel_str.forEach(function(i){
                                            if(item.name === i.name){
                                                item.setValue = i.range;
                                                var arr = i.range.split(',');
                                                $timeout(function(){
                                                    $("input[name=checkbox_"+item.id+"]").each(function(){
                                                        if($.inArray($(this).attr('value'), arr) !== -1){
                                                            $(this).prop('checked',true);
                                                        }
                                                    })
                                                },100)

                                            }
                                        })
                                    }
                                }
                                if(item.type === '03'){
                                    if($scope.para_sel_str){
                                        $scope.para_sel_str.forEach(function(i){
                                            if(item.name === i.name){
                                                item.setValue = i.range;
                                            }
                                        })
                                    }
                                }

                                if(item.type === '01'){
                                    item.section = [];
                                    var arrayTemp = item.range.split(';');
                                    arrayTemp.forEach(function(i) {
                                        var temp1 = i.split(',')[0];
                                        var temp2 = i.split(',')[1];
                                        var temp = temp1 + ' ~ ' + temp2;
                                        item.section.push(temp);
                                    })
                                    item.section.join(';');

                                    if($scope.para_sel_str){
                                        item.arr = [];
                                        $scope.para_sel_str.forEach(function(i){
                                            if(item.name === i.name){
                                                var arr = i.range.split(';');
                                                for(var i=0; i<arr.length; i++) {
                                                    item.arr[i] = {
                                                        min: Number(arr[i].split(',')[0]),
                                                        max: Number(arr[i].split(',')[1]),
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }
                            })

                            switch (backData.data.tagDict.valueType) {
                                case 1 :
                                    $scope.valueType = "单值列表";
                                    break;
                                case 2 :
                                    $scope.valueType = "多段列表";
                                    break;
                                case 3 :
                                    $scope.valueType = "分段";
                                    break;
                                case 4 :
                                    $scope.valueType = "命中";
                                    break;
                                case 5 :
                                    $scope.valueType = "数据项";
                                    break;
                            }
                            switch (backData.data.contextDict[1019]) {
                                case '01' :
                                    $scope.freqLoopUnit = "日";
                                    $scope.freqLoopUnitVal = "01";
                                    break;
                                case '02' :
                                    $scope.freqLoopUnit = "周";
                                    $scope.freqLoopUnitVal = "02";
                                    break;
                                case '03' :
                                    $scope.freqLoopUnit = "月";
                                    $scope.freqLoopUnitVal = "03";
                                    break;
                                case '04' :
                                    $scope.freqLoopUnit = "年";
                                    $scope.freqLoopUnitVal = "04";
                                    break;
                                case '05' :
                                    $scope.freqLoopUnit = "小时";
                                    $scope.freqLoopUnitVal = "05";
                                    break;
                                case '06' :
                                    $scope.freqLoopUnit = "分钟";
                                    $scope.freqLoopUnitVal = "06";
                                    break;
                            }
                            switch (backData.data.contextDict[1021]) {
                                case '01' :
                                    $scope.dataStayUnit = "日";
                                    $scope.dataStayUnitVal = "01";
                                    break;
                                case '02' :
                                    $scope.dataStayUnit = "周";
                                    $scope.dataStayUnitVal = "02";
                                    break;
                                case '03' :
                                    $scope.dataStayUnit = "月";
                                    $scope.dataStayUnitVal = "03";
                                    break;
                                case '04' :
                                    $scope.dataStayUnit = "年";
                                    $scope.dataStayUnitVal = "04";
                                    break;
                                case '05' :
                                    $scope.dataStayUnit = "小时";
                                    $scope.dataStayUnitVal = "05";
                                    break;
                                case '06' :
                                    $scope.dataStayUnit = "分钟";
                                    $scope.dataStayUnitVal = "06";
                                    break;
                            }

                            $scope.createFullData = {
                                connObjId : $scope.fullData.connObjId,
                                prdtIdCd : $scope.fullData.prdtIdCd,
                                type : '02',
                            }
                            if($scope.fullData.connObjNo){
                                $scope.createFullData.connObjNo = $scope.fullData.connObjNo;
                            }

                            $timeout(function(){
                                $("input:radio[name='capEvaluation']").each(function(index, item){
                                    if(item.value === $scope.qltEvlStatus) {
                                        $(this).attr("checked", true).prop("checked", true);;
                                    }
                                })
                            }, 200)
                            cap();
                        }
                    })
                }
                if($scope.showType === 'crp') {                                                             // CRP 编辑页面
                    providerService.save({
                        detail: "trade/crpCreate/"
                    },postData,function(backData) {
                        if (backData.status == 1) {
                            $scope.idCdList = backData.data.idCdList;
                            $scope.selectedIdAttr = backData.data.prdtIdRelList;
                            $scope.selectedApplyScene = backData.data.multi_selscene_limit;
                            $scope.prdtDesc = backData.data.prdtDesc;
                            $scope.valueStr = backData.data.tagDict.valueStr;
                            $scope.msgSample = backData.data.msgSample;
                            $scope.errCodeList = backData.data.errCodeList;
                            $scope.isIDSel = backData.data.isIDSel;
                            $scope.qltEvlStatus = backData.data.qltEvlStatus;
                            $scope.IdAttr_str = backData.data.dataId_str;
                            $scope.fullData = backData.data;
                            $scope.valueType = backData.data.tagDict.valueType;
                            $scope.applicationIndustry = backData.data.applicationIndustry;
                            $scope.applicationIndustrySelSelected = backData.data.applicationIndustrySel?backData.data.applicationIndustrySel:[];
                            $scope.dataScene_str = backData.data.dataScene_str;
                            $scope.nonFeeCode = backData.data.chargeRspList?JSON.parse(backData.data.chargeRspList):[{value: "",}];
                            $scope.feeCode = backData.data.freeRspList?JSON.parse(backData.data.freeRspList):[{value: "",}];
                            $scope.haveApiFile = true;
                            if(backData.data.maxDelayTime){
                                $scope.maxDelayTime = backData.data.maxDelayTime.split(',')[0];
                                $scope.selection_1_val = backData.data.maxDelayTime.split(',')[1];
                            }
                            if(backData.data.concurrency){
                                $scope.concurrency = backData.data.concurrency.split(',')[0];
                                $scope.selection_2_val = backData.data.concurrency.split(',')[1];
                            }
                            if(backData.data.apiDoc){
                                $scope.apiFileHref = backData.data.apiDoc;
                            }

                            $scope.qryIdType = backData.data.qryIdType;
                            var qryIdTypeArr = $scope.qryIdType.split(",");

                            if(qryIdTypeArr.length === 2){
                                $scope.selectedEXID = true;
                                $scope.selectedXID = true;
                            }else{
                                if(qryIdTypeArr[0] === '01') {
                                    $scope.selectedEXID = true;
                                } else if(qryIdTypeArr[0] === '02'){
                                    $scope.selectedXID = true;
                                }
                            }

                            $timeout(function(){
                                $("input:radio[name='crpEvaluation']").each(function(index, item){
                                    if(item.value === $scope.qltEvlStatus) {
                                        $(this).attr("checked", true).prop("checked", true);;
                                    }
                                })
                            }, 200)

                            $scope.createFullData = {
                                connObjId : $scope.fullData.connObjId,
                                prdtIdCd : $scope.fullData.prdtIdCd,
                                apiDoc : $scope.apiFileHref,
                                type : '02',
                            }

                            $scope.$watch("apiFileHref",function(){
                                $scope.createFullData.apiDoc = $scope.apiFileHref;
                            })

                            if($scope.fullData.connObjNo){
                                $scope.createFullData.connObjNo = $scope.fullData.connObjNo;
                            }
                        }
                    })
                    crp();
                }
            }
        }
        else                                                  // 新增模式
        {
            $scope.step = 1;
            $scope.goToStep2 = function(index,type){
                $scope.showType = type;
                $scope.removeIdAttr = function(index){
                    $scope.selectedIdAttr.splice(index,1);
                }

                if($scope.showType === 'cap'){
                    providerService.save({
                        detail: "trade/capCreate/"
                    },{
                        tag_code : ($scope.labelDatas[index]).code,
                        type : '01',
                    },function(backData){
                        if(backData.status == 1){
                            $scope.step = 2;
                            $($(".create-item .breadcrumb li")[0]).addClass("visited");

                            $scope.selectedArea = [];
                            $scope.fullData = backData.data;
                            $scope.idAttr_str = backData.data.dataId_str;
                            $scope.dataOrigin_str = backData.data.dataCertify_str;
                            $scope.dataScene_str = backData.data.dataScene_str;
                            $scope.map = backData.data.dataArea_str;
                            $scope.paramter_str = backData.data.paramter_str;
                            $scope.tagName = backData.data.tagDict.tagName;
                            switch (backData.data.tagDict.valueType) {
                                case 1 :
                                    $scope.valueType = "单值列表";
                                    break;
                                case 2 :
                                    $scope.valueType = "多段列表";
                                    break;
                                case 3 :
                                    $scope.valueType = "分段";
                                    break;
                                case 4 :
                                    $scope.valueType = "命中";
                                    break;
                                case 5 :
                                    $scope.valueType = "数据项";
                                    break;
                            }
                            $scope.paramter_str = backData.data.paramter_str;

                            $scope.paramter_str.forEach(function(item, index) {
                                if (item.type === '02') {
                                    item.ranges = [];
                                    var ranges = item.range.split(',');
                                    ranges.forEach(function(i, n){
                                        item.ranges.push({
                                            name: i,
                                            id: n,
                                        })
                                    })
                                }else if(item.type === '01') {
                                    item.arr = [{
                                        min: null,
                                        max: null,
                                    }]

                                    item.section = [];

                                    var arr = item.range.split(';');
                                    arr.forEach(function(i) {
                                        var temp1 = i.split(',')[0];
                                        var temp2 = i.split(',')[1];
                                        var temp = temp1 + ' ~ ' + temp2;
                                        item.section.push(temp);
                                    })
                                    item.section.join(';');
                                }
                            })

                            $scope.createFullData = {
                                connObjId : $scope.fullData.connObjId,
                                prdtIdCd : $scope.fullData.prdtIdCd,
                                type : '01',
                            }
                            if($scope.fullData.connObjNo){
                                $scope.createFullData.connObjNo = $scope.fullData.connObjNo;
                            }
                        }
                        else{
                            var modalData = {
                                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                                content: backData.msg
                            };
                            $scope.$emit("setModalState",modalData);
                        }
                    })
                    cap();
                }
                if($scope.showType === 'crp'){
                    providerService.save({
                        detail: "trade/crpCreate/"
                    },{
                        tag_code : ($scope.labelDatas[index]).code,
                        type : '01',
                    },function(backData) {
                        if (backData.status == 1) {
                            $scope.step = 2;
                            $($(".create-item .breadcrumb li")[0]).addClass("visited");
                            $scope.idCdList = backData.data.idCdList;
                            $scope.isIDSel = backData.data.isIDSel;
                            $scope.IdAttr_str = backData.data.dataId_str;
                            $scope.fullData = backData.data;
                            $scope.valueType = backData.data.tagDict.valueType;
                            $scope.applicationIndustry = backData.data.applicationIndustry;
                            $scope.dataScene_str = backData.data.dataScene_str;
                            $scope.selection_1_val = '1';
                            $scope.selection_2_val = '1';
                            $scope.createFullData = {
                                connObjId : $scope.fullData.connObjId,
                                prdtIdCd : $scope.fullData.prdtIdCd,
                                type : '01',
                            }
                            if($scope.fullData.connObjNo){
                                $scope.createFullData.connObjNo = $scope.fullData.connObjNo;
                            }
                            $scope.feeCode = [{
                                value: "",
                            }]
                            $scope.nonFeeCode = [{
                                value: "",
                            }]
                        } else{
                            var modalData = {
                                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                                content: backData.msg
                            };
                            $scope.$emit("setModalState",modalData);
                        }
                    })
                    crp();
                }
            }
        }
    }])
    .controller("providerDataOriginCtrl",["$scope","providerService","dls_list_service",function($scope,providerService,dls_list_service){
        var perPageNum =5;
        $scope.pageOptions = {};
        $scope.curPage = 1;
        $scope.searchFullText = '';

        $scope.addCertificate = function(){
            var modalData = {
                templateUrl : './src/templates/modalViews/certificateModal.html'
            };
            $scope.$emit("setModalState",modalData);
        };

        $scope.providerOriginDataGrid = dls_list_service.providerOriginDataGrid;

        $scope.$on("addOrigin",function(){
            $scope.getOriginList(1,$scope.searchText);
        })

        $scope.getOriginList = function(){
            providerService.save({
                detail : "certification/search/"
            },{
                data:$scope.searchText,
                page:$scope.curPage,
                rows:perPageNum,
            },function(backData){
                if(backData.status == 1){
                    $scope.originDatas = backData.data.list;
                    if($scope.originDatas.length == 0){
                        $scope.showOriginData =false;
                    }else{
                        $scope.showOriginData =true;
                        $scope.pageOptions = {
                            "total_items_num" : backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : backData.data.page.total_pages,  //总共的page数量
                            "per_page_num" : perPageNum                          //单页page的data数量
                        };
                    }

                }
            })
        };

        $scope.deleteData = function(data){
            providerService.save({
                detail : "certification/del/"
            },{
                code:data.code
            },function(backData){
                if(backData.status == 1){
                    $scope.getOriginList($scope.curPage);
                }
            })
        }

        $scope.searchData = function(){
            $scope.curPage = 1;
            $scope.getOriginList($scope.curPage,$scope.searchText);
        }

        $scope.searchOriginData = function(e){
            //var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            //if (keycode == 13) {
                $scope.curPage = 1;
                //$scope.searchFullText = $scope.searchText
                $scope.getOriginList();
            //}
        }

        $scope.$watch(function(){
            return $scope.curPage;
        },function(newV){
            $scope.getOriginList();
        },true)
    }])
    .controller("uploadCertCtrl",["$scope","$state","providerService","$rootScope",function($scope,$state,providerService,$rootScope){
        $scope.username = $rootScope.currentUser.username

        $("input[name='file-certify']").change(function(){
            var type = $(this).val().substr($(this).val().lastIndexOf(".")).toLowerCase();
            if(type == '.jpg' || type == '.jepg' || type == '.gif' || type == '.png' || type == '.pdf'){
            }else{
                $(this).val("");
                alert("请上传正确的文件类型！");
            }
            if($(this)[0].files.length != 0){
                $scope.fileCertify = "1";
                $("#fileCertify").css("display",'none')
            }else{
                $("#fileCertify").css("display",'block')
                $scope.fileCertify = "";
            }
        })

        $scope.uploadCert = function(){
            if($scope.fileCertify && $scope.fileName){
                $("#uploadCert").ajaxSubmit({
                    type:"post",
                    url:"../../api/sup/certification/save/",
                    success:function(backData){
                        var status = backData.split(",")[0].split(":")[1];
                        if(status == 1){
                            $scope.$apply(function(){
                                $scope.status = 1;
                                $scope.msg = "操作成功";
                                $scope.fileName = "";
                                $scope.$emit("addOriginSuccess");
                                $scope.$emit("cancelModalState");
                            });
                        }
                    }
                });
            }
        }

        $scope.cancel = function(){
            $scope.$emit("setModalState");
        }
    }])
    .controller('deployCtrl',["$scope","$stateParams","providerService","debounce","localStorageService",function($scope,$stateParams,providerService,debounce,localStorageService){
        $scope.deployList = []
        $scope.temp = "";
        $scope.state = true;
        $scope.searchText = "";
        $scope.curPage = 1;
        $scope.decide = $stateParams.data;
        $scope.idData = $stateParams.idData;
       console.log($scope.idData)
        $scope.cIdData = $stateParams.cIdData;
        $scope.unShift = function(){
            var list = $scope.deployList
            var temp = true;
            for(var i = 0;i < list.length;i++){
                if(list[i].opt){
                    temp = false;
                    var modalData = {
                        templateUrl: './src/templates/modalViews/addToCartTipModal.html',
                    };
                    modalData.content = "一次只能新增一个";
                    $scope.$emit("setModalState", modalData);
                    break;
                }
            }
            if(temp){
                providerService.save({
                    detail:'busiId/generate/',
                },{
                    connObjNo:$scope.idData,
                    lastBusiId:$scope.temp
                },function(backData){
                   var len = $scope.deployList.length;
                    $scope.deployList.splice(len,0,{busiId:backData.data.busiId,opt:"+"});
                    $scope.temp = backData.data.busiId;
                    $scope.pageOptions = {
                    "total_items_num": ++$scope.totalRows,   //总共的data数量
                    "total_pages_num": $scope.totalPages,  //总共的page数量
                    "per_page_num": 10                   //单页page的data数量
                    };
                })
            }
        }

        $scope.search = function(){
            $scope.curPage = 1;
        }
        $scope.$watch('searchText', debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        }, 350));
        $scope.$watch('curPage',function(){
            $scope.getDatas();
        })

        $scope.getDatas = function(){
            providerService.save({
                detail:'busiId/List/',
            },{
               connObjNo:$scope.idData,
               connObjId:$scope.cIdData, 
               message:$scope.searchText,
               page:$scope.curPage
            },function(backData){
                if(backData.status == 1){
                    $scope.deployList = backData.data.list;
                    $scope.connObjId = backData.data.connObjId;
                    $scope.prdtName = backData.data.prdtName;
                    $scope.pageOptions = {
                        "total_items_num":backData.data.page.total_rows,
                        "total_pages_num":backData.data.page.total_pages,
                        "per_page_num":10
                    }
                    $scope.totalRows = backData.data.page.total_rows;
                    $scope.totalPages = backData.data.page.total_pages;
                }
            })
        }
        $scope.getDatas();
        $scope.editCut = function(data){
          data.opt = "+";
        }
        $scope.achieveCut = function(data){
          delete data.opt;
          providerService.save({
            detail:'busiId/desc/save/',
        },{
           connObjNo:$scope.idData,
           busiId:data.busiId,
           description:data.description
        },function(backData){
        })
        }

    }])

