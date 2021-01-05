/**
 * Created by oxygen on 2017/4/6.
 */
angular.module('myApp.directives', [
        'myApp.services',
        'myApp.apiServices'
    ])
    .directive("dlsLogin", function () {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: "src/directives/tpls/dls_login.html"
        }
    })
    .directive('hasPermission', function (permissions) {
        return {
            link: function (scope, element, attrs) {
                if (!angular.isString(attrs.hasPermission))
                    throw "hasPermission value must be a string";

                var value = attrs.hasPermission.trim();
                var notPermissionFlag = value[0] === '!';
                if (notPermissionFlag) {
                    value = value.slice(1).trim();
                }

                function toggleVisibilityBasedOnPermission() {
                    var hasPermission = permissions.hasPermission(value);

                    if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
                        element.show();
                    else
                        element.hide();
                }

                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    })
    .directive("inputTab", function () {
        return {
            restrict: 'A',
            link: function ($scope, ele) {
                var inputs = $(ele).find("input");
                inputs.focus(function () {
                    $(this).parent().addClass("active");
                }).blur(function () {
                    $(this).parent().removeClass("active");
                })
            }
        }
    })
    .directive("secondaryDropdown", function ($state) {     //二级下拉菜单，必须满足data的格式[{style:图片样式，name：tab名称，content：[{name:二级菜单名},...]}...]
        return {
            restrict: 'E',
            replace: false,
            scope: {
                data: "=",
                curState: "=",
            },
            controller: function ($scope, localStorageService) {
                var viewObj = {};
                $scope.datas = $scope.data;
                $scope.setView = function (view) {
                    if (!viewObj[view]) {
                        viewObj[view] = true;
                    } else {
                        viewObj[view] = !viewObj[view];
                    }
                    $scope.viewObj = viewObj;
                };

                $scope.$watch("curState", function () {
                    $scope.selectData = $scope.curState;
                })

                $scope.curView = function ($event, value) {
                    $scope.selectData = value;
                    $state.go(value)
                    $scope.$emit("changeViewState", value);
                    localStorageService.set('appStatus', null);
                }
            },
            templateUrl: "src/directives/tpls/secondary_dropdown.html"
        }
    })
    .directive("btnTab", function () {
        return {
            restrict: 'E',
            scope: {
                data: "=",
                value: "=",
            },
            controller: function ($scope) {
                $scope.datas = $scope.data;
                $scope.selected = 0;
            },
            link: function ($scope, ele) {
                $scope.btnClick = function ($event, value, index) { //用$event来获取angular中的DOM
                    $scope.value = value.toString();
                    $scope.selected = index;
                };
            },
            templateUrl: "src/directives/tpls/btn_tab.html"
        }
    })

    .directive("showData", function (tradeMallService, $state) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                data: "=",
            },
            controller: function ($rootScope, $scope, tradeMallService) {
                $scope.detail = function (data) {
                    var data = data.originData;
                    data = "connObjId=" + data.connObjId + "?connObjNo=" + data.connObjNo + "?tag_code=" + data.prdtIdCd;
                    $state.go("dls.provider.itemDetail", {data: data});
                }

                $scope.addItem = function ($event, data) {
                    var data = data.originData;

                    var postData = {
                        supMemId: data.supMemId,
                        connObjId: data.connObjId,
                        connObjNo: data.connObjNo,
                        connObjCatCd: data.connObjCatCd,
                        connObjVer: data.connObjVer,
                    }

                    var modalData = {
                        templateUrl: './src/templates/modalViews/addToCartTipModal.html',
                        content: ''
                    };

                    tradeMallService.save({
                        detail: "cart/addCartItem/"
                    }, postData, function (resp) {
                        if (resp.status != 0 && (!!resp.data[0].cartNum)) {
                            $rootScope.cartNum = resp.data[0].cartNum;
                            if ($event.target.nodeName == "A") {
                                $($event.target).addClass("disabledBtn");
                            } else {
                                $($event.target).parent().addClass("disabledBtn");
                            }

                            console.log($event)
                            // console.log($rootScope.cartNum);

                            // modalData.content = resp.msg;
                            modalData.content = "添加到购物车成功！";
                            $scope.$emit("setModalState", modalData);
                        } else if (resp.status == 0) {
                            modalData.content = resp.msg;
                            $scope.$emit("setModalState", modalData);
                        }
                    });
                };

            },
            link: function ($scope, ele) {
                $scope.$watch("data", function () {
                    $scope.datas = $scope.data;
                    if ($scope.datas) {
                        setTimeout(function () {
                            var len = $(".show-data-item").length;
                            var width = $($(".show-data-item")[0]).css("width");
                            for (var i = len - 1; i > len - 5; i--) {
                                $($(".show-data-item")[i]).css("max-width", width);
                            }
                        }, 100)
                    }
                });
            },
            templateUrl: "src/directives/tpls/show_data.html"
        }
    })
    .directive("providerComfirm", function ($state) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                datas: "=",
                options: "="
            },
            controller: function ($scope, tradeMallService) {

                $scope.detail = function (data) {
                    data = "connObjId=" + data.connObjId + "?connObjNo=" + data.connObjNo + "?tag_code=" + data.prdtIdCd;
                    $state.go("dls.provider.itemDetail", {data: data});
                }

                $scope.provider_confirm = function (orderId, type, idx) {
                    if (!orderId) {
                        return;
                    }
                    var modalData = {
                        templateUrl: './src/templates/modalViews/addToCartTipModal.html',
                        content: ''
                    };
                    tradeMallService.save({
                        detail: "order/supConfirm/"
                    }, {
                        id: orderId,
                        type: type
                    }, function (resp) {
                        console.log($scope.datas.data.list);
                        modalData.content = resp.msg;
                        $scope.$emit("setModalState", modalData);
                        if ("订单操作成功！" === resp.msg && "1" === resp.status) {
                            $scope.datas.data.list.splice(idx, 1);
                        } else {
                            console.log('error');

                        }
                    });

                }
                $scope.$watch("datas", function () {
                    // console.log($scope.datas)
                    if ($scope.datas) {
                        $scope.lists = $scope.datas.data.list;
                        // console.log($scope.datas)
                    }
                })
            },
            templateUrl: "src/directives/tpls/provider_comfirm.html"
        }
    })
    .directive("pagination", function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: "=",
                curPage: "=",
            },
            controller: function ($scope) {
                $scope.isStart = true;

                $scope.$watch("options", function (newV, oldV) {
                    if ($scope.options) {
                        var pagesNum = $scope.options.total_pages_num;
                        if ($scope.curPage && $scope.options.per_page_num) {
                            if ($scope.options.total_items_num == 0) {
                                $scope.showDataNum = "0~0"
                            } else {
                                $scope.showDataNum = Number($scope.curPage * $scope.options.per_page_num) < Number($scope.options.total_items_num) ? (($scope.curPage - 1) * $scope.options.per_page_num + 1) + "~" + (($scope.curPage) * $scope.options.per_page_num) : (($scope.curPage - 1) * $scope.options.per_page_num + 1) + "~" + $scope.options.total_items_num;
                            }
                        }
                    }

                    var setBar = function () {
                        if (pagesNum < 5) {                    //当页面小于5页时，显示应有页面数
                            for (var i = 0; i < pagesNum; i++) {
                                $scope.lists[i] = {
                                    num: i,
                                };
                            }
                        } else {                          //当页面大于5页时，显示5个页面数
                            if ($scope.curPage - 3 > 0) {
                                if ($scope.curPage + 3 > pagesNum) {
                                    for (var i = pagesNum - 5; i < pagesNum; i++) {
                                        $scope.lists[i] = {
                                            num: i
                                        }
                                    }
                                } else {
                                    for (var i = $scope.curPage - 3; i < $scope.curPage + 2; i++) {
                                        $scope.lists[i] = {
                                            num: i
                                        }
                                    }
                                }
                            } else {
                                for (var i = 0; i < 5; i++) {
                                    $scope.lists[i] = {
                                        num: i
                                    }
                                }
                            }
                        }
                    }

                    $scope.lists = {};
                    $scope.pageNum = pagesNum;
                    setBar();                                //初置分页样式

                    $scope.getData = function ($event, value) {
                        console.log(value)
                        $scope.lists = {};
                        $scope.curPage = value;
                        setBar();
                    }
                    $scope.getPreData = function () {
                        $scope.lists = {};
                        if ($scope.curPage > 1) {
                            $scope.curPage -= 1;
                        }
                        setBar();
                    }
                    $scope.getNextData = function () {
                        $scope.lists = {};
                        if ($scope.curPage < pagesNum) {
                            $scope.curPage += 1;
                        }
                        setBar();
                    }
                })
            },
            link: function ($scope, ele, attr) {
            },
            templateUrl: "src/directives/tpls/pagination.html"
        }
    })

    .directive("cartOrder", function () {
        return {
            restrict: 'E',
            scope: {
                cartDicts: "="
            },
            controller: ['$rootScope', '$scope', '$filter', '$cookies', 'DlsUtil', 'tradeMallService', 'tradeMallTitles', "$state", function ($rootScope, $scope, $filter, $cookies, DlsUtil, tradeMallService, tradeMallTitles, $state) {
                $scope.DlsUtil = DlsUtil;
                $scope.titles = tradeMallTitles.cartOrderTitles;
                $scope.orderName = "";
                $scope.settModCd = "02";
                $scope.settPeriod = '01';
                $scope.settType = '01';
                $scope.prdtType = '01';

                $scope.deleteItem = function (index) {
                    var csrfToken = $cookies.get('csrftoken');
                    var modalData = {
                        templateUrl: './src/templates/modalViews/addToCartTipModal.html',
                        content: ''
                    };
                    tradeMallService.save({
                        detail: "cart/delCartItem",
                        connObjNo: $scope.cartDicts[index].connObjNo,
                        csrfmiddlewaretoken: csrfToken
                    }, function (resp) {
                        console.log(resp);
                        if (!!resp.data.length) {
                            $scope.cartDicts.splice(index, 1);
                            $rootScope.cartNum = resp.data[0].cartNum;
                            modalData.content = resp.msg;

                            $scope.$emit("setModalState", modalData);
                        }
                    });
                };

                $scope.dateStar = new Date();
                $scope.dateEnd = new Date();

                $scope.confirmOrder = function (dict_k) {
                    console.log(dict_k);
                    $scope.connObjId = [];
                    $scope.connObjNo = [];
                    $scope.valuationPrice = [];
                    $scope.dateStr = [];
                    $scope.supMemRole = [];
                    $scope.sourcePrdTypeStr = [];

                    $scope.dateStar = $filter('dlsDateTimeFilter')($scope.dateStar, 0);
                    $scope.dateEnd = $filter('dlsDateTimeFilter')($scope.dateEnd, 24);

                    var modalData = {
                        templateUrl: './src/templates/modalViews/addToCartTipModal.html',
                        content: ''
                    };
                    if ($scope.dateEnd.getTime() - $scope.dateStar.getTime() < 0) {
                        modalData.content = "订单终止日期应在生效日期之后";
                        $scope.$emit("setModalState", modalData);
                        return;
                    }
                    $scope.dateStr.push($filter("date")($scope.dateStar, 'yyyy-MM-dd HH:mm:ss'), $filter("date")($scope.dateEnd, 'yyyy-MM-dd HH:mm:ss'));

                    for (var i = 0, len = $scope.cartDicts.length; i < len; i++) {
                        $scope.connObjId.push($scope.cartDicts[i].connObjId);
                        $scope.connObjNo.push($scope.cartDicts[i].connObjNo);
                        $scope.valuationPrice.push($scope.cartDicts[i].valuationPrice);
                        $scope.supMemRole.push($scope.cartDicts[i].supMemRole);
                        $scope.sourcePrdTypeStr.push($scope.cartDicts[i].sourcePrdType);
                    }
                    var param = {
                        detail: "cart/confirmOrder",
                        supMemId: dict_k,
                        connObjId: $scope.connObjId.toString(),
                        connObjNo: $scope.connObjNo.toString(),
                        dateStr: $scope.dateStr.toString(),
                        orderName: $scope.orderName,
                        settModCd: $scope.settModCd,
                        settPeriod: $scope.settPeriod,
                        settType: $scope.settType,
                        prdtType: $scope.prdtType,
                        supMemRole: $scope.supMemRole.toString(),
                        sourcePrdTypeStr: $scope.sourcePrdTypeStr.toString(),
                        valuationPrice: $scope.valuationPrice.toString()
                    };
                    tradeMallService.save(param, function (resp) {
                        console.log(resp);
                        if (!!resp.data.length && '1' === resp.status) {
                            console.log("订单确认成功");
                            // console.log(resp);
                            modalData.content = resp.msg;
                            $scope.$emit("setModalState", modalData);
                            $rootScope.cartNum = resp.data[0].cartNum;
                            $scope.cartDicts = [];
                        } else {
                            modalData.content = "订单提交失败";
                            $scope.$emit("setModalState", modalData);
                        }
                    });
                }
                $scope.detail = function (data) {
                    var data = "connObjId=" + data.connObjId + "?connObjNo=" + data.connObjNo + "?tag_code=" + data.tag_code;
                    $state.go("dls.provider.itemDetail", {data: data});
                }
            }],
            link: function ($scope, ele) {

            },
            templateUrl: "src/directives/tpls/cart_order.html"
        }
    })
    .directive("datePicker", function () {
        return {
            restrict: 'E',
            scope: {
                dt: "=",
                mindt: "@",
                maxdt: "@",
                format: "@",
            },
            controller: function ($scope) {
                $scope.datas = $scope.data;
                $scope.today = function () {
                    $scope.dataStart = new Date();
                    $scope.dataEnd = new Date();
                };
                $scope.today();
                $scope.minDate = !!$scope.mindt ? new Date($scope.mindt) : new Date();
                $scope.maxDate = !!$scope.maxdt ? new Date($scope.maxdt) :  new Date(2020, 5, 22);
                $scope.dateOptions = {
                    // dateDisabled: disabled,
                    formatYear: 'yy',
                    format: $scope.format,
                    maxDate: $scope.maxDate,
                    // minDate: new Date(1970, 5, 22),
                    minDate: $scope.minDate,
                    startingDay: 1,
                    showbuttonbar: false,
                    showWeeks: false
                };

                function disabled(data) {
                    var date = data.date,
                        mode = data.mode;
                    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                }

                $scope.open = function () {
                    $scope.popup.opened = true;
                };

                $scope.setDate = function (year, month, day) {
                    $scope.dt = new Date(year, month, day);
                };
                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.dateOptions.format ? $scope.dateOptions.format : $scope.formats[1];
                $scope.altInputFormats = ['M!/d!/yyyy'];
                $scope.popup = {
                    opened: false
                };
            },
            templateUrl: "src/directives/tpls/datepicker.html"
        }
    })
    .directive("signCurrency", function () {
        return {
            restrict: 'E',
            scope: {
                data: "=",
                type: "="
            },
            link: function (scope, ele) {
                // console.log(scope);
            },
            controller: function ($scope) {
                var tmpDate = 0;
                if ("02" === $scope.type || "04" === $scope.type || "10" === $scope.type) {
                    $scope.data = 0 - parseFloat($scope.data);
                }
                if (Number($scope.data) >= 0) {
                    $scope.sign_color = {'color': '#e74c3c'};
                } else {
                    $scope.sign_color = {'color': '#41ad6f'};
                }
            },
            template: '<span ng-style="sign_color" data="data">{{data | dlsCurrencyFilter : true}}</span>'
        }
    })
    .directive('modal', function () {
        return {
            restrict: "E",
            scope: {
                data: "="
            },
            controller: function ($scope, $state) {
                $scope.jumpTo = function (state) {
                    if (!!state) {
                        $state.go(state);
                    }
                }

                $scope.$watch("data", function (newV) {
                    if (newV && newV.state) {
                        setTimeout(function () {
                            $state.go(newV.state);
                        }, 1000)
                    }
                })
            },
            templateUrl: "src/directives/tpls/modal.html"
        }
    })
    .directive("stateBtn", [function () {
        return {
            restrict: 'E',
            scope: {
                data: "="
            },
            controller: function ($scope) {
                // $scope.filtBtnState = function (state) {
                //     if ("01" === state) {
                //         return "待出价";
                //     } else if ("02" === state) {
                //         return "已确认";
                //     } else if ("03" === state) {
                //         return "待确认";
                //     } else if ("04" === state) {
                //         return "已过期";
                //     } else if ("05" === state) {
                //         return "已生效";
                //     } else if ("06" === state) {
                //         return "已失效";
                //     } else if ("07" === state){
                //         return "已拒绝";
                //     } else {return;}
                // }
            },
            template: '<button class="btn tab-btn btn-state{{data}}">{{data | orderStateFilter}}</button>'
        }
    }])
    .directive('dlsTable', ['$rootScope', function ($rootScope) {
        return {
            scope: {
                tabId: '@tabId',
                titles: '=titles',
                datas: '=datas',
                width: '=width'
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                $scope.tabOperate = function ($event) {
                    var key = $event.target.id;
                    if (key === "id") {
                    }
                };
                $scope.widthFlag = function () {
                    if (!!$scope.width) {
                        return true;
                    } else {
                        return false;
                    }
                }();
            },
            restrict: 'AE',
            templateUrl: 'src/directives/tpls/dls_table.html',
            // replace: true,
            transclude: true,
            link: function ($scope, iElm, iAttrs, controller, transclude) {
                var tansNode = transclude()[1];
                if (!tansNode || (!tansNode.tagName && !tansNode.textContent)) {
                    $scope.transHide = true;
                }
            }
        };
    }])
    .directive("stateLabel", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                state: "="
            },
            controller: function ($scope) {
                if ($scope.state) {
                    switch ($scope.state) {
                        case "01" :
                            $scope.stateClass = 'state-label-1';
                            $scope.stateName = '待出价';
                            break;
                        case "02" :
                            $scope.stateClass = 'state-label-2';
                            $scope.stateName = '待确认';
                            break;
                        case "03" :
                            $scope.stateClass = 'state-label-3';
                            $scope.stateName = '已确认';
                            break;
                        case "04" :
                            $scope.stateClass = 'state-label-4';
                            $scope.stateName = '已过期';
                            break;
                        case "05" :
                            $scope.stateClass = 'state-label-5';
                            $scope.stateName = '已生效';
                            break;
                        case "06" :
                            $scope.stateClass = 'state-label-6';
                            $scope.stateName = '已失效';
                            break;
                        case "07" :
                            $scope.stateClass = 'state-label-7';
                            $scope.stateName = '已拒绝';
                            break;
                    }
                }
            },
            template: '<label class="state-label {{stateClass}}" ng-bind="stateName"></label>'
        }
    })
    .directive("spinning", function () {
        return {
            restrict: "CE",
            replace: true,
            templateUrl: 'src/directives/tpls/spinning.html'
        }
    })

    .directive("dlsSelect", function () {
        return {
            restrict: "E",
            scope: {
                datas: "=",
                value: "=",
                selectDisabled: "=",
                selectedLabel: "="
            },
            link: function ($scope, ele) {
                if ($scope.datas) {
                    $scope.selectedLabel = $scope.datas[0].label;
                    $scope.value = $scope.datas[0].value;
                }
                $scope.$watch("selectDisabled", function (nV) {
                    if (nV === true) {
                        $scope.toggleSelect = function () {
                            return false
                        }
                        $($(ele).find(".dls-select-header")[0]).addClass("select-disabled")
                    } else {
                        $scope.selectLabel = function (data) {
                            $scope.selectedLabel = data.label;
                            $scope.value = data.value;
                            $scope.toggle = false;
                        }

                        $scope.toggleSelect = function (event) {
                            $scope.toggle = !$scope.toggle
                        }

                        $($(ele).find(".dls-select-header")[0]).removeClass("select-disabled")
                    }
                })
            },
            template: "<div class='dls-select relative'><label class='block relative dls-select-header f-w-l f-s-12' ng-click='toggleSelect($event)'>{{selectedLabel}}<span class='glyphicon glyphicon-menu-down down'></span></label><section style='border:1px solid #B9B0B0;position:absolute;z-index:1000;width:100px;background-color:#FFF' ng-show='toggle == true'><label ng-repeat='data in datas' class='f-w-l f-s-12 block p-l-10' ng-click='selectLabel(data)'>{{data.label}}</label></section></div>"
        }
    })
    .directive("createArea", function () {
        return {
            restrict: "E",
            scope: {
                datas: "=",
                options: "=",
                items: "=",
                selectedLabels: "=",
                isFirst: "=",
                labelTitle: "@",
            },
            templateUrl: "src/directives/tpls/create_area.html",
            link: function ($scope, ele) {
                $scope.options.btnClick = function (node, event) {
                    var flag = false;
                    for (var i = 0; i < $scope.selectedLabels.length; i++) {
                        if ($scope.selectedLabels[i].node && $scope.selectedLabels[i].node.id === node.id) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        var temp = {
                            id: node.id,
                            name: node.name,
                        }
                        $scope.selectedLabels.push(temp);
                    }
                }
                $scope.removeLabel = function (index) {
                    $scope.selectedLabels.splice(index, 1);
                    $(ele).data("selected", $scope.selectedLabels);
                }

                $scope.removeAreaItem = function (event) {
                    var target = $($(event.target).parents(".provider-c-c-item"))[0]
                    $(target).empty();
                }
            }
        }
    })
    .directive("resetWidth", function () {
        return {
            restrict: "A",
            link: function ($scope, ele) {
                setTimeout(function () {
                    var len = $(ele).find("ul").length;
                    console.log($(".show-data-item").length);
                }, 200)
            }
        }
    })
    .directive('fileModel', ['$parse', 'fileUpload', function ($parse, fileUpload) {
        return {
            restrict: 'A',
            scope: {
                file: "=",
            },
            link: function (scope, element, attrs) {
                element.bind('change', function () {
                    scope.$apply(function () {
                        var fileModel = element[0].files[0];
                        scope.file = fileModel;
                    });
                });
            }
        };
    }])
    .directive("bootstrapSelect", function () {
        return {
            restrict: 'A',
            scope: {
                sourceData: '=',
                selectedData: '=',
                selectDisable: '=?',
            },
            replace: true,
            templateUrl: 'src/directives/tpls/bootstrapSelect.html',
            link: function ($scope, ele) {
                $scope.$watch(function () {
                    return $scope.selectedData;
                }, function () {
                    if ($scope.selectedData) {
                        $scope.sourceData.forEach(function (item) {
                            if ($scope.selectedData === item.value) {
                                $(ele).find('button .name').text(item.name);
                            }
                        })
                    }
                })


                if ($scope.selectDisable) {
                    $(ele).find('button').on("click", function () {
                        return false;
                    }).css({
                        backgroundColor: "#CCC",
                        color: "#EEE",
                    });
                } else {
                    $scope.select = function (item) {
                        $(ele).find('button .name').text(item.name);
                        $scope.selectedData = item.value;
                    }
                }
            }
        }
    })
    .directive("dlsRadio", function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                radioName: '@',
                radioData: '=',
                selectedData: '=',
                radioDisable: '=',
            },
            link: function ($scope, ele) {
                if (!$scope.radioDisable) {
                    $scope.$watch("selectedData", function () {
                        console.log($scope.selectedData)
                        if ($scope.selectedData) {
                            $timeout(function () {
                                $($(ele).find("input")).removeAttr("checked");
                                $($(ele).find("input[value=" + $scope.selectedData + "]")).attr("checked", "checked").prop("check", true);
                            }, 100);
                        }
                    })
                    $scope.select = function (item) {
                        $scope.selectedData = item.value;
                    }
                }
            },
            templateUrl: 'src/directives/tpls/radio.html',
        }
    })
    .directive("myTable", function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                tableData: "=",
                tableOptions: "=",
            },
            replace: true,
            transclude: true,
            link: function ($scope, ele) {
                ////var width = $(ele).width()
                ////console.log(width);
                ////$(ele).find('.wrapper').css('width', width);
                //$(ele).on('scroll', function() {
                //    console.log(1);
                //})
            },
            templateUrl: 'src/directives/tpls/my-table.html',
        }
    })
    .directive("dlsPanel", function() {
        return {
            restrict: "A",
            scope: {
                initial: "@",
            },
            link: function($scope, ele) {
                var height = $($(ele).find("div.dls-new-panel-header")).height();
                var launch = $(ele).find("span[data-toggle='launch']");
                var retract = $(ele).find("span[data-toggle='retract']");
                var editBtn = $(ele).find(".edit-btn");
                var nonEditBtn = $(ele).find(".non-edit-btn");
                var modal = document.createElement("div");
                modal.className = "inner-modal"
                modal.style.position = 'absolute';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.zIndex = 10;
                $($(ele).find("div.dls-new-panel-body")).append(modal);
                nonEditBtn.hide();
                editBtn.on("click", function() {
                    nonEditBtn.show();
                    editBtn.hide();
                    $(ele).find(".inner-modal").hide();
                })
                nonEditBtn.on("click", function() {
                    editBtn.show();
                    nonEditBtn.hide();
                    $(ele).find(".inner-modal").show();
                })
                if($scope.initial === 'retract') {
                    $(ele).height(height);
                    $($(ele).find("div.dls-new-panel-body")).hide();
                    $(launch).hide();
                }else{
                    $(retract).hide();
                }
                $(launch).on("click", function() {
                    $(ele).height(height);
                    $($(ele).find("div.dls-new-panel-body")).hide();
                    $(launch).hide();
                    $(retract).show();
                });
                $(retract).on("click", function() {
                    $(ele).height("auto");
                    $($(ele).find("div.dls-new-panel-body")).show();
                    $(launch).show();
                    $(retract).hide();
                });
            }
        }
    })




