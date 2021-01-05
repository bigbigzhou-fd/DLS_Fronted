'use strict';

angular.module('myApp.algorithmManageController', [
    'myApp.services',
    'ui.grid',
    'dls.services.util'
])
    .controller("algorithmItemManagerCtrl",function($rootScope,$scope,$state,dls_list_service,i18nService,tradeMallService,providerService,transferData,$http,Excel,$timeout,localStorageService){
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
    .controller("algorithmItemMItemCtrl",["$scope","$rootScope",'providerService',"supTradeService","$timeout","dls_list_service","$state","localStorageService", function($scope,$rootScope,providerService,supTradeService,$timeout,dls_list_service,$state,localStorageService){
        $scope.curPage = 1;
        $scope.pageOptions = {};
        $scope.itemGridOptions = dls_list_service.providerItemGrid;

        var  appStatus = localStorageService.get('appStatus');
        $scope.searchText = !!appStatus ? appStatus.searchText : '';
        $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;


                $scope.getItemsDatas = function(){
                    var perPageNum = 10;
                    supTradeService.save({
                        detail : "alg/list/"
                    },{
                        keyword:$scope.searchText,
                        pcode:$scope.selectedNode.id,
                        status:$scope.selectStateNum,
                        page:$scope.curPage,
                        // rows:perPageNum,
                    },function(backData){
                        console.log(backData)
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
                    var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=view";
                    var appStatus = {
                        'searchText': $scope.searchText,
                        'pcode': $scope.selectedNode.id,
                        'status': $scope.selectStateNum,
                        'page': $scope.curPage,
                        'selectState': $scope.selectState,
                        'selectData': $scope.selectData,
                    };
                    localStorageService.set('appStatus', appStatus);

                    $state.go("dls.algorithm.createItem",{data:data});
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
                    var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=edit?";
                    $state.go("dls.algorithm.createItem",{data:data});
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
                $scope.auditData = function(data){
                    if(data.price && data.valuationModeCd && data.valuationCountCd){
                        console.log(data.connObjId)
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
            $scope.getItemsDatas();


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
    .controller("algorithmCreateItemCtrl",["$scope","$state","$rootScope","$timeout","providerService","tradeMallService","$compile","fileUpload","supTradeService",function($scope,$state,$rootScope,$timeout,providerService,tradeMallService,$compile,fileUpload,supTradeService){
        $scope.pageOptions = {}
        $scope.selectedNode = {id : ""};
        $scope.selectedIdAttr = [] , $scope.selectedDataOrigin = [] , $scope.selectedApplyScene = [] , $scope.map1Selected = [] , $scope.applicationIndustrySelSelected = [];
        $scope.valueStr = 'asdfasd'
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
                detail: "trade/alg/userTags/"
            }, {
                type:type,
                cont:cont,
                pcode:pcode,
                page:page,
                rows:rows,
            }, function (backData) {
                console.log(backData)
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
       //joe
        $scope.operatingSystem = 'Windows'
        $scope.lookStyle = {
            marginLeft:'174px'
        }
        $scope.operatingSystemList = [{
            name: 'Windows',
            value: 'Windows',
        },{
            name: 'Linux',
            value: 'Linux',
        },{
            name: 'Mac',
            value: 'Mac',
        }]
        $scope.edition = 'Alone'
        $scope.editionList = [{
            name: '单机版',
            value: 'Alone',
        },{
            name: '集群',
            value: 'Cluster',
        },{
            name: '分布式云平台',
            value: 'Cloud',
        }]
        $scope.systemDigit = '32bit'
        $scope.systemDigitList = [{
            name: '32bit',
            value: '32bit',
        },{
            name: '64bit',
            value: '64bit',
        }]
        $scope.language = 'R'
        $scope.languageList = [{
            name: 'R',
            value: 'R',
        },{
            name: 'Python',
            value: 'Python',
        },{
            name: 'Mahout',
            value: 'Mahout',
        },{
            name: 'Spark',
            value: 'Spark',
        },{
            name: 'Weka',
            value: 'Weka',
        },{
            name: 'Scala',
            value: 'Scala',
        }]

        $scope.price = ''
        $scope.afterService = ''
        $scope.createAlgorithm=[{operationNotice:[{text:'',img:'',path:''}]},
                                 {dataRequirements:[{text:'',img:'',path:''}]},
                                 {algorithmUse:[{text:'',img:'',path:''}]},
                                 {algorithmPrinciple:[{text:'',img:'',path:''}]},
                                 {result:[{text:'',img:'',path:''}]},
                                 {commodityAdvantage:[{text:'',img:'',path:''}]},
                                 {algorithmicDescription:[{text:'',img:'',path:''}]},
                                 {relatedApplications:[{text:'',img:'',path:''}]},
                                 {example:[{text:'',img:'',path:''}]},
                                 {meritsAndFaults:[{text:'',img:'',path:''}]},
                                 {customSvc:[{text:'',img:'',path:''}]},
                                 {input:[{text:'',img:'',path:''}]},
                                 {output:[{text:'',img:'',path:''}]}
                                ]
        $scope.addCreateAlgorithm = function(list){
              list.push({text:'',img:'',path:''})
        }
        console.log($scope.createAlgorithm)

        $scope.fileChanged = function(ele,item){
            console.log(item)
            $scope.files = ele.files;
            var file = document.querySelector('input[type=file]').files[0];
            var filename = $scope.files[0].name;
           if(filename.length> 1 && filename ) {
                var ldot = filename.lastIndexOf(".");
                var type = filename.substring(ldot + 1);  //文件类型
                $scope.fileName=filename.slice(0,ldot);//文件名
                console.log($scope.fileName)
             }
        }

//提交
        $scope.submitData = function(){
            console.log(typeof JSON.stringify($scope.createAlgorithm))
            //$scope.createFullData没有
            $scope.createFullData.prdtDesc = JSON.stringify($scope.createAlgorithm)
            $scope.createFullData.opSys = $scope.operatingSystem
            $scope.createFullData.appVersion = $scope.edition
            $scope.createFullData.sysBit = $scope.systemDigit
            $scope.createFullData.devLang = $scope.language
            $scope.createFullData.prdtType = '06'
            // $scope.createFullData.customSvc = $scope.afterService
            console.log($scope.createFullData)
            supTradeService.save({
                    detail: "alg/save/"
                },$scope.createFullData,function(backData){
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

//joe
        $scope.goBack = function(index){
            $scope.step = index;

            $($(".create-item .breadcrumb li")[index]).removeClass("active");
            $($(".create-item .breadcrumb li")[index-1]).removeClass("visited").addClass("active");
            if(index == 5){
                $scope.showAll = false;
            //     $scope.idAttrOptions.addBtn = true;
            //     $scope.dataOriginOptions.addBtn = true;
            //     $scope.applySceneOptions.addBtn = true;
            //     $scope.create_options.addBtn = true;
            //     $scope.create_options.disabled = false;
            //     $scope.selectDisabled = false;
            }
        }

        $scope.cancelCreate = function(){
            history.back()
        }
        $scope.add = function(){
            console.log($scope.valueStr)
        }
        var crp = function(){
            console.log('asfasfas')
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

                    $scope.step = 3;
                    $($(".create-item .breadcrumb li")[1]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[2]).addClass("active");

            }
            $scope.goToStep4 = function(){
                    console.log('asdfasd')
                // if($scope.prdtDesc){
                //     $scope.createFullData = angular.extend({}, $scope.createFullData,{
                //         'prdtDesc': $scope.prdtDesc,
                //     })
                    $scope.step = 4;
                    $($(".create-item .breadcrumb li")[2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[3]).addClass("active");
                // }
            }
            $scope.goToStep5 = function(){
                if($scope.valueStr && $scope.msgSample && $scope.errCodeList && $scope.haveApiFile){
                    $scope.step = 5;
                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        value: $scope.valueStr,
                        msgSample: $scope.msgSample,
                        errCodeList: $scope.errCodeList,
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
                $scope.step = 5;
                $($(".create-item .breadcrumb li")[3]).removeClass("active").addClass("visited");
                $($(".create-item .breadcrumb li")[4]).addClass("active");
            }
            $scope.goToStep6 = function(){
                $scope.showAll = true;
                $scope.step = 6;
                $($(".create-item .breadcrumb li")[4]).removeClass("active").addClass("visited");
                $($(".create-item .breadcrumb li")[5]).addClass("active");
                        //图片上传
            $scope.uploadFile = function(e){
                var uploadUrl = "../../api/sup/trade/alg/picSave/";
                $(e.target).parents('form').ajaxSubmit({
                    type: "POST",
                    url: uploadUrl,
                    data: {
                    },
                    success:function(backData){
                        var res = JSON.parse(backData)
                                if(res.status=='1'){
                                    for(var i=0;i<$scope.createAlgorithm.length;i++){
                                        for (var j in res.data) {
                                            if(res.data[j].length>0){
                                                for(var k = 0;k<res.data[j].length;k++){
                                                    if(!!$scope.createAlgorithm[i][j]){
                                                        $scope.createAlgorithm[i][j][k].img = res.data[j][k].img
                                                        $scope.createAlgorithm[i][j][k].path = res.data[j][k].path

                                                    }
                                                }

                                            }
                                        }
                                    }
                                $scope.submitData()//二次提交
                                }
                        console.log($scope.createAlgorithm)
                    }
                })
            }
                }
        }
        if($state.params.data){                              // 非新建模式
            $scope.step = 2;
            var urlArr = $state.params.data.split("?");
            var data = {
                connObjId : (urlArr[0].split("="))[1],
                connObjNo : (urlArr[1].split("="))[1],
                tag_code : (urlArr[2].split("="))[1],
                type : (urlArr[3].split("="))[1],
            }
            $scope.algorithmType = data.type
            console.log($scope.algorithmType)

            var postData = {
                type : '02',
                tag_code : data.tag_code,
                connObjNo : data.connObjNo,
            };


            if(data.type === 'view'){
                // 查看模式
                $scope.lookStyle = {
                    marginLeft:''
                }
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

                    supTradeService.save({
                        detail: "alg/userCreate/"
                    },postData,function(backData) {
                       if(backData.status == 1){
                           var arr=[];
                           console.log(backData.data.prdtDetailInfo)
                           for(var i in backData.data.prdtDetailInfo){
                               arr.push(i);
                           }
                           for(var i = 0;i<$scope.createAlgorithm.length;i++){
                               for(var j = 0;j<arr.length;j++){
                                   if($scope.createAlgorithm[i][arr[j]]){
                                       $scope.createAlgorithm[i][arr[j]] = backData.data.prdtDetailInfo[arr[j]]
                                        console.log(backData.data.prdtDetailInfo[arr[j]])
                                       for(var k = 0;k<$scope.createAlgorithm[i][arr[j]].length;k++){
                                           $scope.createAlgorithm[i][arr[j]][k].img = $scope.createAlgorithm[i][arr[j]][k].imagePath
                                           $scope.createAlgorithm[i][arr[j]][k].text = $scope.createAlgorithm[i][arr[j]][k].detailText
                                       }
                                   }
                               }
                           }
                           console.log($scope.createAlgorithm)
                           $scope.operatingSystem = backData.data.contextDict['1090']
                           $scope.edition = backData.data.contextDict['1091']
                           $scope.systemDigit = backData.data.contextDict['1092']
                           $scope.language = backData.data.contextDict['1093']
                       }
                    })
                $scope.back = function(){
                    history.go(-1);
                }
            }

            if(data.type === 'edit'){
                $scope.step = 2;
                $scope.removeIdAttr = function(index){
                    $scope.selectedIdAttr.splice(index,1);
                }

                supTradeService.save({
                    detail: "alg/userCreate/"
                },postData,function(backData) {
                    if(backData.status == 1){
                        $scope.createFullData = {
                            connObjId : data.connObjId,
                            connObjNo : data.connObjNo,
                            prdtIdCd : backData.data.prdtIdCd,
                            tagName : backData.data.tagDict.tagName,
                            editType : '02',
                        }
                        var arr=[];
                        console.log($scope.createFullData)
                        for(var i in backData.data.prdtDetailInfo){
                            arr.push(i);
                        }
                        for(var i = 0;i<$scope.createAlgorithm.length;i++){
                            for(var j = 0;j<arr.length;j++){
                                if($scope.createAlgorithm[i][arr[j]]){
                                    $scope.createAlgorithm[i][arr[j]] = backData.data.prdtDetailInfo[arr[j]]
                                    console.log(backData.data.prdtDetailInfo[arr[j]])
                                    for(var k = 0;k<$scope.createAlgorithm[i][arr[j]].length;k++){
                                        $scope.createAlgorithm[i][arr[j]][k].path = $scope.createAlgorithm[i][arr[j]][k].imagePath
                                        $scope.createAlgorithm[i][arr[j]][k].text = $scope.createAlgorithm[i][arr[j]][k].detailText
                                        $scope.createAlgorithm[i][arr[j]][k].img = ''
                                    }
                                }
                            }
                        }
                        console.log($scope.createAlgorithm)
                        $scope.operatingSystem = backData.data.contextDict['1090']
                        $scope.edition = backData.data.contextDict['1091']
                        $scope.systemDigit = backData.data.contextDict['1092']
                        $scope.language = backData.data.contextDict['1093']
                    }
                })
                        crp();
            }
        }else                                                  // 新增模式
        {
            $scope.step = 1;
            $scope.goToStep2 = function(index,data){
                $scope.removeIdAttr = function(index){
                    $scope.selectedIdAttr.splice(index,1);
                }
                console.log(data)
                console.log($scope.labelDatas[index])
                 supTradeService.save({
                        detail: "alg/userCreate/"
                    },{
                        tag_code : ($scope.labelDatas[index]).code,
                        type : '01',
                    },function(backData) {

                        if (backData.status == 1) {
                            $scope.step = 2;
                            $($(".create-item .breadcrumb li")[0]).addClass("visited");
                            $scope.fullData = backData.data;
                            $scope.createFullData = {
                                connObjId : $scope.fullData.connObjId,
                                connObjNo : $scope.fullData.connObjNo,
                                prdtIdCd : $scope.fullData.prdtIdCd,
                                tagName : data.name,
                                editType : '01',
                            }
                        } else{
                            var modalData = {
                                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                                content: backData.msg
                            };
                            $scope.$emit("setModalState",modalData);
                        }
                    })


            }
            crp()
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

