'use strict';
angular.module('myApp.algorithmGoodsManageControllers', [
        'myApp.services',
        'dls.filters',
        'dls.services.util'
])
.controller("algorithmGoodsManageUtilCtrl",['$scope','$filter','$cookies','DlsUtil','adminService','localStorageService'
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
.controller("algorithmGoodsManageListCtrl",['tagMAlgTagService','tagMAlgCatService','$scope','$filter','$cookies','DlsUtil','adminService','$state','localStorageService', 'debounce'
  , function (tagMAlgTagService,tagMAlgCatService,$scope,$filter,$cookies,DlsUtil,adminService,$state,localStorageService,debounce) {
    $scope.totalItems = 0;
    $scope.pageOptions = {
      "total_items_num" : 5,  //总共的data数量
      "total_pages_num" : 1,  //总共的page数量
      "per_page_num" : 10     //单页page的data数量
    };

    $scope.algorithmTitles = ['交易品编号','交易品名称','版本','状态'];
    $scope.admin_algorithm_label_type_btn_datas = [];
    var  appStatus = localStorageService.get('appStatus');
    $scope.searchText = !!appStatus ? appStatus.searchText : '';
    $scope.curPage = !!appStatus ? appStatus.curPage : 1;
    $scope._goodsStatus = !!appStatus ? appStatus._goodsStatus : '0';
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

    var csrfToken = $cookies.get('csrftoken');
    // adminService.get({detail:"tagM/index/"},function(resp){
    //   $scope.adminTags = resp.data;
    //   $scope.admin_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
    //   // $scope.adminTags = $scope.admin_label_type_btn_datas = resp.data.catgoryStr;
    // });

    tagMAlgCatService.get({detail:"index/"},function(resp){
      console.log(resp)
      $scope.adminTags = resp.data;
      $scope.admin_algorithm_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
      // $scope.adminTags = $scope.admin_label_type_btn_datas = resp.data.catgoryStr;
    });


    $scope.getDatas = function (page) {
      tagMAlgTagService.save({
        'detail':"list/",
        'content': $scope.searchText,
        'catCode': $scope.pcode,
        'status': $scope._goodsStatus,
        'page': page || $scope.curPageNum
      },function(resp){
        console.log(resp)
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
            'pcode': $scope.pcode,
        };
        localStorageService.set('appStatus', appStatus);
    };

    $scope.$watch(function(){
        return $scope.curPageNum +"/"+ $scope._goodsStatus + "/" + $scope.pcode;
    },function(newV){
        $scope.getDatas($scope.curPageNum);
    });

    $scope.$watch('searchText',debounce(function (newV, oldV) {
        if (newV !== oldV) {
            $scope.getDatas();
        }
    }, 350));

    $scope.$on("algorithm_selectedNode_id_changed", function(event,data){
        $scope.pcode = data.id;
        $scope.selectedNode = data;
        console.log($scope.selectedNode)
    });

    $scope.addNewgoods = function (type) {
      var goodsCode = '';
      console.log($scope.selectedNode)
      if (!$scope.selectedNode.id || $scope.selectedNode.child) {
        $scope.modalData.content = "请选择叶子结点标签！";
        $scope.$emit("setModalState",$scope.modalData);
        return false;
      }  

      $state.go("dls.algorithmGoodsManage.algorithmEdit",{code:'', mode:'edit',pCode:$scope.selectedNode.id});
      // if ('crp' === type) {
      //   $state.go("dls.goodsManage.crpEdit",{code:'',pCode:$scope.pcode});
      // } else if ('cap' === type) {
      //   adminService.save({detail:"tagM/tag/code/"},function (resp) {
      //     if (0 === resp.status) {
      //       $scope.modalData.content = "获取交易品编号失败，请重试！";
      //       $scope.$emit("setModalState",$scope.modalData);
      //       return false;
      //     }
      //     goodsCode = resp.data.code;
      //     $state.go("dls.goodsManage.capEdit",{code:goodsCode,pCode:$scope.pcode});
      //   });
      // }
    };

    $scope.updateState = function (index,code,newStatus) {
      tagMAlgTagService.save({detail:"status/"},{code:code,status:newStatus},function (resp) {
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
.controller("algorithmEditCtrl",['$scope','$filter','$cookies','tagMAlgTagService','$stateParams','$state'
  , function ($scope,$filter,$cookies,tagMAlgTagService,$stateParams,$state) {

    $scope.modalData = {
      templateUrl : './src/templates/modalViews/addToCartTipModal.html',
      content : ''
     };

    $scope.showMsg = function (msg,goTo) {
      $scope.modalData.content = msg;
      $scope.modalData.goTo = goTo;
      $scope.$emit("setModalState",$scope.modalData);
    };
    
    $scope.code = $stateParams.code;
    $scope.pCode = $stateParams.pCode;
    $scope.mode = $stateParams.mode;

    $scope.name = '';
    $scope.description = '';
    $scope.productType ='06';
    $scope.sceneState = [{
        'value': '06',
        'name': '机器学习'
    }, {
        'value': '07',
        'name': '统计分析'
    }, {
        'value': '08',
        'name': '数据处理'
    }, {
        'value': '09',
        'name': '数据制图'
    }, {
        'value': '10',
        'name': '应用模型'
    }];
    if($scope.mode==='view'){
      $scope.getDatas = function () {
        tagMAlgTagService.save({
          'detail':'detail/',
           code:$scope.code
        },function(backData){
           if(backData.status===1){
            $scope.code = backData.data.code
            $scope.name = backData.data.name
            $scope.pCode = backData.data.pCode
            $scope.description = backData.data.description
            $scope.productType = backData.data.tagType
           }
        });
      };
      $scope.getDatas()
      // $scope.getDatas = function () {
      //   tagMAlgTagService.save({
      //     'detail':'add/',
      //     'code': $scope.code,
      //     'pCode': $scope.pCode,
      //     'name': $scope.name,
      //     'type': $scope.productType,
      //     'description': $scope.description
      //   },function(resp){
      //     console.log(resp)

      //   });
      // };

    }else{
      $scope.getDatas = function () {
        tagMAlgTagService.save({
          'detail':'detail/',
           code:$scope.code
        },function(backData){
           if(backData.status===1){
            $scope.code = backData.data.code
            $scope.name = backData.data.name
            $scope.pCode = backData.data.pCode
            $scope.description = backData.data.description
            $scope.productType = backData.data.tagType
           }
        });
      };
      $scope.getDatas()
      
      $scope.add = function(){
        console.log($scope.code)
        tagMAlgTagService.save({
          'detail':'add/',
          'code': $scope.code,
          'pCode': $scope.pCode,
          'name': $scope.name,
          'type': $scope.productType,
          'description': $scope.description
        },function(resp){
          if(resp.status == 1){
              $scope.showMsg(resp.msg,"dls.algorithmGoodsManage.list")
          }

        });
      }
      $scope.update = function(){
        console.log($scope.code)
        tagMAlgTagService.save({
          'detail':'update/',
          'code': $scope.code,
          'pCode': $scope.pCode,
          'name': $scope.name,
          'tagType': $scope.productType,
          'checkStatus': 1,
          'description': $scope.description
        },function(resp){
          
          if(resp.status == 1){
            $scope.showMsg(resp.msg,"dls.algorithmGoodsManage.list")
          }

        });
      }


    }

  }])