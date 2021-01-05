
'use strict';

angular.module('myApp.memberApplyControllers', [
    'myApp.services',
    'dls.services.util'
])

    .controller("memberApplyCtrl",["$scope","memberApplyOptions","member_apply_audit","userService","$state","$filter", "debounce","localStorageService",
    function($scope,memberApplyOptions,member_apply_audit,userService,$state,$filter,debounce,localStorageService){
        $scope.memberApplyOptions = memberApplyOptions;
        var per_page_num = 10;
        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };

        $scope.pageOptions = {};

        var  appStatus = localStorageService.get('appStatus');
        $scope.searchText = !!appStatus ? appStatus.searchText : '';
        $scope.curPage = !!appStatus ? appStatus.curPage : 1;
        $scope.timeSection =  !!appStatus ? appStatus.timeSection : 9;
        $scope.auditStateTypeVal = !!appStatus ? appStatus.auditStateTypeVal : '09';
        $scope.startDate = !!appStatus ? appStatus.startDate : '';
        $scope.endDate = !!appStatus ? appStatus.endDate : '';
        $scope.auditStateType = [{
            label:'全部',value:'09'
        },{
            label:'填写中',value:'00'
        },{
            label:'待审核',value:'01'
        },{
            label:'已审核',value:'02'
        },{
            label:'退回修改',value:'03'
        },{
            label:'已拒绝',value:'04'
        }]


        $scope.search= function(e){
            //var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            //if (keycode == 13) {
            $scope.getData();
            //}
        }

        $scope.exportMember = function(){
            userService.save({
                detail:"apply/apply_export/"
            },{},function(){})
        }

        $scope.getData = function(){
            userService.save({
                detail:"apply/index_search/"
            },{
                tid : $scope.auditStateTypeVal,
                radio : $scope.timeSection,
                rows : per_page_num,
                page : $scope.curPage,
                text : $scope.searchText,
                beginDate : $scope.beginDt,
                endDate : $scope.endDt,
            },function(backData){
                $scope.memberLists = backData.data[0].list;
                $scope.pageList = backData.data[0].page;
                $scope.pageOptions = {
                    total_items_num : $scope.pageList.total_rows,
                    per_page_num : per_page_num,
                    total_pages_num : $scope.pageList.total_pages,
                }
            })
        }

        $scope.getData();

        $scope.$watch('searchText',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getData();
            }
        }, 350));

        $($(".dls-dropdown-menu")[0]).on("click",function(){
            return false
        })

        $scope.$watch("auditStateTypeVal",function(nV,oV){
            if(oV && (nV != oV)){
                $scope.curPage = 1;
                $scope.notPageChange = true;
                $scope.getData();
            }
        })

        $scope.$watch("timeSection",function(nV,oV){
            if(nV != oV){
                $scope.curPage = 1;
                $scope.notPageChange = true;
                $scope.getData();
            }
        })

        $scope.$watch("beginDate",function(nV,oV){
            if($scope.beginDate){
                $scope.timeSection = 9;
                $scope.beginDt = $filter("dlsDateFilter")($scope.beginDate,false,"-");

                if (new Date($scope.beginDt).getTime()-new Date($scope.endDt).getTime() > 0) {
                    modalData.content = "终止日期应在开始日期之后";
                    $scope.$emit("setModalState",modalData);
                }else{
                    $scope.curPage = 1;
                    $scope.notPageChange = true;
                    $scope.getData();
                }
            }
        })

        $scope.$watch("endDate",function(nV,oV){
            if($scope.endDate){
                $scope.timeSection = 9;
                $scope.endDt = $filter("dlsDateFilter")($scope.endDate,false,"-");
                console.log(new Date($scope.beginDt).getTime());
                console.log(new Date($scope.endDt).getTime());

                if (new Date($scope.beginDt).getTime()-new Date($scope.endDt).getTime() > 0) {
                    modalData.content = "终止日期应在开始日期之后";
                    $scope.$emit("setModalState",modalData);
                }else{
                    $scope.curPage = 1;
                    $scope.notPageChange = true;
                    $scope.getData();
                }
            }
        })

        $scope.$watch("curPage",function(nV,oV){
            if(oV && !$scope.notPageChange){
                $scope.getData();
            }
            $scope.notPageChange = false;
        })

        $scope.applyMember = function(){
            $state.go("dls.createMemberApply");
        }

        $scope.selectTime = function(value){
            $scope.timeSection = value;
        }

        $scope.detail = function(item){
            var appStatus = {
                'searchText': $scope.searchText,
                'curPage': $scope.curPage,
                'timeSection': $scope.timeSection,
                'auditStateTypeVal': $scope.auditStateTypeVal,
                'beginDate': $scope.beginDate,
                'endDate': $scope.endDate,
            };
            localStorageService.set('appStatus', appStatus);
            $state.go("dls.memberApplyView",{applyNo:item.applyNo})
        }

        $scope.edit = function(item){
            var appStatus = {
                'searchText': $scope.searchText,
                'curPage': $scope.curPage,
                'timeSection': $scope.timeSection,
                'auditStateTypeVal': $scope.auditStateTypeVal,
                'beginDate': $scope.beginDate,
                'endDate': $scope.endDate,
            };
            localStorageService.set('appStatus', appStatus);
            $state.go("dls.memberApplyEdit",{applyNo:item.applyNo})
        }

    }])
    .controller("createMemberApplyCtrl",["$scope","userService","orgTypeData","$state","memberApplyArrs", function($scope,userService,orgTypeData,$state,memberApplyArrs){
        $scope.step = 1;
        $scope.currStep = 1;
        $scope.type = "create";

        $scope.orgTypeData = orgTypeData.select;
        $scope.orgTypeArr = memberApplyArrs.orgTypeArr;
        $scope.industryTypeArr = memberApplyArrs.industryTypeArr;
        $scope.nationTypeArr = memberApplyArrs.nationTypeArr;
        $scope.provTypeArr = memberApplyArrs.provTypeArr;
        $scope.orgTypeVal = "01";
        $scope.industryTypeVal = "91";
        $scope.nationTypeVal = "156";
        $scope.provTypeVal = "310";

        userService.save({
            detail :　'apply/memApplyNew/'
        },{},function(backData){
            if(backData.status == 1){
                $scope.applyNo = backData.data.applyNo;
            }
        })

        $scope.pre = function(value){
            $scope.step = value;
            $scope.showAll = false;
            $($(".create-item .breadcrumb li")[value]).removeClass("active");
            $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
        }

        $scope.next = function(value){
            $scope.createItem = {};
            $scope.currStep = value;

            if(value == 2){
                $scope.memberApplyForm.orgFullNameCN.$dirty = true;
                $scope.memberApplyForm.deptName.$dirty = true;
                $scope.memberApplyForm.orgNo.$dirty = true;
                $scope.memberApplyForm.postAddr.$dirty = true;
                $scope.memberApplyForm.zipNo.$dirty = true;

                if($scope.memberApplyForm.orgFullNameCN.$valid && $scope.memberApplyForm.deptName.$valid && $scope.memberApplyForm.orgNo.$valid && $scope.memberApplyForm.postAddr.$valid && $scope.memberApplyForm.zipNo.$valid){
                    $scope.step = value;
                    $scope.createItem = {
                        orgFullNameCN : $scope.orgFullNameCN,
                        orgFullNameEN : $scope.orgFullNameEN,
                        deptName : $scope.deptName,
                        orgNo : $scope.orgNo,
                        orgRegAddr : $scope.orgRegAddr,
                        regCapital : $scope.regCapital,
                        orgTypeVal : $scope.orgTypeVal,
                        industryTypeVal : $scope.industryTypeVal,
                        nationTypeVal : $scope.nationTypeVal,
                        provTypeVal : $scope.provTypeVal,
                        postAddr : $scope.postAddr,
                        zipNo : $scope.zipNo,
                        companyWebSite : $scope.companyWebSite,
                    }
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
                }
            }
            else if(value == 3){
                $scope.memberApplyForm.main_contactName.$dirty = true;
                $scope.memberApplyForm.main_emailAddr.$dirty = true;
                $scope.memberApplyForm.main_phoneNo.$dirty = true;

                if($scope.memberApplyForm.main_contactName.$valid && $scope.memberApplyForm.main_emailAddr.$valid && $scope.memberApplyForm.main_phoneNo.$valid){
                    $scope.step = value;
                    $scope.createItem = Object.assign($scope.createItem,{
                        main_contactName : $scope.contactName1,
                        main_emailAddr : $scope.emailAddr1,
                        main_phoneNo : $scope.phoneNo1,
                        main_faxNo : $scope.faxNo1,
                        othContactName : $scope.contactName2,
                        othEmailAddr : $scope.emailAddr2,
                        othPhoneNo : $scope.phoneNo2,
                        othFaxNo : $scope.faxNo2,
                    })
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
                }
            }
            if(value == 4){
                $scope.memberApplyForm.acctName.$dirty = true;
                $scope.memberApplyForm.acctNo.$dirty = true;
                $scope.memberApplyForm.issueBankName.$dirty = true;

                if($scope.memberApplyForm.acctName.$valid && $scope.memberApplyForm.acctNo.$valid && $scope.memberApplyForm.issueBankID.$valid){
                    $scope.step = value;
                    $scope.createItem = Object.assign($scope.createItem,{
                        acctName : $scope.acctName,
                        acctNo : $scope.acctNo,
                        issueBankName : $scope.issueBankName,
                        issueBankID : $scope.issueBankID,
                    })
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
                }
            }
            if(value == 5){
                $scope.memberApplyForm.billHead.$dirty = true;
                $scope.memberApplyForm.billAcctNo.$dirty = true;
                $scope.memberApplyForm.billIssueBankName.$dirty = true;
                $scope.memberApplyForm.billSendAddr.$dirty = true;
                $scope.memberApplyForm.billContactPhone.$dirty = true;

                if($scope.memberApplyForm.billHead.$valid && $scope.memberApplyForm.billAcctNo.$valid && $scope.memberApplyForm.billIssueBankName.$valid && $scope.memberApplyForm.billSendAddr.$valid && $scope.memberApplyForm.billContactPhone.$valid){
                    $scope.step = value;
                    $scope.createItem = Object.assign($scope.createItem,{
                        billHead : $scope.billHead,
                        billAcctNo : $scope.billAcctNo,
                        billIssueBankName : $scope.billIssueBankName,
                        billSendAddr : $scope.billSendAddr,
                        billContactPhone : $scope.billContactPhone,
                        taxID : $scope.taxID,
                    })
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
                }

            }
            if(value == 6){
                if($("input[name='file-les']")[0].files.length == 0){
                    $("#uploadFile01").css("display","inline-block");
                }else{
                    $("#uploadFile01").css("display","none");
                }
                if($("input[name='file-id']")[0].files.length == 0){
                    $("#uploadFile04").css("display","inline-block");
                }else{
                    $("#uploadFile04").css("display","none");
                }

                if($("input[name='file-les']")[0].files.length != 0 && $("input[name='file-id']")[0].files.length != 0){
                    $scope.step = value;
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");

                    $scope.showAll = true;

                    if($("input[name='file-les']")[0].files[0]){
                        $scope.applyAttachInfo01_name = $("input[name='file-les']")[0].files[0].name;
                    }
                    if($("input[name='file-code']")[0].files[0]){
                        $scope.applyAttachInfo02_name = $("input[name='file-code']")[0].files[0].name;
                    }
                    if($("input[name='file-reg']")[0].files[0]){
                        $scope.applyAttachInfo03_name = $("input[name='file-reg']")[0].files[0].name;
                    }
                    if($("input[name='file-id']")[0].files[0]){
                        $scope.applyAttachInfo04_name = $("input[name='file-id']")[0].files[0].name;
                    }
                    if($("input[name='file-other']")[0].files[0]){
                        $scope.applyAttachInfo05_name = $("input[name='file-other']")[0].files[0].name;
                    }
                }
            }
        }

        $scope.submit = function(){
            var flag = false;
            if(($scope.step == 1 && $scope.memberApplyForm.orgFullNameCN.$valid && $scope.memberApplyForm.deptName.$valid && $scope.memberApplyForm.orgNo.$valid && $scope.memberApplyForm.postAddr.$valid && $scope.memberApplyForm.zipNo.$valid) || ($scope.step == 2 && $scope.memberApplyForm.main_contactName.$valid && $scope.memberApplyForm.main_emailAddr.$valid && $scope.memberApplyForm.main_phoneNo.$valid) || ($scope.step == 3 && $scope.memberApplyForm.acctName.$valid && $scope.memberApplyForm.acctNo.$valid && $scope.memberApplyForm.issueBankID.$valid) ||($scope.step == 4 && $scope.memberApplyForm.billHead.$valid && $scope.memberApplyForm.billAcctNo.$valid && $scope.memberApplyForm.billIssueBankName.$valid && $scope.memberApplyForm.billSendAddr.$valid && $scope.memberApplyForm.billContactPhone.$valid)||($scope.step == 5 && $("input[name='file-les']")[0].files.length != 0 && $("input[name='file-id']")[0].files.length != 0)){
                flag = true;
            }

            if(flag){
                $("form[name = 'memberApplyForm']").ajaxSubmit({
                    type:"post",
                    url:"../../api/acc/apply/memApply/",
                    data: {
                        orgTypeCd: $scope.orgTypeVal,
                        industryCd: $scope.industryTypeVal,
                        nationCd: $scope.nationTypeVal,
                        provCd: $scope.provTypeVal,
                    },
                    success:function(backData){
                        alert("暂存成功！")
                    }
                })
            }

            flag = false;
        }

        $scope.finalSubmit = function(){
            $("form[name = 'memberApplyForm']").ajaxSubmit({
                type:"post",
                url:"../../api/acc/apply/memApply/",
                data: {
                    orgTypeCd: $scope.orgTypeVal,
                    industryCd: $scope.industryTypeVal,
                    nationCd: $scope.nationTypeVal,
                    provCd: $scope.provTypeVal,
                },
                success:function(backData){
                    console.log(backData)
                    var status = backData.split(",")[0].split(":")[1];
                    if(status == 1){
                        userService.save({
                            detail:"apply/setCdFinal/"
                        },{
                            applyNo : $scope.applyNo,
                        },function(backData){
                            if(backData.status == 1){
                                alert("申请成功！")
                            }
                        })
                        $state.go('dls.memberApply');
                    }else{
                        alert("申请失败！")
                    }
                }
            })
        }

        $scope.goBack = function(){
            history.back()
        }
    }])
    .controller("createMemberEditCtrl",["$scope","userService","$state","memberApplyArrs",function($scope,userService,$state,memberApplyArrs){
        $scope.type = 'create';
        $scope.step = 1;
        $scope.applyNo = $state.params.applyNo;
        $scope.orgTypeArr = memberApplyArrs.orgTypeArr;
        $scope.industryTypeArr = memberApplyArrs.industryTypeArr;
        $scope.nationTypeArr = memberApplyArrs.nationTypeArr;
        $scope.provTypeArr = memberApplyArrs.provTypeArr;

        userService.save({
            detail : "apply/memApplyEdit/"
        },{
            applyNo : $scope.applyNo
        },function(backData){
            if(backData.status == 1){
                $scope.orgFullNameCN = backData.data.applyBaseInfo.orgFullNameCN;
                $scope.orgFullNameEN = backData.data.applyBaseInfo.orgFullNameEN;
                $scope.deptName = backData.data.applyBaseInfo.deptName;
                $scope.orgNo = backData.data.applyBaseInfo.orgNo;
                $scope.orgRegAddr = backData.data.applyBaseInfo.orgRegAddr;
                $scope.regCapital = backData.data.applyBaseInfo.regCapital;
                $scope.orgTypeVal = backData.data.applyBaseInfo.orgTypeCd;
                $scope.industryTypeVal = backData.data.applyBaseInfo.industryCd;
                $scope.nationTypeVal = backData.data.applyBaseInfo.nationCd;
                $scope.provTypeVal = backData.data.applyBaseInfo.provCd;
                $scope.postAddr = backData.data.applyBaseInfo.postAddr;
                $scope.zipNo = backData.data.applyBaseInfo.zipNo;
                $scope.companyWebSite = backData.data.applyBaseInfo.companyWebSite;

                $scope.acctName = backData.data.applySetlInfo.acctName;
                $scope.acctNo = backData.data.applySetlInfo.acctNo;
                $scope.issueBankName =  backData.data.applySetlInfo.issueBankName;
                $scope.issueBankID = backData.data.applySetlInfo.issueBankID;

                if(backData.data.applyContactDict['1']){
                    $scope.contactName1 = backData.data.applyContactDict['1'].contactName;
                    $scope.emailAddr1 = backData.data.applyContactDict['1'].emailAddr;
                    $scope.phoneNo1 = backData.data.applyContactDict['1'].phoneNo;
                    $scope.faxNo1 = backData.data.applyContactDict['1'].faxNo;
                }

                if(backData.data.applyContactDict['2']){
                    $scope.contactName2 = backData.data.applyContactDict['2'].contactName;
                    $scope.emailAddr2 = backData.data.applyContactDict['2'].emailAddr;
                    $scope.phoneNo2 = backData.data.applyContactDict['2'].phoneNo;
                    $scope.faxNo2 = backData.data.applyContactDict['2'].faxNo;
                }

                $scope.billHead = backData.data.applySetlInfo.billHead;
                $scope.billAcctNo = backData.data.applySetlInfo.billAcctNo;
                $scope.billIssueBankName =  backData.data.applySetlInfo.billIssueBankName;
                $scope.billSendAddr = backData.data.applySetlInfo.billSendAddr;
                $scope.billContactPhone =  backData.data.applySetlInfo.billContactPhone;
                $scope.taxID = backData.data.applySetlInfo.taxID;

                if(backData.data.attachDict){
                    $scope.attachUrl1 = backData.data.attachDict['00'];
                    $scope.attachUrl2 = backData.data.attachDict['01'];
                    $scope.attachUrl3 = backData.data.attachDict['02'];
                    $scope.attachUrl4 = backData.data.attachDict['03'];
                    $scope.attachUrl5 = backData.data.attachDict['04'];
                }
            }
        })

        $scope.pre = function(value){
            $scope.step = value;
            $scope.showAll = false;
            $($(".create-item .breadcrumb li")[value]).removeClass("active");
            $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
        }

        $scope.next = function(value){
            $scope.createItem = {};
            $scope.currStep = value;

            if(value == 2){
                $scope.memberApplyForm.orgFullNameCN.$dirty = true;
                $scope.memberApplyForm.deptName.$dirty = true;
                $scope.memberApplyForm.orgNo.$dirty = true;
                $scope.memberApplyForm.postAddr.$dirty = true;
                $scope.memberApplyForm.zipNo.$dirty = true;

                if($scope.memberApplyForm.orgFullNameCN.$valid && $scope.memberApplyForm.deptName.$valid && $scope.memberApplyForm.orgNo.$valid && $scope.memberApplyForm.postAddr.$valid && $scope.memberApplyForm.zipNo.$valid){
                    $scope.step = value;
                    $scope.createItem = {
                        orgFullNameCN : $scope.orgFullNameCN,
                        orgFullNameEN : $scope.orgFullNameEN,
                        deptName : $scope.deptName,
                        orgNo : $scope.orgNo,
                        orgRegAddr : $scope.orgRegAddr,
                        regCapital : $scope.regCapital,
                        orgTypeVal : $scope.orgTypeVal,
                        industryTypeVal : $scope.industryTypeVal,
                        nationTypeVal : $scope.nationTypeVal,
                        provTypeVal : $scope.provTypeVal,
                        postAddr : $scope.postAddr,
                        zipNo : $scope.zipNo,
                        companyWebSite : $scope.companyWebSite,
                    }
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
                }
            }
            else if(value == 3){
                $scope.memberApplyForm.main_contactName.$dirty = true;
                $scope.memberApplyForm.main_emailAddr.$dirty = true;
                $scope.memberApplyForm.main_phoneNo.$dirty = true;

                if($scope.memberApplyForm.main_contactName.$valid && $scope.memberApplyForm.main_emailAddr.$valid && $scope.memberApplyForm.main_phoneNo.$valid){
                    $scope.step = value;
                    $scope.createItem = Object.assign($scope.createItem,{
                        main_contactName : $scope.contactName1,
                        main_emailAddr : $scope.emailAddr1,
                        main_phoneNo : $scope.phoneNo1,
                        main_faxNo : $scope.faxNo1,
                        othContactName : $scope.contactName2,
                        othEmailAddr : $scope.emailAddr2,
                        othPhoneNo : $scope.phoneNo2,
                        othFaxNo : $scope.faxNo2,
                    })
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
                }
            }
            else if(value == 4){
                $scope.memberApplyForm.acctName.$dirty = true;
                $scope.memberApplyForm.acctNo.$dirty = true;
                $scope.memberApplyForm.issueBankName.$dirty = true;
                $scope.memberApplyForm.issueBankID.$dirty = true;

                if($scope.memberApplyForm.acctName.$valid && $scope.memberApplyForm.acctNo.$valid && $scope.memberApplyForm.issueBankName.$valid && $scope.memberApplyForm.issueBankID.$valid){
                    $scope.step = value;
                    $scope.createItem = Object.assign($scope.createItem,{
                        acctName : $scope.acctName,
                        acctNo : $scope.acctNo,
                        issueBankName : $scope.issueBankName,
                        issueBankID : $scope.issueBankID,
                    })
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
                }
            }
            else if(value == 5){
                $scope.memberApplyForm.billHead.$dirty = true;
                $scope.memberApplyForm.billAcctNo.$dirty = true;
                $scope.memberApplyForm.billIssueBankName.$dirty = true;
                $scope.memberApplyForm.billSendAddr.$dirty = true;
                $scope.memberApplyForm.billContactPhone.$dirty = true;

                if($scope.memberApplyForm.billHead.$valid && $scope.memberApplyForm.billAcctNo.$valid && $scope.memberApplyForm.billIssueBankName.$valid && $scope.memberApplyForm.billSendAddr.$valid && $scope.memberApplyForm.billContactPhone.$valid){
                    $scope.step = value;
                    $scope.createItem = Object.assign($scope.createItem,{
                        billHead : $scope.billHead,
                        billAcctNo : $scope.billAcctNo,
                        billIssueBankName : $scope.billIssueBankName,
                        billSendAddr : $scope.billSendAddr,
                        billContactPhone : $scope.billContactPhone,
                        taxID : $scope.taxID,
                    });

                    $("input[name='file-les']").change(function(){
                        $scope.lesEdit = true;
                        $scope.attachUrl1 = "";
                        $scope.$apply($scope.lesEdit);
                    });
                    $("input[name='file-code']").change(function(){
                        $scope.codeEdit = true;
                        $scope.attachUrl2 = "";
                        $scope.$apply($scope.codeEdit);
                    });
                    $("input[name='file-reg']").change(function(){
                        $scope.regEdit = true;
                        $scope.attachUrl3 = "";
                        $scope.$apply($scope.regEdit);

                    });
                    $("input[name='file-id']").change(function(){
                        $scope.idEdit = true;
                        $scope.attachUrl4 = "";
                        $scope.$apply($scope.idEdit);

                    });
                    $("input[name='file-other']").change(function(){
                        $scope.otherEdit = true;
                        $scope.attachUrl5 = "";
                        $scope.$apply($scope.otherEdit);

                    });


                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");
                }

            }
            else if(value == 6){
                if(($scope.attachUrl1 || $("input[name='file-les']")[0].files.length != 0) && ($scope.attachUrl4 || $("input[name='file-id']")[0].files.length != 0)){
                    $scope.step = value;
                    $($(".create-item .breadcrumb li")[value-2]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[value-1]).removeClass("visited").addClass("active");

                    $scope.showAll = true;

                    $scope.orgTypeType = $("select[name='orgTypeCd']").find("option:selected").text();
                    $scope.industryType = $("select[name='industryCd']").find("option:selected").text();
                    $scope.nationType = $("select[name='nationCd']").find("option:selected").text();
                    $scope.provType = $("select[name='provCd']").find("option:selected").text();

                    if($("input[name='file-les']")[0].files[0]){
                        $scope.applyAttachInfo01_name = $("input[name='file-les']")[0].files[0].name;
                    }
                    if($("input[name='file-code']")[0].files[0]){
                        $scope.applyAttachInfo02_name = $("input[name='file-code']")[0].files[0].name;
                    }
                    if($("input[name='file-reg']")[0].files[0]){
                        $scope.applyAttachInfo03_name = $("input[name='file-reg']")[0].files[0].name;
                    }
                    if($("input[name='file-id']")[0].files[0]){
                        $scope.applyAttachInfo04_name = $("input[name='file-id']")[0].files[0].name;
                    }
                    if($("input[name='file-other']")[0].files[0]){
                        $scope.applyAttachInfo05_name = $("input[name='file-other']")[0].files[0].name;
                    }
                }
            }
        }

        $scope.submit = function(){
            var flag = false;

            if(($scope.step == 1 && $scope.memberApplyForm.orgFullNameCN.$valid && $scope.memberApplyForm.deptName.$valid && $scope.memberApplyForm.orgNo.$valid && $scope.memberApplyForm.postAddr.$valid && $scope.memberApplyForm.zipNo.$valid) || ($scope.step == 2 && $scope.memberApplyForm.main_contactName.$valid && $scope.memberApplyForm.main_emailAddr.$valid && $scope.memberApplyForm.main_phoneNo.$valid) || ($scope.step == 3 && $scope.memberApplyForm.acctName.$valid && $scope.memberApplyForm.acctNo.$valid && $scope.memberApplyForm.issueBankID.$valid) ||($scope.step == 4 && $scope.memberApplyForm.billHead.$valid && $scope.memberApplyForm.billAcctNo.$valid && $scope.memberApplyForm.billIssueBankName.$valid && $scope.memberApplyForm.billSendAddr.$valid && $scope.memberApplyForm.billContactPhone.$valid)||($scope.step == 5 && $("input[name='file-les']")[0].files.length != 0 && $("input[name='file-id']")[0].files.length != 0)){
                flag = true;
            }

            if(flag){
                $("form[name = 'memberApplyForm']").ajaxSubmit({
                    type:"post",
                    url:"../../api/acc/apply/memApply/",
                    data: {
                        orgTypeCd: $scope.orgTypeVal,
                        industryCd: $scope.industryTypeVal,
                        nationCd: $scope.nationTypeVal,
                        provCd: $scope.provTypeVal,
                    },
                    success:function(backData){
                        alert("暂存成功！")
                    }
                })
            }

            flag = false;

        }

        $scope.finalSubmit = function(){
            $("form[name = 'memberApplyForm']").ajaxSubmit({
                type:"post",
                url:"../../api/acc/apply/memApply/",
                data:{
                    orgTypeCd: $scope.orgTypeVal,
                    industryCd: $scope.industryTypeVal,
                    nationCd: $scope.nationTypeVal,
                    provCd: $scope.provTypeVal,
                },
                success:function(backData){
                    var status = backData.split(",")[0].split(":")[1];
                    if(status == 1){
                        userService.save({
                            detail:"apply/setCdFinal/"
                        },{
                            applyNo : $scope.applyNo,
                        },function(backData){
                            if(backData.status == 1){
                                alert("申请成功！")
                            }
                        })
                        $state.go('dls.memberApply');
                    }else{
                        alert("申请失败！")
                    }
                }
            })
        }

        $scope.goBack = function(){
            history.back()
        }

    }])
    .controller("createMemberViewCtrl",["$scope","userService","$state","memberApplyArrs",function($scope,userService,$state,memberApplyArrs){
        $scope.type = 'view';
        $scope.showAll = true;
        $scope.applyNo = $state.params.applyNo;
        $scope.orgTypeArr = memberApplyArrs.orgTypeArr;
        $scope.industryTypeArr = memberApplyArrs.industryTypeArr;
        $scope.nationTypeArr = memberApplyArrs.nationTypeArr;
        $scope.provTypeArr = memberApplyArrs.provTypeArr;

        userService.save({
            detail : "apply/memApplyView/"
        },{
            applyNo : $scope.applyNo
        },function(backData){
            if(backData.status == 1){
                $scope.orgFullNameCN = backData.data.applyBaseInfo.orgFullNameCN;
                $scope.orgFullNameEN = backData.data.applyBaseInfo.orgFullNameEN;
                $scope.deptName = backData.data.applyBaseInfo.deptName;
                $scope.orgNo = backData.data.applyBaseInfo.orgNo;
                $scope.orgRegAddr = backData.data.applyBaseInfo.orgRegAddr;
                $scope.regCapital = backData.data.applyBaseInfo.regCapital;
                $scope.orgTypeVal = backData.data.applyBaseInfo.orgTypeCd;
                $scope.industryTypeVal = backData.data.applyBaseInfo.industryCd;
                $scope.nationTypeVal = backData.data.applyBaseInfo.nationCd;
                $scope.provTypeVal = backData.data.applyBaseInfo.provCd;
                $scope.postAddr = backData.data.applyBaseInfo.postAddr;
                $scope.zipNo = backData.data.applyBaseInfo.zipNo;
                $scope.companyWebSite = backData.data.applyBaseInfo.companyWebSite;

                $scope.acctName = backData.data.applySetlInfo.acctName;
                $scope.acctNo = backData.data.applySetlInfo.acctNo;
                $scope.issueBankName =  backData.data.applySetlInfo.issueBankName;
                $scope.issueBankID = backData.data.applySetlInfo.issueBankID;
                if(backData.data.applyContactDict){
                    $scope.contactName1 = backData.data.applyContactDict['1'].contactName;
                    $scope.emailAddr1 = backData.data.applyContactDict['1'].emailAddr;
                    $scope.phoneNo1 = backData.data.applyContactDict['1'].phoneNo;
                    $scope.faxNo1 = backData.data.applyContactDict['1'].faxNo;

                    $scope.contactName2 = backData.data.applyContactDict['2'].contactName;
                    $scope.emailAddr2 = backData.data.applyContactDict['2'].emailAddr;
                    $scope.phoneNo2 = backData.data.applyContactDict['2'].phoneNo;
                    $scope.faxNo2 = backData.data.applyContactDict['2'].faxNo;
                }
                $scope.billHead = backData.data.applySetlInfo.billHead;
                $scope.billAcctNo = backData.data.applySetlInfo.billAcctNo;
                $scope.billIssueBankName =  backData.data.applySetlInfo.billIssueBankName;
                $scope.billSendAddr = backData.data.applySetlInfo.billSendAddr;
                $scope.billContactPhone =  backData.data.applySetlInfo.billContactPhone;
                $scope.taxID = backData.data.applySetlInfo.taxID;

                if(backData.data.attachDict){
                    $scope.attachUrl1 = backData.data.attachDict['00'];
                    $scope.attachUrl2 = backData.data.attachDict['01'];
                    $scope.attachUrl3 = backData.data.attachDict['02'];
                    $scope.attachUrl4 = backData.data.attachDict['03'];
                    $scope.attachUrl5 = backData.data.attachDict['04'];
                }
            }
        })

        $scope.goBack = function(){
            history.back()
        }
    }])
    .controller("applySignUpCtrl",["$scope","$state","csrfService",function($scope,$state,csrfService){

        csrfService.token();

        $scope.applyMember = function(){
            $scope.accApplyForm.orgFullNameCN.$dirty = true;
            $scope.accApplyForm.deptName.$dirty = true;
            $scope.accApplyForm.contactName.$dirty = true;
            $scope.accApplyForm.settEmailAddr.$dirty = true;
            $scope.accApplyForm.settContactPhone.$dirty = true;

            if($scope.accApplyForm.orgFullNameCN.$valid && $scope.accApplyForm.deptName.$valid && $scope.accApplyForm.contactName.$valid && $scope.accApplyForm.settEmailAddr.$valid && $scope.accApplyForm.settContactPhone.$valid){
                $("form[name = 'accApplyForm']").ajaxSubmit({
                    type:"post",
                    url:"../../api/acc/apply/signup_submit/",
                    success:function(backData){
                        var status = backData.split(",")[0].split(":")[1];
                        if(status == 1){
                            alert("您的申请已成功提交，我们将尽快与您联系!");
                            $state.reload();
                        }
                    }
                })
            }
        }

        $scope.reset = function(){
            $state.reload();
        }

        $scope.goBack = function(){
            history.back();
        }

    }])