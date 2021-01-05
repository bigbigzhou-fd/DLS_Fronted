'use strict';

angular.module('myApp', [
  'ngCookies',
  'LocalStorageModule',
  'ui.router',
  'ui.bootstrap',
  'myApp.directives',
  'dls.services.util',
  'myApp.dlsControllers',
  'myApp.adminControllers',
  'myApp.quotaControllers',
  'myApp.memberAuditControllers',
  'myApp.memberManageControllers',
  'myApp.memberApplyControllers',
  'myApp.settlementControllers',
  'myApp.configControllers',
  'myApp.analysisControllers',
  'myApp.goodsManageControllers',
  'myApp.algorithmGoodsManageControllers',
  'myApp.accountManageControllers',
  'myApp.productAccountControllers',
  'myApp.signControllers',
  'myApp.demandControllers',
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
.config(['$compileProvider', function( $compileProvider ) {
        $compileProvider.aHrefSanitizationWhitelist(/^(\s*(https?:|ftp:|mailto:|tel:|file:|sms:|javascript:void\(0\)))/);
}])
.config(["$httpProvider", function ($httpProvider) {
　 //更改 Content-Type
   $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
   $httpProvider.defaults.headers.post["Accept"] = "*/*";
   $httpProvider.defaults.transformRequest = function (data) {
       if (data !== undefined) {
           return $.param(data);
       }
       return data;
   };

   $httpProvider.interceptors.push(function($q,$rootScope,$cookies) {
     return {
      request: function(config) {
        if(config.url.indexOf('api') > -1 || config.url.indexOf('rps') > -1) {
          config.headers['X-CSRFToken'] = $cookies.get('csrftoken');
          // console.log(config);
        }
        return config;
      },
       responseError: function(err){
             if(-1 === err.status) {
               console.log("远程服务器无响应");
             } else if(401 === err.status) {
               console.log("用户未登陆或登陆过期！");
               $rootScope.$broadcast("reLogin");
             } else if(403 === err.status) {
               console.log("用户无权限访问！");
               $rootScope.$broadcast("denied");
             } else if (500 === err.status) {
               alert("服务器错误！");
               //$rootScope.$broadcast("reLogin");
             }

             return $q.reject(err);
        }
     };
   });
}])
.run(['$rootScope', '$location','$state','csrfService','permissions',function($rootScope, $location, $state,csrfService,permissions){
  $rootScope.$on('$stateChangeSuccess', function(scope, next, nextParams, current, currentParams) {
    var userPermission = next.permission;
    if (!!userPermission && !permissions.hasPermission(userPermission)) {
      $state.go("dls.denied");
    }
  });
}])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state("admin_login", {
          url: "/admin_login",
          views: {
              "": {
                templateUrl: "./src/templates/login.html"
              }
          }
      })
      .state("dls",{
          url:"/dls",
          templateUrl: "./src/templates/dls.html",
      })
      .state("apply",{
          url:"/apply/signup",
          templateUrl: "./src/templates/acc_apply.html",
      })
      .state("dls.denied",{
          url:"/denied",
          templateUrl: "./src/templates/noRight.html",
      })
      .state("dls.welcome",{
          url:"/welcome",
          templateUrl: "./src/templates/welcome.html",
      })
      .state("dls.resetPwd",{
          url:"/resetPwd",
          templateUrl: "./src/templates/resetPwd.html",
      })
      .state("dls.config",{
        url: "/config",
        views:{
          "":{
            template:"<div ui-view='detail'></div>"
          }
        },
        permission: '90'
      })
      .state("dls.config.discount",{
        url: "/discount",
        views:{
          "detail":{
            templateUrl:"./src/templates/configViews/discount.html"
          }
        },
        permission: '91'
      })
      .state("dls.config.discountConfig",{
        url: "/discountConfig",
        views:{
          "detail":{
            templateUrl:"./src/templates/configViews/discountConfig.html"
          }
        },
        permission: '119'
      })
      .state("dls.config.memRole",{
        url: "/memRole",
        views:{
          "detail":{
            templateUrl:"./src/templates/configViews/memRole.html"
          }
        },
        permission: '101'
      })
      .state("dls.config.supPrice",{
        url: "/supPrice",
        views:{
          "detail":{
            templateUrl:"./src/templates/configViews/supPrice.html"
          }
        },
        permission: '102'
      })

      .state("dls.admin",{
        url: "/admin",
        views:{
          "":{
            template:"<div ui-view='detail'></div>"
          }
        },
        permission: '51'
      })
      .state("dls.admin.tagLib",{
        url: "/tagLib",
        views:{
          "detail":{
            templateUrl:"./src/templates/adminViews/tagLibManage.html"
          }
        },
        permission: '54'
      })
      .state("dls.admin.idLib",{
        url: "/idLib",
        views:{
          "detail":{
            templateUrl:"./src/templates/adminViews/idLibManage.html"
          }
        },
        permission: '64'
      })
      .state("dls.admin.crpManage", {
          url: "/crpManage",
          views:{
              "detail":{
                  templateUrl:"./src/templates/adminViews/crpManage.html"
              }
          },
      })
      .state("dls.admin.createItem",{
          url:"/createItem?data",
          params:{"data":null},
          views:{
              "detail":{
                  templateUrl:"./src/templates/adminViews/algorithm_item_manage_create_item.html"
              }
          },
          permission: '35'
      })
      .state("dls.memberAudit",{
          url:"/memberAudit",
          views:{
              "":{
                  templateUrl:"./src/templates/memberAuditViews/member_audit.html"
              }
          },
          permission: '80'
      })
      .state("dls.memberInfo",{
          url:"/memberInfo",
          views:{
              "":{
                  templateUrl:"./src/templates/memberManage/memberInfo.html"
              }
          },
          permission: '82'
      })
      .state("dls.orderInfo",{
          url:"/orderInfo",
          views:{
              "":{
                  templateUrl:"./src/templates/memberManage/orderInfo.html"
              }
          },
          permission: '83'
      })
      .state("dls.userOperateManage",{
          url:"/userOperateManage",
          views:{
              "":{
                  templateUrl:"./src/templates/memberManage/userOperateManage.html"
              }
          },
          permission: '82'
      })
      .state("dls.openAccountAudit",{
          url:"/account?No",
          params:{"No" : null},
          templateUrl:"./src/templates/memberAuditViews/openAccount.html",
          permission: '86'
      })
      .state("dls.audit",{
          url:"/audit?No",
          params:{"No" : null},
          templateUrl:"./src/templates/memberAuditViews/auditPage.html"
      })
      .state("dls.auditDetail",{
          url:"/auditDetail?No",
          params:{"No" : null},
          templateUrl:"./src/templates/memberAuditViews/auditDetailPage.html",
          permission: '85'
      })
      .state("dls.orderDetailInfo",{
          url:"/orderDetailInfo?No",
          params:{"No" : null},
          templateUrl:"./src/templates/memberManage/orderDetailInfo.html",
          permission: '83'
      })
      .state("dls.itemDetail",{
          url:"/itemDetail?No",
          params:{"No" : null},
          templateUrl:"./src/templates/memberManage/itemDetail.html"
      })
      .state("dls.analysis",{
          url: "/analysis",
          views:{
              "":{
                  template:"<div ui-view='detail'></div>"
              }
          },
          permission: '88'
      })
      .state("dls.analysis.businessLog",{
          url: "/businessLog",
          views:{
              "detail":{
                  templateUrl:"./src/templates/analysisViews/businessLog.html"
              }
          },
          permission: '89'
      })
      .state("dls.analysis.connDetail",{
          url: "/connDetail?type?prdtType?No?start?end",
          params:{type:null,prdtType:null,No:null,start:null,end:null},
          views:{
              "detail":{
                  templateUrl:"./src/templates/analysisViews/connDetail.html"
              }
          },
          permission: '89'
      })
      .state("dls.analysis.orderDetail",{
          url: "/orderDetail?type?prdtIdCd?prdtType?orderId?supId?start?end?supType",
          params:{type:null,orderId:null,supId:null,supType:null},
          views:{
              "detail":{
                  templateUrl:"./src/templates/analysisViews/orderDetail.html"
              }
          },
          permission: '89'
      })
      .state("dls.quota",{
        url: "/quota",
        views:{
          "":{
            template:"<div ui-view='detail'></div>"
          }
        },
        permission: '70'
      })
      .state("dls.quota.manage",{
        url: "/manage",
        views:{
          "detail":{
            templateUrl:"./src/templates/quotaViews/quotaManage.html"
          }
        },
        permission: '71'
      })
      .state("dls.quota.record",{
        url: "/record?memId",
        params:{"memId":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/quotaViews/quotaRecord.html"
          }
        },
        permission: '71'
      })
      .state("dls.quota.adjust",{
        url: "/adjust?memId",
        params:{"memId":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/quotaViews/quotaAdjust.html"
          }
        },
        permission: '71'
      })
      .state("dls.quota.check",{
        url: "/check",
        views:{
          "detail":{
            templateUrl:"./src/templates/quotaViews/quotaCheck.html"
          }
        },
        permission: '72'
      })

      .state("dls.quota.setment",{
        url: "/setment?memId",
        params:{"memId":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/quotaViews/setmentQuery.html"
          }
        },
        permission: '73'
      })
      .state("dls.memberApply",{
          url: "/memberApply",
          views:{
              "":{
                  templateUrl:"./src/templates/memberApplyViews/memberApply.html"
              }
          },
          permission: '77'
      })
      .state("dls.createMemberApply",{
          url: "/createMemberApply",
          views:{
              "":{
                  templateUrl:"./src/templates/memberApplyViews/createMemberApply.html",
                  controller:"createMemberApplyCtrl"
              }
          },
          permission: '87'
      })
      .state("dls.memberApplyView",{
          url: "/memberApplyView?applyNo",
          params:{"applyNo":null},
          views:{
              "":{
                  templateUrl:"./src/templates/memberApplyViews/createMemberApply.html",
                  controller:"createMemberViewCtrl"
              },
          },
          permission: '87'
      })
      .state("dls.memberApplyEdit",{
          url: "/memberApplyEdit?applyNo",
          params:{"applyNo":null},
          views:{
              "":{
                  templateUrl:"./src/templates/memberApplyViews/createMemberApply.html",
                  controller:"createMemberEditCtrl"
              },
          },
          permission: '87'
      })
      .state("dls.settlement",{
        url: "/settlement",
        views:{
          "":{
            template:"<div ui-view='detail'></div>"
          }
        },
        permission: '98'
      })
      .state("dls.settlement.summary",{
        url: "/summary",
        views:{
          "detail":{
            templateUrl:"./src/templates/settlementViews/settlement_summary.html"
          }
        },
        permission: '93'
      })
      .state("dls.settlement.clearing",{
        url: "/clearing",
        views:{
          "detail":{
            templateUrl:"./src/templates/settlementViews/quotaClearing.html"
          }
        },
        permission: '73'
      })
      .state("dls.settlement.manage",{
        url: "/manage",
        params:{"startTime":null, "endTime":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/settlementViews/settlement_manage.html"
          }
        },
        permission: '93'
      })
      .state("dls.settlement.info",{
        url: "/info?memId&startTime&endTime",
        params:{"memId":null,"startTime": null, "endTime": null},
        views:{
          "detail":{
            templateUrl:"./src/templates/settlementViews/settlement_info.html"
          }
        },
        permission: '93'
      })
      .state("dls.settlement.detail",{
        url: "/detail?settNo&memRole",
        params:{"settNo":null,"memRole":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/settlementViews/settlement_detail.html"
          }
        },
        permission: '93'
      })
      .state("dls.settlement.currency",{
        url: "/currency?settNo&taskId}",
        params:{"settNo":null,"taskId":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/settlementViews/settlement_currency.html"
          }
        },
        permission: '93'
      })

      .state("dls.goodsManage",{
        url: "/goodsManage",
        views:{
          "":{
            template:"<div ui-view='detail'></div>",
            controller:"goodsManageUtilCtrl"
          }
        },
        permission: '98'
      })
      .state("dls.goodsManage.list",{
        url: "/list",
        views:{
          "detail":{
            templateUrl:"./src/templates/goodsManageViews/goodsManage.html"
          }
        },
        permission: '54'
      })
      .state("dls.goodsManage.capEdit",{
        url: "/capEdit?mode?code$pCode",
        params:{"code":null,"pCode":null,"mode":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/goodsManageViews/capEdit.html"
          }
        },
        permission: '54'
      })
      .state("dls.goodsManage.crpEdit",{
        url: "/crpEdit?mode?code&pCode",
        params:{"code":null,"pCode":null,"mode":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/goodsManageViews/crpEdit.html"
          }
        },
        permission: '54'
      })

      .state("dls.algorithmGoodsManage",{
        url: "/algorithmGoodsManage",
        views:{
          "":{
            template:"<div ui-view='detail'></div>",
            controller:"algorithmGoodsManageUtilCtrl"
          }
        },
        permission: '98'
      })
      .state("dls.algorithmGoodsManage.list",{
        url: "/list",
        views:{
          "detail":{
            templateUrl:"./src/templates/algorithmGoodsManageViews/algorithmGoodsManage.html"
          }
        },
        permission: '54'
      })
      .state("dls.algorithmGoodsManage.algorithmEdit",{
        url: "/algorithmEdit?mode?code$pCode",
        params:{"code":null,"pCode":null,"mode":null},
        views:{
          "detail":{
            templateUrl:"./src/templates/algorithmGoodsManageViews/algorithmEdit.html"
          }
        },
        permission: '54'
      })
      // .state("dls.algorithmGoodsManage.crpEdit",{
      //   url: "/crpEdit?mode?code&pCode",
      //   params:{"code":null,"pCode":null,"mode":null},
      //   views:{
      //     "detail":{
      //       templateUrl:"./src/templates/algorithmGoodsManageViews/crpEdit.html"
      //     }
      //   },
      //   permission: '54'
      // })








      .state("dls.accountManage",{
        url: "/accountManage",
        views:{
          "":{
            template:"<div ui-view='detail'></div>",
            controller:"accountManageUtilCtrl"
          }
        },
        // permission: '98'
      })
      .state("dls.accountManage.manage",{
        url: "/manage",
        views:{
          "detail":{
            templateUrl:"./src/templates/accountManageViews/accountManage.html"
          }
        },
        permission: '107'
      })
      .state("dls.accountManage.manageView",{
        url: "/manageView?memId",
        params:{"memId" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/accountManageViews/accountManageView.html"
          }
        },
        permission: '116'
      })
      .state("dls.accountManage.accountHistory",{
        url: "/accountHistory?memId",
        params:{"memId" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/accountManageViews/accountHistory.html"
          }
        },
        permission: '118'
      })
      .state("dls.accountManage.accountView",{
        url: "/accountView?memId",
        params:{"memId" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/accountManageViews/accountView.html"
          }
        },
        permission: '116'
      })
      .state("dls.accountManage.freezeList",{
        url: "/freezeList?memId",
        params:{"memId" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/accountManageViews/freezeList.html"
          }
        },
        permission: '105'
      })
      
      .state("dls.accountManage.check",{
        url: "/check",
        views:{
          "detail":{
            templateUrl:"./src/templates/accountManageViews/accountCheck.html"
          }
        },
        permission: '109'
      })

      .state("dls.accountManage.checkRecord",{
        url: "/checkRecord?num",
        params:{"num" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/accountManageViews/checkRecord.html"
          }
        },
        permission: '116'
      })

      .state("dls.productAccount",{
        url: "/productAccount",
        views:{
          "":{
            template:"<div ui-view='detail'></div>",
            controller:"productAccountUtilCtrl"
          }
        },
        // permission: '98'
      })
      .state("dls.productAccount.manage",{
        url: "/manage",
        views:{
          "detail":{
            templateUrl:"./src/templates/productAccountViews/productAccountManage.html"
          }
        },
        permission: '111'
      })
      .state("dls.productAccount.checkHistory",{
        url: "/checkHistory?memId",
        params:{"memId" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/productAccountViews/checkHistory.html"
          }
        },
        permission: '112'
      })
      .state("dls.productAccount.query",{
        url: "/query?memId",
        params:{"memId" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/productAccountViews/productQuery.html",
            controller:"productQueryCtrl"
          }
        },
        permission: '113'
      })
      .state("dls.productAccount.check",{
        url: "/check",
        views:{
          "detail":{
            templateUrl:"./src/templates/productAccountViews/check.html"
          }
        },
        permission: '113'
      })
      .state("dls.productAccount.checkInfo",{
        url: "/checkInfo?memId",
        params:{"memId" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/productAccountViews/productQuery.html",
            controller:"productCheckInfoCtrl"
          }
        },
        permission: '112'
      })

      .state("dls.sign",{
        url: "/sign",
        views:{
          "":{
            template:"<div ui-view='detail'></div>",
            controller:"signUtilCtrl"
          }
        },
        permission: '114'
      })
      .state("dls.sign.manage",{
        url: "/manage",
        views:{
          "detail":{
            templateUrl:"./src/templates/signViews/signManage.html"
          }
        },
        permission: '114'
      })
      .state("dls.sign.info",{
        url: "/info?memId&accountId",
        params:{"memId" : null,"accountId" : null},
        views:{
          "detail":{
            templateUrl:"./src/templates/signViews/signQuery.html",
            controller:"signInfoCtrl"
          }
        },
        permission: '114'
      })
      .state("dls.sign.query",{
        url: "/query?memId&accountId&num",
        params:{"memId" : null,"accountId": null,"num": null},
        views:{
          "detail":{
            templateUrl:"./src/templates/signViews/signQuery.html",
            controller:"signQueryCtrl"
          }
        },
        permission: '114'
      })
      .state("dls.demand",{
        url: "/demand",
        views:{
          "":{
            template:"<div ui-view='detail'></div>",
            controller:"signUtilCtrl"
          }
        },
        permission: '128'
      })
      .state("dls.demand.demandManage",{
        url: "/demandManage",
        views:{
          "detail":{
            templateUrl:"./src/templates/demandViews/demandManage.html"
          }
        },
        permission: '128'
      })
      .state("dls.demand.similarity", {
          url: "/similarity?reqId",
          params: {reqId: null},
          views:{
              "detail":{
                  templateUrl:"./src/templates/demandViews/similarity.html",
              }
          },
          permission: '128'
      })
      .state("dls.demand.similaritySee", {
        url: "/similaritySee?reqId",
        params: {reqId: null},
        views:{
            "detail":{
                templateUrl:"./src/templates/demandViews/similaritySee.html",
            }
        },
        permission: '128'
    })
      .state("dls.demand.supResponse", {
          url: "/supResponse?reqId",
          params: {reqId: null},
          views:{
              "detail":{
                  templateUrl:"./src/templates/demandViews/supResponse.html",
              }
          },
          permission: '128'
      })
      .state("dls.demand.goodsItem",{
        url: "/goodsItem?prdtIdcd&prdtType&reqId",
        params:{"prdtIdcd":null,"prdtType":null,"reqId":null},
        views:{
            "detail":{
                templateUrl:"./src/templates/demandViews/goodsItem.html"
            }
        },
        permission: '128'
    })
    .state("dls.demand.bill", {
      url: "/bill?reqId",
      params: {reqId: null},
      views:{
          "detail":{
              templateUrl:"./src/templates/demandViews/bill.html",
          }
      },
      permission: '128'
    })
    .state("dls.demand.createItem",{
      url:"/createItem?data",
      params:{"data":null},
      views:{
          "detail":{
              templateUrl:"./src/templates/demandViews/provider_item_manage_create_item.html"
          }
      },
      permission: '128'
  })
      $urlRouterProvider.otherwise("/admin_login");
})




