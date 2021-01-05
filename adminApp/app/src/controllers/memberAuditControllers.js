'use strict';

angular.module('myApp.memberAuditControllers', [
            'myApp.services',
            'dls.services.util'
    ])
    .controller("memberAuditCtrl",["$scope","memberAuditServ","userService","$state","debounce","localStorageService",
    function($scope,memberAuditServ,userService,$state,debounce,localStorageService){
        $scope.auditState = memberAuditServ.auditState;
        $scope.auditGridOptions = memberAuditServ.auditGridOptions;
        $scope.auditPageOpt = {}
        var per_page_num = 10;

        $scope.auditStateType = [{label:"全部",value:"0"},{label:"待审核",value:"1"},{label:"通过审核",value:"2"},{label:"退回修改",value:"3"},{label:"已拒绝",value:"4"}]

        var appStatus = localStorageService.get('appStatus');
        $scope.searchText = !!appStatus ? appStatus.searchText : '';
        $scope.curPage = !!appStatus ? appStatus.curPage : 1;
        $scope.auditStateTypeVal = !!appStatus ? appStatus.auditStateTypeVal : '0';


        $scope.$watch("curPage",function(newV, oldV){
            if(newV !== oldV) {
                $scope.getData();
            }
        })

        $scope.$watch(function(){
            return $scope.auditStateTypeVal + '/'+ $scope.searchText;
        },debounce(function(newV, oldV){
            if(newV !== oldV) {
                $scope.curPage = 1;
                $scope.getData();
            }
        }, 350));

        $scope.search= function(e){
            $scope.curPage = 1;
            $scope.getData();
        }

        $scope.getData = function(){
            userService.save({
                detail:'review/'
            },{
                status : $scope.auditStateTypeVal,
                search : $scope.searchText,
                page: $scope.curPage,
                rows : per_page_num,
            },function(backData){
                $scope.memberLists = backData.data.list;
                $scope.pageList = backData.data.page;
                $scope.auditPageOpt = {
                    total_items_num : $scope.pageList.total_rows,
                    per_page_num : per_page_num,
                    total_pages_num : $scope.pageList.total_pages,
                }
            })
        };

        //$scope.$watch('searchText',debounce(function (newV, oldV) {
        //    if (newV !== oldV) {
        //        $scope.getData();
        //    }
        //}, 350));

        $scope.getData();

        $scope.openAccount = function(account){
            var appStatus = {
                'searchText': $scope.searchText,
                'curPage': $scope.curPage,
                'auditStateTypeVal': $scope.auditStateTypeVal,
            };
            $state.go("dls.openAccountAudit",{No : account.applyNo})
        }

        $scope.detail = function(account){
            var appStatus = {
                'searchText': $scope.searchText,
                'curPage': $scope.curPage,
                'auditStateTypeVal': $scope.auditStateTypeVal,
            };
            localStorageService.set('appStatus', appStatus);

            $state.go("dls.auditDetail",{No:account.applyNo})
        }

        $scope.audit = function(account){
            $state.go("dls.audit",{No : account.applyNo})
        }
    }])
    .controller("openAccountCtrl",["$scope","auditService","userService","$state",function($scope,auditService,userService,$state){
        var account = $state.params.No;

        auditService.get({
            detail:account
        },function(backData){
            $scope.applyNo = backData.data.applyBaseInfo.applyNo;
            $scope.orgFullNameCN = backData.data.applyBaseInfo.orgFullNameCN;
            $scope.deptName = backData.data.applyBaseInfo.deptName;
            $scope.applyName = backData.data.applyBaseInfo.applyName;
            $scope.regCapital = backData.data.applyBaseInfo.regCapital;
            $scope.openAcctStatCd = backData.data.applyBaseInfo.openAcctStatCd;
            $scope.notifyMode = backData.data.applyBaseInfo.notifyMode;
        })

        $scope.goBack = function(){
            history.back()
        }

        $scope.openAcc = function(){
            $scope.checkedMsg = [];
            $('input[name="message"]:checked').each(function(){
                $scope.checkedMsg.push($(this).val());
            });

            if($scope.checkedMsg.length != 0){
                $("#messageAlert").css("visibility","hidden");
                userService.save({
                    detail:'review/reg/'
                },{
                    operate: 'open',
                    applyNo:$scope.applyNo,
                    notifyMode: $scope.checkedMsg,
                },function(backData){
                    var modalData = {
                        templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                        content : backData.msg,
                    };
                    if(backData.status == 1){
                        modalData.goTo = "dls.memberAudit";
                    }
                    $scope.$emit("setModalState",modalData);
                })
            }else{
                $("#messageAlert").css("visibility","visible");
            }
        }
    }])
    .controller("auditPageCtrl",["$scope","userService","$state",function($scope,userService,$state){
        $scope.account = $state.params.No;

        userService.save({
            detail:'review/view/'
        },{
            applyNo:$scope.account,
        },function(backData){
            if(backData.status == 1){
                $scope.orgFullNameCN = backData.data.applyBaseInfo.orgFullNameCN;
                $scope.orgFullNameEN = backData.data.applyBaseInfo.orgFullNameEN;
                $scope.deptName = backData.data.applyBaseInfo.deptName;
                $scope.orgNo = backData.data.applyBaseInfo.orgNo;
                $scope.orgRegAddr = backData.data.applyBaseInfo.orgRegAddr;
                $scope.regCapital = backData.data.applyBaseInfo.regCapital;
                $scope.orgTypeCd = backData.data.applyBaseInfo.orgTypeCdDesc;
                $scope.industryCd = backData.data.applyBaseInfo.industryCdDesc;
                $scope.nationCd = backData.data.applyBaseInfo.nationCdDesc;
                $scope.provCd = backData.data.applyBaseInfo.provCdDesc;
                $scope.postAddr = backData.data.applyBaseInfo.postAddr;
                $scope.zipNo = backData.data.applyBaseInfo.zipNo;
                if($scope.companyWebSite1 = backData.data.applyContactList[0]){
                    $scope.companyWebSite1 = backData.data.applyContactList[0].companyWebSite;
                    $scope.contactName1 = backData.data.applyContactList[0].contactName;
                    $scope.emailAddr1 = backData.data.applyContactList[0].emailAddr;
                    $scope.phoneNo1 = backData.data.applyContactList[0].phoneNo;
                    $scope.faxNo1 = backData.data.applyContactList[0].faxNo;
                }
                if(backData.data.applyContactList[1]){
                    $scope.companyWebSite2 = backData.data.applyContactList[1].companyWebSite;
                    $scope.contactName2 = backData.data.applyContactList[1].contactName;
                    $scope.emailAddr2 = backData.data.applyContactList[1].emailAddr;
                    $scope.phoneNo2 = backData.data.applyContactList[1].phoneNo;
                    $scope.faxNo2 = backData.data.applyContactList[1].faxNo;
                }
                $scope.acctName = backData.data.applySetlInfo.acctName;
                $scope.acctNo = backData.data.applySetlInfo.acctNo;
                $scope.issueBankName = backData.data.applySetlInfo.issueBankName;
                $scope.issueBankID = backData.data.applySetlInfo.issueBankID;
                $scope.settContactName = backData.data.applySetlInfo.settContactName;
                $scope.settContactPhone = backData.data.applySetlInfo.settContactPhone;
                $scope.settEmailAddr = backData.data.applySetlInfo.settEmailAddr;
                $scope.billHead = backData.data.applySetlInfo.billHead;
                $scope.billAcctNo = backData.data.applySetlInfo.billAcctNo;
                $scope.billIssueBankName = backData.data.applySetlInfo.billIssueBankName;
                $scope.billSendAddr = backData.data.applySetlInfo.billSendAddr;
                $scope.billContactPhone = backData.data.applySetlInfo.billContactPhone;
                $scope.taxID = backData.data.applySetlInfo.taxID;
                $scope.historyAuditMsg = backData.data.historyAuditMsg;
                if(backData.data.auditInfoList[0]){
                    $scope.auditMsg = backData.data.auditInfoList[0].auditMsg;
                }
                for(var i = 0 ; i < backData.data.applyAttachInfoDict.length; i++){
                    switch (backData.data.applyAttachInfoDict[i].attachTypeCd){
                        case '00' : $scope.licence = backData.data.applyAttachInfoDict[i].attachURL;break;
                        case '01' : $scope.ozgCode = backData.data.applyAttachInfoDict[i].attachURL;break;
                        case '02' : $scope.taxCode = backData.data.applyAttachInfoDict[i].attachURL;break;
                        case '03' : $scope.IDpic = backData.data.applyAttachInfoDict[i].attachURL;break;
                    }
                }
            }
        })

        $scope.approve = function(){
            userService.save({
                detail:'review/review/'
            },{
                applyNo:$scope.account,
                auditType:"approve",
                auditMsg : $scope.auditMsg,
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                    content : backData.msg,
                };
                if(backData.status == 1){
                    modalData.goTo = "dls.memberAudit";
                }
                $scope.$emit("setModalState",modalData);
            })
        }

        $scope.refuse = function(){
            userService.save({
                detail:'review/review/'
            },{
                applyNo:$scope.account,
                auditType:"reject",
                auditMsg : $scope.auditMsg,
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                    content : backData.msg,
                };
                if(backData.status == 1){
                    modalData.goTo = "dls.memberAudit";
                }
                $scope.$emit("setModalState",modalData);
            })
        }

        $scope.sendBack = function(){
            userService.save({
                detail:'review/review/'
            },{
                applyNo:$scope.account,
                auditType:"decline",
                auditMsg : $scope.auditMsg,
            },function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                    content : backData.msg
                };
                if(backData.status == 1){
                    modalData.goTo = "dls.memberAudit";
                }
                $scope.$emit("setModalState",modalData);
            })
        }

        $scope.goBack = function(){
            history.back()
        }
    }])
    .controller("auditDetailPageCtrl",["$scope","userService","$state",function($scope,userService,$state){
        $scope.account = $state.params.No;

        userService.save({
            detail:'review/view/'
        },{
            applyNo:$scope.account,
        },function(backData){
            console.log(backData)
            if(backData.status == 1){
                $scope.orgFullNameCN = backData.data.applyBaseInfo.orgFullNameCN;
                $scope.orgFullNameEN = backData.data.applyBaseInfo.orgFullNameEN;
                $scope.deptName = backData.data.applyBaseInfo.deptName;
                $scope.orgNo = backData.data.applyBaseInfo.orgNo;
                $scope.orgRegAddr = backData.data.applyBaseInfo.orgRegAddr;
                $scope.regCapital = backData.data.applyBaseInfo.regCapital;
                $scope.orgTypeCd = backData.data.applyBaseInfo.orgTypeCdDesc;
                $scope.industryCd = backData.data.applyBaseInfo.industryCdDesc;
                $scope.nationCd = backData.data.applyBaseInfo.nationCdDesc;
                $scope.provCd = backData.data.applyBaseInfo.provCdDesc;
                $scope.postAddr = backData.data.applyBaseInfo.postAddr;
                $scope.zipNo = backData.data.applyBaseInfo.zipNo;
                $scope.companyWebSite1 = backData.data.applyContactList[0].companyWebSite;
                $scope.contactName1 = backData.data.applyContactList[0].contactName;
                $scope.emailAddr1 = backData.data.applyContactList[0].emailAddr;
                $scope.phoneNo1 = backData.data.applyContactList[0].phoneNo;
                $scope.faxNo1 = backData.data.applyContactList[0].faxNo;
                $scope.companyWebSite2 = backData.data.applyContactList[1].companyWebSite;
                $scope.contactName2 = backData.data.applyContactList[1].contactName;
                $scope.emailAddr2 = backData.data.applyContactList[1].emailAddr;
                $scope.phoneNo2 = backData.data.applyContactList[1].phoneNo;
                $scope.faxNo2 = backData.data.applyContactList[1].faxNo;
                $scope.acctName = backData.data.applySetlInfo.acctName;
                $scope.acctNo = backData.data.applySetlInfo.acctNo;
                $scope.issueBankName = backData.data.applySetlInfo.issueBankName;
                $scope.issueBankID = backData.data.applySetlInfo.issueBankID;
                $scope.settContactName = backData.data.applySetlInfo.settContactName;
                $scope.settContactPhone = backData.data.applySetlInfo.settContactPhone;
                $scope.settEmailAddr = backData.data.applySetlInfo.settEmailAddr;
                $scope.billHead = backData.data.applySetlInfo.billHead;
                $scope.billAcctNo = backData.data.applySetlInfo.billAcctNo;
                $scope.billIssueBankName = backData.data.applySetlInfo.billIssueBankName;
                $scope.billSendAddr = backData.data.applySetlInfo.billSendAddr;
                $scope.billContactPhone = backData.data.applySetlInfo.billContactPhone;
                $scope.taxID = backData.data.applySetlInfo.taxID;
                $scope.historyAuditMsg = backData.data.historyAuditMsg;
                $scope.applyProgCd = backData.data.applyBaseInfo.applyProgCd;
                for(var i = 0 ; i < backData.data.applyAttachInfoDict.length; i++){
                    switch (backData.data.applyAttachInfoDict[i].attachTypeCd){
                        case '00' : $scope.licence = backData.data.applyAttachInfoDict[i].attachURL;break;
                        case '01' : $scope.ozgCode = backData.data.applyAttachInfoDict[i].attachURL;break;
                        case '02' : $scope.taxCode = backData.data.applyAttachInfoDict[i].attachURL;break;
                        case '03' : $scope.IDpic = backData.data.applyAttachInfoDict[i].attachURL;break;
                    }
                }
            }
        })

        $scope.goBack = function(){
            history.back()
        }
    }])




