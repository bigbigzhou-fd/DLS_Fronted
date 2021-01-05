'use strict';
angular.module('myApp.adminControllers', [
        'myApp.services',
        'dls.filters',
        'dls.services.util'
])
	.controller("adminTagCtrl",['$scope','$filter','$cookies','adminService','DlsUtil'
        , function ($scope,$filter,$cookies,adminService,DlsUtil) {
		var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };
        $scope.editUrl = "tagM/cat/form/";
		$scope.deleteUrl = "tagM/cat/del/";
        $scope.admin_label_type_btn_datas = [];
        var csrfToken = $cookies.get('csrftoken');
        console.log(csrfToken)
		adminService.get({detail:"tagM/index/"},function(resp){
	        console.log(resp);
	        $scope.adminTags = resp.data;
            // console.log($scope.adminTags);
	        $scope.admin_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
	    });

        $scope.totalItems = 0;
        $scope.curPageNum = 1;
        $scope.pageOptions = {};


	    $scope.labelType = "标签名称";
        $scope.searchText = '';
        $scope.type = "name";
	    $scope.assignmentType = "单值列表";
	    $scope.selectedNode = {id : ""};
	    $scope.setLabelType = function (idx) {
	    	var list = ["标签名称", "赋值类型"];
	    	var typeNames = ['name', 'value_type'];
	    	$scope.labelType = list[idx];
	    	$scope.type = typeNames[idx];
            if (idx === 1) {
                $scope.searchText = idx;
            } else {
                $scope.searchText = '';
            }
	    };
	    $scope.setAssignmentType = function (idx) {
	    	var list = [ '全部', '单值列表', '多值列表', '分段', '命中', '数据项'];
	    	$scope.assignmentType = list[idx];
	    	$scope.searchText = idx;
	    };
	    $scope.libTabTitles = ["标签编号",	"标签名称",	"标签赋值类型",	"标签赋值"];
	    $scope.libTabDatas = [{
	    	"id":"000156","name":"指定商品的购买意图","type":"多值列表","fushi":"指定商品的购买意图列表"
	    }];


	    $scope.searchItem = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.getTagListDatas($scope.selectedNode.id,$scope.searchText);
            }
        };

        // $scope.trade_label_type_btn_datas = $rootScope.trade_label_type_btn_datas;

        $scope.getTagListDatas = function(pcode,cont,page) {
            var type = !!cont ? $scope.type : "";
            page = !!page ? page : $scope.curPageNum = 1;
            adminService.save({
                detail: "tagM/tag/list"
            }, {
                type:type,
                cont:cont,
                pcode:pcode,
                page:page,
                csrfmiddlewaretoken: csrfToken
            }, function (resp) {
            	console.log(resp);
                if (resp.status == 1) {
                    $scope.libTabDatas = resp.data.list;

                    $scope.totalItems = resp.data.page.total_rows;
                    $scope.pageOptions = {
                        "total_items_num" : resp.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : resp.data.page.total_pages,  //总共的page数量
                        "per_page_num" : resp.data.page.rows             //单页page的data数量
                    };
                }
            });
        };

        $scope.$watch(function () {
            return $scope.searchText + '/' + $scope.curPageNum;
        }, function (newV) {
            $scope.getTagListDatas($scope.pcode,$scope.searchText,$scope.curPageNum);
        }, true);


        $scope.edit_name   = "";
        $scope.edit_type   = "";
        $scope.edit_value  = "";
        var old_name       = "";
        var old_value_type = "";
        var old_value_ex   = "";


        $scope.editTag = function (index,event) {
        	$scope.renderId = index;
        	if (event) {
        		// var tr = $(event.target).parent().parent();
        		// var tobeEdit = tr.find('.edit');
        		$scope.edit_name  = old_name       = $scope.libTabDatas[index].name      ; //$(tobeEdit[0])[0].innerText;
        		$scope.edit_type  = old_value_type = $filter("assignTypeFilter")($scope.libTabDatas[index].value_type); //$(tobeEdit[1])[0].innerText;
        		$scope.edit_value = old_value_ex   = $scope.libTabDatas[index].value_ex  ; //$(tobeEdit[2])[0].innerText;
        	}


        };
        $scope.saveTag = function (index,event,code) {
        	var tr = $(event.target).parent().parent();
        	var tobeEdit = tr.find('.edit');

        	var new_name       = $(tobeEdit[0]).val();
        	var new_value_type = $(tr.find('select')).val();
        	var new_value_ex   = $(tobeEdit[1]).val();

            if (new_name === old_name && new_value_type === old_value_type && new_value_ex === old_value_ex) {
                console.log("未修改");
                $scope.renderId = undefined;
            } else if (! new_name || ! new_value_ex || ! new_value_type) {
                modalData.content = "请将标签名称、标签类型和标签赋值输入完整！";
                $scope.$emit("setModalState",modalData);
                return;
            } else {
            	new_value_type = $filter('assignTypeNumberFilter')(new_value_type);
        		adminService.save({
        		    detail: "tagM/tag/form"
        		}, {
        			acttype:'edit',
        			name: new_name,
        			code: code,
        		    type:new_value_type,
        		    value:new_value_ex,
        		    csrfmiddlewaretoken: csrfToken
        		}, function (resp) {
        			console.log(resp);
        		    if (resp.status == 1) {
        		    	var code = resp.code;
        		    	$scope.libTabDatas[index].name       = new_name;
        		    	$scope.libTabDatas[index].value_type = new_value_type;
        		    	$scope.libTabDatas[index].value_ex   = new_value_ex;
        		        // $scope.libTabDatas = resp.data.list;
        		        $scope.renderId = undefined;
        		    } else if (resp.status === 0) {
                        modalData.content = resp.msg;
                        $scope.$emit("setModalState",modalData);
                    }
        		});
        	}
        };
        $scope.cancelEditTag = function (index,event) {
        	$scope.renderId = undefined;
        };
        $scope.deleteList = [];
        $scope.deleteTag = function(index,event) {
        	$scope.deleteList.push($scope.libTabDatas[index].code);
        	adminService.save({
        	    detail: "tagM/tag/delete"
        	}, {
        		code_list : $scope.deleteList,
        	    csrfmiddlewaretoken: csrfToken
        	}, function (resp) {
        		console.log(resp);
        	    if (resp.status == 1) {
        	    	$scope.libTabDatas.splice(index,1);
        	    } else {
        	    	console.log('error');
        	    }
        	});
        };

        $scope.deleteTagGroup = function () {
        	console.log($scope.libTabDatas);
        	$scope.deleteList = [];
        	var tmp = {};
        	for (var i = 0, len = $scope.libTabDatas.length; i < len; i++) {
        		if(!!$scope.libTabDatas[i].checked){
        			$scope.deleteList.push($scope.libTabDatas[i].code);
        		}
        	}
        	adminService.save({
        	    detail: "tagM/tag/delete"
        	}, {
        		code_list : $scope.deleteList,
        	    csrfmiddlewaretoken: csrfToken
        	}, function (resp) {
        		console.log(resp);
        	    if (resp.status == 1) {
                    $scope.libTabDatas = DlsUtil.removeArrItem($scope.libTabDatas,true,"checked")
        	    } else {
        	    	console.log('error');
        	    }
        	});
        };

        $scope.addNewTagContentFlag = 0;
        $scope.addNewTagContent = function () {
            $scope.edit_name  = "";
            $scope.edit_type  = "";
            $scope.edit_value = "";
            $scope.addNewTagContentFlag = 1;
        };
        $scope.$on("selectedNode_id_changed", function(event,data){
            $scope.pcode = data.id;
        });
        $scope.saveNewTagContent = function (new_name,new_type,new_value) {
            var type = $filter('assignTypeNumberFilter')(new_type);
            if (!$scope.pcode) {
                modalData.content = "请选择标签类！";
                $scope.$emit("setModalState",modalData);
                return;
            }
            adminService.save({
                detail: "tagM/tag/form"
            }, {
                acttype:'create',
                name: new_name,
                type: type,
                pcode: $scope.pcode,
                value:new_value,
                csrfmiddlewaretoken: csrfToken
            }, function (resp) {
                console.log(resp);
                if (resp.status == 1) {
                    var tmp = {};
                    tmp.code = resp.data.code;
                    tmp.name = new_name;
                    tmp.value_type = type;
                    tmp.value_ex = new_value;
                    $scope.libTabDatas.push(tmp);
                    $scope.addNewTagContentFlag = 0;
                } else {
                    modalData.content = resp.msg;
                    $scope.$emit("setModalState",modalData);
                }
            });
        };
        $scope.cancelAddNewTagContent = function () {
            $scope.addNewTagContentFlag = 0;
        }


	}])
	.controller("adminIdCtrl",['$scope','$cookies','adminService','DlsUtil', function ($scope,$cookies,adminService,DlsUtil) {

        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };
        $scope.$on("selectedNode_id_changed", function(event,data){
            $scope.pcode = data.id;
        });

        $scope.editUrl = "idM/idCat/form/";
		$scope.deleteUrl = "idM/idCat/del/";
		$scope.admin_label_type_btn_datas = [];

		adminService.get({detail:"idM/index/"},function(resp){
            $scope.adminTags = resp.data;
	        // console.log($scope.adminTags);
	        $scope.admin_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
	    });

        $scope.totalItems = 0;
        $scope.curPageNum = 1;
        $scope.pageOptions = {};

	    $scope.labelType = "ID名称";
        $scope.type = "name";
        $scope.searchText = "";
	    $scope.libTabTitles = ["ID编号",	"ID名称",	"ID赋值"];
	    $scope.selectedNode = {id : ""};
	    var csrfToken = $cookies.get('csrftoken');

	    $scope.getTagListDatas = function(pcode,cont,page) {
	    	var type = !!cont ? $scope.type : "";
            page = !!page ? page : $scope.curPageNum = 1;
            adminService.save({
                detail: "idM/idObj/list"
            }, {
                type:type,
                cont:cont,
                pcode:pcode,
                page:page,
                csrfmiddlewaretoken: csrfToken
            }, function (resp) {
            	console.log(resp);
                if (resp.status == 1) {
                    $scope.libIdDatas = resp.data.list;

                    $scope.totalItems = resp.data.page.total_rows;
                    $scope.pageOptions = {
                        "total_items_num" : resp.data.page.total_rows,   //总共的data数量
                        "total_pages_num" : resp.data.page.total_pages,  //总共的page数量
                        "per_page_num" : resp.data.page.rows             //单页page的data数量
                    };
                }
            });
        };


        $scope.searchItem = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.getTagListDatas('',$scope.searchText);
            }
        };

        $scope.$watch(function () {
            return $scope.searchText + '/' + $scope.curPageNum;
        }, function (newV, oldV) {
            if(newV !== oldV) {
                $scope.getTagListDatas($scope.pcode,$scope.searchText,$scope.curPageNum);
            }
        }, true);

        $scope.edit_name   = "";
        $scope.edit_value  = "";
        var old_name       = "";
        var old_value_ex   = "";


        $scope.editTag = function (index,event) {
        	$scope.renderId = index;
        	if (event) {
        		var tr = $(event.target).parent().parent();
        		var tobeEdit = tr.find('.edit');
        		$scope.edit_name  = old_name       = $(tobeEdit[0])[0].innerText;
        		$scope.edit_value = old_value_ex   = $(tobeEdit[1])[0].innerText;
        	}


        };
        $scope.saveTag = function (index,event,code) {
        	var tr = $(event.target).parent().parent();
        	var tobeEdit = tr.find('.edit');

        	var new_name       = $(tobeEdit[0]).val();
        	var new_value_ex   = $(tobeEdit[1]).val();

        	if (new_name === old_name && new_value_ex === old_value_ex) {
        		console.log("未修改");
        		$scope.renderId = undefined;
        	} else if (!new_name || ! new_value_ex) {
                modalData.content = "请将ID名称和ID赋值输入完整！";
                $scope.$emit("setModalState",modalData);
                return;
            } else {
        		adminService.save({
        		    detail: "idM/idObj/form"
        		}, {
        			acttype:'edit',
        			name: new_name,
        			code: code,
        		    value:new_value_ex,
        		    csrfmiddlewaretoken: csrfToken
        		}, function (resp) {
        			console.log(resp);
        		    if (resp.status == 1) {
        		    	var code = resp.code;
        		    	$scope.libIdDatas[index].name       = new_name;
        		    	$scope.libIdDatas[index].value_ex   = new_value_ex;
        		        $scope.renderId = undefined;
        		    }
        		});
        	}
        };
        $scope.cancelEditTag = function (index,event) {
        	$scope.renderId = undefined;
        };
        $scope.deleteList = [];
        $scope.deleteTag = function(index,event) {
        	$scope.deleteList.push($scope.libIdDatas[index].code);
        	adminService.save({
        	    detail: "idM/idObj/delete"
        	}, {
        		code_list : $scope.deleteList,
        	    csrfmiddlewaretoken: csrfToken
        	}, function (resp) {
        		console.log(resp);
        	    if (resp.status == 1) {
        	    	$scope.libIdDatas.splice(index,1);
        	    } else {
        	    	console.log('error');
        	    }
        	});
        };

        $scope.deleteIdGroup = function () {
        	console.log($scope.libIdDatas);
        	$scope.deleteList = [];
        	var tmp = {};
        	for (var i = 0, len = $scope.libIdDatas.length; i < len; i++) {
        		if(!!$scope.libIdDatas[i].checked){
        			$scope.deleteList.push($scope.libIdDatas[i].code);
        		}
        	}
        	adminService.save({
        	    detail: "idM/idObj/delete"
        	}, {
        		code_list : $scope.deleteList,
        	    csrfmiddlewaretoken: csrfToken
        	}, function (resp) {
        		console.log(resp);
        	    if (resp.status == 1) {
                    $scope.libIdDatas = DlsUtil.removeArrItem($scope.libIdDatas,true,"checked");
        	    } else {
        	    	console.log('error');
        	    }
        	});
        };

        $scope.addNewIdContentFlag = 0;
        $scope.addNewIdContent = function () {
            $scope.addNewIdContentFlag = 1;
            $scope.edit_name  = "";
            $scope.edit_value = "";
        };
        $scope.$on("selectedNode_id_changed", function(event,data){
            $scope.pcode = data.id;
        });
        $scope.saveNewIdContent = function (new_name,new_value) {
            if (!$scope.pcode) {
                modalData.content = "请选择ID类！";
                $scope.$emit("setModalState",modalData);
                return;
            }
            adminService.save({
                detail: "idM/idObj/form"
            }, {
                acttype:'create',
                name: new_name,
                pcode: $scope.pcode,
                value:new_value,
                csrfmiddlewaretoken: csrfToken
            }, function (resp) {
                console.log(resp);
                if (resp.status == 1) {
                    var tmp = {};
                    tmp.code = resp.data.code;
                    tmp.name = new_name;
                    tmp.value_ex = new_value;
                    $scope.libIdDatas.push(tmp);
                    $scope.addNewIdContentFlag = 0;
                    $scope.pageOptions.total_items_num += 1;
                } else {
                    modalData.content = resp.msg;
                    // alert(resp.msg);
                    $scope.$emit("setModalState",modalData);
                }
            });
        };
        $scope.cancelAddNewIdContent = function () {
            $scope.addNewIdContentFlag = 0;
        }
	}])
    .controller("labelEditCtrl",['$scope','$cookies','$filter','adminService','DlsUtil'
    	,function($scope,$cookies,$filter,adminService,DlsUtil){

            // $(document).on("mousedown", function (e) {
            //     if (-1 === e.target.className.indexOf('tree-label'))  {
            //         console.log(e.target.className);
            //         $scope.selectedNode.id = "";
            //         $('.tree-label ').removeClass("selectedNode").removeClass("tree-selected");
            //     }
            //     console.log($scope.selectedNode);
            // });

            $scope.$watch(function () {
                return $scope.selectedNode.id;
            }, function (newV) {
                $scope.$emit("selectedNode_id_changed", $scope.selectedNode);

                !!$scope.getTagListDatas && $scope.getTagListDatas($scope.selectedNode.id);
            }, true);

        	var modalData = {
        	    templateUrl : './src/templates/modalViews/addToCartTipModal.html',
        	    content : ''
        	};
        	$scope.treeOptions = {
        	    nodeChildren: "child",
        	    dirSelectable: true,
        	    injectClasses: {
        	        iExpanded: "glyphicon glyphicon-triangle-bottom",
        	        iCollapsed: "glyphicon glyphicon-triangle-right",
        	        labelSelected: "selectedNode",
        	    },
        	    adminEdit : true,
        	    addTag : function(node,event){
        	    	if(event){
        	    		var liEle = $(event.target).parent();
                        // console.log(liEle);
						var topli = liEle.position().top;
        	    		// console.log(liEle.position().top);
        	    		var edtEle = $('.dls-tree').find('.input-group');
        	    		edtEle.css("display",'inline-block');
        	    		// var topEdt = edtEle.position().top;
        	    		// console.log(edtEle.position().top);
        	    		edtEle.css("top",topli+33+'px');

        	    		$scope.addNewTag = function (event) {
        	    			var newTagName = $scope.newTag;
                            if (!newTagName) {
                                modalData.content = "标签名不能为空";
                                $scope.$emit("setModalState",modalData);
                                return;
                            }
                            var newNode = {};
                            newNode.isParent = false;
                            newNode.name = newTagName;
                            newNode.pId = node.id;
	        	    		adminService.save({
				                detail : $scope.editUrl
				            },{
				                "acttype" : 'tag',
				                "name" : newTagName,
				                "pid" : node.id
				            },function(resp){
				            	// console.log(resp);
				            	if (1 === resp.status) {
				            		newNode.id = resp.data.code;
                                    $scope.adminTags.push(newNode);
				            		$scope.admin_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
				            		// DlsUtil.updateItemInObjArr($scope.admin_label_type_btn_datas,node.id,newNode);
                                    // console.log($scope.admin_label_type_btn_datas);
                                    $scope.newTag = '';
				            		edtEle.css("display",'none');
    			            		modalData.content = "添加标签成功";
    		            			$scope.$emit("setModalState",modalData);
				            	} else {
				            		modalData.content = "添加标签失败";
    		            			$scope.$emit("setModalState",modalData);
				            	}
				            });
				            event.stopPropagation();
        	    		};

        	    		$scope.cancleAddNewTag = function (event) {
	        	    		$scope.newTag = '';
	        	    		edtEle.css("display",'none');
	        	    		event.stopPropagation();
        	    		}



        	    	}
	            },
	            editTag : function(node,event){
	            	if(event){
	            		var tagEle = $(event.target).parent().find('.tree-label')[0];
	            		var oldTag = $.trim($(tagEle).text());
	            	    $(tagEle).attr("contenteditable",true);
	            	    $(tagEle).addClass("editable").select();;//.focus();


	            	    DlsUtil.selectText(tagEle);
	            	    $(tagEle).blur(function () {
		            	    $(tagEle).removeClass("editable");
                            var newTag = $.trim($(tagEle).text());
                            if (oldTag === newTag) {return;}

                            if (!newTag) {
                                $(tagEle).text(oldTag)
                                modalData.content = "ID名不能为空";
                                $scope.$emit("setModalState",modalData);
                                return false;
                            }

                            adminService.save({
                                detail : $scope.editUrl
                            },{
                                "acttype" : 'edit',
                                "name" : newTag,
                                "code" : node.id
                            },function(resp){
                                // console.log(resp);
                                if (1 === resp.status) {
				            		var index = DlsUtil.findIndexInArr(node.id,$scope.adminTags);
				            		$scope.adminTags[index].name = newTag;
				            		$scope.admin_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
                                    modalData.content = "修改标签成功";
    		            			$scope.$emit("setModalState",modalData);
				            	} else {
                                    $(tagEle).text(oldTag);
				            		modalData.content = "修改标签失败";
    		            			$scope.$emit("setModalState",modalData);
				            	}
				            });
	            	    });

	            	}
	            },
	            removeTag : function(node,event){
	            	adminService.save({
		                detail : $scope.deleteUrl
		            },{
		                "acttype" : 'delete',
		                "code" : node.id
		            },function(resp){
		            	// console.log(resp);
		            	if (1 === resp.status) {
		            		// console.log(node.id);
		            		var index = DlsUtil.findIndexInArr(node.id,$scope.adminTags);
		            		$scope.adminTags.splice(index,1);
		            		$scope.admin_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
		            		modalData.content = "删除标签成功";
	            			$scope.$emit("setModalState",modalData);
		            	} else if (0 === resp.status) {
		            		modalData.content = resp.msg;
		            		$scope.$emit("setModalState",modalData);
		            	}
		            });
	            },


        	    // templateUrl:"angular-tree-admin.html"
        	};

            $scope.addCategory = function (event) {
            	var edtEle = $('.dls-tree').find('.input-group');
        	    edtEle.css("display",'inline-block');
                var btnTop = $('.btn-add-tag').position().top;
        	    edtEle.css("top", btnTop+38+'px');
        	    $scope.addNewTag = function (event) {
	    			var newTagName = $scope.newTag;
                    if (!newTagName) {
                        modalData.content = "标签名不能为空";
                        $scope.$emit("setModalState",modalData);
                        return;
                    }
                    var newNode = {};
                    newNode.isParent = true;
                    newNode.name = newTagName;
                    newNode.pId = 0;
                    newNode.child = [];
                    console.log($scope.selectedNode.id);
    	    		adminService.save({
		                detail : $scope.editUrl
		            },{
		                "acttype" : 'folder',
		                "name" : newTagName,
		                "pid" : ''
		            },function(resp){
		            	// console.log(resp);
		            	if (1 === resp.status) {
		            		newNode.id = resp.data.code;
		            		// console.log(newNode);
		            		$scope.adminTags.push(newNode);
		            		$scope.admin_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
		            		$scope.newTag = '';
		            		edtEle.css("display",'none');
		            		modalData.content = "添加标签成功";
	            			$scope.$emit("setModalState",modalData);
		            	} else {
		            		modalData.content = "添加标签失败";
	            			$scope.$emit("setModalState",modalData);
		            	}
		            });
		            event.stopPropagation();
	    		};

	    		$scope.cancleAddNewTag = function (event) {
    	    		$scope.newTag = '';
    	    		edtEle.css("display",'none');
    	    		event.stopPropagation();
	    		}
            }


    	}])
    .controller("crpManageCtrl",["$scope","providerService","debounce","$state","supTradeService", function($scope, providerService,debounce,$state,supTradeService){
        $scope.auditState = [{
            label:'待审核',value:'01'
        },{
            label:'审核通过',value:'03'
        },{
            label:'审核不通过',value:'04'
        },{
            label:'退回修改',value:'05'
        }]
        
        $scope.toExamine = true;
        $scope.auditStateType = "待审核";
        $scope.auditStateTypeVal = "01";
        $scope.pageOptions = {};

        $scope.getData = function() {
            var url
            if($scope.toExamine){
               url = 'trade/crp/review/'
            }else{
               url = 'trade/alg/review/'
            }
            providerService.save({
                detail: url,
            }, {
                status: $scope.auditStateTypeVal,
                keywords: $scope.searchText,
                page: $scope.curPage,
                rows: 10,
            }, function (backData) {
                if (backData.status === 1) {
                    $scope.crpList = backData.data.list;
                    $scope.pageOptions = {
                        "total_items_num": backData.data.page.total_rows,   //总共的data数量
                        "total_pages_num": backData.data.page.total_pages,   //总共的page数量
                        "per_page_num": 10                                   //单页page的data数量
                    };
                }
            })
        }

        $scope.auditData = function(data,mode){
            var url
            if($scope.toExamine){
               url = "trade/crp/setConnObjNoStatus"
            }else{
               url = "trade/alg/audit/"
            }
            providerService.save({
                detail : url
            },{
               connObjNo: data.connObjNo,
               mode: mode,
            },function(backData){
                console.log(backData)
                if(backData.status == 0){

                    $scope.getData();
                    var modalData = {
                        templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                    };
                    modalData.content = "操作成功！";
                    $scope.$emit("setModalState",modalData);
                }
            })
        }

        $scope.$watch('searchText',debounce(function (newV, oldV) {
            if (newV !== oldV) {
                $scope.getData();
            }
        }, 350));

        $scope.$watch("auditStateTypeVal", function(newV, oldV){
            if(newV !== oldV) {
                $scope.curPage = 1;
                $scope.getData();
            }
        })

        $scope.$watch("curPage", function(newV, oldV){
            if(newV !== oldV) {
                $scope.getData();
            }
        })

        $scope.$watch("toExamine", function(newV, oldV){
            if(newV !== oldV) {
                $scope.getData();
            }
        })

        $scope.detail = function(data){
            console.log(data)
            if($scope.toExamine){
                providerService.save({
                    detail : "trade/crp/adminReviewCrp"
                },{
                    connObjNo: data.connObjNo,
                },function(backData){
                    if(backData.status == 1){
                        var detail = backData.data;
                        if(detail.freeRspList){
                            detail.freeRspList = JSON.parse(detail.freeRspList)
                        }

                        if(detail.chargeRspList){
                            detail.chargeRspList = JSON.parse(detail.chargeRspList)
                        }

                        if(detail.maxDelayTime){
                            detail.maxDelayTime = detail.maxDelayTime.split(',');
                        }

                        if(detail.concurrency){
                            detail.concurrency = detail.concurrency.split(',');
                        }

                        var modalData = {
                            templateUrl : './src/templates/modalViews/connObjModal.html',
                            data: detail,
                        };
                        $scope.$emit("setModalState",modalData);
                    }
                })
            }else{
                var data = "connObjId="+data.connObjId+"?connObjNo="+data.connObjNo+"?tag_code="+data.prdtIdCd+"?type=view";
                console.log(data)
                $state.go("dls.admin.createItem",{data:data});
            }

        }

        $scope.getData();
    }])
    .controller("algorithmLabelEditCtrl",['$scope','$cookies','$filter','adminService','tagMAlgCatService','DlsUtil'
    ,function($scope,$cookies,$filter,adminService,tagMAlgCatService,DlsUtil){

        // $(document).on("mousedown", function (e) {
        //     if (-1 === e.target.className.indexOf('tree-label'))  {
        //         console.log(e.target.className);
        //         $scope.selectedNode.id = "";
        //         $('.tree-label ').removeClass("selectedNode").removeClass("tree-selected");
        //     }
        //     console.log($scope.selectedNode);
        // });

        $scope.$watch(function () {
            return $scope.selectedNode.id;
        }, function (newV) {
            $scope.$emit("algorithm_selectedNode_id_changed", $scope.selectedNode);

            // !!$scope.getTagListDatas && $scope.getTagListDatas($scope.selectedNode.id);
        }, true);

        var modalData = {
            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
            content : ''
        };
        $scope.treeOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            adminEdit : true,
            addTag : function(node,event){
                if(event){
                    var liEle = $(event.target).parent();
                    // console.log(liEle);
                    var topli = liEle.position().top;
                    // console.log(liEle.position().top);
                    var edtEle = $('.dls-tree').find('.input-group');
                    edtEle.css("display",'inline-block');
                    // var topEdt = edtEle.position().top;
                    // console.log(edtEle.position().top);
                    edtEle.css("top",topli+33+'px');

                    $scope.addNewTag = function (event) {
                        var newTagName = $scope.newTag;
                        if (!newTagName) {
                            modalData.content = "标签名不能为空";
                            $scope.$emit("setModalState",modalData);
                            return;
                        }
                        var newNode = {};
                        newNode.isParent = false;
                        newNode.name = newTagName;
                        newNode.pId = node.id;
                        tagMAlgCatService.save({
                            detail : 'save/'
                        },{
                            "acttype" : 'tag',
                            "name" : newTagName,
                            "pid" : node.id
                        },function(resp){
                            // console.log(resp);
                            if (1 === resp.status) {
                                newNode.id = resp.data.code;
                                $scope.adminTags.push(newNode);
                                $scope.admin_algorithm_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
                                // DlsUtil.updateItemInObjArr($scope.admin_algorithm_label_type_btn_datas,node.id,newNode);
                                // console.log($scope.admin_algorithm_label_type_btn_datas);
                                $scope.newTag = '';
                                edtEle.css("display",'none');
                                modalData.content = "添加标签成功";
                                $scope.$emit("setModalState",modalData);
                            } else {
                                modalData.content = "添加标签失败";
                                $scope.$emit("setModalState",modalData);
                            }
                        });
                        event.stopPropagation();
                    };

                    $scope.cancleAddNewTag = function (event) {
                        $scope.newTag = '';
                        edtEle.css("display",'none');
                        event.stopPropagation();
                    }



                }
            },
            editTag : function(node,event){
                if(event){
                    var tagEle = $(event.target).parent().find('.tree-label')[0];
                    var oldTag = $.trim($(tagEle).text());
                    $(tagEle).attr("contenteditable",true);
                    $(tagEle).addClass("editable").select();;//.focus();


                    DlsUtil.selectText(tagEle);
                    $(tagEle).blur(function () {
                        $(tagEle).removeClass("editable");
                        var newTag = $.trim($(tagEle).text());
                        if (oldTag === newTag) {return;}

                        if (!newTag) {
                            $(tagEle).text(oldTag)
                            modalData.content = "ID名不能为空";
                            $scope.$emit("setModalState",modalData);
                            return false;
                        }

                        tagMAlgCatService.save({
                            detail : 'save/'
                        },{
                            "acttype" : 'edit',
                            "name" : newTag,
                            "code" : node.id
                        },function(resp){
                            // console.log(resp);
                            if (1 === resp.status) {
                                var index = DlsUtil.findIndexInArr(node.id,$scope.adminTags);
                                $scope.adminTags[index].name = newTag;
                                $scope.admin_algorithm_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
                                modalData.content = "修改标签成功";
                                $scope.$emit("setModalState",modalData);
                            } else {
                                $(tagEle).text(oldTag);
                                modalData.content = "修改标签失败";
                                $scope.$emit("setModalState",modalData);
                            }
                        });
                    });

                }
            },
            removeTag : function(node,event){
                tagMAlgCatService.save({
                    detail : 'del/'
                },{
                    "acttype" : 'delete',
                    "code" : node.id
                },function(resp){
                    // console.log(resp);
                    if (1 === resp.status) {
                        // console.log(node.id);
                        var index = DlsUtil.findIndexInArr(node.id,$scope.adminTags);
                        $scope.adminTags.splice(index,1);
                        $scope.admin_algorithm_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
                        modalData.content = "删除标签成功";
                        $scope.$emit("setModalState",modalData);
                    } else if (0 === resp.status) {
                        modalData.content = resp.msg;
                        $scope.$emit("setModalState",modalData);
                    }
                });
            },


            // templateUrl:"angular-tree-admin.html"
        };

        $scope.addCategory = function (event) {
            var edtEle = $('.dls-tree').find('.input-group');
            edtEle.css("display",'inline-block');
            var btnTop = $('.btn-add-tag').position().top;
            edtEle.css("top", btnTop+38+'px');
            $scope.addNewTag = function (event) {
                var newTagName = $scope.newTag;
                if (!newTagName) {
                    modalData.content = "标签名不能为空";
                    $scope.$emit("setModalState",modalData);
                    return;
                }
                var newNode = {};
                newNode.isParent = true;
                newNode.name = newTagName;
                newNode.pId = 0;
                newNode.child = [];
                console.log($scope.selectedNode.id);
                tagMAlgCatService.save({
                    detail : 'save/'
                },{
                    "acttype" : 'folder',
                    "name" : newTagName,
                    "pid" : ''
                },function(resp){
                    // console.log(resp);
                    if (1 === resp.status) {
                        newNode.id = resp.data.code;
                        // console.log(newNode);
                        $scope.adminTags.push(newNode);
                        $scope.admin_algorithm_label_type_btn_datas = DlsUtil.convertListToTree($scope.adminTags);
                        $scope.newTag = '';
                        edtEle.css("display",'none');
                        modalData.content = "添加标签成功";
                        // $scope.$emit("setModalState",modalData);
                    } else {
                        modalData.content = "添加标签失败";
                        $scope.$emit("setModalState",modalData);
                    }
                });
                event.stopPropagation();
            };

            $scope.cancleAddNewTag = function (event) {
                $scope.newTag = '';
                edtEle.css("display",'none');
                event.stopPropagation();
            }
        }


    }])
    .controller("algorithmCreateItemCtrl",["$scope","$state","$rootScope","$timeout","providerService","tradeMallService","$compile","fileUpload","supTradeService",function($scope,$state,$rootScope,$timeout,providerService,tradeMallService,$compile,fileUpload,supTradeService){
        $scope.pageOptions = {}
        $scope.selectedNode = {id : ""};
        $scope.selectedIdAttr = [] , $scope.selectedDataOrigin = [] , $scope.selectedApplyScene = [] , $scope.map1Selected = [] , $scope.applicationIndustrySelSelected = [];
        $scope.valueStr = 'asdfasd'
        $scope.searchItem = function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.curPage = 1;
                $scope.searchFullText = $scope.searchText
                $scope.getLabelDatas($scope.selectLabelValue,$scope.searchFullText,$scope.selectedNode.id,$scope.curPage,10);
            }
        }

        $scope.getLabelDatas = function(type,cont,pcode,page,rows) {
            providerService.save({
                detail: "trade/alg/userTags/"
            }, {
                type:type,
                cont:cont,
                pcode:pcode,
                page:page,
                rows:rows,
            }, function (backData) {
                console.log(backData)
                if (backData.status == 1) {
                    $scope.labelDatas = backData.data.list
                    $scope.totalItems =
                        $scope.pageOptions = {
                            "total_items_num": backData.data.page.total_rows,   //总共的data数量
                            "total_pages_num": backData.data.page.total_pages,   //总共的page数量
                            "per_page_num": 10                  //单页page的data数量
                        };
                }
            })
        }

        $scope.$watch(function () {
            return $scope.curPage + "/" + $scope.selectedNode.id +"/"+ $scope.selectLabelValue +"/"+ $scope.searchFullText;
        }, function (newV) {
            $scope.getLabelDatas($scope.selectLabelValue,$scope.searchFullText,$scope.selectedNode.id,$scope.curPage,10);
        }, true)

        var unique = function(node, event, arr) {
            var flag = true;
            arr.forEach(function(item){
                if(item.id === node.id) {
                    flag = false;
                }
            })
            if(flag) {
                arr.push(node);
            }
        }
        $scope.coverAreaSumIsRight = true;
        $scope.idAttrOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedIdAttr);
            }
        };
        $scope.dataOriginOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedDataOrigin);
            }
        };
        $scope.applySceneOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedApplyScene);
            }
        };
        $scope.applicationIndustrySelOptions = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.applicationIndustrySelSelected);
            }
        };
        $scope.create_options = {
            nodeChildren: "child",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "glyphicon glyphicon-triangle-bottom",
                iCollapsed: "glyphicon glyphicon-triangle-right",
                labelSelected: "selectedNode",
            },
            addBtn:'true',
            btnClick:function(node,event){
                unique(node, event, $scope.selectedArea);
                for(var i=0; i<$scope.selectedArea.length; i++) {
                    if($scope.selectedArea[i].id === '000000') {
                        $scope.selectedArea = [$scope.selectedArea[i]];
                    }
                }
            }
        };
        //joe
        $scope.operatingSystem = 'Windows'
        $scope.lookStyle = {
            marginLeft:'174px'
        }
        $scope.operatingSystemList = [{
            name: 'Windows',
            value: 'Windows',
        },{
            name: 'Linux',
            value: 'Linux',
        },{
            name: 'Mac',
            value: 'Mac',
        }]
        $scope.edition = 'Alone'
        $scope.editionList = [{
            name: '单机版',
            value: 'Alone',
        },{
            name: '集群',
            value: 'Cluster',
        },{
            name: '分布式云平台',
            value: 'Cloud',
        }]
        $scope.systemDigit = '32bit'
        $scope.systemDigitList = [{
            name: '32bit',
            value: '32bit',
        },{
            name: '64bit',
            value: '64bit',
        }]
        $scope.language = 'R'
        $scope.languageList = [{
            name: 'R',
            value: 'R',
        },{
            name: 'Python',
            value: 'Python',
        },{
            name: 'Mahout',
            value: 'Mahout',
        },{
            name: 'Spark',
            value: 'Spark',
        },{
            name: 'Weka',
            value: 'Weka',
        },{
            name: 'Scala',
            value: 'Scala',
        }]

        $scope.price = ''
        $scope.afterService = ''
        $scope.createAlgorithm=[{operationNotice:[{text:'',img:'',path:''}]},
            {dataRequirements:[{text:'',img:'',path:''}]},
            {algorithmUse:[{text:'',img:'',path:''}]},
            {algorithmPrinciple:[{text:'',img:'',path:''}]},
            {result:[{text:'',img:'',path:''}]},
            {commodityAdvantage:[{text:'',img:'',path:''}]},
            {algorithmicDescription:[{text:'',img:'',path:''}]},
            {relatedApplications:[{text:'',img:'',path:''}]},
            {example:[{text:'',img:'',path:''}]},
            {meritsAndFaults:[{text:'',img:'',path:''}]},
            {customSvc:[{text:'',img:'',path:''}]},
            {input:[{text:'',img:'',path:''}]},
            {output:[{text:'',img:'',path:''}]}
        ]
        $scope.addCreateAlgorithm = function(list){
            list.push({text:'',img:'',path:''})
        }
        console.log($scope.createAlgorithm)

        $scope.fileChanged = function(ele,item){
            console.log(item)
            $scope.files = ele.files;
            var file = document.querySelector('input[type=file]').files[0];
            var filename = $scope.files[0].name;
            if(filename.length> 1 && filename ) {
                var ldot = filename.lastIndexOf(".");
                var type = filename.substring(ldot + 1);  //文件类型
                $scope.fileName=filename.slice(0,ldot);//文件名
                console.log($scope.fileName)
            }
        }

//提交
        $scope.submitData = function(){
            console.log(typeof JSON.stringify($scope.createAlgorithm))
            //$scope.createFullData没有
            $scope.createFullData.prdtDesc = JSON.stringify($scope.createAlgorithm)
            $scope.createFullData.opSys = $scope.operatingSystem
            $scope.createFullData.appVersion = $scope.edition
            $scope.createFullData.sysBit = $scope.systemDigit
            $scope.createFullData.devLang = $scope.language
            $scope.createFullData.prdtType = '06'
            // $scope.createFullData.customSvc = $scope.afterService
            console.log($scope.createFullData)
            supTradeService.save({
                detail: "alg/save/"
            },$scope.createFullData,function(backData){
                var modalData = {
                    templateUrl : './src/templates/modalViews/addToCartTipModal.html'
                };
                modalData.content = backData.msg;
                $scope.$emit("setModalState",modalData);
                if(backData.status == '1'){
                    $rootScope.$broadcast('setCrp');
                    history.go(-1)
                    $scope.showAll = false;
                }
            })
        }

//joe
        $scope.goBack = function(index){
            $scope.step = index;

            $($(".create-item .breadcrumb li")[index]).removeClass("active");
            $($(".create-item .breadcrumb li")[index-1]).removeClass("visited").addClass("active");
            if(index == 5){
                $scope.showAll = false;
                //     $scope.idAttrOptions.addBtn = true;
                //     $scope.dataOriginOptions.addBtn = true;
                //     $scope.applySceneOptions.addBtn = true;
                //     $scope.create_options.addBtn = true;
                //     $scope.create_options.disabled = false;
                //     $scope.selectDisabled = false;
            }
        }

        $scope.cancelCreate = function(){
            history.back()
        }
        $scope.add = function(){
            console.log($scope.valueStr)
        }
        var crp = function(){
            console.log('asfasfas')
            $scope.uploadAPIFile = function(){
                var uploadUrl = "../../api/sup/trade/crp/fileSave/";
                $($("form[name='uploadAPI']:visible").find("input[type='file']")).each(function(index,item){
                    var fileTypeArr = (item.files[0].name).split('.');
                    var len = fileTypeArr.length - 1;
                    var fileType = fileTypeArr[len];
                    if(fileType === 'doc' || fileType === 'docx' || fileType === 'pdf'){
                        $("form[name='uploadAPI']:visible").ajaxSubmit({
                            type: "POST",
                            url: uploadUrl,
                            data: {
                                connObjNo:$scope.fullData.connObjNo,
                            },
                            success:function(backData){
                                backData = JSON.parse(backData);
                                $scope.$apply(function(){
                                    $scope.apiFileHref = backData.data;
                                    $scope.haveApiFile = true;
                                })
                            }
                        })
                    }else{
                        alert("请上传word或pdf格式的文件！")
                    }
                })
            }
            $scope.goToStep3 = function(){

                $scope.step = 3;
                $($(".create-item .breadcrumb li")[1]).removeClass("active").addClass("visited");
                $($(".create-item .breadcrumb li")[2]).addClass("active");

            }
            $scope.goToStep4 = function(){
                console.log('asdfasd')
                // if($scope.prdtDesc){
                //     $scope.createFullData = angular.extend({}, $scope.createFullData,{
                //         'prdtDesc': $scope.prdtDesc,
                //     })
                $scope.step = 4;
                $($(".create-item .breadcrumb li")[2]).removeClass("active").addClass("visited");
                $($(".create-item .breadcrumb li")[3]).addClass("active");
                // }
            }
            $scope.goToStep5 = function(){
                if($scope.valueStr && $scope.msgSample && $scope.errCodeList && $scope.haveApiFile){
                    $scope.step = 5;
                    $scope.createFullData = angular.extend({}, $scope.createFullData,{
                        value: $scope.valueStr,
                        msgSample: $scope.msgSample,
                        errCodeList: $scope.errCodeList,
                    });

                    $($(".create-item .breadcrumb li")[3]).removeClass("active").addClass("visited");
                    $($(".create-item .breadcrumb li")[4]).addClass("active");



                    $scope.$watch("selectedApplyScene",function(){
                        if($scope.selectedApplyScene.length === 1){
                            $scope.applySceneOptions.addBtn = false;
                        }else{
                            $scope.applySceneOptions.addBtn = true;
                        }
                    },true)

                    $scope.removeapplicationIndustry = function(index){
                        $scope.applicationIndustrySelSelected.splice(index,1)
                    }

                    $scope.removeApplyScene = function(index){
                        $scope.selectedApplyScene.splice(index,1)
                    }

                    $timeout(function(){
                        $($("select[name='maxDelayTime']").find("option")).each(function(index, item){
                            if($(item).text() === $scope.selection_1_val){
                                $("select[name='maxDelayTime']").val($(this).attr("value"));
                            };
                        })

                        $($("select[name='concurrency']").find("option")).each(function(index, item){
                            if($(item).text() === $scope.selection_2_val){
                                $("select[name='concurrency']").val($(this).attr("value"));
                            };
                        })
                    },200)
                }
                $scope.step = 5;
                $($(".create-item .breadcrumb li")[3]).removeClass("active").addClass("visited");
                $($(".create-item .breadcrumb li")[4]).addClass("active");
            }
            $scope.goToStep6 = function(){
                $scope.showAll = true;
                $scope.step = 6;
                $($(".create-item .breadcrumb li")[4]).removeClass("active").addClass("visited");
                $($(".create-item .breadcrumb li")[5]).addClass("active");
                //图片上传
                $scope.uploadFile = function(e){
                    var uploadUrl = "../../api/sup/trade/alg/picSave/";
                    $(e.target).parents('form').ajaxSubmit({
                        type: "POST",
                        url: uploadUrl,
                        data: {
                        },
                        success:function(backData){
                            var res = JSON.parse(backData)
                            if(res.status=='1'){
                                for(var i=0;i<$scope.createAlgorithm.length;i++){
                                    for (var j in res.data) {
                                        if(res.data[j].length>0){
                                            for(var k = 0;k<res.data[j].length;k++){
                                                if(!!$scope.createAlgorithm[i][j]){
                                                    $scope.createAlgorithm[i][j][k].img = res.data[j][k].img
                                                    $scope.createAlgorithm[i][j][k].path = res.data[j][k].path

                                                }
                                            }

                                        }
                                    }
                                }
                                $scope.submitData()//二次提交
                            }
                            console.log($scope.createAlgorithm)
                        }
                    })
                }
            }
        }
        if($state.params.data){                              // 非新建模式
            $scope.step = 2;
            var urlArr = $state.params.data.split("?");
            var data = {
                connObjId : (urlArr[0].split("="))[1],
                connObjNo : (urlArr[1].split("="))[1],
                tag_code : (urlArr[2].split("="))[1],
                type : (urlArr[3].split("="))[1],
            }
            $scope.algorithmType = data.type
            console.log($scope.algorithmType)

            var postData = {
                type : '02',
                tag_code : data.tag_code,
                connObjNo : data.connObjNo,
            };


            if(data.type === 'view'){
                // 查看模式
                $scope.lookStyle = {
                    marginLeft:''
                }
                $timeout(function(){
                    $scope.idAttrOptions.addBtn = false;
                    $scope.dataOriginOptions.addBtn = false;
                    $scope.applySceneOptions.addBtn = false;
                    $scope.create_options.addBtn = false;
                    $scope.create_options.disabled = true;
                    $scope.selectDisabled = true;
                },200)
                $scope.isView = true;
                $scope.showAll = true;

                supTradeService.save({
                    detail: "alg/adminCreate/"
                },postData,function(backData) {
                    if(backData.status == 1){
                        var arr=[];
                        console.log(backData.data.prdtDetailInfo)
                        for(var i in backData.data.prdtDetailInfo){
                            arr.push(i);
                        }
                        for(var i = 0;i<$scope.createAlgorithm.length;i++){
                            for(var j = 0;j<arr.length;j++){
                                if($scope.createAlgorithm[i][arr[j]]){
                                    $scope.createAlgorithm[i][arr[j]] = backData.data.prdtDetailInfo[arr[j]]
                                    console.log(backData.data.prdtDetailInfo[arr[j]])
                                    for(var k = 0;k<$scope.createAlgorithm[i][arr[j]].length;k++){
                                        $scope.createAlgorithm[i][arr[j]][k].img = $scope.createAlgorithm[i][arr[j]][k].imagePath
                                        $scope.createAlgorithm[i][arr[j]][k].text = $scope.createAlgorithm[i][arr[j]][k].detailText
                                    }
                                }
                            }
                        }
                        console.log($scope.createAlgorithm)
                        $scope.operatingSystem = backData.data.contextDict['1090']
                        $scope.edition = backData.data.contextDict['1091']
                        $scope.systemDigit = backData.data.contextDict['1092']
                        $scope.language = backData.data.contextDict['1093']
                    }
                })
                $scope.back = function(){
                    history.go(-1);
                }
            }

            if(data.type === 'edit'){
                $scope.step = 2;
                $scope.removeIdAttr = function(index){
                    $scope.selectedIdAttr.splice(index,1);
                }

                supTradeService.save({
                    detail: "alg/userCreate/"
                },postData,function(backData) {
                    if(backData.status == 1){
                        $scope.createFullData = {
                            connObjId : data.connObjId,
                            connObjNo : data.connObjNo,
                            prdtIdCd : backData.data.prdtIdCd,
                            tagName : backData.data.tagDict.tagName,
                            editType : '02',
                        }
                        var arr=[];
                        console.log($scope.createFullData)
                        for(var i in backData.data.prdtDetailInfo){
                            arr.push(i);
                        }
                        for(var i = 0;i<$scope.createAlgorithm.length;i++){
                            for(var j = 0;j<arr.length;j++){
                                if($scope.createAlgorithm[i][arr[j]]){
                                    $scope.createAlgorithm[i][arr[j]] = backData.data.prdtDetailInfo[arr[j]]
                                    console.log(backData.data.prdtDetailInfo[arr[j]])
                                    for(var k = 0;k<$scope.createAlgorithm[i][arr[j]].length;k++){
                                        $scope.createAlgorithm[i][arr[j]][k].path = $scope.createAlgorithm[i][arr[j]][k].imagePath
                                        $scope.createAlgorithm[i][arr[j]][k].text = $scope.createAlgorithm[i][arr[j]][k].detailText
                                        $scope.createAlgorithm[i][arr[j]][k].img = ''
                                    }
                                }
                            }
                        }
                        console.log($scope.createAlgorithm)
                        $scope.operatingSystem = backData.data.contextDict['1090']
                        $scope.edition = backData.data.contextDict['1091']
                        $scope.systemDigit = backData.data.contextDict['1092']
                        $scope.language = backData.data.contextDict['1093']
                    }
                })
                crp();
            }
        }else                                                  // 新增模式
        {
            $scope.step = 1;
            $scope.goToStep2 = function(index,data){
                $scope.removeIdAttr = function(index){
                    $scope.selectedIdAttr.splice(index,1);
                }
                console.log(data)
                console.log($scope.labelDatas[index])
                supTradeService.save({
                    detail: "alg/userCreate/"
                },{
                    tag_code : ($scope.labelDatas[index]).code,
                    type : '01',
                },function(backData) {

                    if (backData.status == 1) {
                        $scope.step = 2;
                        $($(".create-item .breadcrumb li")[0]).addClass("visited");
                        $scope.fullData = backData.data;
                        $scope.createFullData = {
                            connObjId : $scope.fullData.connObjId,
                            connObjNo : $scope.fullData.connObjNo,
                            prdtIdCd : $scope.fullData.prdtIdCd,
                            tagName : data.name,
                            editType : '01',
                        }
                    } else{
                        var modalData = {
                            templateUrl : './src/templates/modalViews/addToCartTipModal.html',
                            content: backData.msg
                        };
                        $scope.$emit("setModalState",modalData);
                    }
                })


            }
            crp()
        }
    }])