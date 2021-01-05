'use strict';
angular.module('myApp.configControllers', [
        'myApp.services',
        'dls.filters',
])
	.controller("configDiscountCtrl",['$scope','$filter','$cookies','settlementService','DlsUtil'
        , function ($scope,$filter,$cookies,settlementService,DlsUtil) {
        $scope.titles = ["会员编号","会员角色","产品类型","会员折扣"];
    	var csrfToken = $cookies.get('csrftoken');
          //   	var oldDatas = [];
    	var modalData = {
    	    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
    	    content : ''
    	};
        $scope.totalItems = 0;
        $scope.curPageNum = 1;
        $scope.pageOptions = {};

        $scope.$watch("curPageNum",function(){
            $scope.getDatas($scope.memId);
        });
        $scope.getDatas = function (memId) {
            memId = memId || $scope.memId;
            settlementService.save({detail:"conf/discount/list",page:$scope.curPageNum,memId:memId,csrfmiddlewaretoken:csrfToken},function(resp){
                $scope.dataLists = resp.data.list;
                $scope.totalItems = resp.data.page.total_rows;
                $scope.pageOptions = {
                    "total_items_num" : $scope.totalItems,   //总共的data数量
                    "total_pages_num" : resp.data.page.total_pages,  //总共的page数量
                    "per_page_num" : resp.data.page.rows             //单页page的data数量
                };
            });
        };

        $scope.memDiscount = "";
        $scope.memRole = "";
        $scope.prdtType = "";
        var old_memDiscount  = "";
        var old_memRole = "";
        var old_prdtType = "";
        $scope.editItem = function (index,event) {
            $scope.renderId = index;
            if (event) {
                $scope.memDiscount  = old_memDiscount = $scope.dataLists[index].memDiscount;
                $scope.memRole  = old_memRole = $scope.dataLists[index].memRole;
                $scope.prdtType = old_prdtType   = $scope.dataLists[index].prdtType;
            }
        };

        $scope.saveItem = function (index,event,memId,id) {
            var tr = $(event.target).parent().parent();
            var tobeEdit = tr.find('.edit');
            // console.log(memId);
            if (!id && !/^[0-9]{7}$/.test(memId)) {
                modalData.content = "请输入7位数字组成的会员编号！";
                $scope.$emit("setModalState",modalData);
                return;
            }

            var new_memRole = $(tr.find('select')[0]).val();
            var new_prdtType   = $(tr.find('select')[1]).val();
            var new_memDiscount       = !!id ? $(tobeEdit[0]).val() : $(tobeEdit[1]).val();
            new_memDiscount = $filter('number')(new_memDiscount, 2);
            if (!new_memDiscount || isNaN(new_memDiscount) || parseFloat(new_memDiscount) > 1 || parseFloat(new_memDiscount) <= 0) {
                modalData.content = "请输入0~1之间的合法折扣，保留两位小数！";
                $scope.$emit("setModalState",modalData);
                return;
            }
            if (new_memRole === old_memRole && new_prdtType === old_prdtType && new_memDiscount === old_memDiscount) {
                // console.log("未修改");
                $scope.renderId = undefined;
            } else if (!new_memRole || !new_prdtType || !new_memDiscount) {
                modalData.content = "请将标签名称、标签类型和标签赋值输入完整！";
                $scope.$emit("setModalState",modalData);
                return;
            } else {
                // console.log(new_memRole,new_prdtType,new_memDiscount);
                settlementService.save({
                    detail: "conf/discount/edit"
                }, {
                    id: !!id ? $scope.dataLists[index].id : undefined,
                    memId: memId,
                    memRole: new_memRole,
                    prdtType: new_prdtType,
                    memDiscount: new_memDiscount,
                    csrfmiddlewaretoken: csrfToken
                }, function (resp) {
                    // console.log(resp);
                    if (resp.status == 1) {
                        if (!!id) {
                            $scope.dataLists[index].memRole = new_memRole;
                            $scope.dataLists[index].prdtType = new_prdtType;
                            $scope.dataLists[index].memDiscount = new_memDiscount;
                            $scope.renderId = undefined;
                        } else {
                            var tmp = {};
                            tmp.memId = memId;
                            tmp.memRole = new_memRole;
                            tmp.prdtType = new_prdtType;
                            tmp.memDiscount = new_memDiscount;
                            $scope.dataLists.push(tmp);
                            $scope.addNewItemFlag = 0;
                        }

                    } else if (resp.status === 0) {
                    }
                    modalData.content = resp.msg;
                    $scope.$emit("setModalState",modalData);

                });
            }
        };
        $scope.cancelEditItem = function (index,event) {
            $scope.renderId = undefined;
            $scope.addNewItemFlag = 0;
        };
        $scope.addNewItem = function () {
            $scope.memDiscount = "0";
            $scope.memRole = "01";
            $scope.prdtType = "01";
            $scope.addNewItemFlag = 1;
        };



    }])
   
    .controller("configMemRoleCtrl", ['$scope','$filter','$cookies','settlementService','DlsUtil'
        ,function ($scope,$filter,$cookies,settlementService,DlsUtil) {

            $scope.titles = ["会员编号","会员角色","产品类型"];
            var modalData = {
                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                content : ''
            };
              $scope.totalItems = 0;
              $scope.curPageNum = 1;
              $scope.pageOptions = {};

              $scope.$watch("curPageNum",function(){
                  $scope.getDatas($scope.memId);
              });
              $scope.getDatas = function (memId) {
                  memId = memId || $scope.memId;
                  settlementService.save({detail:"conf/memRole/list",page:$scope.curPageNum,memId:memId},function(resp){
                      console.log(resp.data);

                      $scope.dataLists = resp.data.list;
                      $scope.totalItems = resp.data.page.total_rows;
                      $scope.pageOptions = {
                          "total_items_num" : $scope.totalItems,   //总共的data数量
                          "total_pages_num" : resp.data.page.total_pages,  //总共的page数量
                          "per_page_num" : resp.data.page.rows             //单页page的data数量
                      };
                  });
              };

              // $scope.memDiscount = "";
              $scope.memRole = "";
              $scope.prdtType = "";
              // var old_memDiscount  = "";
              var old_memRole = "";
              var old_prdtType = "";
              $scope.editItem = function (index,event) {
                  $scope.renderId = index;
                  if (event) {
                      $scope.memRole  = old_memRole = $scope.dataLists[index].memRole;
                      $scope.prdtType = old_prdtType   = $scope.dataLists[index].prdtType;
                  }
              };

              $scope.saveItem = function (index,event,memId,id) {
                  var tr = $(event.target).parent().parent();
                  var tobeEdit = tr.find('.edit');

                  if (!id && !/^[0-9]{7}$/.test(memId)) {
                      modalData.content = "请输入7位数字组成的会员编号！";
                      $scope.$emit("setModalState",modalData);
                      return;
                  }

                  var new_memRole = $(tr.find('select')[0]).val();
                  var new_prdtType   = $(tr.find('select')[1]).val();
                  if (new_memRole === old_memRole && new_prdtType === old_prdtType ) {
                      console.log("未修改");
                      $scope.renderId = undefined;
                  } else if (! new_memRole || ! new_prdtType) {
                      modalData.content = "请选择会员角色和产品类型！";
                      $scope.$emit("setModalState",modalData);
                      return;
                  } else {
                      console.log(new_memRole,new_prdtType);
                      settlementService.save({
                          detail: "conf/memRole/edit"
                      }, {
                          id: !!id ? $scope.dataLists[index].id : undefined,
                          memId: memId,
                          memRole: new_memRole,
                          prdtType: new_prdtType
                      }, function (resp) {
                          console.log(resp);
                          if (resp.status == 1) {
                              if (!!id) {
                                  $scope.dataLists[index].memRole = new_memRole;
                                  $scope.dataLists[index].prdtType = new_prdtType;
                                  $scope.renderId = undefined;
                              } else {
                                  var tmp = {};
                                  tmp.memId = memId;
                                  tmp.memRole = new_memRole;
                                  tmp.prdtType = new_prdtType;
                                  $scope.dataLists.push(tmp);
                                  $scope.addNewItemFlag = 0;
                              }

                          } else if (resp.status === 0) {
                          }
                          modalData.content = resp.msg;
                          $scope.$emit("setModalState",modalData);

                      });
                  }
              };
              $scope.cancelEditItem = function (index,event) {
                  $scope.renderId = undefined;
                  $scope.addNewItemFlag = 0;
              };
              $scope.addNewItem = function () {
                  $scope.memRole = "01";
                  $scope.prdtType = "01";
                  $scope.addNewItemFlag = 1;
              };
    }])
    .controller("configSupPriceCtrl", ['$scope','$filter','$cookies','settlementService','DlsUtil'
        ,function ($scope,$filter,$cookies,settlementService,DlsUtil) {
            // $scope.timeStamp = new Date();
            $scope.titles = ["交易品编号","单价"];
            var modalData = {
                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                content : ''
            };
              $scope.totalItems = 0;
              $scope.curPageNum = 1;
              $scope.pageOptions = {};

              $scope.$watch("curPageNum",function(){
                  $scope.getDatas($scope.prdtIdCd);
              });
              $scope.getDatas = function (prdtIdCd) {
                  prdtIdCd = prdtIdCd || $scope.prdtIdCd;
                  settlementService.save({detail:"conf/capPrice/list",page:$scope.curPageNum,prdtIdCd:prdtIdCd},function(resp){
                      console.log(resp.data);

                      $scope.dataLists = resp.data.list;
                      $scope.totalItems = resp.data.page.total_rows;
                      $scope.pageOptions = {
                          "total_items_num" : $scope.totalItems,   //总共的data数量
                          "total_pages_num" : resp.data.page.total_pages,  //总共的page数量
                          "per_page_num" : resp.data.page.rows             //单页page的data数量
                      };
                  });
              };


              $scope.memRole = "";
              $scope.prdtType = "";
              // var old_memDiscount  = "";
              var old_prdtIdCd = "";
              var old_price = "";
              $scope.editItem = function (index,event) {
                $scope.addNewItemFlag = 0;
                  $scope.renderId = index;
                  if (event) {
                      $scope.prdtIdCd  = old_prdtIdCd = $scope.dataLists[index].prdtIdCd;
                      $scope.price = old_price   = $scope.dataLists[index].price;
                  }
              };

              $scope.saveItem = function (index,event,prdtIdCd,price,addNewFlag) {
                  var tr = $(event.target).parent().parent();
                  var tobeEdit = tr.find('.edit');

                  var new_prdtIdCd = prdtIdCd;
                  var new_price   = price;

                  if (!/^[0-9]{6}$/.test(new_prdtIdCd)) {
                      modalData.content = "请输入6位数字组成的交易品编号！";
                      $scope.$emit("setModalState",modalData);
                      return;
                  }
                  if (isNaN(new_price)) {
                      modalData.content = "请输入合法数字！";
                      $scope.$emit("setModalState",modalData);
                      return;
                  }

                  if (!addNewFlag && new_prdtIdCd === old_prdtIdCd && new_price === old_price ) {
                      console.log("未修改");
                      $scope.renderId = undefined;
                  }else if (! new_prdtIdCd || ! new_price) {
                      modalData.content = "请输入交易品编号和价格！";
                      $scope.$emit("setModalState",modalData);
                      return;
                  }

                  settlementService.save({
                      detail: "conf/capPrice/edit"
                  }, {
                    prdtIdCd: prdtIdCd,
                    price: price
                  }, function (resp) {
                      console.log(resp);
                      if (resp.status == 1) {
                            if (!!addNewFlag) {
                                var tmp = {};
                                tmp.prdtIdCd = prdtIdCd;
                                tmp.price = price;
                                // tmp.timeStamp = $scope.timeStamp;
                                $scope.dataLists.push(tmp);
                                $scope.addNewItemFlag = 0;
                            } else {
                                $scope.dataLists[index].prdtIdCd = prdtIdCd;
                                $scope.dataLists[index].price = price;
                                // $scope.dataLists[index].timeStamp = $filter('dlsDateFilter')($scope.timeStamp);
                                $scope.renderId = undefined;
                            }
                          } else if (resp.status === 0) {
                          }
                            modalData.content = resp.msg;
                            $scope.$emit("setModalState",modalData);
                  });
              };
              $scope.cancelEditItem = function (index,event) {
                  $scope.renderId = undefined;
                  $scope.addNewItemFlag = 0;
              };
              $scope.addNewItem = function () {
                  $scope.prdtIdCd = "";
                  $scope.price = "";
                  // $scope.timeStamp = new Date();
                  $scope.addNewItemFlag = 1;
              };
    }])
    .controller("configCPageCtrl",['$scope','$filter','$cookies','DlsUtil','signManageService','configPageTitles', 'debounce','localStorageService'
  , function ($scope,$filter,$cookies,DlsUtil,signManageService,configPageTitles, debounce,localStorageService) {
    $scope.titles = configPageTitles.titles;
    $scope.datas = {
        list: []
    };
    $scope.pageOptions = {
      "total_items_num" : 0,
      "total_pages_num" : 1,
      "per_page_num" : 10
    };
    // $scope.curPageNum = 1;
    $scope.totalItems = 0;

    var  appStatus = localStorageService.get('appStatus');
    console.log(appStatus)
    $scope.keyword = !!appStatus ? appStatus.keyword : '';
    $scope.status = !!appStatus ? appStatus.status : '00';
    $scope.curPageNum = !!appStatus ? appStatus.curPageNum : 1;

    $scope.getDatas = function () {
      signManageService.save({
          detail: "list"
      }, {
      	page: $scope.curPageNum,
        keyword:$scope.keyword,
        status:$scope.status
      }, function (resp) {
        $scope.datas = resp.data;
        console.log(resp.data);
        $scope.pageOptions = {
            "total_items_num" : resp.data.page.total_rows,
            "total_pages_num" : resp.data.page.total_pages,
            "per_page_num" : resp.data.page.rows
        };
      });
    };
    $scope.$watch(function(){
        return $scope.curPageNum + '/' + $scope.status
    }, function(){
        $scope.getDatas();
    });

    $scope.$watch('keyword',debounce(function (newV, oldV) {
        if (newV !== oldV) {
            $scope.getDatas();
        }
    }, 350));

    $scope.setStatus = function () {
      var appStatus = {
        'keyword': $scope.keyword,
        'status': $scope.status,
        'curPageNum': $scope.curPageNum
      };
      localStorageService.set('appStatus', appStatus);
    }

}])
