'use strict';
angular.module('myApp.quotaControllers', [
        'myApp.services',
        'dls.filters'
])
	.controller("quotaManageCtrl",['$scope','$cookies','userService','DlsUtil', function ($scope,$cookies,userService,DlsUtil) {
		$scope.titles = ['序号','成员账号','成员机构名称','部门名称','当前额度','最后更新时间','状态','操作'];
		$scope.quotaLists = [];
		$scope.curPageNum = 1;
		$scope.pageOptions = {};
		var csrfToken = $cookies.get('csrftoken');
		$scope.getQuotaLists = function (text,page) {
			text = text || $scope.searchText;
			page = page || $scope.curPageNum;
			userService.save({
                detail: "limit/list/dataTable/"
            }, {
            	page:page,
                text:text,
                csrfmiddlewaretoken: csrfToken
            }, function (resp) {
            	console.log(resp);
                if (resp.status == 1) {
                	// var datas = resp.data;
                    $scope.quotaLists = resp.data.list;
                    $scope.totalItems = resp.data.page.total_rows;
                    $scope.total_pages_num = resp.data.page.total_pages;
                    $scope.per_page_items = resp.data.page.rows;
                    // console.log($scope.orderLists);
                    $scope.pageOptions = {
                        "total_items_num" : $scope.totalItems,   //总共的data数量
                        "total_pages_num" : $scope.total_pages_num,  //总共的page数量
                        "per_page_num" : $scope.per_page_items                   //单页page的data数量
                    };
                }
            });
		};
		// $scope.getQuotaLists($scope.searchText,$scope.curPageNum);
		$scope.searchItem = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.getQuotaLists($scope.searchText,1);
            }
        };
        $scope.$watch("curPageNum",function(){
            $scope.getQuotaLists($scope.searchText,$scope.curPageNum);
        });

	}])

	.controller("quotaRecordCtrl",['$scope','$cookies','$stateParams','userService','account_quota_titles',function($scope,$cookies,$stateParams,userService,account_quota_titles){
    	$scope.quotaTitles = account_quota_titles.titles;
        $scope.quotaUserDatas = {};
        $scope.quotaDatas = [];
        // $scope.curPage = 1;
        $scope.totalItems = 0;
        $scope.curPageNum = 1;
        $scope.pageOptions = {};

        var perPageNum = 10;    //分页每页显示内容的数量
        var csrfToken = $cookies.get('csrftoken');
        $scope.memId = $stateParams.memId;

        userService.save({detail:"limit/list/detail/admin/",memId:$scope.memId,csrfmiddlewaretoken:csrfToken},function(resp){
            if (!!resp.data.memLmtBalance) {
                $scope.quotaUserDatas = resp.data.memLmtBalance;
                // console.log($scope.quotaUserDatas);
            }
        });
        $scope.getQuotaDatas = function (page) {
            page = page || $scope.curPage;
            userService.save({detail:"limit/list/detail/dataTable/admin/",memId:$scope.memId,page:page,csrfmiddlewaretoken:csrfToken},function(resp){
                console.log(resp);
                if (!!resp.data[0].list.length) {
                    console.log(resp);
                    $scope.quotaDatas = resp.data[0].list;
                    $scope.totalItems = resp.data[0].page.total_rows;
                    $scope.pageOptions = {
                        "total_items_num" : resp.data[0].page.total_rows,   //总共的data数量
                        "total_pages_num" : resp.data[0].page.total_pages,  //总共的page数量
                        "per_page_num" : resp.data[0].page.rows             //单页page的data数量
                    };
                }
            });
        }
        // $scope.getQuotaDatas();


        $scope.$watch("curPageNum",function(){
            // $scope.lists = $scope.quotaDatas.slice($scope.pageOptions.per_page_num*($scope.curPageNum-1),$scope.pageOptions.per_page_num*$scope.curPageNum);
            $scope.getQuotaDatas($scope.curPageNum);
        });


    }])
    .controller("quotaAdjustCtrl",['$scope','$cookies','$stateParams','userService','account_quota_titles'
        ,function($scope,$cookies,$stateParams,userService,account_quota_titles){
            var csrfToken = $cookies.get('csrftoken');
            var modalData = {
                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                content : ''
            };
            $scope.adjustTypes = [{
              'value' : '08',
              'name' : '充值'
            },{
              'value' : '03',
              'name' : '授信增加'
            },{
              'value' : '04',
              'name' : '授信减少'
            },{
              'value' : '09',
              'name' : '账户调增'
            },{
              'value' : '10',
              'name' : '账户调减'
            }];
            $scope.memId = $stateParams.memId;
            $scope.type = "08";
            userService.save({detail:"limit/list/adjust",memId:$scope.memId,csrfmiddlewaretoken:csrfToken},function(resp){
                console.log(resp);

                if (!!resp.data.memLmtBalance) {

                    $scope.quotaDatas = resp.data.memLmtBalance;
                    // console.log($scope.quotaUserDatas);
                }
            });
            $scope.newQuotaAmount = "";
            $scope.remark = "";
            $scope.adjustQuotaAmount = function (newQuotaAmount) {
                // body...
                if (! newQuotaAmount) {
                    modalData.content = "额度不能为空！";
                    $scope.$emit("setModalState",modalData);
                    return;
                }
                if (isNaN(newQuotaAmount) || parseFloat(newQuotaAmount) <= 0) {
                    modalData.content = "请输入大于0的数字！";
                    $scope.$emit("setModalState",modalData);
                    return;
                }
                if ( ($scope.type === '09' || $scope.type === '10')  && !$scope.remark) {
                    modalData.content = "请输入账户调整原因！";
                    $scope.$emit("setModalState",modalData);
                    return;
                }

                userService.save({detail:"limit/list/adjust/save",memId:$scope.memId,adjType:$scope.type,remark:$scope.remark,limit:newQuotaAmount,csrfmiddlewaretoken:csrfToken},function(resp){
                    // console.log(resp);

                    if (1 === resp.status) {
                        $scope.newQuotaAmount = "";
                        $scope.remark = "";
                    }
                    modalData.content = resp.msg;
                    $scope.$emit("setModalState",modalData);
                });
            }

    }])
    .controller("quotaCheckCtrl",['$scope','$cookies','userService','account_quota_titles'
    	,function($scope,$cookies,userService,account_quota_titles){
    		var csrfToken = $cookies.get('csrftoken');
            var modalData = {
                templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                content : ''
            };
    		$scope.checkStatus = '未审核';
            $scope.status = '01';
            $scope.totalItems = 0;
            $scope.curPageNum = 1;
            $scope.pageOptions = {};
    		$scope.setCheckStatus = function (idx) {
    			var list = ["未审核", "已审核", "已拒绝"];
    			var statusNames = ['01', '02','03'];
    			$scope.checkStatus = list[idx];
    			$scope.status = statusNames[idx];
    		};
             $scope.quotaCheckTitles = ["序号",  "账户","机构名称", "部门名称",  "更新时间",    "额度调整类型",  "金额",  "剩余额度",    "调整账户",    "审核账户",    "审核状态"];
            $scope.getCheckDatas = function () {
        		userService.save({detail:"limit/review/list",page:$scope.curPageNum,memId:$scope.memId,reviewStatus:$scope.status,csrfmiddlewaretoken:csrfToken},function(resp){
                    console.log(resp);

                    if (resp.data.length > 0) {

                        $scope.quotaCheckDatas = resp.data[0].list;
                        $scope.totalItems = resp.data[0].page.total_rows;
                        $scope.pageOptions = {
                            "total_items_num" : resp.data[0].page.total_rows,   //总共的data数量
                            "total_pages_num" : resp.data[0].page.total_pages,  //总共的page数量
                            "per_page_num" : resp.data[0].page.rows             //单页page的data数量
                        };
                    }
                    // console.log($scope.quotaCheckDatas);
                });
            };
            $scope.getCheckDatas();
            $scope.$watch("curPageNum",function(){
                $scope.getCheckDatas();
            });

            $scope.checkQuota = function (id, status,idx) {
                userService.save({detail:"limit/review",id:id,reviewStatus:status,csrfmiddlewaretoken:csrfToken},function(resp){
                    console.log(resp);

                    if (1 === resp.status && "成功" === resp.msg) {
                        $scope.quotaCheckDatas.splice(idx,1);
                        if ("02" === status) {
                            modalData.content = "审核成功！";
                        } else {
                            modalData.content = "拒绝成功！";
                        }
                    } else {
                        modalData.content = resp.msg;
                    }
                    $scope.$emit("setModalState",modalData);
                });
            };




    }])
    .controller("quotaClearingCtrl",['$scope','$cookies','userService','account_quota_titles'
        ,function($scope,$cookies,userService,account_quota_titles){
            var csrfToken = $cookies.get('csrftoken');
            $scope.totalItems = 0;
            $scope.curPageNum = 1;
            $scope.pageOptions = {};

            $scope.quotaCheckTitles = ["序号",   "会员编号",    "机构全称中文",  "机构全称英文",  "剩余额度",   "查看明细"];

            $scope.getDatas = function (page) {
                page = page || $scope.curPageNum;
                userService.save({detail:"limit/setl/list/dataTable",page:page,csrfmiddlewaretoken:csrfToken},function(resp){
                    console.log(resp);

                    if (resp.data.list.length > 0) {
                        $scope.quotaCheckDatas = resp.data.list;
                        $scope.totalItems = resp.data.page.total_rows;
                        $scope.pageOptions = {
                            "total_items_num" : resp.data.page.total_rows,   //总共的data数量
                            "total_pages_num" : resp.data.page.total_pages,  //总共的page数量
                            "per_page_num" :    resp.data.page.rows             //单页page的data数量
                        };

                    }
                });
            };
            $scope.$watch("curPageNum",function(){
                $scope.getDatas($scope.curPageNum);
            });
        }])
    .controller("quotaStatementsCtrl",['$scope','$cookies','$stateParams','userService','account_statements_titles','DLS_years','DLS_months','Excel','$timeout'
        ,function($scope,$cookies,$stateParams,userService,account_statements_titles,DLS_years,DLS_months,Excel,$timeout){
            $scope.memId = $stateParams.memId;

            $scope.outlineTitles = account_statements_titles.outlineTitles;
            $scope.statementsTitles = account_statements_titles.statementsTitles;
            $scope.statementsOrderTitles = account_statements_titles.statementsOrderTitles;

            $scope.statementsOrderDatas = {};
            $scope.years = DLS_years;
            $scope.months = DLS_months;
            var date = new Date();
            $scope.clearYear = date.getFullYear().toString();
            $scope.clearMonth= $scope.months.num[date.getMonth()];
            $scope.getDatas = function (year,month) {
                year = year || $scope.clearYear;
                month = month || $scope.clearMonth;
                var csrfToken = $cookies.get('csrftoken');
                userService.save({detail:"settlement/list/dataTable",memId:$scope.memId,year:year,month:month,csrfmiddlewaretoken:csrfToken},function(resp){
                    // console.log(resp);
                    if (0 === resp.status) {
                        console.log("请求失败");
                        return;
                    } else if (!!resp.data.memOrderInfo.length) {
                        $scope.statementsOrderDatas = resp.data.instSetlSum;
                        $scope.statementsOrderDatas.orderList = [];
                        $scope.statementsDatas = resp.data.memOrderInfo;
                        for(var tmp={},i=0,len=$scope.statementsDatas.length;i<len;i++){
                            tmp.oppositeInstitude = $scope.statementsDatas[i].orgOther;
                            tmp.receive           = $scope.statementsDatas[i].detailInfo[0].rcvAmt || "--";
                            tmp.pay               = $scope.statementsDatas[i].detailInfo[0].payAmt || "--";
                            tmp.name              = $scope.statementsDatas[i].name;
                            tmp.roleName          = $scope.statementsDatas[i].roleName;
                            tmp.clearingType 　   = $scope.statementsDatas[i].settModCd;
                            tmp.id　　　　　　　  = $scope.statementsDatas[i].detailInfo[0].orderId;
                            tmp.connObjCatCd　　  = $scope.statementsDatas[i].detailInfo[0].connObjCatCd;//单品
                            tmp.connObjId 　　　  = $scope.statementsDatas[i].detailInfo[0].connObjId;
                            tmp.taskNum 　　　　  = $scope.statementsDatas[i].detailInfo[0].taskNum;
                            tmp.expectPrice 　　  = $scope.statementsDatas[i].detailInfo[0].expectPrice;
                            tmp.ConnObjVer 　　   = $scope.statementsDatas[i].detailInfo[0].ConnObjVer;
                            tmp.connObjName 　　  = $scope.statementsDatas[i].detailInfo[0].prdtName;
                            tmp.chargetype 　　   = $scope.statementsDatas[i].detailInfo[0].valuationModeCd_display;
                            tmp.orderEffectDate   = $scope.statementsDatas[i].orderEffectDate;
                            tmp.orderExpiryDate   = $scope.statementsDatas[i].orderExpiryDate;
                            tmp.confirmTime 　　  = $scope.statementsDatas[i].confirmTime;
                            $scope.statementsOrderDatas.orderList.push(tmp);
                            tmp = {};
                        }
                        // console.log($scope.statementsOrderDatas);
                    } else {
                        $scope.statementsOrderDatas = {};
                    }

                });
            };
            $scope.getDatas();

            $scope.exportStatement = function (evt) {
                $(evt.target).download = 'statementTab.csv';
                $timeout(function() { window.open(Excel.tableToExcel('#statementTab')); }, 100); // trigger download
            };


        }])

