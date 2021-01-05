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
                $scope.$watch("data", function () {
                    $scope.datas = $scope.data;
                });

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
                            $($event.target).addClass("disabledBtn");
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
                    var pagesNum = $scope.options.total_pages_num;
                    if ($scope.curPage && $scope.options.per_page_num) {
                        if ($scope.options.total_items_num == 0) {
                            $scope.showDataNum = "0~0"
                        } else {
                            $scope.showDataNum = Number($scope.curPage * $scope.options.per_page_num) < Number($scope.options.total_items_num) ? (($scope.curPage - 1) * $scope.options.per_page_num + 1) + "~" + (($scope.curPage) * $scope.options.per_page_num) : (($scope.curPage - 1) * $scope.options.per_page_num + 1) + "~" + $scope.options.total_items_num;
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
            controller: ['$rootScope', '$scope', '$filter', '$cookies', 'DlsUtil', 'tradeMallService', 'cart_titles', "$state", function ($rootScope, $scope, $filter, $cookies, DlsUtil, tradeMallService, cart_titles, $state) {
                $scope.DlsUtil = DlsUtil;
                $scope.titles = cart_titles.titles;
                $scope.orderName = "";
                $scope.settModCd = "02";

                $scope.deleteItem = function (index) {
                    // console.log($scope.cartDicts[index].connObjNo);/
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
                            $scope.cartDicts.pop(index);
                            $rootScope.cartNum = resp.data[0].cartNum;
                            modalData.content = resp.msg;

                            $scope.$emit("setModalState", modalData);
                        }
                    });
                };

                $scope.dateStar = new Date();
                $scope.dateEnd = new Date();

                $scope.confirmOrder = function (dict_k) {
                    $scope.connObjId = [];
                    $scope.connObjNo = [];
                    $scope.valuationPrice = [];
                    $scope.dateStr = [];

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
                    $scope.dateStr.push($scope.dateStar.toLocaleString(), $scope.dateEnd.toLocaleString());

                    for (var i = 0, len = $scope.cartDicts.length; i < len; i++) {
                        $scope.connObjId.push($scope.cartDicts[i].connObjId);
                        $scope.connObjNo.push($scope.cartDicts[i].connObjNo);
                        $scope.valuationPrice.push($scope.cartDicts[i].valuationPrice);
                    }
                    tradeMallService.save({
                        detail: "cart/confirmOrder",
                        supMemId: dict_k,
                        connObjId: $scope.connObjId.toString(),
                        connObjNo: $scope.connObjNo.toString(),
                        dateStr: $scope.dateStr.toString(),
                        orderName: $scope.orderName,
                        settModCd: $scope.settModCd,
                        valuationPrice: $scope.valuationPrice.toString()
                    }, function (resp) {
                        console.log(resp);
                        if (!!resp.data.length) {
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
                $scope.dateOptions = {
                    // dateDisabled: disabled,
                    formatYear: 'yy',
                    format: this.format,
                    maxDate: $scope.maxdt ? new Date($scope.maxdt) : new Date(2025, 1, 1),
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
    .directive("discountForm", ['$filter', '$cookies', 'settlementService', 'DlsUtil'
        , function ($filter, $cookies, settlementService, DlsUtil) {
            return {
                restrict: 'E',
                scope: {
                    data: "=",
                    addnewflag: "=addnewflag",
                    disableflag: "@"
                },
                controller: function ($scope, $element) {

                },
                link: function ($scope, ele) {
                    var csrfToken = $cookies.get('csrftoken');
                    var oldDatas = $filter("cloneObj")($scope.data);
                    ;
                    var modalData = {
                        templateUrl: './src/templates/modalViews/addToCartTipModal.html',
                        content: ''
                    };

                    $scope.flag = true;
                    $(ele[0]).find("input").attr("disabled", true);
                    $scope.save = function () {
                        settlementService.save({
                            detail: "conf/discount/edit",
                            csrfmiddlewaretoken: csrfToken
                        }, function (resp) {
                            if (resp.status === 1) {
                                $(ele[0]).find("input").attr("disabled", true);
                                modalData.content = "保存成功！";
                                $scope.$emit("setModalState", modalData);
                            }

                        });
                    };

                    $scope.edit = function () {
                        $scope.flag = false;
                        $(ele[0]).find("input").removeAttr("disabled");
                    };
                    $scope.cancle = function () {
                        $scope.flag = true;
                        $scope.data = $filter("cloneObj")(oldDatas);
                        $(ele[0]).find("input").attr("disabled", true);
                    };

                },
                templateUrl: "src/directives/tpls/discount_form.html"
            }
        }])

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

                $scope.$watch("data", function(newV){
                    if (newV && newV.state) {
                        setTimeout(function(){
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
            template: "<div class='dls-select relative'><label class='block relative dls-select-header f-w-l f-s-12' ng-click='toggleSelect($event)'>{{selectedLabel}}<span class='glyphicon glyphicon-menu-down down'></span></label><section class='select-body' ng-show='toggle == true'><label ng-repeat='data in datas' class='f-w-l f-s-12 block p-l-10' ng-click='selectLabel(data)'>{{data.label}}</label></section></div>"
        }
    })
    .directive("createArea", function () {
        return {
            restrict: "E",
            scope: {
                datas: "=",
                options: "=",
                items: "=",
                selectedLabels: "=?",
                isFirst: "=",
                labelTitle: "@",
            },
            templateUrl: "src/directives/tpls/create_area.html",
            link: function ($scope, ele) {
                $scope.options.btnClick = function (node, event) {
                    var flag = false;
                    for (var i = 0; i < $scope.selectedLabels.length; i++) {
                        if ($scope.selectedLabels[i].node.id === node.id) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        var temp = {
                            node: node,
                            target: event.target,
                        }
                        $scope.selectedLabels.push(temp);
                        $(event.target).css("visibility", "hidden")
                    }
                }
                $scope.removeLabel = function (index) {
                    $($scope.selectedLabels[index].target).css({
                        "visibility": "visible",
                    });
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
    .directive("checkInput", function () {
        return {
            restrict: "A",
            link: function ($scope, ele) {
                $(ele).change(function () {
                    if ($(this)[0].files.length != 0) {
                        $($(this).next("label")[0]).css('display', 'none')
                    } else {
                        $($(this).next("label")[0]).css('display', 'inline-block')
                        console.log(0)
                    }
                })
            }
        }
    })
    .directive("newSelect", function () {
        return {
            restrict: "A",
            scope: {
                value: "=",
            },
            link: function ($scope, ele) {
                $scope.$watch("value", function (nv, ov) {
                    if (!ov) {
                        $(ele).find('option').each(function () {
                            if ($(this).attr('value') == $scope.value) {
                                $(this).attr("selected", true);
                            } else {
                                $(this).removeAttr("selected");
                            }
                        })
                    }
                })


                $(ele).change(function () {
                    $scope.value = $(this).val()
                })
            }
        }
    })
    .directive("goodsStatusBtn", [function () {
        return {
            restrict: 'E',
            scope: {
                data: "="
            },
            controller: function ($scope) {
            },
            template: '<button class="btn tab-btn btn-state0{{data}}">{{data | goodsStatusFilter}}</button>'
        }
    }])
    .directive("releaseStateBtn", [function () {
        return {
            restrict: 'E',
            scope: {
                data: "="
            },
            controller: function ($scope) {
            },
            template: '<button class="btn tab-btn btn-state0{{data}}">{{data | releaseStateFilter}}</button>'
        }
    }])
    .directive("sceneStateBtn", [function () {
        return {
            restrict: 'E',
            scope: {
                data: "="
            },
            controller: function ($scope) {
               $scope.data = $scope.data.split(',')
            },
            template: '<button class="btn btn-state0" style="min-width:110px;font-size:12px;color:#fff;"><span ng-repeat="(index,value) in data" class="m-lr-8">{{value|sceneStateFilter}}</span></button>'
        }
    }])


