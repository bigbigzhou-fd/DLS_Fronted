'use strict';
angular.module('myApp.goodsManageControllers', [
        'myApp.services',
        'dls.filters',
        'dls.services.util'
])
.controller("goodsManageUtilCtrl",['$scope','$filter','$cookies','DlsUtil','adminService','localStorageService'
  , function ($scope,$filter,$cookies,DlsUtil,adminService,localStorageService) {


    $scope.modalData = {
        templateUrl : './src/templates/modalViews/addToCartTipModal.html',
        content : ''
    };
    $scope.valueType = [{
      'value' : 1,
      'name' : '单值'
    },{
      'value' : 2,
      'name' : '多值'
    },{
      'value' : 3,
      'name' : '分段'
    },{
      'value' : 5,
      'name' : '数据项'
    },{
      'value' : 4,
      'name' : '命中'
    }];
    $scope.paramType = [{
        'value' : '01',
        'name' : '数值'
      },{
        'value' : '02',
        'name' : '列表'
      },{
        'value' : '03',
        'name' : '文件类型'
    }];
    $scope.goodsType = [{
      'value' : '03',
      'name' : '营销类'
    },{
      'value' : '02',
      'name' : '征信类'
    }];
    $scope.goodsStatus = [{
      'value' : '0',
      'name' : '全部'
    },{
      'value' : '1',
      'name' : '待上架'
    },{
      'value' : '2',
      'name' : '已上架'
    },{
      'value' : '3',
      'name' : '已下架'
    },{
      'value' : '4',
      'name' : '已失效'
    }];

  }])
.controller("goodsManageListCtrl",['$scope','$filter','$cookies','DlsUtil','adminService','$state','localStorageService', 'debounce'
  , function ($scope,$filter,$cookies,DlsUtil,adminService,$state,localStorageService,debounce) {
    // $scope.goodsTypeValue = localStorageService.get('goodsTypeValue') || '02';
    $scope.totalItems = 0;
    $scope.pageOptions = {
      "total_items_num" : 5,  //总共的data数量
      "total_pages_num" : 1,  //总共的page数量
      "per_page_num" : 10     //单页page的data数量
    };

    $scope.capTitles = ['交易品编号','交易品名称','版本','参数','赋值类型','赋值说明','状态'];
    $scope.crpTitles = ['交易品编号','交易品名称','版本','ID列表','赋值类型','赋值说明','状态'];

    var  appStatus = localStorageService.get('appStatus');
    $scope.searchText = !!appStatus ? appStatus.searchText : '';
    $scope.curPage = !!appStatus ? appStatus.curPage : 1;
    $scope._goodsStatus = !!appStatus ? appStatus._goodsStatus : '0';
    $scope.goodsTypeValue = !!appStatus ? appStatus.goodsTypeValue : '02';
    $scope.pcode = !!appStatus ? appStatus.pcode : '';

    $scope.selectedNode = {};
    $scope.treeOptions = {
        nodeChildren: "child",
        dirSelectable: true,
        injectClasses: {
            iExpanded: "glyphicon glyphicon-triangle-bottom",
            iCollapsed: "glyphicon glyphicon-triangle-right",
            labelSelected: "selectedNode",
        }
    };

    $scope.editUrl = "tagM/cat/form/";
    $scope.deleteUrl = "tagM/cat/del/";
    $scope.admin_label_type_btn_datas = [];
    var csrfToken = $cookies.get('csrftoken');
    adminService.get({detail:"tagM/index/"},function(resp){
      $scope.adminTags = resp.data;
      $scope.admin_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
      // $scope.adminTags = $scope.admin_label_type_btn_datas = resp.data.catgoryStr;
    });

    $scope.getDatas = function (page) {
      adminService.get({
        'detail':"tagM/tag/list",
        'content': $scope.searchText,
        'catCode': $scope.pcode,
        'tagType': $scope.goodsTypeValue,
        'status': $scope._goodsStatus,
        'page': page || $scope.curPageNum
      },function(resp){
          if (0 === resp.data.status) {
            $scope.modalData.content = "获取数据失败！";
            $scope.$emit("setModalState",$scope.modalData);
            return false;
          }
          $scope.datas = resp.data.list;

          $scope.pageOptions = {
              total_items_num : resp.data.page.total_rows,
              per_page_num : 10,
              total_pages_num : resp.data.page.total_pages,
          };
          if (resp.data.page.total_pages < $scope.curPageNum) {$scope.curPageNum = 1;}
      });

    };

    $scope.setData = function (item) {
        // localStorageService.set('goodsCategoryDatas',  item);
        var appStatus = {
            'searchText': $scope.searchText,
            'curPage': $scope.curPage,
            '_goodsStatus': $scope._goodsStatus,
            'goodsTypeValue': $scope.goodsTypeValue,
            'pcode': $scope.pcode,
        };
        localStorageService.set('appStatus', appStatus);
    };

    $scope.$watch(function(){
        return $scope.curPageNum +"/"+ $scope._goodsStatus +"/"+ $scope.goodsTypeValue + "/" + $scope.pcode;
    },function(newV){
        $scope.getDatas($scope.curPageNum);
        // localStorageService.set('goodsTypeValue',$scope.goodsTypeValue);
    });

    $scope.$watch('searchText',debounce(function (newV, oldV) {
        if (newV !== oldV) {
            $scope.getDatas();
        }
    }, 350));

    $scope.$on("selectedNode_id_changed", function(event,data){
        $scope.pcode = data.id;
        $scope.selectedNode = data;
    });

    $scope.addNewgoods = function (type) {
      var goodsCode = '';
      if (!$scope.selectedNode.id || $scope.selectedNode.child) {
        $scope.modalData.content = "请选择叶子结点标签！";
        $scope.$emit("setModalState",$scope.modalData);
        return false;
      }

      if ('crp' === type) {
        $state.go("dls.goodsManage.crpEdit",{code:'',pCode:$scope.pcode});
      } else if ('cap' === type) {
        adminService.save({detail:"tagM/tag/code/"},function (resp) {
          if (0 === resp.status) {
            $scope.modalData.content = "获取交易品编号失败，请重试！";
            $scope.$emit("setModalState",$scope.modalData);
            return false;
          }
          goodsCode = resp.data.code;
          $state.go("dls.goodsManage.capEdit",{code:goodsCode,pCode:$scope.pcode});
        });
      }
    };

    $scope.updateState = function (index,code,newStatus) {
      adminService.save({detail:"tagM/tag/status/"},{code:code,status:newStatus},function (resp) {
        $scope.modalData.content = resp.msg;
        $scope.$emit("setModalState",$scope.modalData);
        if (resp.status === 1) {
          $scope.datas[index].status = newStatus;
          if (newStatus === -1) {
            $scope.datas.splice(index,1);
          }
        }
      });
    };


}])
.controller("capEditCtrl",['$scope','$filter','$cookies','DlsUtil','adminService','$stateParams','$state'
  , function ($scope,$filter,$cookies,DlsUtil,adminService,$stateParams,$state) {
  	$scope.DlsUtil = DlsUtil;
    $scope.code = $stateParams.code;
    $scope.mode = $stateParams.mode;
    $scope.goodsDatas = {};
    $scope.goodsDatas.checkStatus = '0';
    var csrfToken = $cookies.get('csrftoken');
  	$scope.deleteParaItem = function (index) {
  		$scope.goodsDatas.parameters.splice(index,1);
  	};
  	$scope.addParaItem = function () {
  		var item = {
  		  'paraName': '',
  		  'paraType': '01',
  		  'paraRange': [{min:null,max:null}]
  	  };
  		$scope.goodsDatas.parameters.push(item);
      // console.log($scope.goodsDatas);
  	};
    $scope.addParaRange = function (index) {
      for (var i = 0; i < $scope.goodsDatas.parameters.length; i++) {
        if ($scope.goodsDatas.parameters[index].paraType == "01" && index === i) {
          $scope.goodsDatas.parameters[index].paraRange.push({min:null,max:null});
        }
      }
    };
    $scope.deleteParaRange = function (pIndex, index) {
      for (var i = 0; i < $scope.goodsDatas.parameters.length; i++) {
        if ($scope.goodsDatas.parameters[pIndex].paraType == "01" && pIndex === i) {
          $scope.goodsDatas.parameters[pIndex].paraRange.splice(index,1);
        }
      }
    };

    $scope.paraTypeChanged = function (index, type) {
      console.log(index, type);
      if (type === "01") {
        $scope.goodsDatas.parameters[index].paraRange = [{min:null,max:null}];
      } else {
        $scope.goodsDatas.parameters[index].paraRange = "";
      }
    };

    var saveUrl = "";
    if (!!$scope.code && !$stateParams.pCode) { //新增不获取数据
      saveUrl = "tagM/tag/update/";
      adminService.get({detail:"tagM/tag/detail",code:$scope.code},function(resp){
        $scope.goodsDatas = resp.data;
        for (var i = 0; i < $scope.goodsDatas.parameters.length; i++) {
          if ($scope.goodsDatas.parameters[i].paraType == "01") {
            $scope.goodsDatas.parameters[i].paraRange = $filter("numberRangeToObjFilter")($scope.goodsDatas.parameters[i].paraRange);
          }
        }
        console.log($scope.goodsDatas);

      });
    } else if (!!$stateParams.pCode){
      saveUrl = "tagM/tag/add/";
      $scope.goodsDatas = angular.extend({}, $scope.goodsDatas,{'pCode': $stateParams.pCode,'code': $scope.code});
      $scope.goodsDatas.parameters = [];$scope.addParaItem();
    } else if (!$scope.code && !$stateParams.pCode) {
      $state.go("dls.goodsManage.list");
    }

    $scope.saveDatas = function () {

      var parameters = angular.copy($scope.goodsDatas.parameters);
      for (var i = 0; i < parameters.length; i++) {
        if (parameters[i].paraType == "01") {
          parameters[i].paraRange = $filter("numberRangeToStrFilter")(parameters[i].paraRange);
          if (!parameters[i].paraRange) {
            $scope.modalData.content = "参数范围不能为空！";
            $scope.$emit("setModalState",$scope.modalData);
            return;
          }
        }
      }

      var obj = angular.extend({}, $scope.goodsDatas,{'tagType':'03','checkStatus': $scope.goodsDatas.checkStatus,'parameters':JSON.stringify(parameters)});
      console.log(obj);
      adminService.save({detail:saveUrl},obj,function (resp) {
        console.log(resp);
        $scope.modalData.content = resp.msg;
        $scope.$emit("setModalState",$scope.modalData);
        if (resp.status === 1) {
           setTimeout(function () {
             window.history.go(-1);
           },2000);
        }
      });
    }
  }])
.controller("crpEditCtrl",['$scope','$filter','$cookies','DlsUtil','adminService','$stateParams','$state'
  , function ($scope,$filter,$cookies,DlsUtil,adminService,$stateParams,$state) {
  	$scope.DlsUtil = DlsUtil;
    $scope.code = $stateParams.code;
    $scope.pCode = $stateParams.pCode;
    $scope.mode = $stateParams.mode;
    $scope.goodsDatas = {};
    $scope.goodsDatas.checkStatus = 1;
    $scope.goodsDatas.valueType = 1;

    $scope.admin_label_type_btn_datas = [];
    var csrfToken = $cookies.get('csrftoken');
    adminService.get({detail:"tagM/tag/dataIdStr"},function(resp){
      $scope.admin_label_type_btn_datas = resp.data.dataId_str;
    });

    $scope.selectedNode = {id : ""};
    var idSelectedArr = [];
    $scope.selectedNodes = [];

    $scope.idTreeOptions = {
        nodeChildren: "child",
        dirSelectable: true,
        injectClasses: {
            iExpanded: "glyphicon glyphicon-triangle-bottom",
            iCollapsed: "glyphicon glyphicon-triangle-right",
            labelSelected: "selectedNode",
            selectedNodes: "selectedNodes",
        },
        addBtn: true,
        btnClick:function(node,event){
            var flag = false;
            for(var i in idSelectedArr){
                if(idSelectedArr[i].id === node.id){
                    flag = true;
                }
            }
            if(!flag){
                var temp = {
                    id:node.id,
                    target:event.target,
                }
                idSelectedArr.push(temp);
                $scope.selectedNodes.push(node);
            }
        }
    };

    if($scope.mode === 'view') {
        $scope.idTreeOptions.addBtn = false;
        $scope.showAll = true;
    }

    $scope.removeIdNodes = function(index){
    idSelectedArr.splice(index,1);
    $scope.selectedNodes.splice(index,1);
    };

    var saveUrl = "";
    if (!!$scope.code && !$stateParams.pCode) { //新增不获取数据
      saveUrl = "tagM/tag/update/";
      adminService.get({detail:"tagM/tag/detail",code:$scope.code},function(resp){
        $scope.goodsDatas = resp.data;
        $scope.selectedNodes = resp.data.ids;
      });
    } else if (!!$stateParams.pCode){
      saveUrl = "tagM/tag/add/";
      $scope.goodsDatas = angular.extend({}, $scope.goodsDatas,{'pCode': $scope.pCode,'code': $scope.code});
    } else if (!$scope.code && !$stateParams.pCode) {
      $state.go("dls.goodsManage.list");
    }

    $scope.saveDatas = function () {
      var idLists = [];
      for (var i = $scope.selectedNodes.length - 1; i >= 0; i--) {
        idLists.push($scope.selectedNodes[i].id);
      }
      var obj = angular.extend({}, $scope.goodsDatas,{'tagType':'02','ids':idLists.toString(),'checkStatus': $scope.goodsDatas.checkStatus});
      adminService.save({detail:saveUrl},obj,function (resp) {
        $scope.modalData.content = resp.msg;
        $scope.$emit("setModalState",$scope.modalData);
        if (resp.status === 1) {
           setTimeout(function () {
             window.history.go(-1);
           },2000);
        }
      });
    }

  }])