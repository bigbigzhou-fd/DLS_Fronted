'use strict';

angular.module('myApp', [
    'ngCookies',
    'LocalStorageModule',
    'ui.router',
    'ui.bootstrap',
    'myApp.directives',
    'dls.services.util',
    'myApp.dlsControllers',
    'myApp.tradeControllers',
    'myApp.accountControllers',
    'myApp.providerControllers',
    'myApp.demPublishControllers',
    'myApp.customizedControllers',
    //  src/controllers/taskControllers.js
    'myApp.taskControllers',
    'myApp.algorithmManageController',
    'myApp.settlementControllers',
    'myApp.workOrderControllers',
    'myApp.demandControllers',
    'myApp.logControllers',
    'myApp.services',
    'dls.filters',
    'treeControl',
    'moment-picker',
    'angular-md5'
])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('dls')
            .setStorageType('sessionStorage');
    })
    .config(["$httpProvider", function ($httpProvider) {
        //更改 Content-Type
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
        $httpProvider.defaults.headers.post["Accept"] = "*/*";
        $httpProvider.defaults.transformRequest = function (data) {
            //param() 方法创建数组或对象的序列化表示形式
            if (data !== undefined) {
                return $.param(data);
            }
            return data;
        };

        $httpProvider.interceptors.push(function ($q, $rootScope, $cookies) {
            return {
                request: function (config) {
                    if (config.url.indexOf('api') > -1 || config.url.indexOf('rps') > -1) {
                        config.headers['X-CSRFToken'] = $cookies.get('csrftoken');
                        // console.log(config);
                    }
                    $rootScope.isLoading = true;
                    return config;
                },
                response: function (config) {
                    $rootScope.isLoading = false;
                    return config;
                },
                responseError: function (err) {
                    // console.log(err);
                    if (-1 === err.status) {
                        console.log("远程服务器无响应");
                    } else if (401 === err.status) {
                        console.log("用户登录过期");
                        $rootScope.$broadcast("reLogin");
                    } else if (403 === err.status) {
                        console.log("用户无权限访问");
                        $rootScope.$broadcast("denied");
                    }

                    return $q.reject(err);
                }
            };
        });
    }])
    .run(['$rootScope', '$location', '$state', 'csrfService', 'permissions', function ($rootScope, $location, $state, csrfService, permissions) {
        $rootScope.$on('$stateChangeSuccess', function (scope, next, nextParams, current, currentParams) {
            var userPermission = next.permission;
            if (!!userPermission && !permissions.hasPermission(userPermission)) {
                $state.go("dls.denied");
            }
        });
        // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //   // console.log(event,toState, toParams, fromState, fromParams);
        //   // console.log($state);
        //   if ($state.current.name === "login") {
        //     csrfService.token().then(function (resp) {
        //       console.log("output csrftoken___________________");
        //     });
        //   }
        // });
    }])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                views: {
                    "": {
                        templateUrl: "./src/templates/login.html"
                    }
                }
            })
            .state("dls", {
                url: "/dls",
                templateUrl: "./src/templates/dls.html",
            })
            .state("dls.denied", {
                url: "/denied",
                templateUrl: "./src/templates/noRight.html",
            })
            .state("dls.resetPwd", {
                url: "/resetPwd",
                templateUrl: "./src/templates/resetPwd.html",
            })
            .state("dls.trade", {
                url: "/trade",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>"
                    }
                },
                permission: '43'
            })

            .state("dls.trade.mall", {
                url: "/mall",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/trade_mall.html"
                    }
                },
                permission: '43'
            })
            .state("dls.trade.mall.item", {
                url: "/item",
                views: {
                    "": {
                        templateUrl: "./src/templates/tradeViews/trade_mall_item.html"
                    }
                },
                permission: '44'
            })
            .state("dls.trade.mall.set", {
                url: "/item",
                views: {
                    "": {
                        templateUrl: "./src/templates/tradeViews/trade_mall_set.html"
                    }
                },
            })
            .state("dls.trade.mall.goodsCategory", {
                url: "/goodsCategory",
                views: {
                    "": {
                        templateUrl: "./src/templates/tradeViews/goodsCategory.html"
                    }
                }
            })
            // dls.task.mall.tasksCategory
            // /opt/project/DLS_frontEnd/userApp/app/src/templates/taskViews/task.html
            .state("dls.task.mall.tasksCategory", {
                url: "/tasksCategory",
                views: {
                    "": {
                        templateUrl: "./src/templates/taskViews/task.html"
                    }
                }
            })
            .state("dls.trade.goodsItem", {
                url: "/goodsItem?/type/prdtId/transactionSwitchValue",
                params: { "type": null, "prdtId": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/goodsItem.html"
                    }
                }
            })


            .state("dls.trade.cartList", {
                url: "/cartList",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/trade_cart_list.html"
                    }
                },
                permission: '46'
            })
            .state("dls.trade.cart", {
                url: "/cart",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/trade_cart.html"
                    }
                },
                permission: '46'
            })

            //.state("dls.trade.orderDetail",{
            //  url: "/orderDetail?odId}",
            //  params:{"odId":null},
            //  views:{
            //    "detail":{
            //      templateUrl:"./src/templates/tradeViews/trade_orderDetail.html"
            //    }
            //  },
            //  permission: '50'
            //})
            // .state("dls.trade.orderList", {
            //     url: "/orderList",
            //     views: {
            //         "detail": {
            //             templateUrl: "./src/templates/tradeViews/trade_orderList.html"
            //         }
            //     },
            //     permission: '50'
            // })
            .state("dls.trade.demOrder", {
                url: "/orderList?role",
                params: { 'role': 'dem' },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/orderList.html",
                    }
                },
                permission: '50'
            })
            .state("dls.trade.supOrder", {
                url: "/orderList?role",
                params: { 'role': 'sup' },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/orderList.html"
                    }
                },
                permission: '50'
            })
            .state("dls.trade.orderDetail", {
                url: "/orderDetail?orderId?role",
                params: { 'orderId': null, 'role': null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/orderListDetail.html"
                    }
                },
                permission: '50'
            })
            .state("dls.trade.demConfirm", {
                url: "/orderConfirm?data",
                params: { 'data': 'dem' },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/orderConfirm.html"
                    }
                },
                permission: '50'
            })
            .state("dls.trade.supConfirm", {
                url: "/orderConfirm?data",
                params: { 'data': 'sup' },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/orderConfirm.html"
                    }
                },
                permission: '50'
            })
            .state("dls.trade.providerConfirm", {
                url: "/providerConfirm",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/tradeViews/trade_providerConfirm.html"
                    }
                },
                permission: '48'
            })
            .state("dls.provider", {
                url: "/provider",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>"
                    }
                },
            })
            .state("dls.provider.itemManage", {
                url: "/itemManage",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/providerManageViews/provider_item_manage.html"
                    }
                },
            })
            .state("dls.provider.deploy", {
                url: "/deploy?data&idData&cIdData",
                params: { data: null, idData: null, cIdData: null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/providerManageViews/provider_item_deploy.html",
                        controller: "deployCtrl"
                    }
                },
            })
            .state("dls.provider.itemManage.item", {
                url: "/item",
                views: {
                    "": {
                        templateUrl: "./src/templates/providerManageViews/provider_item_manage_item.html"
                    }
                },
                permission: '29'
            })
            .state("dls.provider.createItem", {
                url: "/createItem?data",
                params: { "data": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/providerManageViews/provider_item_manage_create_item.html"
                    }
                },
                permission: '35'
            })
            .state("dls.provider.itemDetail", {
                url: "/itemDetail?data",
                params: { "data": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/providerManageViews/provider_detail.html"
                    }
                },
            })
            .state("dls.provider.editItem", {
                url: "/editItem?data",
                params: { "data": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/providerManageViews/provider_item_manage_edit_item.html"
                    }
                },
                permission: '36'
            })
            .state("dls.provider.itemManage.crp", {
                url: "/crp",
                views: {
                    "": {
                        templateUrl: "src/templates/providerManageViews/provider_item_manage_crp.html"
                    }
                },
                permission: '38'
            })
            .state("dls.provider.createCrp", {
                url: "/createCrp",
                views: {
                    "detail": {
                        templateUrl: "src/templates/providerManageViews/provider_item_manage_create_crp.html"
                    }
                },
                permission: '39'
            })
            .state("dls.provider.dataOrigin", {
                url: "/dataOrigin",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/providerManageViews/provider_data_origin.html"
                    }
                },
                permission: '42'
            })


            .state("dls.algorithm", {
                url: "/algorithm",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>"
                    }
                },
            })
            .state("dls.algorithm.itemManage", {
                url: "/itemManage",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/algorithmManageViews/algorithm_item_manage.html"
                    }
                },
            })
            .state("dls.algorithm.deploy", {
                url: "/deploy?data&idData&cIdData",
                params: { data: null, idData: null, cIdData: null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/algorithmManageViews/algorithm_item_deploy.html",
                        controller: "deployCtrl"
                    }
                },
            })
            // edit by zhou 2021/1/4
            .state("dls.task", {
                url: "/task",
                views: {
                    "": {
                        templateUrl: "./src/templates/taskViews/task1.html"
                    }
                },
                permission: '29'
            })
            .state("dls.task.createTask", {
                url: "/createTask?data",
                params: { "data": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/providerManageViews/provider_item_manage_create_item.html"
                    }
                },
                permission: '35'
            })
            .state("dls.algorithm.itemManage.item", {
                url: "/item",
                views: {
                    "": {
                        templateUrl: "./src/templates/algorithmManageViews/algorithm_item_manage_item.html"
                    }
                },
                permission: '29'
            })
            .state("dls.algorithm.createItem", {
                url: "/createItem?data",
                params: { "data": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/algorithmManageViews/algorithm_item_manage_create_item.html"
                    }
                },
                permission: '35'
            })






            .state("dls.account", {
                url: "/account",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>"
                    }
                }
            })
            .state("dls.account.myAccount", {
                url: "/myAccount",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/accountViews/account_my_account.html"
                    }
                },
            })
            .state("dls.account.tradeDetail", {
                url: "/tradeDetail",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/accountViews/account_trade_detail.html"
                    }
                },
            })
            .state("dls.account.freezeList", {
                url: "/freezeList",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/accountViews/account_freeze_list.html"
                    }
                },
            })
            .state("dls.account.order", {
                url: "/order?odId}",
                params: { "odId": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/accountViews/account_order_detail.html"
                    }
                },
                permission: '67'
            })
            .state("dls.account.quota", {
                url: "/quota",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/accountViews/account_quota.html"
                    }
                },
                permission: '58'
            })
            .state("dls.account.clearing", {
                url: "/clearing",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/accountViews/account_clearing.html"
                    }
                },
                permission: '61'
            })
            .state("dls.settlement", {
                url: "/settlement",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>"
                    }
                },
                permission: '98'
            })
            .state("dls.settlement.summary", {
                url: "/summary",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/settlementViews/settlement_summary.html"
                    }
                },
                permission: '99'
            })
            .state("dls.settlement.detail", {
                url: "/detail?settNo}",
                params: { "settNo": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/settlementViews/settlement_detail.html"
                    }
                },
                permission: '99'
            })
            .state("dls.log", {
                url: "/log",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>"
                    }
                },
                permission: '94'
            })
            .state("dls.log.capDemLog", {
                url: "/capDemLog",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/logViews/log.html",
                        controller: "logCtrl",
                    }
                },
                permission: '95'
            })
            .state("dls.log.capSharedSupLog", {
                url: "/capSharedSupLog",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/logViews/log.html",
                        controller: "logCtrl",
                    }
                },
                permission: '95'
            })
            .state("dls.log.capBuyoutSupLog", {
                url: "/capBuyoutSupLog",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/logViews/log.html",
                        controller: "logCtrl",
                    }
                },
                permission: '95'
            })
            .state("dls.log.dmixDemLog", {
                url: "/dmixDemLog",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/logViews/log.html",
                        controller: "logCtrl",
                    }
                },
                permission: '97'
            })
            .state("dls.log.dmixSupLog", {
                url: "/dmixSupLog",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/logViews/log.html",
                        controller: "logCtrl",
                    }
                },
                permission: '97'
            })
            .state("dls.log.stdDemLog", {
                url: "/stdDemLog",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/logViews/log.html",
                        controller: "logCtrl",
                    }
                },
                permission: '96'
            })
            .state("dls.log.stdSupLog", {
                url: "/stdSupLog",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/logViews/log.html",
                        controller: "logCtrl",
                    }
                },
                permission: '96'
            })
            .state("dls.log.logDetail", {
                url: "/logDetail?type?No?statDate?orderName?st?et",
                params: { "type": null, "No": null, "statDate": null, "orderName": null, "st": null, "et": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/logViews/logDetail.html",
                        controller: "logDetailCtrl",
                    }
                },
                permission: '94'
            })
            .state("dls.workOrder", {
                url: "/workOrderViews",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>"
                    }
                },
                permission: '50'
            })
            .state("dls.workOrder.demList", {
                url: "/list?type",
                params: { "type": "dem" },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/workOrderViews/workOrderList.html",
                        controller: "workOrderListCtrl",
                    }
                },
                permission: '50'
            })
            .state("dls.workOrder.supList", {
                url: "/list?type",
                params: { "type": "sup" },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/workOrderViews/workOrderList.html",
                        controller: "workOrderListCtrl",
                    }
                },
                permission: '50'
            })
            .state("dls.workOrder.routerConfig", {
                url: "/routerConfig?data",
                params: { "data": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/workOrderViews/routerConfig.html",
                        controller: "routerConfigCtrl",
                    }
                },
                permission: '50'
            })
            .state("dls.workOrder.workOrderDetail", {
                url: "/workOrderDetail?data",
                params: { "data": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/workOrderViews/workOrderDetail.html",
                        controller: "workOrderDetailCtrl",
                    }
                },
                permission: '50'
            })
            .state("dls.demand", {
                url: "/demand",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>",
                        controller: "demandUtilCtrl",
                    }
                },
                permission: '119'
            })
            .state("dls.demand.hall", {
                url: "/hall",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/demandViews/hall.html"
                    }
                },
                permission: '119'
            })
            .state("dls.demand.similarity", {
                url: "/similarity?reqId",
                params: { "reqId": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/demandViews/similarity.html"
                    }
                },
                permission: '119'
            })
            .state("dls.demand.goodsItem", {
                url: "/goodsItem?prdtIdcd&prdtType&reqId",
                params: { "prdtIdcd": null, "prdtType": null, "reqId": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/demandViews/goodsItem.html"
                    }
                },
                permission: '119'
            })
            .state("dls.demand.bill", {
                url: "/bill?reqId?type?status?reqType",
                params: { "reqId": null, "type": null, "status": null, "reqType": null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/demandViews/bill.html"
                    }
                },
                permission: '119'
            })
            .state("dls.demPublish", {
                url: "/demPublish",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>"
                    }
                },
                permission: '120'
            })
            .state("dls.demPublish.demPublish", {
                url: "/demPublish?reqId",
                params: { type: null, reqId: null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/demPublish/demPublish.html",
                    }
                },
                permission: '120'
            })
            .state("dls.demPublish.demManage", {
                url: "/demManage",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/demPublish/demManage.html",
                    }
                },
                permission: '120'
            })
            .state("dls.demPublish.supResponse", {
                url: "/supResponse?reqId",
                params: { reqId: null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/demPublish/supResponse.html",
                    }
                },
                permission: '120'
            })
            .state("dls.demPublish.similarity", {
                url: "/similarity?reqId",
                params: { reqId: null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/demPublish/similarity.html",
                    }
                },
                permission: '120'
            })
            .state("dls.customizedViews", {
                url: "/customizedViews",
                views: {
                    "": {
                        template: "<div ui-view='detail'></div>",
                        controller: "customizedCtrl",
                    }
                },
                permission: '120'
            })
            .state("dls.customizedViews.demPublish", {
                url: "/demPublish?reqId?reqType",
                params: { type: null, reqId: null, reqType: null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/customizedViews/demPublish.html",
                    }
                },
                permission: '120'
            })
            .state("dls.customizedViews.acceptanceCheck", {
                url: "/acceptanceCheck",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/customizedViews/acceptanceCheck.html",
                    }
                },
                permission: '120'
            })
            .state("dls.customizedViews.demManage", {
                url: "/demManage",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/customizedViews/demManage.html",
                    }
                },
                permission: '120'
            })
            .state("dls.customizedViews.hall", {
                url: "/hall",
                views: {
                    "detail": {
                        templateUrl: "./src/templates/customizedViews/hall.html"
                    }
                },
                permission: '119'
            })
            .state("dls.taskViews.task", {
                url: "/task",
                views: {
                    "detail": {
                        // /opt/project/DLS_frontEnd/userApp/app/src/templates/taskViews/task.html
                        templateUrl: "./src/templates/taskViews/task.html"
                    }
                },
                permission: '119'
            })
            .state("dls.customizedViews.supResponse", {
                url: "/supResponse?reqId",
                params: { reqId: null },
                views: {
                    "detail": {
                        templateUrl: "./src/templates/customizedViews/supResponse.html",
                    }
                },
                permission: '120'
            })


        $urlRouterProvider.otherwise("/login");
    })
