'use strict';

angular.module('myApp.dlsControllers', [
        'myApp.services',
        'myApp.apiServices'
    ])
    .controller('appModalInstanceCtrl', function ($scope, $uibModalInstance, DlsUtil, modalDatas) {
        var $ctrl = this;
        $scope.DlsUtil = DlsUtil;
        $scope.modalDatas = modalDatas;
        $scope.withdrawTypes = [{
            'value': '02',
            'name': '提现'
        }, {
            'value': '17',
            'name': '提现到余额'
        }];
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

        $scope.quotaAvalivable = 0;
        $scope.$watch(function () {
            return $scope.modalDatas.accountType + '/' + $scope.modalDatas.prdtType;
        }, function () {
            if ($scope.modalDatas.accountType === '01') {
                $scope.quotaAvalivable = $scope.modalDatas.totLmtReal; //余额
            } else if ($scope.modalDatas.accountType === '02') {
                $scope.quotaAvalivable = $scope.modalDatas.avaCrdLmtReal; //可用授信额度
            } else if ($scope.modalDatas.accountType === '04') {
                $scope.quotaAvalivable = $scope.modalDatas.accruedLmtReal; //可计提
            } else if ($scope.modalDatas.accountType === '03' && $scope.modalDatas.prdtType === '02') {
                $scope.quotaAvalivable = $scope.modalDatas.crpAvaquota; //
            } else if ($scope.modalDatas.accountType === '03' && $scope.modalDatas.prdtType === '03') {
                $scope.quotaAvalivable = $scope.modalDatas.capAvaquota; //
            }
        });
    })
    .controller("dlsCtrl", ['$rootScope', '$scope', '$http', '$state', '$cookies', 'localStorageService', 'USER_ROLES', 'AuthService', 'AUTH_EVENTS', 'permissions',
        function ($rootScope, $scope, $http, $state, $cookies, localStorageService, USER_ROLES, AuthService, AUTH_EVENTS, permissions) {
            $scope.permissions = permissions;
            $rootScope.isUserAuth = !!localStorageService.get('username') || false;
            $scope.aside = {
                shortType: false
            };

            $scope.curView = function (value) {
                $scope.$emit("changeState", value);
            };
            $scope.$on("changeViewState", function (event, data) {
                $scope.$broadcast("curState", data);
            });
            $scope.$on("providerSwitch", function (event, data) {
                $scope.curState = "dls.provider.itemManage." + data;
            });
            $scope.$on("reLogin", function (event, data) {
                $rootScope.redirectState = $state.current.name;
                $state.go("login");
            });
            $scope.$on("denied", function (event, data) {
                $state.go("dls.denied");
            });

            $scope.$on('setModalState', function (event, data) {  //设置全局的模态框
                $scope.modalData = data;
                $('#myModal').modal('toggle').addClass('modal-mid');
            });
            $scope.$on(AUTH_EVENTS.loginSuccess, function () {
                $rootScope.isUserAuth = true;
                if (!!$rootScope.redirectState && $rootScope.redirectState !== "admin_login") {
                    $state.go($rootScope.redirectState);
                } else if ("admin_login" === $state.current.name) {
                    $state.go("dls.welcome");
                }
            });

            $scope.setAsideStyle = function () {               //设置边栏的样式
                $scope.aside.shortType = !$scope.aside.shortType;
            };
            $scope.$watch("aside.shortType", function () {
                clearTimeout(mytime);
                $scope.asideChange = true;
                var mytime = setTimeout(function () {
                    $scope.asideChange = false;
                }, 100);
            });

            var appInit = function () {
                $rootScope.currentUser = {};
                $rootScope.userRoles = USER_ROLES;
                $rootScope.isAuthorized = AuthService.isAuthorized('会员管理账户');
                if (!!$rootScope.isUserAuth) {
                    $rootScope.currentUser.username = localStorageService.get('username');
                    $rootScope.currentUser.company = localStorageService.get('memName');
                    $rootScope.currentUser.apartment = localStorageService.get('memDept');
                    $rootScope.cartNum = localStorageService.get('cartNum');
                    $rootScope.permissionList = localStorageService.get('permissionList');
                    $rootScope.trade_label_type_btn_datas = localStorageService.get('trade_label_type_btn_datas');
                }
            };
            appInit();

            $scope.logoOut = function () {
                var apiUrl = "/api/user_logout/";
                $http.post(apiUrl).then(function (resp) {
                    if (200 === resp.status) {
                        $rootScope.isUserAuth = false;
                        $state.go("admin_login");
                    }
                });
            }
            $scope.resetPwd = function () {
                $state.go("dls.resetPwd");
            }
        }])
    .controller("dlsAsideCtrl", function ($scope, dls_list_service, permissions) {
        var navigatorBtn = dls_list_service.dls_operation_btn_datas;
        var arr = [];
        for (var i = 0, len1 = navigatorBtn.length; i < len1; i++) {
            var tmpObj = {}, tmpArr = [];
            tmpObj.style = navigatorBtn[i].style;
            tmpObj.name = navigatorBtn[i].name;
            for (var j = 0, len2 = navigatorBtn[i].contents.length; j < len2; j++) {
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
    .controller("dlsMainCtrl", function ($scope, $state) {
        $scope.$on("curState", function (event, data) {
            if (data == 'dls.provider.itemManage.item') {
                $scope.selectData = 'item';
            } else if (data == 'dls.provider.itemManage.set') {
                $scope.selectData = 'set';
                $state.go(data)
            }
        });
    })
    .controller('loginCtrl', ['$scope', '$rootScope', '$state', '$filter', 'localStorageService', 'AUTH_EVENTS', 'AuthService', 'csrfService', function ($scope, $rootScope, $state, $filter, localStorageService, AUTH_EVENTS, AuthService, csrfService) {

        $scope.credentials = {
            username: '',
            pwdInput: '',
            // userRole: $scope.userRole
        };
        $scope.validCode = '';

        $scope.codeShow = false;
        $scope.credentialsShow = false;
        $scope.createCode = function () {
            $scope.validCode = '';
            var codeLength = 4; //验证码的长度
            var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
            for (var i = 0; i < codeLength; i++) {
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
                return;  //注释验证码
            } else {
                $scope.codeShow = false;
            }
            AuthService.login(credentials).then(function (resp) {
                console.log(resp)
                if (401 === resp.status) {
                    $scope.createCode();
                    $scope.credentialsShow = true;
                    //return;
                }
                console.log(resp.data[0].memId)
                if (1 === resp.status && !!resp.data[0].memId) {
                    //console.log("login succeed");
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    var data = resp.data[0];
                    if (angular.isArray(data.perms)) {
                        for (var i = 0, rights = {}, len = data.perms.length; i < len; i++) {
                            rights[String(data.perms[i][0])] = data.perms[i][1];
                        }
                    }
                    localStorageService.set('username', data.username);
                    localStorageService.set('memName', data.memName);
                    localStorageService.set('memDept', data.memDept);
                    localStorageService.set('cartNum', data.cartNumber);
                    localStorageService.set('permissionList', rights);

                    localStorageService.set('anal_start_time', "");
                    localStorageService.set('anal_end_time', "");

                    $rootScope.currentUser.username = data.username;
                    $rootScope.currentUser.company = data.memName;
                    $rootScope.currentUser.apartment = data.memDept;
                    $rootScope.cartNum = data.cartNumber;
                    $rootScope.permissionList = rights;
                }
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
                                        $state.go("admin_login");
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