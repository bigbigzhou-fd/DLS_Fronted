'use strict';

angular.module('myApp.memberManageControllers', [
        'myApp.services',
        'dls.services.util'
    ])
    .controller("memberInfoCtrl",["$scope","userService","member_info_titles","debounce",
    function($scope,userService,member_info_titles,debounce){
        $scope.member_info_titles = member_info_titles;
        $scope.searchType = '1';
        $scope.setType = function (type) {
            $scope.searchType = type;
        }

        $scope.search = function (e) {
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.curPageNum = 1;
                $scope.getDatas();
            }
        }

        $scope.$watch("searchType", function (newV, oldV) {
            if (newV !== oldV) {
                $scope.curPageNum = 1;
                $scope.getDatas();
            }
        })

        $scope.$watch("curPageNum", function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        })

        $scope.pageOptions = {};

        $scope.edit = function (list) {
            list.edit = true;
        }

        $scope.cancel = function (list) {
            list.edit = false;
            $scope.getDatas();
        }

        $scope.getDatas = function () {
            var page = $scope.curPageNum;
            var per_page_items = 10;
            if ($scope.searchType == '1') {
                userService.save({
                    detail: "review/mem/list/admin/",
                }, {
                    memId: $scope.searchText,
                    rows: per_page_items,
                    page: $scope.curPageNum,
                }, function (backData) {
                    if (backData.status == 1) {
                        $scope.memberLists = backData.data.list;
                        $scope.pageOptions = {
                            "total_items_num": backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num": backData.data.page.total_pages,  //总共的page数量
                            "per_page_num": per_page_items                   //单页page的data数量
                        };
                    }
                })
            } else if ($scope.searchType == '2') {
                userService.save({
                    detail: "review/mem/list/admin/",
                }, {
                    orgFullNameCN: $scope.searchText,
                    rows: per_page_items,
                    page: $scope.curPageNum,
                }, function (backData) {
                    if (backData.status == 1) {
                        $scope.memberLists = backData.data.list;
                        $scope.pageOptions = {
                            "total_items_num": backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num": backData.data.page.total_pages,  //总共的page数量
                            "per_page_num": per_page_items                   //单页page的data数量
                        };
                    }
                })
            }
        };

        $scope.getDatas();

        $scope.$watch('searchText',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        }, 350));

        $scope.sure = function(list) {
            userService.save({
                detail: "review/mem/updateURL/",
            }, {
                memId: list.memId,
                demmngURL: list.demmngURL,
                svrURL: list.svrURL,
                supmngURL: list.supmngURL,
            }, function (backData) {
                if (backData.status == 1) {
                    $scope.getDatas();
                }
            })
        }

    }])
    .controller("orderInfoCtrl",['$rootScope','$scope','$cookies','order_info_titles','memberService','$state','debounce','localStorageService',
        function($rootScope,$scope,$cookies,order_info_titles,memberService,$state,debounce,localStorageService){
        $scope.order_info_titles = order_info_titles;
        $scope.orderListDatas = "";
        $scope.orderLists = [];
        //$scope.totalItems = 0;
        $scope.searchOptions = "";
        $scope.pageOptions = {};

        var appStatus = localStorageService.get('appStatus');
        $scope.searchText = !!appStatus ? appStatus.searchText : '';
        $scope.curPage = !!appStatus ? appStatus.curPage : 1;
        $scope.searchType = !!appStatus ? appStatus.searchType : 2;

        var per_page_items = 10

        $scope.setStatus = function (orderId, status) {
            memberService.save({
                detail: 'status/set/'
            }, {
                orderId: orderId,
                status: status,
            }, function (resp) {
                if (resp.status == 1) {
                    $scope.getDatas();
                }
            })
        }

        $scope.getDatas = function () {
            console.log($scope.curPage)

            memberService.save(
                {
                    detail: 'list/admin/'
                },
                {
                    keywords: $scope.searchText,
                    type: $scope.searchType,
                    rows: per_page_items,
                    page: $scope.curPage,
                }, function (resp) {
                    if (resp.data.list) {
                        $scope.MemOrderInfo = resp.data.list;
                        $scope.pageOptions = {
                            "total_items_num": resp.data.page.total_rows,   //总共的data数量
                            "total_pages_num": resp.data.page.total_pages,  //总共的page数量
                            "per_page_num": per_page_items                   //单页page的data数量
                        };
                    }
                });
        }

        $scope.getDatas();

        $scope.$watch("curPage", function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        });

        $scope.$watch("searchType", function (newV, oldV) {
            // console.log($scope.searchType)
            if (newV !== oldV) {
                $scope.curPage = 1;
                $scope.getDatas();
            }
        });

        $scope.$watch('searchText',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getDatas();
            }
        }, 350));

        $scope.detail = function (order) {
            var appStatus = {
                'searchText': $scope.searchText,
                'curPage': $scope.curPage,
                'searchType': $scope.searchType,
            };
            localStorageService.set('appStatus', appStatus);

            $state.go('dls.orderDetailInfo', {No: order})
        };
    }])
    .controller("orderDetailInfoCtrl", ['$scope', "memberService", "$state", "order_detail_titles", function ($scope, memberService, $state, order_detail_titles) {
        var orderNo = $state.params.No;
        $scope.orderDetailTitles = order_detail_titles.titles;

        memberService.save(
            {
                detail: 'detail/admin/'
            }, {
                orderId: orderNo
            }, function (backData) {
                if (backData.status == 1) {
                    $scope.demMemName = backData.data.orderInfo.demMemName;
                    $scope.demDeptName = backData.data.orderInfo.getDemInfo_deptName;
                    $scope.supMemName = backData.data.orderInfo.supMemName;
                    $scope.supDeptName = backData.data.orderInfo.getSupInfo_deptName;
                    $scope.orderId = backData.data.orderInfo.orderId;
                    $scope.settModCd = backData.data.orderInfo.settModCd;
                    $scope.status = backData.data.orderInfo.status;
                    $scope.orderEffectDate = backData.data.orderInfo.orderEffectDate;
                    $scope.orderExpiryDate = backData.data.orderInfo.orderExpiryDate;
                    $scope.orderDtlInfoList = backData.data.orderDtlInfoList;
                }
            })

        $scope.detail = function (data) {
            var data = "connObjId=" + data.connObjId + "?connObjNo=" + data.connObjNo + "?tag_code=" + data.prdtIdCd;
            $state.go("dls.itemDetail", {No: data});
        }
    }])
    .controller("itemDetailCtrl", ["$scope", "$state", "providerService", function ($scope, $state, providerService) {
        var urlArr = $state.params.No.split("?");
        var data = {
            connObjId: (urlArr[0].split("="))[1],
            connObjNo: (urlArr[1].split("="))[1],
            tag_code: (urlArr[2].split("="))[1],
        }

        $scope.goBack = function () {
            history.go(-1)
        }
        providerService.save({
            detail: "trade/viewTrade/"
        }, data, function (backData) {
            if (backData) {
                $scope.showAll = true;
                $scope.selectDisabled = true;
                $scope.dataIdStr = backData.data.dataId_str;
                $scope.connObjId = backData.data.connObjId;
                $scope.prdtIdRelList = backData.data.prdtIdRelList;
                $scope.dataScene_str = backData.data.dataScene_str;
                $scope.tagName = backData.data.tagDict.tagName;
                $scope.tagTypeName = backData.data.tagDict.tagTypeName;
                $scope.prdtName = backData.data.prdtBaseInfo.prdtName;
                $scope.keyWord = backData.data.prdtBaseInfo.keyWord;
                $scope.prdtDesc = backData.data.prdtBaseInfo.prdtDesc;
                $scope.sourceIndustry = backData.data.dataIndustry_str;
                $scope.dataArea_str = backData.data.dataArea_str;
                $scope.sourceIndustryArr = backData.data.contextDict[1003];
                $scope.labelContext = backData.data.contextDict[1027];
                $scope.labelWeb = backData.data.contextDict[1028];
                $scope.setValue = backData.data.contextDict[1029];
                $scope.loopPercentage = backData.data.contextDict[1013];
                $scope.memConstraint = backData.data.contextDict[1015];
                $scope.tradeConstraint = backData.data.contextDict[1016];
                $scope.dataOrigin = backData.data.contextDict[1007];
                $scope.dataLoop = backData.data.contextDict[1018];
                //$scope.selfDefine = backData.data.prdtDataEval.evalScore; 质量自评
                $scope.freqLoop = backData.data.contextDict[1020];
                $scope.dataStay = backData.data.contextDict[1022];
                $scope.chargeNum = backData.data.prdtValMode.valuationPrice;
                //$scope.dataSceneArr
                var itemLmtCondList = backData.data.itemLmtCondList;
                $scope.itemLmtCondList = [];

                if ($scope.dataOrigin) {
                    $($("input[name='dataOrigin']")[Number($scope.dataOrigin) - 1]).attr("checked", true)
                }

                for (var i = 0; i < itemLmtCondList.length; i++) {
                    var item = itemLmtCondList[i].lmtVal;
                    var temp = item.split(",");
                    switch (temp[0]) {
                        case '1' :
                            temp[0] = 'PV';
                            break;
                        case '2' :
                            temp[0] = 'UV';
                            break;
                        case '3' :
                            temp[0] = '时长';
                            break;
                        case '4' :
                            temp[0] = '次数';
                            break;
                    }
                    switch (temp[1]) {
                        case '1' :
                            temp[1] = '>';
                            break;
                        case '2' :
                            temp[1] = '<';
                            break;
                        case '3' :
                            temp[1] = '=';
                            break;
                        case '4' :
                            temp[1] = '>=';
                            break;
                        case '5' :
                            temp[1] = '<=';
                            break;
                    }
                    $scope.itemLmtCondList.push(temp);
                }
                switch (backData.data.prdtValMode.valuationModeCd) {
                    case '01' :
                        $scope.chargeType = "单值列表";
                        break;
                    case '02' :
                        $scope.chargeType = "多段列表";
                        break;
                    case '03' :
                        $scope.chargeType = "分段";
                        break;
                }
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
                switch (backData.data.contextDict[1002]) {
                    case '156' :
                        $scope.language = "中文";
                        break;
                    case '826' :
                        $scope.language = "英文";
                        break;
                    case '000' :
                        $scope.language = "其他";
                        break;
                }
                switch (backData.data.contextDict[1004]) {
                    case '01' :
                        $scope.processType = "直接计算";
                        break;
                    case '02' :
                        $scope.processType = "间接计算";
                        break;
                }
                switch (backData.data.contextDict[1010]) {
                    case '01' :
                        $scope.valiDateType = "无";
                        break;
                    case '02' :
                        $scope.valiDateType = "一次验证";
                        break;
                    case '03' :
                        $scope.valiDateType = "二次验证";
                        break;
                }

                switch (backData.data.contextDict[1019]) {
                    case '01' :
                        $scope.freqLoopUnit = "日";
                        break;
                    case '02' :
                        $scope.freqLoopUnit = "周";
                        break;
                    case '03' :
                        $scope.freqLoopUnit = "月";
                        break;
                    case '04' :
                        $scope.freqLoopUnit = "年";
                        break;
                    case '05' :
                        $scope.freqLoopUnit = "小时";
                        break;
                    case '06' :
                        $scope.freqLoopUnit = "分钟";
                        break;
                }

                switch (backData.data.contextDict[1021]) {
                    case '01' :
                        $scope.dataStayUnit = "日";
                        break;
                    case '02' :
                        $scope.dataStayUnit = "周";
                        break;
                    case '03' :
                        $scope.dataStayUnit = "月";
                        break;
                    case '04' :
                        $scope.dataStayUnit = "年";
                        break;
                    case '05' :
                        $scope.dataStayUnit = "小时";
                        break;
                    case '06' :
                        $scope.dataStayUnit = "分钟";
                        break;
                }
            }
        })
    }])
    .controller("userOperateManageCtrl", ["$scope", "logInService", function ($scope, logInService) {
        $scope.pageOptions = {};
        $scope.curPageNum = 1;

        $scope.startTime = new Date();
        $scope.endTime = new Date();

        $scope.search = function () {
            $scope.curPageNum = 1;
            $scope.getDatas();
        }

        $scope.$watch('curPageNum', function () {
            $scope.getDatas();
        })

        $scope.getDatas = function () {
            var page = $scope.curPageNum;
            var per_page_items = 10;
            $scope.st = $scope.startTime.toJSON().replace(new RegExp('/', "g"), '-').substring(0, 10);
            $scope.et = $scope.endTime.toJSON().replace(new RegExp('/', "g"), '-').substring(0, 10);

            //$scope.endTime = $scope.endTime.toString().concat(" 23:59:59");
            logInService.save({
                detail: "opt_logs/",
            }, {
                text: $scope.searchText,
                startDate: $scope.st,
                endDate: $scope.et,
                rows: per_page_items,
                page: $scope.curPageNum,
            }, function (backData) {
                console.log(1)
                if (backData.status == 1) {
                    $scope.operateDatas = backData.data.list;
                    $scope.pageOptions = {
                        "total_items_num": backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num": backData.data.page.total_pages,  //总共的page数量
                        "per_page_num": per_page_items                   //单页page的data数量
                    };
                }
            })
        }
    }])


