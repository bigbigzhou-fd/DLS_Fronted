'use strict';

angular.module('dls.services.util', [])
  .factory('DlsUtil', function(){
    var self = {};
    self.namePattern = /^(\w)*[^\<\>]*(\w)*$/;

    self.debounce = function(idle, action){
      var last
      return function(){
        var ctx = this, args = arguments
        clearTimeout(last)
        last = setTimeout(function(){
            action.apply(ctx, args)
        }, idle)
      }
    };
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
      "prdtType":"产品类别",
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
    titles:["流通对象编号","类型","互联对象名称","版本号","产品类别","计价方式","价格（元）"]
  })
  .constant('order_list_titles', {
    titles:["订单编号","订单名称","需方机构名称","供方机构名称","起始日期","终止日期","状态"]
  })
  .constant('account_log_titles', {
    titles:["序号","订单ID","订单名称","生效日期","截止日期","供应方确认时间","需求方发起时间",
                "订单状态","本方机构","本方角色","本方操作账户","相对方机构","清算方式","总收入金额(元)","当前应收金额(元)","总支出金额(元)","当前应付金额(元)"]
  })
  .constant('account_order_titles', {
    titles:["序号","任务ID","订单ID","互联对象ID","版本号","互联对象类型","互联对象名称","计价单位(元)"
    ,"单价（元）","总配送数量（次）","当前配送数量（次）","总收入金额(元)","当前应收入金额(元)","总支出金额(元)","当前应支出金额(元)"]
  })
  .constant('account_statements_titles', {
    outlineTitles:["序号","相对方机构","应收金额(元)","应付金额(元)"],
    statementsTitles:["序号","相对方机构","订单ID","订单名称","本方角色","清算方式", "本月应收金额(元)","本月应付金额(元)"],
    statementsOrderTitles:["类型","互联对象ID","版本号","互联对象名称","计价单位(元)","本月配送数量","单价（元）","本月应收金额(元)","本月应付金额(元)"]
  })
  .constant('account_quota_titles', {
    titles:["序号","更新时间","额度调整类型","金额(元)","剩余额度(元)","操作账户"]
  })
  .constant('settlement_summary_titles', {
    titles:["结算单编号","结算起始日期","结算截止日期","结算周期","实付金额(元)","实收金额(元)"]
  })
  .constant('settlementDetailTitles', {
    titles:["序号","交易品编号","交易品名称","互联对象编号","互联对象名称","实付金额(元)","实收金额(元)"]
  })
  .constant('tradeMallTitles', {
    marketingTitles:["交易品名称","供方数量","最高价(元)","均价(元)","最低价(元)"],
    creditTitles:["交易品名称","ID类型","赋值说明","供方数量","最高价(元)","均价(元)","最低价(元)","交易品说明"],
    marketingItemTitles:["互联对象编号","版本号","供方机构名称","供方部门名称","覆盖度","覆盖量","更新频率","价格(元)","计价方式"],
    creditItemTitles:["互联对象编号","版本号","供方机构名称","供方部门名称","可选ID","查询ID类型","价格(元)","计数方式"],
    marketingCartListTitles:["产品类型","交易品名称","互联对象编号","版本","供方机构名称","供方部门名称","单价（元）","计价方式"],
    creditCartListTitles:["产品类型","交易品名称","互联对象编号","版本","供方机构名称","供方部门名称","单价（元）","计价方式"],
    cartOrderTitles:["交易品名称","互联对象编号","版本","单价（元）","价格类型","计数方式","折扣方式","折扣","保价时间","参数列表"],
    algorithmTitles:['交易品名称','供方数量','最高价(元)','均价(元)','最低价(元)']
  })
  .constant('selectOptions', {
    priceType: [{
      'value' : '01',
      'name' : '固定单价'
    },{
      'value' : '02',
      'name' : '浮动单价'
    }],
    countType: [{
      'value': '01',
      'name' : '按次'
    },{
      'value': '02',
      'name' : '按千次'
    },{
      'value': '03',
      'name' : '按百万次'
    },{
      'value': '04',
      'name' : '按条'
    },{
      'value': '05',
      'name' : '按千条'
    }],
    countGetType: [{
      'value' : '01',
      'name' : '查询计数'
    },{
      'value' : '02',
      'name' : '查得计数'
    }],
    discountType: [{
      'value' : '01',
      'name' : '固定折扣'
    },{
      'value' : '02',
      'name' : '动态折扣'
    }],
    settPeriodType: [{
      'value' : '01',
      'name' : '按天'
    },{
      'value' : '02',
      'name' : '按月'
    },{
      'value' : '03',
      'name' : '按季'
    }]
  })
  .factory('permissions', function ($rootScope) {
    return {
        setPermissions: function(permissions) {
          $rootScope.permissionList = permissions;
          $rootScope.$broadcast('permissionsChanged')
        },
        hasPermission: function (permission) {
          permission = angular.isString(permission) && permission.trim();
          return !!$rootScope.permissionList && !!$rootScope.permissionList[permission];
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
      // console.log(credentials);
      apiUrl = dlsAPI.packApi('/user_login/');


      // console.log(apiUrl);
      return $http
        .post(apiUrl, {
            "username":username,
            "pwdInput":pwdInput
        })
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
    for (var i = 0; i < len; i++) {
        if(!n[array[i]]){
            r.push(array[i]);
            n[array[i]] = true;
        }
    }
    return r;
}

Array.prototype.deletItem = function (item) {
  var array = this;
  var len = array.length;
  for (var i = 0; i < len; i++) {
    if (array[i] === item) {
      var r = array.splice(i,1);
      break;
    }
  }
  console.log(r);
  return r;
}



