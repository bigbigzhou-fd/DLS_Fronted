'use strict';

angular.module('dls.services.util', [])
  .factory('DlsUtil', function(){
    var self = {};
    self.namePattern = /^(\w)*[^\<\>]*(\w)*$/;
    self.rangePattern = /^(\w)*[^\；]*(\w)*$/;
    self.positiveNumPattern = /^\+?(((0\.[1-9])|(([1-9]\d*)(\.[1-9])?))|((0\.[0-9][1-9])|(([1-9]\d*)(\.[0-9][1-9])?)))$/;

    self.convertListToTree = function(data) {
      if (angular.isArray(data) && data.length > 0) {
        var tree = [];
            var len = data.length;
            var nodes = {};
            for(var i=0; i<len; i++){
                var temp = {
                    pId:data[i].pId,
                    id:data[i].id,
                    label:data[i].name,
                    isParent:data[i].isParent
                };
                if(data[i].isParent){
                    temp.child = [];
                }
                nodes[data[i].id] = temp;
            }
            for(var key in nodes){
                if(nodes[key].pId !== 0){          
                    if (!nodes[nodes[key].pId].isParent && !nodes[nodes[key].pId].child) {
                      nodes[nodes[key].pId].child = [];
                    }
                    nodes[nodes[key].pId].child.push(nodes[key]);
                }
            }
            for(var key in nodes){
                if(nodes[key].pId === 0){
                    tree.push(nodes[key]);
                }
            }

            return tree;
      }
    };

    self.findIndexInArr = function(txt,lists) {
      for(var i = 0, len = lists.length; i <len ; i++) {
        if (txt === lists[i].id) {
          return i;
        }
      }
    };
    self.updateItemInObjArr = function(objArr,pId,newItem) {
      for(var i = 0; i < objArr.length; i ++) {
        // console.log(objArr[i]);
        if (objArr[i].child.length > 0) {
          self.updateItemInObjArr(objArr[i].child);
        } else {
          if(objArr[i].id === pId) {
            objArr[i].child.push(newItem);
            console.log(newItem);
            console.log(objArr[i].child);
          }
        }
      }
      // console.log(objArr);
      return objArr;
    };

    self.selectText = function (element) {
        // console.log(element);
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNodeContents(element);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    self.removeArrItem = function (arr,val,propertyName) {
      var res = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        var temp = arr[i];
        if (!String(temp[propertyName]) || String(temp[propertyName]) !== String(val)) {
          res.push(temp);
        }

      }
      return res;
    }

    return self;
  })
  .factory('debounce', ['$timeout','$q', function($timeout, $q) {
    // The service is actually this function, which we call with the func
    // that should be debounced and how long to wait in between calls
    return function debounce(func, wait, immediate) {
      var timeout;
      // Create a deferred object that will be resolved when we need to
      // actually call the func
      var deferred = $q.defer();
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if(!immediate) {
            deferred.resolve(func.apply(context, args));
            deferred = $q.defer();
          }
        };
        var callNow = immediate && !timeout;
        if ( timeout ) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(later, wait);
        if (callNow) {
          deferred.resolve(func.apply(context,args));
          deferred = $q.defer();
        }
        return deferred.promise;
      };
    };
  }])
  .factory('Excel', function ($window) {
       var uri = 'data:application/vnd.ms-excel;base64,',
           template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
           base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
           format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
       return {
           tableToExcel: function (tableId, worksheetName) {
               var table = $(tableId);
               var tableTemp = $("<div></div>");
               var tableHtml = table.html()
               tableTemp.html(tableHtml);

               //选择行
               var trs = tableTemp.find('tr');
               var trsLen = trs.length;
               var miss = table.attr("exporterSuppressColumns");//不需要导出的
               var misLen = miss ? miss.length : 0;

               for(var i=1; i<trsLen; i++){
                   for(var j=misLen-1; j>=0; j--){
                       if(i==1){
                           $($(trs[0]).find('th:eq('+miss[j]+')')[0]).remove()
                       }
                       $($(trs[i]).find('td:eq('+miss[j]+')')[0]).remove()
                   }
               }

               if(trsLen>1){
                   var ctx = { worksheet: worksheetName, table: tableTemp.html() };
                   var href = uri + base64(format(template, ctx));
                   return href;
               }
            }
       };
    })
  .constant('dls_url','http://61.147.182.167:80')
  .constant('API','/api') //开发环境
  .constant('RPS','/rps')
   //.constant('API','') //部署
  .constant('DLS_years',["2016","2017","2018","2019","2020","2021","2022","2023","2024"])
  .constant('DLS_months',{
            "num":["01","02","03","04","05","06","07","08","09","10","11","12"],
            "name":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
  })
  .constant('MALL_ITEMS_DATAS_LABEL',{   //单品列表的label
      "connObjId":"互联对象序号",
      "connObjVer":"版本号",
      "idName":"支持ID类型",
      "tag_name":"数据标签",
      "tag_value_type":"赋值类型",
      "supMemName":"供方机构",
      "supMemDept":"供方机构部门",
      "evaluation":"数据评分",
      "price_mode":"计价单位",
      "price":"价格(元)",
  })
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    member: 'member'
  })
  .constant('cart_titles', {
    titles:["流通对象编号","类型","互联对象名称","版本号","计价方式","价格（元）"]
  })
  .constant('order_list_titles', {
    titles:["序号","订单编号","订单名称","需方机构名称","供方机构名称","起始日期","终止日期","状态"]
  })
  .constant('account_log_titles', {
    titles:["序号","订单ID","订单名称","生效日期","截止日期","供应方确认时间","需求方发起时间",
                "订单状态","本方机构","本方角色","本方操作账户","相对方机构","清算方式","总收入金额（元）","当前应收金额（元）","总支出金额（元）","当前应付金额（元）"]
  })
  .constant('account_order_titles', {
    titles:["序号","任务ID","订单ID","互联对象ID","版本号","互联对象类型","互联对象名称","计价单位"
    ,"单价（元）","总配送数量（次）","当前配送数量（次）","总收入金额（元）","当前应收入金额（元）","总支出金额（元）","当前应支出金额（元）"]
  })
  .constant('account_statements_titles', {
    outlineTitles:["序号","相对方机构","应收金额（元）","应付金额（元）"],
    statementsTitles:["序号","相对方机构","订单ID","订单名称","本方角色","清算方式", "本月应收金额（元）","本月应付金额（元）"],
    statementsOrderTitles:["类型","互联对象ID","版本号","互联对象名称","计价单位","本月配送数量","单价（元）","本月应收金额（元）","本月应付金额（元）"]
  })
  .constant('account_quota_titles', {
    titles:["序号","更新时间","额度调整类型","金额（元）","剩余额度（元）","操作账户"]
  })
  .constant('order_detail_titles', {
    titles:["流通对象编号","配送任务编号","类型","互联对象名称","版本号","标签名称","标签代码","计价方式","价格（元）"]
  })
  .constant('member_info_titles',{
      columnDefs:[{
          displayName:'序号',
          width:'50'
      },{
          field:'memId',
          displayName:'会员编号',
          width:"60"
      },{
          field:'companyId',
          displayName:'ums公司编号',
          width:"90"
      },{
          field:'orgFullNameCN',
          displayName:'机构全称中文',
          width:"180"
      }, {
          field: 'deptName',
          displayName: '部门名称',
          width: "100"
      },{
          field:'token',
          displayName:'token',
          width:"60"
      },{
          field:'svrURL',
          displayName:'会员接口机地址',
          width:"150"
      },{
          field:'supmngURL',
          displayName:'供方接口机管理地址',
          width:"150"
      },{
          field: 'demmngURL',
          displayName: '需方接口机管理地址',
          width: "150"
      },{
          field: 'pubKey',
          displayName: '会员公钥',
          width: "150"
      }],
  })
  .constant('memberApplyOptions',{
      columnDefs:[{
          field:'applyNo',
          displayName:'申请编号',
          width:"150"
      },{
          field:'name',
          displayName:'申请日期',
          width:"150"
      },{
          field:'orgFullNameCN',
          displayName:'机构全称',
          width:"130"
      }, {
          field: 'deptName',
          displayName: '部门名称',
          width: "100"
      },{
          field:'contactName',
          displayName:'业务联系人姓名',
          width:"150"
      },{
          field:'emailAddr',
          displayName:'联系人电子邮箱',
          width:"150"
      },{
          field:'phoneNo',
          displayName:'联系人电话',
          width:"150"
      },{
          field:'applyProgCd',
          displayName:'审核状态',
          width:"150"
      }],
  })
  .constant('member_apply_audit',{
      status : [{
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
  })
  .constant('order_info_titles',{
      columnDefs:[{
          displayName:'序号',
          width:'50'
      },{
          field:'orderId',
          displayName:'订单编号',
          width:"60"
      },{
          field:'name',
          displayName:'订单名称',
          width:"90"
      },{
          field:'demMemName',
          displayName:'需方机构名称',
          width:"130"
      }, {
          field: 'supMemName',
          displayName: '供方机构名称',
          width: "100"
      },{
          field:'orderEffectDate',
          displayName:'起始日期',
          width:"150"
      },{
          field:'orderExpiryDate',
          displayName:'终止日期',
          width:"150"
      },{
          field:'status',
          displayName:'状态',
          width:"150"
      }],
  })
  .constant("orgTypeData",{
    select:[{
        label:"国有企业",
        value:"01",
    },{
        label:"集体企业",
        value:"02",
    },{
        label:"联营企业",
        value:"03",
    },{
        label:"股份合作制企业",
        value:"04",
    },{
        label:"私营企业",
        value:"05",
    },{
        label:"个体户",
        value:"06",
    },{
        label:"合伙企业",
        value:"07",
    },{
        label:"有限责任公司",
        value:"08",
    },{
        label:"股份有限公司",
        value:"09",
    }]
  })
    .constant("industryTypeData",{
        select:[{
            label:"国有企业",
            value:"01",
        },{
            label:"集体企业",
            value:"02",
        },{
            label:"联营企业",
            value:"03",
        },{
            label:"股份合作制企业",
            value:"04",
        },{
            label:"私营企业",
            value:"05",
        },{
            label:"个体户",
            value:"06",
        },{
            label:"合伙企业",
            value:"07",
        },{
            label:"有限责任公司",
            value:"08",
        },{
            label:"股份有限公司",
            value:"09",
        }]
    })
    .constant('settlement_summary_titles', {
      titles:["会员编号","机构名称","机构部门","结算单编号","结算起始日期","结算截止日期","结算周期","应付金额（元）","应收金额（元）"]
    })
    .constant('settlementDetailTitles', {
      titles:['序号', '订单编号', '订单名称', '供方机构名称', '供方部门名称', '交易品编号', '交易品名称', '互联对象编号', '互联对象名称', '计费数量（次）', '应付金额（元）']
    })
    .constant('settlementManageTitles', {
      titles:["序号","机构名称","机构部门","结算单数量（次）","应收金额（元）","应付金额（元）"]
    })
    .constant('settlementInfoTitles', {
      titles:['结算起始日期', '结算截止日期', '结算单编号', '订单编号', '业务产品', '成员角色',  '计费数量（次）', '应付金额（元）', '应收金额（元）']
    })
    .constant('settlementCurrencyTitles', {
      titles:['日期', '结算单编号', '订单编号', '订单名称', '业务产品', '成员角色', '交易品编号', '交易品名称', '互联对象编号', '互联对象名称', '计费数量（次）', '标准单价（元）', '计费方式', '折扣率', '当日折前金额（元）', '当日减免金额（元）', '当日结算金额（元）']
    })
    .constant('accountCheckTitles', {
      titles:['序号', '交易流水号', '成员账号', '机构名称', '部门名称', '业务类型', '变动金额（元）', '最后更新时间', '申请人', '审核人', '状态', '操作']
    })
    .constant('checkRecordTitles', {
      titles:['日期', '交易流水号',  '业务类型', '变动金额（元）',  '状态', '操作人','备注']
    })
    .constant('productAccountTitles', {
      titles:['序号', '会员编号',  '机构名称', '部门名称',  '系统开户名称', '账户更新时间','操作']
    })
    .constant('productAccountCheckHistoryTitles', {
      titles:['序号', '申请编号',  '申请日期', '审核日期',  '操作类型', '产品名称','申请人','审核人','状态','审核意见']
    })
    .constant('productAccountCheckTitles', {
      titles:['序号', '申请编号',  '机构名称', '部门名称',  '申请时间', '审核时间', '产品账户','申请人','状态','操作']
    })
    .constant('signManageTitles', {
      titles:['序号', '会员编号',  '机构名称', '部门名称',  '开户时间', '签约时间','申请人','状态','操作']
    })
    .constant('configPageTitles', {
        titles:['序号', '字段名称',  '赋值权重', '更新时间',  '操作']
      })








  .factory('permissions', function ($rootScope) {
    return {
        setPermissions: function(permissions) {
          $rootScope.permissionList = permissions;
          $rootScope.$broadcast('permissionsChanged')
        },
        hasPermission: function (permission) {
          permission = angular.isString(permission) && permission.trim();
          // console.log($rootScope.permissionList[permission]);
          if (!!$rootScope.permissionList) {
            return !!$rootScope.permissionList[permission];
          }
        }
    };
  })

  .factory('dlsAPI', function (API) {
  	var dlsAPI= {};
  	dlsAPI.packApi = function (api) {
  		return API+api;
      }
  	return dlsAPI;
  })
  .factory('dlsRPS', function (RPS) {
    var dlsRPS= {};
    dlsRPS.packRps = function (rps) {
        return RPS+rps;
    }
    return dlsRPS;
  })
  .factory('csrfService', ['$http','dlsAPI', function ($http,dlsAPI) {
  	var csrfService = {};
  	csrfService.token = function () {
      var apiUrl=dlsAPI.packApi('/');
  		return $http
  		  .get(apiUrl)
  		  .then(function (resp) {
  		  	return resp;
  		  });
  	};
  	return csrfService;
  }])
  .factory('AuthService', ['$rootScope','$http', 'md5','Session', 'dlsAPI', function ($rootScope,$http,md5,Session,dlsAPI) {
    var authService = {};


    authService.login = function (credentials) {
      // credentials.pwdInput = md5.createHash(credentials.pwdInput || '');
      var pwdInput = md5.createHash(credentials.pwdInput || '');
      var username = credentials.username;
      var apiUrl = "";
      apiUrl = dlsAPI.packApi('/admin_login/');


      return $http
        .post(apiUrl, {username, pwdInput})
        .then(function (res) {
        	// var data = res.data.data[0];
         //  for (var i = 0, rights = {},len = data.perms.length; i < len; i++) {
         //    rights[data.perms[i][0]] = data.perms[i][1];
         //  }
          // console.log(Session);
          // Session.create(data.id, data.username,data.name,rights);
          // $rootScope.isAuthorized = authService.isAuthorized('会员管理账户');
          return res.data;
        },function (err) {
        	// console.log(err);
        	return err;
        });
    };

    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    return authService;
  }])
  .service('Session', ['$cookies', function ($cookies) {
    this.create = function (sessionId, userId, userRole,rights) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = userRole;
      this.rights = rights;
    };
    this.destroy = function () {
      this.id = null;
      this.userId = null;
      this.userRole = null;
      this.rights = null;
    };

    return this;
  }])
  .service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .then(function(backData){
                console.log(backData);
            })
    }
  }]);

Array.prototype.unique = function(){
    var array = this;
    var n = {}, r = [], len = array.length;
    for (var i = 0; i < array.length; i++) {
        if(!n[array[i]]){
            r.push(array[i]);
            n[array[i]] = true;
        }
    }
    return r;
}

Array.prototype.removeByValue = function(val) {
  for(var i=0; i<this.length; i++) {
    if(this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
}






