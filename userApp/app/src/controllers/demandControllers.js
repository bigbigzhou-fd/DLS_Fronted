'use strict';
angular.module('myApp.demandControllers', [
        'myApp.services',
        'dls.filters'
    ])
    .controller("demandUtilCtrl", ['$scope', function ($scope) {

        $scope.modalData = {
            templateUrl: './src/templates/modalViews/addToCartTipModal.html',
            content: ''
        };
        $scope.showMsg = function (msg) {
            $scope.modalData.content = msg;
            $scope.$emit("setModalState", $scope.modalData);
        };
        // $scope.checkStates = [{
        //     'value' : '00',
        //     'name' : '全部'
        //   },{
        //     'value' : '01',
        //     'name' : '待审核'
        //   },{
        //     'value' : '02',
        //     'name' : '审核通过'
        // },{
        //     'value' : '03',
        //     'name' : '审核不通过'
        // }];

    }])
    .controller("demandMallCtrl", ['$scope', '$cookies', '$filter', '$stateParams', 'demandService', 'debounce', '$uibModal', 'localStorageService'
        , function ($scope, $cookies, $filter, $stateParams, demandService, debounce, $uibModal, localStorageService) {
            $scope.scene = '00';
            $scope.releaseDate = '00';
            $scope.pageOptions = {
                "total_items_num": 0,
                "total_pages_num": 0,
                "per_page_num": 10
            };
            $scope.curPage = 1;
            var appStatus = localStorageService.get('appStatus');
            $scope.searchText = !!appStatus ? appStatus.searchText : '';
            $scope.curPage = !!appStatus ? appStatus.curPage : '';
            $scope.scene = !!appStatus ? appStatus.scene : '';
            $scope.releaseDate = !!appStatus ? appStatus.releaseDate : '';
            $scope.getDatas = function (page, pcode, category, text) {
                demandService.save({detail: "pub/list/"}, {
                    page: $scope.curPage,
                    message: $scope.searchText,
                    scene: $scope.scene,
                    time: $scope.releaseDate,
                }, function (resp) {
                    $scope.datas = resp.data.list;
                    $scope.pageOptions = {
                        "total_items_num": resp.data.page.total_rows,
                        "total_pages_num": resp.data.page.total_pages,
                        "per_page_num": resp.data.page.rows
                    };
                });
            };

            $scope.focus = function (item, index) {
                demandService.save({detail: "fcs/reqInfo/"}, {
                    reqId: item.reqId,
                    status: item.focusStatus
                }, function (resp) {
                    if (resp.status === 1 && resp.msg === '成功' && item.focusStatus === '01') {
                        $scope.datas[index].focusStatus = '02';
                        $scope.showMsg("关注成功");
                    } else if (resp.status === 1 && resp.msg === '成功' && item.focusStatus === '02') {
                        $scope.datas[index].focusStatus = '01';
                        $scope.showMsg("取消关注成功");
                    }else{
                        $scope.showMsg(resp.msg);
                    }
                });
            }

            $scope.$watch(function () {
                return $scope.scene + "/" + $scope.curPage + "/" + $scope.releaseDate;
            }, function (newV) {
                $scope.getDatas();
            }, true);

            $scope.$watch('searchText', debounce(function (newV, oldV) {
                if (newV !== oldV) {
                    $scope.getDatas();
                }
            }, 350));

            $scope.openModal = function (size, type, index) {
                var tplUrl = './src/templates/modalViews/' + type + '.html';
                $scope.modalDatas = $scope.datas[index];
                console.log($scope.modalDatas.result);

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: tplUrl,
                    controller: 'appModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: size,
                    resolve: {
                        modalDatas: function () {
                            return $scope.modalDatas;
                        }
                    }
                });
                modalInstance.result.then(function (datas){
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

            $scope.setAppStatus = function (item) {
                var appStatus = {
                    'searchText': $scope.searchText,
                    'scene': $scope.scene,
                    'releaseDate': $scope.releaseDate,
                    'curPage': $scope.curPage,
                };
                localStorageService.set('appStatus', appStatus);
            };

        }])
    .controller("demandSimilarityCtrl", ['$scope', '$cookies', '$filter', '$stateParams', 'demandService', 'localStorageService'
        , function ($scope, $cookies, $filter, $stateParams, demandService, localStorageService) {
            $scope.titles = ['最高相似度', '交易品名称', '产品类型', '供方数量（家）', '赋值说明'];
            $scope.pageOptions = {
                "total_items_num": 0,
                "total_pages_num": 0,
                "per_page_num": 10
            };
            $scope.curPage = 1;
            $scope.reqId = $stateParams.reqId;
            // console.log($scope.reqId);
            $scope.getDatas = function () {
                demandService.save({detail: "simi/list/"}, {
                    reqId: $scope.reqId,
                    page: $scope.curPage
                }, function (resp) {
                    $scope.datas = resp.data;
                    $scope.pageOptions = {
                        "total_items_num": resp.data.page.total_rows,
                        "total_pages_num": resp.data.page.total_pages,
                        "per_page_num": resp.data.page.rows
                    };
                });
            };
            // $scope.getDatas();
            $scope.$watch(function () {
                return $scope.curPage;
            }, function (newV) {
                $scope.getDatas();
            }, true);

            $scope.detail = function (item) {
                var appStatus = {
                    'prdtIdName': item.prdtIdName,
                    'responseNum': item.responseNum,
                    'simiDegree': item.simiDegree,
                };
                localStorageService.set('appStatus', appStatus);
            }


        }])
    .controller("demandGoodsItemCtrl", ['$rootScope', '$scope', '$state', '$stateParams', 'demandService', 'localStorageService',
        function ($rootScope, $scope, $state, $stateParams, demandService, localStorageService) {
            $scope.pageOptions = {
                "total_items_num": 0,
                "total_pages_num": 0,
                "per_page_num": 10
            };
            $scope.curPage = 1;
            $scope.searchText = '';
            $scope.prdtIdCd = $stateParams.prdtIdcd;
            $scope.reqId = $stateParams.reqId;

            $scope.titles = ['相似度', '产品类型', '互联对象编号', '版本', '供方机构名称', '供方部门名称', '单价（元）', '计价方式'];
            $scope.prdtIdCd = $stateParams.prdtIdcd;
            $scope.prdtType = $stateParams.type;
            $scope.detail = localStorageService.get('appStatus');
            $scope.getDatas = function () {
                demandService.save({detail: 'simi/dtl/'}, {
                    page: $scope.curPage,
                    prdtIdcd: $scope.prdtIdCd,
                    reqId: $scope.reqId
                }, function (resp) {
                    // console.log(resp);
                    $scope.datas = resp.data.list;
                    $scope.pageOptions = {
                        "total_items_num": resp.data.page.total_rows,
                        "total_pages_num": resp.data.page.total_pages,
                        "per_page_num": 10
                    };
                });
            };
            $scope.$watch(function () {
                return $scope.curPage;
            }, function (newV, oldV) {
                if(newV !== oldV) {
                    $scope.getDatas();
                }
            });
            $scope.getDatas();
            $scope.selectAll = function () {
                $scope.datas.forEach(function (item) {
                    item.checked = $scope.checkedAll;
                })
                $scope.selectData();
            };

            $scope.selectData = function (checked, connObjId) {
                var item = {
                    supMemId: '',
                    connObjId: '',
                    connObjNo: '',
                    connObjCatCd: '',
                    connObjVer: ''
                };
                $scope.selectedItems = [];
                var orderItems = $scope.datas.filter(function (item) {
                    return (item.checked === true);
                });
                for (var i = orderItems.length - 1; i >= 0; i--) {
                    item.supMemId = orderItems[i].supMemId;
                    item.connObjId = orderItems[i].connObjId;
                    item.connObjNo = orderItems[i].connObjNo;
                    item.connObjCatCd = orderItems[i].connObjCatCd;
                    item.connObjVer = orderItems[i].connObjVer;
                    $scope.selectedItems.push(item);
                }
            };

            $scope.verDetail = function (item) {
                var data = item.prdtType === '03' ? "connObjId=" + item.connObjId + "?connObjNo=" + item.connObjNo + "?tag_code=" + $scope.prdtIdCd + "?type=view?prdtType=cap" : "connObjId=" + item.connObjId + "?connObjNo=" + item.connObjNo + "?tag_code=" + $scope.prdtIdCd + "?type=view?prdtType=crp";
                $state.go("dls.provider.createItem", {data: data});
            }

            $scope.createOrder = function () {
                localStorageService.set('selectedConnObjNo', $scope.selectedConnObjNo);
                localStorageService.set('prdtType', $scope.prdtType);
                $state.go("dls.trade.cart");
            };

            $scope.addToCart = function () {
                var cartInfo = JSON.stringify($scope.selectedItems);
                demandService.save({detail: "order/batch/"}, {'cartInfo': cartInfo}, function (resp) {
                    // console.log(resp);
                    $scope.showMsg(resp.msg);
                    if (resp.status === 1) {
                        $rootScope.cartNum = resp.data[0].cartNum;
                        localStorageService.set('cartNum', resp.data[0].cartNum);
                        $state.go("dls.trade.cartList");
                    }
                });
            };

  }])
    .controller("demandBillCtrl", ['$scope', '$state', '$stateParams', 'demandService', '$uibModal',
        function ($scope, $state, $stateParams, demandService, $uibModal) {
            $scope.reqId = $stateParams.reqId;
            $scope.type = $stateParams.type;
            $scope.status = $stateParams.status;
            $scope.reqType = $stateParams.reqType || '';
            console.log($scope.reqType == '')
            var modalData = {
                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            };
            $scope.responseBill = function (size, type) {
                var tplUrl = './src/templates/modalViews/' + type + '.html';
                $scope.modalDatas = {
                    keywords: $scope.datas.keyword,
                    scale: $scope.datas.expDateScale,
                    expectPrice: $scope.datas.valuationPrice
                }
                // console.log($scope.modalDatas);

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: tplUrl,
                    controller: 'appModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: size,
                    resolve: {
                        modalDatas: function () {
                            return $scope.modalDatas;
                        }
                    }
                });
                modalInstance.result.then(function (datas) {
                    var reqDatas = {
                        remarks: datas.remarks,
                        reqId: $scope.reqId,
                        prepDays: datas.prepDays
                    };
                    demandService.save({
                        detail: "res/reqInfo/"
                    }, reqDatas, function (resp) {
                        $scope.showMsg(resp.msg);
                        if (resp.status === 1) {
                            $scope.status = 1;
                            history.go(-1);
                        }
                    });
                }, function () {
                    // console.info('Modal dismissed at: ' + new Date());
                });

            };
            $scope.editBill = function() {
                $state.go("dls.demPublish.demPublish", {reqId: $scope.reqId})
            }
            $scope.getDatas = function () {
                demandService.save({detail: "req/dtl/"}, {
                    reqId: $scope.reqId
                }, function (resp) {
                    if (resp.status !== 1) {
                        $scope.showMsg(resp.msg);
                        return;
                    }
                    $scope.scenes=[];
                    $scope.datas = resp.data;
                    if(!!$scope.datas.scene){
                        $scope.scenes = $scope.datas.scene.trim().split(',');
                    }
                });
            };
            $scope.getDatas();
        }])
