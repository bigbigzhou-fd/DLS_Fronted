angular.module('dls.filters', [])
    .filter('dlsCurrencyFilter', function ($filter) {
        return function (input, sign, symbol, fractionSize) {
            if ("--" === input) {
                return "--"
            }
            input = input || '';
            symbol = symbol || '¥';
            fractionSize = fractionSize || 2;
            var out = '';
            if (sign) {
                if (Number(input) > 0) {
                    out += "+" + symbol + ' ' + $filter('number')(input, fractionSize);
                } else if (Number(input) < 0) {
                    input *= -1;
                    out += "-" + symbol + ' ' + $filter('number')(input, fractionSize);
                }
            } else {
                out += symbol + ' ' + $filter('number')(input, fractionSize);
            }
            return out;
        };
    })
    .filter('connObjVerFilter', function ($filter) {
        return function (input, symbol) {
            input = input || '';
            symbol = symbol || 'v';
            var out = '';
            if (!!input) {
                input = Number(input) / 100;
                out = symbol + $filter('number')(input, 2);
            }
            return out;
        }
    })
    .filter('connObjCatCdFilter', function () {
        return function (input) {
            input = input || '';
            var out = '';
            if (!!input) {
                switch (input) {
                    case '1010101':
                        out = "单品";
                        break;
                    default:
                        out = "套餐";
                        break;
                }
                return out;
            }
        }
    })

    .filter('quotaAdjTypeFilter', function () {
        return function (input) {
            input = input || '';
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "现金充值";
                        break;
                    case '03':
                        out = "授信增加";
                        break;

                    case '04':
                        out = "授信减少";
                        break;
                    case '07':
                        out = "结算减少";
                        break;
                    case '08':
                        out = "充值";
                        break;
                    case '09':
                        out = "账户调增";
                        break;
                    case '10':
                        out = "账户调减";
                        break;
                }
                return out;
            }
        }
    })
    .filter('orderStateFilter', function () {
        return function (input) {
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "新生成";
                        break;
                    case '02':
                        out = "待确认";
                        break;
                    case '03':
                        out = "已确认";
                        break;
                    case '04':
                        out = "已过期";
                        break;
                    case '05':
                        out = "已生效";
                        break;
                    case '06':
                        out = "已失效";
                        break;
                    case '07':
                        out = "已拒绝";
                        break;
                    case '08':
                        out = "部分确认";
                        break;
                }
                return out;
            }
        }
    })
    .filter('dlsDateFilter', function () {
        return function (date, bool, format) {
            date = new Date(date) || new Date();
            format = format || '-';
            bool = !!bool || false; //是否需要时分秒
            var out = "";
            if (angular.isDate(date)) {
                var year = date.getFullYear();
                var mon = 1 + date.getMonth();
                var day = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();
                var sec = date.getSeconds();
                if (bool) {
                    out += year + format + mon + format + day + " " + hour + format + min + format + sec;
                } else {
                    out += year + format + mon + format + day;
                }
                // console.log(out);
                return out;
            }
        }
    })
    .filter("getFirstContent", function () {
        return function (input) {
            input = input + '';
            return input.split(" ")[0]
        }
    })
    .filter('dlsDateTimeFilter', function () {
        return function (date, time) {
            date = new Date(date) || new Date();
            time = !!time ? time : 0; //0-24时
            var out = "";
            var hour = 0;
            var min = 0;
            var sec = 0;
            if (angular.isDate(date)) {
                var year = date.getFullYear();
                var mon = date.getMonth();
                var day = date.getDate();
            }
            switch (time) {
                case 0:
                    hour = 0;
                    break;
                case 24:
                    hour = 23;
                    min = 59;
                    sec = 59;
                    break;
                default :
                    hour = time;
                    break;
            }
            return new Date(year, mon, day, hour, min, sec);
        }
    })

    .filter("settPeriodFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "天";
                        break;
                    case '02' :
                        input = "月";
                        break;
                    case '03' :
                        input = "季";
                        break;
                    case '04' :
                        input = "半年";
                        break;
                    default :
                        input = "年";
                        break;
                }
            }
            return input;
        }
    })
    .filter("timeUnitFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "日";
                        break;
                    case '02' :
                        input = "周";
                        break;
                    case '03' :
                        input = "月";
                        break;
                    case '04' :
                        input = "年";
                        break;
                    case '05' :
                        input = "小时";
                        break;
                    default :
                        input = "分钟";
                        break;

                }
            }
            return input;
        }
    })

    .filter('memRoleFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "供方会员";
                        break;
                    case '02':
                        out = "需方会员";
                        break;
                    case '03':
                        out = "服务会员";
                        break;
                    case '04':
                        out = "供方会员";
                        break;
                    case '05':
                        out = "供方会员";
                        break;
                }
                return out;
            }
        }
    })
    .filter('prdtTypeFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "标准数据配送";
                        break;
                    case '02':
                        out = "征信类";
                        break;
                    case '03':
                        out = "CAP产品";
                        break;
                }
                return out;
            }
        }
    })
    .filter("settTypeFilter", function () {
        return function (input) {
            switch (input) {
                case "01":
                    input = "普通结算";
                    break;
                case "02":
                    input = "风控雷达结算";
                    break;
                case "03":
                    input = "CAP结算";
                    break;
            }
            return input;
        }
    })
    .filter("logSettType", function () {
        return function (input) {
            switch (input) {
                case "01":
                    input = "普通结算";
                    break;
                case "02":
                    input = "征信类结算";
                    break;
                case "03":
                    input = "营销类结算";
                    break;
            }
            return input;
        }
    })
    .filter("settleTypeFilter", function () {
        return function (input) {
            switch (input) {
                case "capDemLog" :
                    input = "营销类结算";
                    break;
                case "capSharedSupLog" :
                    input = "营销类结算";
                    break;
                case "capBuyoutSupLog" :
                    input = "营销类结算";
                    break;
                case "dmixDemLog" :
                    input = "征信类结算";
                    break;
                case "dmixSupLog" :
                    input = "征信类结算";
                    break;
                case "stdDemLog" :
                    input = "普通结算";
                    break;
                case "stdSupLog" :
                    input = "普通结算";
                    break;
            }
            return input;
        }
    })
    .filter("tagTypeFilter", function () {
        return function (input) {
            switch (input) {
                case "02" :
                    input = "征信类";
                    break;
                case "03" :
                    input = "营销类";
                    break;
                case "" :
                    input = "算法类";
                    break;
            }
            return input
        }
    })
    .filter("valueType", function () {
        return function (input) {
            switch (input) {
                case 1:
                    input = '单值列表';
                    break;
                case '1':
                    input = '单值列表';
                    break;
                case 2:
                    input = '多值列表';
                    break;
                case '2':
                    input = '多值列表';
                    break;
                case 3:
                    input = '分段';
                    break;
                case '3':
                    input = '分段';
                    break;
                case 4:
                    input = '命中';
                    break;
                case '4':
                    input = '命中';
                    break;
                case 5:
                    input = '数据项';
                    break;
                case '5':
                    input = '数据项';
                    break;
            }
            return input
        }
    })
    .filter("workOrderStatus", function () {
        return function (input) {
            switch (input) {
                case '0' :
                    input = '全部';
                    break;
                case '01' :
                    input = '未配置路由';
                    break;
                case '02' :
                    input = '已配置路由';
                    break;
                case '03' :
                    input = '不可配送';
                    break;
                case '04' :
                    input = '已失效';
                    break;
            }
            return input;
        }
    })
    .filter("customizedSceneStatus", function () {
        return function (input) {
            console.log(input.split(',')[0])
            switch (input) {
                case '00' :
                    input = '全部';
                    break;
                case '03' :
                    input = '智慧城市';
                    break;
                case '02' :
                    input = '营销';
                    break;
                case '04' :
                    input = '征信';
                    break;
                case '99' :
                    input = '其它';
                    break;
            }
            return input;
        }
    })
    .filter("customizedDemandTypeStatus", function () {
        return function (input) {
            switch (input) {
                case '' :
                    input = '全部';
                    break;
                case '01' :
                    input = '数据定制';
                    break;
                case '02' :
                    input = '数据清洗';
                    break;
                case '03' :
                    input = '数据可视化';
                    break;
                case '04' :
                    input = '数据分析';
                    break;
                case '05' :
                    input = '数据模型';
                    break;             
                case '06' :
                    input = '其它';
                    break;
            }
            return input;
        }
    })
    .filter("dispModeFilter", function () {
        return function (input) {
            switch (input) {
                case '01' :
                    input = '实时配送';
                    break;
                case '02' :
                    input = '异步配送';
                    break;
                case '03' :
                    input = '异步碰撞配送';
                    break;
            }
            return input;
        }
    })
    .filter("IDModeFilter", function () {
        return function (input) {
            switch (input) {
                case '01' :
                    input = 'EXID';
                    break;
                case '02' :
                    input = 'XID';
                    break;
            }
            return input;
        }
    })
    .filter("peopleTagFilter", function () {
        return function (input) {
            switch (input) {
                case '00' :
                    input = '标签数据';
                    break;
                case '01' :
                    input = '人群包';
                    break;
            }
            return input;
        }
    })

    .filter("valuationModeCdFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "查询计数";
                        break;
                    case '02' :
                        input = "查得计数";
                        break;
                }
            }
            return input;
        }
    })
    .filter("valuationCountCdFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "按次";
                        break;
                    case '02' :
                        input = "按千次";
                        break;
                    case '03' :
                        input = "按百万次";
                        break;
                    case '04' :
                        input = "按条";
                        break;
                    case '05' :
                        input = "按千条";
                        break;
                }
            }
            return input;
        }
    })
    .filter("settPeriodFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "按天";
                        break;
                    case '02' :
                        input = "按月";
                        break;
                    case '03' :
                        input = "按季";
                        break;
                    case '04' :
                        input = "按半年";
                        break;
                    case '05' :
                        input = "按年";
                        break;
                }
            }
            return input;
        }
    })
    .filter("settModFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "双边清算";
                        break;
                    case '02' :
                        input = "集中清算";
                        break;
                }
            }
            return input;
        }
    })
    .filter("supConfirmFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '0' :
                        input = "待确认";
                        break;
                    case '01' :
                        input = "同意";
                        break;
                    case '02' :
                        input = "拒绝";
                        break;
                    case '03' :
                        input = "已失效";
                        break;
                }
            }
            return input;
        }
    })
    .filter('connVerFilter', function () {
        return function (input) {
            var out = '';
            if (!!input) {
                out = 'v' + (Number(input) / 100).toFixed(2);
                return out;
            }
        }
    })
    .filter('transitionDetailFilter', function () {
        return function (input) {
            var out = '';
            if (!!input) {
                switch (input) {
                    case '08':
                        out = "充值";
                        break;
                    case '01':
                        out = "充值";
                        break;
                    case '02':
                        out = "提现";
                        break;
                    case '03':
                        out = "授信调整";
                        break;
                    case '04':
                        out = "赠送调整";
                        break;
                    case '05':
                        out = "调账";
                        break;
                    case '06':
                        out = "清算";
                        break;
                }
                return out;
            }
        }
    })
    .filter('emptyFilter', function () {
        return function (input) {
            return !!input ? input : '--'
        }
    })
    .filter('textEmptyFilter', function () {
        return function (input) {
            if (input && (input.toString() === 'None' || input.toString() === 'none')) {
                return '-'
            }
            return !!input ? input : '-'
        }
    })
    .filter('moneyEmptyFilter', function () {
        return function (input) {
            if (input && (input.toString() === 'None' || input.toString() === 'none')) {
                return '0.00'
            }
            return !!input ? input : '0.00'
        }
    })
    .filter('reqDemStatusFilter', function () {
        return function (input) {
            var out = '';
            if (!!input) {
                switch (input) {
                    case '':
                        out = "全部";
                        break;
                    case '01':
                        out = "待发布";
                        break;
                    case '02':
                        out = "已发布";
                        break;
                    case '03':
                        out = "已失效";
                        break;
                    case '-1':
                        out = "已删除";
                        break;
                }
                return out;
            }
        }
    })
    .filter('reqSupStatusFilter', function () {
        return function (input) {
            var out = '';
            if (!!input) {
                switch (input) {
                    case '':
                        out = "全部";
                        break;
                    case '01':
                        out = "已关注";
                        break;
                    case '02':
                        out = "已报名";
                        break;
                    case '03':
                        out = "已失效";
                        break;
                    case '-1':
                        out = "已删除";
                        break;
                }
                return out;
            }
        }
    })
    .filter('processTypeFilter', function () {
        return function (input) {
            var out = '';
            if (!!input) {
                var temp = [];
                var arr = input.split(',');
                if(arr[0]) {
                    temp.push("直接计算");
                }
                if(arr[1]) {
                    temp.push("间接计算");
                }
                return temp.join();
            }
        }
    })

    .filter('reqSceneFilter', function () {
        return function (input) {
            var out = [];
            if (!!input) {
                var inputs = input.split(",");
                if(inputs.indexOf("00") !== -1){
                    out.push("全部");
                }
                if(inputs.indexOf("03") !== -1){
                    out.push("智慧城市");
                }
                if(inputs.indexOf("02") !== -1){
                    out.push("营销");
                }
                if(inputs.indexOf("04")!== -1){
                    out.push("征信");
                }
                if(inputs.indexOf("99")!== -1){
                    out.push("其他");
                }
                return out.join("、");
            }
        }
    })
    .filter('reqTypeFilter', function () {
        return function (input) {
            var out = [];
            if (!!input) {
                var inputs = input.split(",");
                if(inputs.indexOf("00") !== -1){
                    out.push("全部");
                }
                if(inputs.indexOf("01") !== -1){
                    out.push("数据定制");
                }
                if(inputs.indexOf("02") !== -1){
                    out.push("数据清洗");
                }
                if(inputs.indexOf("03") !== -1){
                    out.push("数据可视化");
                }
                if(inputs.indexOf("04")!== -1){
                    out.push("数据分析");
                }
                if(inputs.indexOf("05")!== -1){
                    out.push("数据模型");
                }
                return out.join("、");
            }
        }
    })
    .filter('shrinkFilter', function () {
      return function (input, cutlength) {
        if(!input){
            input = ''
        }
        cutlength = cutlength || 100;
        if(input.length > cutlength){
          return input.substring(0, cutlength) + "...";
        }
        return input
      }
    })
    .filter('similarityFilter', function () {
        return function (input) {
            if(input) {
                input = input + ' %'
            }
            return input
        }
    })





