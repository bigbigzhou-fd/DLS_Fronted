'use strict';
angular.module('myApp.accountManageControllers', [
        'myApp.services',
        'dls.filters',
        'dls.services.util'
])
.controller("accountManageUtilCtrl",['$scope','$filter','$cookies','DlsUtil','localStorageService'
  , function ($scope,$filter,$cookies,DlsUtil,localStorageService) {

    $scope.modalData = {
        templateUrl : './src/templates/modalViews/addToCartTipModal.html',
        content : ''
    };
    $scope.showMsg = function (msg) {
      $scope.modalData.content = msg;
      $scope.$emit("setModalState",$scope.modalData);
    };
    $scope.checkStates = [{
        'value' : '00',
        'name' : '全部'
      },{
        'value' : '01',
        'name' : '待审核'
      },{
        'value' : '02',
        'name' : '审核通过'
    },{
        'value' : '03',
        'name' : '审核不通过'
    }];
}])
.controller("accountViewCtrl",['$scope','$filter','$cookies','DlsUtil','localStorageService','userService','$stateParams'
  , function ($scope,$filter,$cookies,DlsUtil,localStorageService,userService,$stateParams) {
    $scope.memId = $stateParams.memId;
    $scope.accountDatas = {};
    $scope.disLmtsum = 0;
    $scope.avaHandSelLmtsum = 0;
    $scope.getData = function() {
      userService.save({
        detail: "admin/user/account/",
      }, {
        memId: $scope.memId
      }, function(resp) {
        var accountData = {};
        $scope.prdtArr = [];
        $scope.accountDatas = resp.data;
        for (var i = 0; i < $scope.accountDatas.list.length; i++) {
          $scope.disLmtsum += parseFloat($scope.accountDatas.list[i].disLmt);
          $scope.avaHandSelLmtsum += parseFloat($scope.accountDatas.list[i].avaHandSelLmt);
        }
      });
    }

    $scope.getData();

}])
.controller("accountFreezeCtrl", ['$scope', 'userService','$stateParams', function ($scope, userService,$stateParams) {
    $scope.tradeType = [{
        label: '全部',
        value: '',
    }, {
        label: '充值',
        value: '08',
    }, {
        label: '提现',
        value: '02',
    }];

    $scope.freType = [{
        label: '全部',
        value: '',
    }, {
        label: '解冻',
        value: '01',
    }, {
        label: '冻结',
        value: '02',
    }];
    $scope.memId = $stateParams.memId;

    $scope.originDatas = [];
    $scope.startDt = new Date();
    $scope.endDt = new Date();

    $scope.pageOptions = {
        per_page_num: 10,
    }
    $scope.curPage = 1;

    $scope.$watch("startDt", function () {
        $scope.sd = $scope.startDt.toJSON().substring(0, 10);
    })

    $scope.$watch("endDt", function () {
        $scope.ed = $scope.endDt.toJSON().substring(0, 10);
    })

    $scope.getData = function () {
        $scope.sd = $scope.startDt.toJSON().substring(0, 10);
        $scope.ed = $scope.endDt.toJSON().substring(0, 10);
        userService.save({
            detail: "/admin/user/account/manage/list/",
        }, {
            type: '02',
            startTime: $scope.sd,
            memId: $scope.memId,
            endTime: $scope.ed,
            busType: $scope.selectType,
            freType: $scope.freezeType,
            page: $scope.curPage,
            rows: $scope.pageOptions.per_page_num,
        }, function (backData) {
            $scope.originDatas = backData.data.list;
            $scope.pageOptions = {
                "total_items_num": backData.data.page.total_rows,   //总共的data数量
                "total_pages_num": backData.data.page.total_pages,  //总共的page数量
                "per_page_num": backData.data.page.rows             //单页page的data数量
            };
        })
    }

    $scope.search = function () {
        $scope.curPage = 1;
        $scope.getData();
    }

    $scope.$watch(function () {
        return $scope.selectType + '/' + $scope.freezeType
    }, function () {
        $scope.search();
    })

    $scope.$watch(function () {
        return $scope.curPage
    }, function () {
        $scope.getData();
    })

    $scope.getData();
}])
.controller("accountCheckCtrl", ['$scope', '$filter', '$cookies', '$uibModal', 'DlsUtil', 'localStorageService', 'accountCheckTitles', 'accountManageService', 'userService', 'debounce'
    , function ($scope, $filter, $cookies, $uibModal, DlsUtil, localStorageService, accountCheckTitles, accountManageService, userService, debounce) {
        $scope.titles = accountCheckTitles.titles;
        $scope.pageOptions = {
            "total_items_num": 0,
            "total_pages_num": 1,
            "per_page_num": 10
        };

        $scope.totalItems = 0;
        var  appStatus = localStorageService.get('appStatus');
        $scope.keyword = !!appStatus ? appStatus.keyword : '';
        $scope.status = !!appStatus ? appStatus.status : '00';
        $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;

        $scope.getDatas = function () {
            accountManageService.save({
                detail: "review/list/"
            }, {
                page: $scope.curPageNum,
                keyword: $scope.keyword,
                state: $scope.status
            }, function (resp) {
                $scope.datas = resp.data;
                $scope.pageOptions = {
                    "total_items_num": resp.data.page.total_rows,
                    "total_pages_num": resp.data.page.total_pages,
                    "per_page_num": resp.data.page.rows
                };
            });
        };

        $scope.$watch(function () {
            return $scope.curPageNum + "/" + $scope.status;
        }, function (newV) {
            $scope.getDatas();
        });

        $scope.$watch('keyword',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        }, 350));

        $scope.search = function (e) {
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.getDatas();
            }
        };

        $scope.setStatus = function () {
          var appStatus = {
            'keyword': $scope.keyword,
            'status': $scope.status,
            'curPageNum': $scope.curPageNum
          };
          localStorageService.set('appStatus', appStatus);
        };


        $scope.openModel = function (size, type, index) {
            var tplUrl = './src/templates/modalViews/' + type + '.html';
            // console.log($scope.datas.list[index]);
            $scope.modalDatas = $scope.datas.list[index];
            $scope.modalDatas.notes = '';

            // console.log(modalDatas);

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
                console.log(datas);
                var saveUrl = "limit/chk/review/";
                var reqDatas = {
                    serialNum: datas.serialNum,
                    memId: datas.memId,
                    businessType: datas.businessType,
                    remarks: datas.notes,
                    reviewStatus: datas.result ? '02' : '03',
                };
                userService.save({
                    detail: saveUrl
                }, reqDatas, function (resp) {
                    console.log(resp);
                    $scope.showMsg(resp.msg);
                    if (resp.status === 1) {
                        datas.result ? $scope.datas.list[index].reviewStatus = '02' : $scope.datas.list[index].reviewStatus = '03';
                    }
                });
            }, function () {
                // console.info('Modal dismissed at: ' + new Date());
            });
        };
    }])
.controller("checkRecordCtrl", ['$scope', '$filter', '$cookies', '$stateParams', 'DlsUtil', 'localStorageService', 'checkRecordTitles', 'userService', '$sce'
    , function ($scope, $filter, $cookies, $stateParams, DlsUtil, localStorageService, checkRecordTitles, userService, $sce) {
        $scope.titles = checkRecordTitles.titles;
        $scope.serialNum = $stateParams.num;
        $scope.setPopover = function(data){
            if(!data.remarks) {data.remarks = '--'};
            if(!data.remarks2) {data.remarks2 = '--'};
            if(!data.accountType) {data.accountType = '--'};
            var remark = '<div>申请备注： '+ data.remarks +'<br/> 审核备注： '+ data.remarks2 +'<br/> 调账类型： '+ data.accountType +'</div>'
            $scope.popoverDetail = $sce.trustAsHtml(remark)
        }

        $scope.getData = function () {
            userService.save({
                detail: "limit/review/detail/",
            }, {
                serialNum: $scope.serialNum
            }, function (resp) {
                $scope.datas = resp.data;
            });
        };

        $scope.getData();
    }])
.controller("accountManageCtrl", ['$scope', '$filter', '$cookies', 'DlsUtil', 'localStorageService', 'checkRecordTitles', 'userService'
    , function ($scope, $filter, $cookies, DlsUtil, localStorageService, checkRecordTitles, userService) {
        $scope.pageOptions = {
            per_page_num: 10,
        }

        var  appStatus = localStorageService.get('appStatus');
        $scope.searchText = !!appStatus ? appStatus.searchText : '';
        $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;

        $scope.getData = function () {
            userService.save({
                detail: "admin/user/account/list/",
            }, {
                keyword: $scope.searchText,
                page: $scope.curPageNum,
                rows: $scope.pageOptions.per_page_num,
            }, function (backData) {
                $scope.datas = backData.data.list;
                $scope.pageOptions = {
                    "total_items_num": backData.data.page.total_rows,   //总共的data数量
                    "total_pages_num": backData.data.page.total_pages,  //总共的page数量
                    "per_page_num": backData.data.page.rows             //单页page的data数量
                };
            })
        };

        $scope.$watch(function () {
            return $scope.curPageNum
        }, function (newV, oldV) {
            if(newV !== oldV) {
                $scope.getData();
            }
        })
        $scope.search = function () {
            $scope.curPageNum = 1;
            $scope.getData();
        }

        $scope.setData = function (item) {
            var appStatus = {
                'searchText': $scope.searchText,
                'curPageNum': $scope.curPageNum
            };
            localStorageService.set('appStatus', appStatus);
        };

        $scope.getData();

    }])
.controller("accountHistoryCtrl", ['$scope', '$filter', '$cookies', 'DlsUtil', 'localStorageService', 'checkRecordTitles', 'userService', '$stateParams', '$sce'
    , function ($scope, $filter, $cookies, DlsUtil, localStorageService, checkRecordTitles, userService, $stateParams, $sce) {
        $scope.pageOptions = {
            per_page_num: 10,
        }

        $scope.memId = $stateParams.memId;

        $scope.auditType = [{
            value: '',
            label: '全部',
        }, {
            value: '01',
            label: '审核中',
        }, {
            value: '02',
            label: '审核通过',
        }, {
            value: '03',
            label: '审核不通过',
        }];

        $scope.freezeType = [{
            value: '',
            label: '全部',
        }, {
            value: '02',
            label: '冻结',
        }, {
            value: '01',
            label: '解冻',
        }];

        $scope.tradeType = [{
            value: '',
            label: '全部',
        }, {
            value: '08',
            label: '充值',
        }, {
            value: '02',
            label: '提现',
        }, {
            value: '03',
            label: '授信调整',
        }, {
            value: '04',
            label: '赠送调整',
        }, {
            value: '05',
            label: '调账',
        }, {
            value: '06',
            label: '清算',
        }];

        $scope.freTradeType = [{
            value: '',
            label: '全部',
        }, {
            value: '08',
            label: '充值',
        }, {
            value: '02',
            label: '提现',
        }];

        $scope.reviewStatus = '';

        $scope.curPage = 1;
        $scope.reviewStatus = "";
        $scope.busType = "";
        $scope.freType = "";

        $scope.startDt = new Date();
        $scope.endDt = new Date();

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

        $scope.$watch('btnIndex', function (newV, oldV) {
            if(newV !== oldV) {
                switch ($scope.btnIndex) {
                    case '00':
                        $scope.reviewStatus = '';
                        $scope.search();
                        break;
                    case '01':
                        $scope.busType = '';
                        $scope.search();
                        break;
                    case '02':
                        $scope.freType = '';
                        $scope.busType = '';
                        $scope.search();
                        break;
                }
            }
        })

        $scope.$watch("startDt", function () {
            $scope.sd = $scope.startDt.toJSON().substring(0, 10);
        })

        $scope.$watch("endDt", function () {
            $scope.ed = $scope.endDt.toJSON().substring(0, 10);
        })

        $scope.$watch(function () {
            return $scope.reviewStatus + '/' + $scope.busType + '/' + $scope.freType;
        }, function () {
            $scope.search();
        })

        $scope.getData = function () {
            $scope.sd = $scope.startDt.toJSON().substring(0, 10);
            $scope.ed = $scope.endDt.toJSON().substring(0, 10);
            userService.save({
                detail: "admin/user/account/manage/list/",
            }, {
                type: $scope.btnIndex,
                memId: $scope.memId,
                page: $scope.curPage,
                startTime: $scope.sd,
                endTime: $scope.ed,
                reviewStatus: $scope.reviewStatus,
                busType: $scope.busType,
                freType: $scope.freType,
                rows: $scope.pageOptions.per_page_num,
            }, function (backData) {
                $scope.originDatas = backData.data.list;
                $scope.pageOptions = {
                    "total_items_num": backData.data.page.total_rows,   //总共的data数量
                    "total_pages_num": backData.data.page.total_pages,  //总共的page数量
                    "per_page_num": backData.data.page.rows             //单页page的data数量
                };
            })
        };

        $scope.search = function () {
            $scope.curPage = 1;
            $scope.getData();
        }

        $scope.$watch('curPage', function (newV, oldV) {
            if(newV !== oldV) {
                $scope.getData();
            }
        })
    }])
.controller("accountManageViewCtrl", ['$scope', '$rootScope', '$uibModal', 'userService', '$stateParams', function ($scope, $rootScope, $uibModal, userService, $stateParams) {
    $scope.tradeType = [{
        label: '全部',
        value: '',
    }, {
        label: '营销产品交易记录',
        value: '03',
    }, {
        label: '征信产品交易记录',
        value: '02',
    }];

    $scope.accountDatas = {
        orgFullNameCN: $rootScope.currentUser.company,
        deptName: $rootScope.currentUser.apartment,
    };
    $scope.memId = $stateParams.memId;
    var accountData = {};
    $scope.getData = function () {
        userService.save({
            detail: "admin/user/account/",
        }, {
            memId: $scope.memId,
        }, function (backData) {
            $scope.prdtArr = [];
            $scope.accountDatas = Object.assign($scope.accountDatas, backData.data);
            $scope.prdtArr = $scope.accountDatas.list;
            if ($scope.prdtArr) {
                $scope.prdtArr.forEach(function (item, index) {
                    if (index === 0) {
                        $scope.prdtType = item.prdtType;
                        $scope.accountData = item;
                    }
                    if (item.prdtType === '02') {
                        $scope.accountDatas.crpAvaquota = item.avaHandSelLmtReal;
                    } else if (item.prdtType === '03') {
                        $scope.accountDatas.capAvaquota = item.avaHandSelLmtReal;
                    }
                    accountData[item.prdtType] = item;
                })
                $scope.accountData = accountData[$scope.prdtType];
            }

        })
    };

    $scope.selectPrdt = function(prdtType){
        $scope.prdtType = prdtType;
        $scope.accountData = accountData[prdtType];
    }

    $scope.getData();

    var templateLists = {
        recharge: 'recharge.html',
    };

    $scope.openModal = function (size, type) {
        var tplUrl = './src/templates/modalViews/' + type + '.html';
        var modalDatas = {
            type: type,
            orgFullNameCN: $scope.accountDatas.orgFullNameCN,
            deptName: $scope.accountDatas.deptName,
            memId: $scope.memId,
            avaLmt: $scope.accountDatas.avaLmt,
            totLmtReal: $scope.accountDatas.totLmtReal,
            accruedLmt: $scope.accountDatas.accruedLmt,
            crdLmt: $scope.accountDatas.crdLmt,
            avaCrdLmtReal: $scope.accountDatas.avaCrdLmtReal,
            accruedLmtReal: $scope.accountDatas.accruedLmtReal,
            handSelLmt: $scope.accountDatas.handSelLmt,
            handSelLmtReal: $scope.accountDatas.handSelLmtReal,
            changeType: $scope.accountDatas.changeType,
            businessType: $scope.accountDatas.businessType,
            prdtType: $scope.prdtType,
            crpAvaquota:$scope.accountDatas.crpAvaquota,
            capAvaquota:$scope.accountDatas.capAvaquota,
            accountData:$scope.accountData,
            nowTime:$scope.accountDatas.nowTime
        };
        console.log(modalDatas);

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
                    return modalDatas;
                }
            }
        });
        modalInstance.result.then(function (datas) {
            console.log(datas);
            var saveUrl = "limit/adjust/" + type + "/";
            userService.save({
                detail: saveUrl
            }, datas, function (resp) {
                console.log(resp);
                $scope.showMsg(resp.msg);
            });
        }, function () {
            // console.info('Modal dismissed at: ' + new Date());
        });

    };


}])
