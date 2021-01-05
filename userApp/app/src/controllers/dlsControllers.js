'use strict';

angular.module('myApp.dlsControllers', [
        'myApp.services',
        'myApp.apiServices'
    ])
    .controller('appModalInstanceCtrl', function ($scope, $uibModalInstance, DlsUtil, modalDatas) {
        var $ctrl = this;
        $scope.DlsUtil = DlsUtil;
        $scope.modalDatas = modalDatas;
        console.log($scope.modalDatas)
        $ctrl.ok = function (val) {
            $scope.modalDatas.result = true;
            $uibModalInstance.close(
                $scope.modalDatas
            );
        };

        $ctrl.deny = function (val) {
            $scope.modalDatas.result = false;
            $uibModalInstance.close(
                $scope.modalDatas
            );
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    })

    .controller('DetailModalInstanceCtrl', function(tradeMallService,$scope, $uibModalInstance, DlsUtil, modalDatas,debounce) {
        var $ctrl = this;
        $scope.DlsUtil = DlsUtil;
        console.log(modalDatas)
        $scope.modalDatas = modalDatas;
        $scope.searchText = "";
        $scope.curPage = 1;

        $scope.getDatas = function(){
            var per_page_items = 10,connObjNo;
            if($scope.modalDatas.connObjNo){
                connObjNo = $scope.modalDatas.connObjNo
            }else{
                connObjNo = $scope.modalDatas.list[$scope.modalDatas.ind].connObjNo
            }
            tradeMallService.save({
                detail:'marketi/busiId/list/',
            },{
                connObjNo:connObjNo,
                keyword:$scope.searchText,
                page:$scope.curPage
            },function(backData){
                if(backData.status == 1){
                    $scope.deployList = backData.data.list;
                    console.log($scope.deployList)
                    for(var i = 0;i<$scope.deployList.length;i++){
                        if($scope.deployList[i].busiIdList===$scope.modalDatas.busiId){
                            $scope.modalDatas.note1 = $scope.deployList[i].noteList;
                        }
                    }
                    $scope.pageOptions = {
                        "total_items_num":backData.data.page.total_rows,
                        "total_pages_num":backData.data.page.total_pages,
                        "per_page_num":per_page_items
                    }
                }
            })
        }
        $scope.$watch('searchText',debounce(function(newV,oldV){
             if(newV !== oldV){
                 console.log(1)
                $scope.curPage = 1;
                $scope.getDatas();
             }
        },350));
        $scope.$watch('curPage',function(){
            console.log(2)
            $scope.getDatas();
        })
        // if(!!$scope.modalDatas.list){ 
        //     console.log(3)
        //     $scope.getDatas()
            // $scope.busiIdList = $scope.modalDatas.list[0].busiIdList.split('\,')
            // $scope.noteList = $scope.modalDatas.list[0].noteList
        // }

        $ctrl.ok = function (val) {
            $scope.modalDatas.result = true;
            $uibModalInstance.close(
                val
            );
        };

        $ctrl.deny = function (val) {
            $scope.modalDatas.result = false;
            $uibModalInstance.close(
                $scope.modalDatas
            );
        };
        $scope.radioState = function(ind){
            console.log($scope.deployList[ind])
            $ctrl.ok($scope.deployList[ind])
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    })
    .controller("dlsCtrl",function($rootScope,$scope,$http,$state,$cookies,localStorageService,USER_ROLES,AuthService,AUTH_EVENTS,tradeMallService){
        $rootScope.isUserAuth = !!localStorageService.get('username') || false;
        $scope.aside = {
            shortType : false
        };
        $scope.modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };

        $scope.$on("addOriginSuccess",function(){
            $scope.$broadcast("addOrigin");
        })

        $scope.curView = function(value){
            $scope.$emit("changeState",value);
        };
        $scope.$on("changeViewState",function(event,data){
            $scope.$broadcast("curState",data);
        });

        $scope.$on("reLogin",function(event,data){
            $rootScope.redirectState = $state.current.name;
            $state.go("login");
        });
        $scope.$on("denied",function(event,data){
            $state.go("dls.denied");
        });

        $rootScope.$on('setModalState',function(event,data){  //设置全局的模态框
            $scope.modalData = data;
            $('#myModal').modal('show').addClass('modal-mid');
        });
        $rootScope.$on('cancelModalState',function(event,data){  //设置全局的模态框
            $('#myModal').modal('hide');
        });
        $scope.$on(AUTH_EVENTS.loginSuccess,function(){
            $rootScope.isUserAuth = true;
            if ("login" === $state.current.name) {
                $state.go("dls.trade.mall.goodsCategory");
            }
            if (!!$rootScope.redirectState && $rootScope.redirectState !== "login") {
                $state.go($rootScope.redirectState);
            }

        });

        $scope.setAsideStyle = function(){               //设置边栏的样式
            $scope.aside.shortType = !$scope.aside.shortType;
        };
        $scope.$watch("aside.shortType",function(){
            clearTimeout(mytime);
            $scope.asideChange = true;
            var mytime = setTimeout(function(){
                $scope.asideChange = false;
            },100);
        });

        var appInit = function () {
            $rootScope.currentUser = {};
            $rootScope.userRoles = USER_ROLES;
            $rootScope.isAuthorized = AuthService.isAuthorized('会员管理账户');
            if (!!$rootScope.isUserAuth) {
                $rootScope.currentUser.username       = localStorageService.get('username');
                $rootScope.currentUser.company        = localStorageService.get('memName');
                $rootScope.currentUser.apartment      = localStorageService.get('memDept');
                $rootScope.cartNum                    = localStorageService.get('cartNum');
                $rootScope.permissionList             = localStorageService.get('permissionList');
                $rootScope.trade_label_type_btn_datas = localStorageService.get('trade_label_type_btn_datas');
                $rootScope.trade_label_reckon_type_btn_datas = localStorageService.get('trade_label_reckon_type_btn_datas');
            }
        };
        appInit();

        $scope.logoOut = function () {
            var apiUrl="/api/user_logout/";
            $http.post(apiUrl).then(function (resp) {
                if (200 === resp.status) {
                    $rootScope.isUserAuth = false;
                    $state.go("login");
                }
            });
        }

        $scope.resetPwd = function() {
            $state.go("dls.resetPwd");
        }
    })
    .controller("dlsAsideCtrl",function($scope,$rootScope,$state,dls_list_service,permissions){
        var navigatorBtn = dls_list_service.dls_operation_btn_datas;
        var arr = [];
        for (var i = 0, len1 = navigatorBtn.length ; i < len1 ; i++) {
          var tmpObj = {}, tmpArr = [];
          tmpObj.style = navigatorBtn[i].style;
          tmpObj.name = navigatorBtn[i].name;
          for (var j = 0, len2 = navigatorBtn[i].contents.length ; j < len2 ; j++) {
            if (!!permissions.hasPermission(navigatorBtn[i].contents[j].permission)) {
              tmpArr.push(navigatorBtn[i].contents[j]);
            }
          }
          tmpObj.contents = tmpArr;
          if (tmpObj.contents.length > 0) {
            arr.push(tmpObj);
          }
        }
        $scope.dls_operation_btn_datas = arr;
    })
    .controller("dlsMainCtrl",function($scope,$state){
        $scope.$on("curState",function(event,data){
            if(data == 'dls.provider.itemManage.item'){
                $scope.selectData = 'item';
            }else if(data == 'dls.provider.itemManage.set'){
                $scope.selectData = 'set';
                $state.go(data)
            }
        });
    })
    .controller('loginCtrl', ['$scope', '$rootScope','$state', '$filter','localStorageService','tradeMallService', 'AUTH_EVENTS', 'AuthService', 'csrfService' ,function ($scope,  $rootScope,$state, $filter,localStorageService,tradeMallService, AUTH_EVENTS, AuthService,csrfService) {
      $scope.userRole = 'user';
      $scope.credentials = {
        username: '',
        pwdInput: '',
      };
      $scope.validCode = '';

      $scope.codeShow = false;
      $scope.credentialsShow = false;
      $scope.createCode = function () {
        $scope.validCode = '';
        var codeLength = 4; //验证码的长度
        var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
             'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
             'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
        for(var i = 0; i < codeLength; i++) {
            var charNum = Math.floor(Math.random() * 52);
            $scope.validCode += codeChars[charNum];
        }

      }
      $scope.createCode();
      csrfService.token();
      $scope.login = function (credentials) {
        if ($filter('lowercase')($scope.validCode) !== $filter('lowercase')($scope.credentials.code)) {
            $scope.codeShow = true;
            $scope.createCode();
            return;
        } else {
            $scope.codeShow = false;
        }
        AuthService.login(credentials).then(function (resp) {
          if (401 === resp.status) {
            $scope.createCode();
            $scope.credentialsShow = true;
            return;
          }
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          var data = resp.data[0];
          for (var i = 0, rights = {},len = data.perms.length; i < len; i++) {
            rights[String(data.perms[i][0])] = data.perms[i][1];
          }
          localStorageService.set('username', data.username);
          localStorageService.set('memName',  data.memName);
          localStorageService.set('memDept',  data.memDept);
          localStorageService.set('cartNum',  data.cartNumber);
          localStorageService.set('permissionList',  rights);

          localStorageService.set('log_start_time', "");
          localStorageService.set('log_end_time',  "");

          $rootScope.currentUser.username  = data.username;
          $rootScope.currentUser.company   = data.memName;
          $rootScope.currentUser.apartment = data.memDept;
          $rootScope.cartNum = data.cartNumber;
          $rootScope.permissionList = rights;
        });
      };
    }])
    .controller("resetPwdCtrl", ["$scope", "$rootScope", "userService", "md5", "$state", "$http", function($scope, $rootScope, userService, md5, $state, $http) {
        $scope.username = $rootScope.currentUser.username;
        $scope.confirmReset = function () {
            if ($scope.pwd.trim() !== $scope.certifyPwd.trim()) {
                $scope.notMatch = true;
                return
            } else {
                $scope.notMatch = false;
                if ($scope.resetPwdForm.$valid) {
                    userService.save({
                        detail: "apply/pwdModify/",
                    }, {
                        oldPwd: md5.createHash($scope.originPwd.trim()),
                        newPwd: md5.createHash(($scope.pwd).trim()),
                    }, function (backData) {
                        if(backData.status === 1){
                            var modalData = {
                                templateUrl: './src/templates/modalViews/addToCartTipModal.html',
                            };
                            modalData.content = backData.msg;
                            $scope.$emit("setModalState", modalData);
                            setTimeout(function(){
                                $scope.$emit("cancelModalState");
                                var apiUrl = "/api/user_logout/";
                                $http.post(apiUrl).then(function (resp) {
                                    if (200 === resp.status) {
                                        $rootScope.isUserAuth = false;
                                        $state.go("login");
                                    }
                                });
                            }, 750)
                        }else{
                            var modalData = {
                                templateUrl: './src/templates/modalViews/addToCartTipModal.html',
                            };
                            modalData.content = backData.msg;
                            $scope.$emit("setModalState", modalData);
                        }
                    })
                }
            }
        }

        $scope.reset = function() {
            $scope.originPwd = "";
            $scope.pwd = "";
            $scope.certifyPwd = "";
        }
    }])