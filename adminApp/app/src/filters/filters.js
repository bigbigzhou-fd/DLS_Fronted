angular.module('dls.filters', [])
    .filter('dlsCurrencyFilter', function ($filter) {
        return function (input, sign, symbol, fractionSize) {
            if ("--" === input) {
                return "--"
            }
            input = input || 0;
            symbol = symbol || '¥';
            fractionSize = fractionSize || 2;
            var out = '';
            if (sign) {
                if (Number(input) >= 0) {
                    out += symbol + " +" + ' ' + $filter('number')(input, fractionSize);
                } else if (Number(input) < 0) {
                    input *= -1;
                    out += symbol + " -" + ' ' + $filter('number')(input, fractionSize);
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
                    case '02':
                        out = "提现";
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
                    case '11':
                        out = "结算增加";
                        break;
                    case '12':
                        out = "总额度至分配额度";
                        break;
                    case '13':
                        out = "赠送增加";
                        break;
                    case '14':
                        out = "赠送减少";
                        break;
                    case '15':
                        out = "清算增加";
                        break;
                    case '16':
                        out = "清算减少";
                        break;
                    case '17':
                        out = "提现至余额";
                        break;




                }
                return out;
            }
        }
    })
    .filter('quotaAdjStatusFilter', function () {
        return function (input) {
            input = input || '';
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "待审核 ";
                        break;
                    case '02':
                        out = "已审核";
                        break;
                    case '03':
                        out = "已拒绝";
                        break;
                }
                return out;
            }
        }
    })
    .filter('prdtAccCheckStatusFilter', function () {
        return function (input) {
            input = input || '';
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "待审核 ";
                        break;
                    case '02':
                        out = "已通过";
                        break;
                    case '03':
                        out = "已拒绝";
                        break;
                }
                return out;
            }
        }
    })

    .filter('accountCheckStatusFilter', function () {
        return function (input) {
            input = input || '';
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "待审核";
                        break;
                    case '02':
                        out = "审核通过";
                        break;
                    case '03':
                        out = "已拒绝";
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
                        out = "待出价";
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
                }
                return out;
            }
        }
    })
    .filter('assignTypeFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '1':
                        out = "单值列表";
                        break;
                    case '2':
                        out = "多值列表";
                        break;
                    case '3':
                        out = "分段";
                        break;
                    case '4':
                        out = "命中";
                        break;
                    case '5':
                        out = "数据项";
                        break;
                }
                return out;
            }
        }
    })


    .filter('assignTypeNumberFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '单值列表':
                        out = "1";
                        break;
                    case '多值列表':
                        out = "2";
                        break;
                    case '分段':
                        out = "3";
                        break;
                    case '命中':
                        out = "4";
                        break;
                    case '数据项':
                        out = "5";
                        break;
                }
                return out;
            }
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
    .filter('memRoleTocodeFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '普通供方会员':
                        out = "01";
                        break;
                    case '需方会员':
                        out = "02";
                        break;
                    case '服务会员':
                        out = "03";
                        break;
                    case '分成供方会员':
                        out = "04";
                        break;
                    case '买断供方会员':
                        out = "05";
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
                        out = "征信类产品";
                        break;
                    case '03':
                        out = "营销类产品";
                        break;
                }
                return out;
            }
        }
    })
    .filter('accountTypeFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "可用余额";
                        break;
                    case '02':
                        out = "可用授信";
                        break;
                    case '03':
                        out = "可用赠送";
                        break;
                    case '04':
                        out = "可计提";
                        break;

                }
                return out;
            }
        }
    })
    .filter('prdtTypeTocodeFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '标准数据配送':
                        out = "01";
                        break;
                    case '征信类产品':
                        out = "02";
                        break;
                    case '营销类产品':
                        out = "03";
                        break;
                }
                return out;
            }
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
            }
            return input
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
    .filter("auditState", function () {
        return function (input) {
            if (input) {
                var audit = input.substring(0, 2);
                var open = input.substring(2, 4);

                switch (audit) {
                    case '00' :
                        input = "未知状态";
                        break;
                    case '01' :
                        input = "待审核";
                        break;
                    case '02' :
                        if (open == '00') {
                            input = "已审核通过：未开户"
                        } else if (open == '01') {
                            input = "已审核通过：已开户"
                        } else if (!open) {
                            input = "已审核通过"
                        }
                        ;
                        break;
                    case '03' :
                        input = "已审核：退回修改";
                        break;
                    case '04' :
                        input = "已审核：拒绝";
                        break;
                }
            }

            return input
        }
    })
    .filter("applyState", function () {
        return function (input) {
            if (input) {
                var audit = input.substring(0, 2);
                var open = input.substring(2, 4);

                switch (audit) {
                    case '00' :
                        input = "填写中";
                        break;
                    case '01' :
                        input = "待审核";
                        break;
                    case '02' :
                        if (open == '00') {
                            input = "已审核通过：未开户"
                        } else if (open == '01') {
                            input = "已审核通过：已开户"
                        } else if (!open) {
                            input = "已审核通过"
                        }
                        ;
                        break;
                    case '03' :
                        input = "已审核：退回修改";
                        break;
                    case '04' :
                        input = "已审核：拒绝";
                        break;
                }
            }

            return input
        }
    })
    .filter("openState", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '00' :
                        input = "未开户";
                        break;
                    case '01' :
                        input = "已开户";
                        break;
                    case '02' :
                        input = "临时关停";
                        break;
                    case '03' :
                        input = "永久关停";
                        break;
                    default :
                        input = "未知状态";
                        break;
                }
            }
            return input
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

    .filter("valuationState", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "按次计费";
                        break;
                    case '02' :
                        input = "按千次计费";
                        break;
                    case '03' :
                        input = "按百万次计费";
                        break;
                }
            }
            return input
        }
    })
    .filter("cloneObj", function ($filter) {
        return function (obj) {
            if (typeof obj !== 'object') {
                return;
            }
            var str, newobj = obj.constructor === Array ? [] : {};
            if (typeof obj === 'object') {
                for (var i in obj) {
                    newobj[i] = typeof obj[i] === 'object' ? $filter("cloneObj")(obj[i]) : obj[i];
                }
            }
            return newobj;
        }
    })
    .filter('roleTypeFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '4':
                        out = "供方";
                        break;
                    case '05':
                        out = "供方";
                        break;
                }
                return out;
            }
        }
    })
    .filter("goodsStatusFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case 1 :
                        input = "待上架";
                        break;
                    case 2 :
                        input = "已上架";
                        break;
                    case 3 :
                        input = "已下架";
                        break;
                    case 4 :
                        input = "已失效";
                        break;
                    case -1 :
                        input = "已删除";
                        break;
                }
            }
            return input;
        }
    })
    .filter("auditStatusFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '00' :
                        input = "待提交审核";
                        break;
                    case '01' :
                        input = "待审核";
                        break;
                    case '02' :
                        input = "不审核";
                        break;
                    case '03' :
                        input = "审核通过";
                        break;
                    case '04' :
                        input = "审核失败";
                        break;
                    case '05' :
                        input = "退回修改";
                        break;
                }
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
                        input = "按次计费";
                        break;
                    case '02' :
                        input = "按千次计费";
                        break;
                    case '03' :
                        input = "按百万次计费";
                        break;
                    case '04' :
                        input = "按条计费";
                        break;
                    case '05' :
                        input = "按千条计费";
                        break;
                }
            }
            return input;
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
    .filter("qltEvlStatusFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "加入";
                        break;
                    case '02' :
                        input = "不加入";
                        break;
                }
            }
            return input;
        }
    })
    .filter("maxDelayTimeFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '1' :
                        input = "s";
                        break;
                    case '2' :
                        input = "ms";
                        break;
                }
            }
            return input;
        }
    })
    .filter("dlsCurrency", function () {
        return function (input) {
            if (input) {
                if(Number(input) > 0){
                    input = '+' + input;
                }
            }
            return input;
        }
    })
    .filter("concurrencyFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '1' :
                        input = "s/条";
                        break;
                    case '2' :
                        input = "ms/条";
                        break;
                }
            }
            return input;
        }
    })
    .filter("numberRangeToObjFilter", function () {
        return function (input) {
            // input = "12,13;45,68";
            input = input.split(";");
            var tmp = [], out = [];
            for (var i = 0; i < input.length; i++) {
                // tmp = input[i].split(',');
                var obj = {
                    'min': null,
                    'max': null
                };
                obj.min = Number(input[i].split(',')[0]);
                obj.max = Number(input[i].split(',')[1]);
                out.push(obj);
            }
            return out;
        }
    })
    .filter("numberRangeToStrFilter", function () {
        return function (input) {
            var result = "";
            // input = [{min:1,max:2},{min:3,max:4}];
            for (var i = 0; i < input.length; i++) {
                if ((input[i].min == 0 || input[i].min) && (input[i].max == 0 || input[i].max)) {
                    result += input[i].min;
                    result += ',';
                    result += input[i].max;
                    result += ';';
                } else {
                    result = "";
                    return;
                }
            }
            result = result.slice(0, result.length - 1);
            console.log(result);
            // result.length--;
            return result;
        }
    })
    .filter("numberRangeObjToStr", function () {
        return function (input) {

            var out = "";
            if (typeof input === 'string') {
                return;
            }
            for (item in input) {
                out += input[item];
            }
            return out;
        }
    })
    .filter("numToPercentFilter", function () {
        return function (input) {

            var out = "";
            out = (input * 100).toFixed(2) + '%';
            return out;
        }
    })
    .filter("signStatusFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "未签约";
                        break;
                    case '02' :
                        input = "签约中";
                        break;
                    case '03' :
                        input = "已签约";
                        break;
                    case '04' :
                        input = "签约失败";
                        break;
                }
            }
            return input;
        }
    })
    .filter("signStatusReasonFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "";
                        break;
                    case '02' :
                        input = "您的签约资料已提交，银行签约处理中！";
                        break;
                    case '03' :
                        input = "签约成功！";
                        break;
                    case '04' :
                        input = "由于开户行号等信息不正确，签约失败！请核对信息后进行签约！";
                        break;
                }
            }
            return input;
        }
    })
    .filter("accountManageStatusFilter", function () {
        return function (input) {
            if (input) {
                switch (input) {
                    case '01' :
                        input = "可用";
                        break;
                    case '02' :
                        input = "不可用";
                        break;
                }
            }
            return input;
        }
    })
    .filter('textEmptyFilter', function () {
        return function (input) {
            if(input === undefined || input === null || input.toString() === 'None' || input.toString() === 'none'){
                return '-'
            }
            return !!input ? input : '-'
        }
    })
    .filter('moneyEmptyFilter', function () {
        return function (input) {

            if(input === undefined || input === null  || input.toString() === 'None' || input.toString() === 'none'){
                return '0.00'
            }
            return !!input ? input : '0.00'
        }
    })
    .filter('releaseStateFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
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
    .filter('sceneStateFilter', function () {
        return function (input) {
            input += "";
            var out = '';
            if (!!input) {
                switch (input) {
                    case '01':
                        out = "用户画像";
                        break;
                    case '02':
                        out = "营销";
                        break;
                    case '03':
                        out = "智慧城市";
                        break;
                    case '04':
                        out = "征信";
                        break;
                    case '99':
                        out = "其他";
                        break;

                }
                return out;
            }
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
    .filter('reqSceneFilter', function () {
        return function (input) {
            var out = [];
            if (!!input) {
                var inputs = input.split(",");
                if(inputs.indexOf("00") !== -1){
                    out.push("全部 ");
                }
                if(inputs.indexOf("03") !== -1){
                    out.push("智慧城市 ");
                }
                if(inputs.indexOf("02") !== -1){
                    out.push("营销 ");
                }
                if(inputs.indexOf("04")!== -1){
                    out.push("征信 ");
                }
                if(inputs.indexOf("99")!== -1){
                    out.push("其他 ");
                }
                return out.join("、");
            }
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
    .filter('emptyFilter', function () {
        return function (input) {
            return !!input ? input : '--'
        }
    })








