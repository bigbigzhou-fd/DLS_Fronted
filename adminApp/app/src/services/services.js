/**
 * Created by oxygen on 2017/4/11.
 */
angular.module('myApp.services', [])
    .service("transferData",function(){
        return {
            proCsv : {}
        }
    })
    .service("dls_list_service",function($http){
        return {
            trade_scenario_btn_datas : [{       //trade_mall.html
                name:"营销场景",
                value:"02",
                action:"1",
            },{
                name:"征信场景",
                value:"04",
                action:"2",
            },{
                name:"智慧城市",
                value:"03",
                action:"3",
            }] ,
            trade_type_btn_datas : [{        //trade_mall.html
                name:"通用",
                value:"",
                action:"1"
            },{
                name:"汽车",
                value:"汽车",
                action:"2"
            },{
                name:"母婴",
                value:"母婴",
                action:"3"
            },{
                name:"金融",
                value:"金融",
                action:"4"
            }] ,
            trade_mall_sets_grid : {
                id:"tradeMallSetsGrid",
                widths:[{
                    displayName:'版本号',
                    width:'80px',
                },{
                    displayName:'互联对象套餐',
                    width:'160px',
                },{
                    displayName:'数据供方机构',
                    width:'200px',
                },{
                    displayName:'数据供方部门',
                    width:'120px',
                },{
                    displayName:'计价单位',
                    width:'100px',
                },{
                    displayName:'操作',
                    width:'120px',
                }],
                columnDefs:[{
                    field:'connSetVer',
                    displayName:'版本号',
                    width:'60px',
                },{
                    field:'setName',
                    displayName:'互联对象套餐',
                    width:'120px',
                },{
                    field:'supMemName',
                    displayName:'数据供方机构',
                    width:'200px',
                },{
                    field:'supMemDept',
                    displayName:'数据供方部门',
                    width:'120px',
                },{
                    field:'price_mode',
                    displayName:'计价单位',
                    width:'100px',
                },{
                    field:'price',
                    displayName:'价格(元)',
                    width:'100px',
                }],
            },
            dls_operation_btn_datas:[{
                "style":"glyphicon glyphicon-wrench",
                "name":"配置管理",
                "contents":[{
                    "name":"折扣率管理",
                    "action":"dls.config.discount",
                    "permission": '91'
                }
                //    ,{
                //    "name":"成员角色管理",
                //    "action":"dls.config.memRole",
                //    "permission": '101'
                //},{
                //    "name":"CAP供方计价管理",
                //    "action":"dls.config.supPrice",
                //    "permission": '102'
                //}
                ]
            },{
                "style":"glyphicon glyphicon-cog",
                "name":"后台库管理",
                "contents":[
                //    {
                //    "name":"标签库(KV)管理",
                //    "action":"dls.admin.tagLib",
                //    "permission": '54'
                //},
                    {
                    "name":"ID库(KV)管理",
                    "action":"dls.admin.idLib",
                    "permission": '64'
                },{
                    "name":"挂牌审核",
                    "action":"dls.admin.crpManage",
                    "permission": '64'
                }]
            },{
                "style":"glyphicon glyphicon-cog",
                "name":"交易品管理",
                "contents":[{
                    "name":"交易品管理",
                    "action":"dls.goodsManage.list",
                    "permission": '54'
                }]
            },{
                "style":"glyphicon glyphicon-cog",
                "name":"算法交易品管理",
                "contents":[{
                    "name":"算法交易品管理",
                    "action":"dls.algorithmGoodsManage.list",
                    "permission": '54'
                }]
            },{
                "style":"glyphicon glyphicon-list-alt",
                "name":"会员申请",
                "contents":[{
                    "name":"会员申请",
                    "action":"dls.memberApply",
                    "permission": '77'
                }]
            },{
                "style":"glyphicon glyphicon-tasks",
                "name":"会员管理",
                "contents":[{
                    "name":"会员信息",
                    "action":"dls.memberInfo",
                    "permission": '82'
                },{
                    "name":"订单信息",
                    "action":"dls.orderInfo",
                    "permission": '83'
                },{
                    "name":"用户操作管理",
                    "action":"dls.userOperateManage",
                    "permission": '82'
                }]
            },{
                "style":"glyphicon glyphicon-user",
                "name":"成员审核",
                "contents":[{
                    "name":"成员审核",
                    "action":"dls.memberAudit",
                    "permission": '80'
                }],
            }
            //    ,{
            //    "style":"glyphicon glyphicon-object-align-vertical",
            //    "name":"额度信息管理",
            //    "contents":[{
            //        "name":"额度管理",
            //        "action":"dls.quota.manage",
            //        "permission": '71'
            //    },{
            //        "name": "额度审核",
            //        "action": "dls.quota.check",
            //        "permission": '72'
            //    }],
            //}
                ,{
                "style": "iconfont icon-report",
                "name": "结算",
                "contents": [
                //    {
                //    "name":"结算汇总",
                //    "action":"dls.settlement.summary",
                //    "permission": '93'
                //},{
                //    "name": "会员结算",
                //    "action": "dls.settlement.clearing",
                //    "permission": '73'
                //},
                    {
                    "name":"结算单管理",
                    "action":"dls.settlement.manage",
                    "permission": '93'
                }]
            }
                ,{
                "style":"glyphicon glyphicon-stats",
                "name":"经营分析",
                "contents":[{
                    "name":"业务日志",
                    "action":"dls.analysis.businessLog",
                    "permission": '89'
                }]
            },{
                "style":"glyphicon glyphicon-stats",
                "name":"账户管理",
                "contents":[{
                    "name":"账户管理",
                    "action":"dls.accountManage.manage",
                    "permission": '107'
                },{
                    "name":"账户审核",
                    "action":"dls.accountManage.check",
                    "permission": '109'
                }]
            },{
                "style":"glyphicon glyphicon-stats",
                "name":"产品账户",
                "contents":[{
                    "name":"产品账户开户",
                    "action":"dls.productAccount.manage",
                    "permission": '111'
                },{
                    "name":"产品账户审核",
                    "action":"dls.productAccount.check",
                    "permission": '113'
                }]
            },{
                "style":"glyphicon glyphicon-road",
                "name":"签约管理",
                "contents":[{
                    "name":"签约管理",
                    "action":"dls.sign.manage",
                    "permission": '115'
                }]
            },{
                "style":"glyphicon glyphicon-th",
                "name":"需求管理",
                "contents":[{
                    "name":"需求管理",
                    "action":"dls.demand.demandManage",
                    "permission": '128'
                }]
            }
            // ,{
            //     "style":"glyphicon glyphicon-stats",
            //     "name":"配置页面",
            //     "contents":[{
            //         "name":"配置页面",
            //         "action":"dls.config.discountConfig",
            //         "permission": '119'
            //     }]
            // }
            ],
             providerOriginDataGrid:{
                 id:"providerDataOriginGrid",
                 widths:[{
                     displayName:"序号",
                     width:"60",
                 },{
                     displayName:'文件编号',
                     width:"180",
                 },{
                     displayName:'文件名称',
                     width:"180"
                 },{
                     displayName:'上传日期',
                     width:"220"
                 },{
                     displayName:'上传人员',
                     width:"180"
                 },{
                     displayName:'操作',
                     width:"100"
                 }],
                 columnDefs:[{
                     field:'code',
                     displayName:'文件编号',
                     width:"180",
                 },{
                     field:'name',
                     displayName:'文件名称',
                     width:"180"
                 },{
                     field:'ctime',
                     displayName:'上传日期',
                     width:"220"
                 },{
                     field:'username',
                     displayName:'上传人员',
                     width:"180"
                 }],
             },
             providerItemGrid:{
                id : "providerItemManageGrid", //必须
                widths:[{
                    displayName:'序号',
                    width:'50px'
                },{
                    displayName:'互联对象编号',
                    width:"140px",
                },{
                    displayName:'互联对象名称',
                    width:"150px"
                },{
                    displayName:'版本号',
                    width:"60px"
                },{
                    displayName:'标签名称',
                    width:"150px"
                },{
                    displayName:'标签赋值类型',
                    width:"100px"
                },{
                    displayName:'计价单位',
                    width:"100px"
                },{
                    displayName: '价格（元）',
                    width: "100px"
                },{
                    displayName:'状态',
                    width:"100px"
                },{
                    displayName:'操作',
                    width:"140px"
                }],
                columnDefs:[{
                    field:'connObjId',
                    displayName:'互联对象编号',
                    width:"140px",
                },{
                    field:'prdtName',
                    displayName:'互联对象名称',
                    width:"150px"
                },{
                    field:'connObjVer',
                    displayName:'版本号',
                    width:"60px"
                },{
                    field:'tagName',
                    displayName:'标签名称',
                    width:"150px"
                },{
                    field:'tagValueTypeDisplay',
                    displayName:'标签赋值类型',
                    width:"100px"
                },{
                    field:'valuationModeCdDisplay',
                    displayName:'计价单位',
                    width:"100px"
                },{
                    field: 'valuationPrice',
                    displayName: '价格（元）',
                    width: "100px"
                }],
                //exporterOlderExcelCompatibility: true,    //ui-grid解决中文乱码
                exporterCsvFilename: 'tradeItemList.csv',
                exporterSuppressColumns : [0,8,9] //不必导出的columns
            },
             providerSetGrid:{
                 id : "providerSetManageGrid", //必须
                 widths:[{
                     displayName:'互联对象编号',
                     width:"140",
                 },{
                     displayName:'版本号',
                     width:"60"
                 },{
                     displayName:'套餐名称',
                     width:"150"
                 },{
                     displayName:'计价单位',
                     width:"100"
                 },{
                     displayName: '价格（元）',
                     width: "100"
                 },{
                     displayName:'状态',
                     width:"100"
                 },{
                     displayName:'操作',
                     width:"140"
                 }],
                 columnDefs:[{
                     field:'connSetVer',
                     displayName:'版本号',
                     width:"60"
                 },{
                     field:'setName',
                     displayName:'套餐名称',
                     width:"150"
                 },{
                     field:'valuationModeCdDispaly',
                     displayName:'计价单位',
                     width:"100"
                 }, {
                     field: 'valuationPrice',
                     displayName: '价格（元）',
                     width: "100"
                 }],
                 //exporterOlderExcelCompatibility: true,    //ui-grid解决中文乱码
                 exporterCsvFilename: 'tradeSetList.csv',
                 exporterSuppressColumns : [5,6] //不必导出的columns
             },
             tradeProviderConfirmGrid:{
                 columnDefs:[{
                     field:'connObjNo',
                     displayName:'流通对象编号',
                 },{
                     field:'connObjCatDisplay',
                     displayName:'类型',
                 },{
                     field:'prdtName',
                     displayName:'互联对象名称',
                },{
                     field:'connObjVer',
                     displayName:'版本号',
                 },{
                     field:'valuationModeCd_display',
                     displayName:'计价方式',
                 },{
                     field:'valuationPrice',
                     displayName:'价格（元）',
                 }]},
             businessLogGrid:{
                 columnDefs:[{
                     field:'prdtName',
                     displayName:'交易品名',
                 },{
                     field:'prdtIdCd',
                     displayName:'交易品编号',
                 },{
                     field:'supNum',
                     displayName:'互联供方',
                 },{
                     field:'demNum',
                     displayName:'互联需方',
                 },{
                     field:'periodDemBuyNum',
                     displayName:'需方买入数量（次）',
                 },{
                     field:'demBuyNum',
                     displayName:'需方累计买入数量（次）',
                 },{
                     field:'periodSupSoldNum',
                     displayName:'供方卖出数量（次）',
                 },{
                     field:'supSoldNum',
                     displayName:'供方累计卖出数量（次）',
                 },{
                     field:'rcvDemAmtAct',
                     displayName:'需方结算金额（元）',
                 },{
                     field:'paySupAmtAct',
                     displayName:'供方结算金额（元）',
                 },{
                     field:'imBalanceAct',
                     displayName:'供需结算差额（元）',
                 }]
             },
             demDetailGrid:{
                columnDefs:[{
                    field:'demMemName',
                    displayName:'需方机构名称',
                },{
                    field:'demDeptName',
                    displayName:'需方部门名称',
                },{
                    field:'orderId',
                    displayName:'订单编号',
                },{
                    field:'settType',
                    displayName:'结算类型',
                },{
                    field:'demBuyNum',
                    displayName:'需方买入数量（次）',
                },{
                    field:'demBuyNumTot',
                    displayName:'需方累计买入数量（次）',
                },{
                    field:'rcvDemAmt',
                    displayName:'应收需方金额（元）',
                },{
                    field:'discountAmt',
                    displayName:'减免金额（元）',
                },{
                    field:'rcvDemAmtAct',
                    displayName:'需方结算金额（元）',
                }]
            },
             supDetailGrid:{
                columnDefs:[{
                    field:'supMemName',
                    displayName:'供方机构名称',
                },{
                    field:'supDeptName',
                    displayName:'供方部门名称',
                },{
                    field:'orderId',
                    displayName:'订单编号',
                },{
                    field:'settType',
                    displayName:'结算类型',
                },{
                    field:'supSoldNum',
                    displayName:'供方卖出数量（次）',
                },{
                    field:'supSoldNumTot',
                    displayName:'供方累计卖出数量（次）',
                },{
                    field:'paySupAmt',
                    displayName:'应付供方金额（元）',
                },{
                    field:'paySupAmtAct',
                    displayName:'供方结算金额（元）',
                }]
            },
            capSupConnDetailGrid:{
                columnDefs:[{
                    field:'supMemName',
                    displayName:'供方机构名称',
                },{
                    field:'supDeptName',
                    displayName:'供方部门名称',
                }
                //    ,{
                //    field:'role',
                //    displayName:'成员角色',
                //}
                    ,{
                    field:'orderId',
                    displayName:'订单编号',
                },{
                    field:'settType',
                    displayName:'结算类型',
                },{
                    field:'supSoldNum',
                    displayName:'供方卖出数量（次）',
                },{
                    field:'supSoldNumTot',
                    displayName:'供方累计卖出数量（次）',
                },{
                    field:'paySupAmt',
                    displayName:'应付供方金额（元）',
                },{
                    field:'paySupAmtAct',
                    displayName:'供方结算金额（元）',
                }]
            },
            capSupBoConnDetailGrid:{
                columnDefs:[{
                    field:'supMemName',
                    displayName:'供方机构名称',
                },{
                    field:'supDeptName',
                    displayName:'供方部门名称',
                },{
                    field:'role',
                    displayName:'成员角色',
                },{
                    field:'supSoldNum',
                    displayName:'供方卖出数量（次）',
                },{
                    field:'supSoldNumTot',
                    displayName:'供方累计卖出数量（次）',
                },{
                    field:'paySupAmt',
                    displayName:'应付供方金额（元）',
                },{
                    field:'paySupAmtAct',
                    displayName:'供方结算金额（元）',
                }]
            },
             orderDemDetailGrid:{
                 columnDefs:[{
                     field:'connObjId',
                     displayName:'互联对象编号',
                 },{
                     field:'prdtName',
                     displayName:'互联对象名称',
                 },{
                     field:'supMemName',
                     displayName:'供方机构名称',
                 },{
                     field:'supDeptName',
                     displayName:'供方部门名称',
                 },{
                     field:'connObjVer',
                     displayName:'版本',
                 },{
                     field:'price',
                     displayName:"单价"
                 },{
                     field:'demBuyNum',
                     displayName:'需方买入数量（次）',
                 },{
                     field:'demBuyNumTot',
                     displayName:'需方累计买入数量（次）',
                 },{
                     field:'rcvDemAmt',
                     displayName:'应收需方金额（元）',
                 },{
                     field:'discountAmt',
                     displayName:'减免金额（元）',
                 },{
                     field:'rcvDemAmtAct',
                     displayName:'实收需方金额（元）',
                 }]
             },
            orderSharedSupDetailGrid:{
                 columnDefs:[{
                     field:'connObjId',
                     displayName:'互联对象编号',
                 },{
                     field:'prdtName',
                     displayName:'互联对象名称',
                 },{
                     field:'demMemName',
                     displayName:'需方机构名称',
                 },{
                     field:'demDeptName',
                     displayName:'需方部门名称',
                 },{
                     field:'connObjVer',
                     displayName:'版本',
                 },{
                     field:'price',
                     displayName:'单价',
                 },{
                     field:'supSoldNum',
                     displayName:'供方卖出数量（次）',
                 },{
                     field:'supSoldNumTot',
                     displayName:'供方累计卖出数量（次）',
                 },{
                     field:'rcvDemAmt',
                     displayName:'应付供方金额（元）',
                 },{
                     field:'discountAmt',
                     displayName:'减免金额（元）',
                 },{
                     field:'rcvDemAmtAct',
                     displayName:'供方结算金额（元）',
                 }]
             },
            orderCAPSupDetailGrid:{
                 columnDefs:[{
                     field:'connObjId',
                     displayName:'互联对象编号',
                 },{
                     field:'prdtName',
                     displayName:'互联对象名称',
                 },{
                     field:'connObjVer',
                     displayName:'版本',
                 },{
                     field:'price',
                     displayName:'单价',
                 },{
                     field:'supSoldNum',
                     displayName:'供方卖出数量（次）',
                 },{
                     field:'supSoldNumTot',
                     displayName:'供方累计卖出数量（次）',
                 },{
                     field:'rcvDemAmt',
                     displayName:'应付供方金额（元）',
                 },{
                     field:'rcvDemAmtAct',
                     displayName:'实付供方金额（元）',
                 }]
             },
            orderSupDetailGrid:{
                 columnDefs:[{
                     field:'connObjId',
                     displayName:'互联对象编号',
                 },{
                     field:'prdtName',
                     displayName:'互联对象名称',
                 },{
                     field:'demMemName',
                     displayName:'需方机构名称',
                 },{
                     field:'demDeptName',
                     displayName:'需方部门名称',
                 },{
                     field:'price',
                     displayName:'单价',
                 },{
                     field:'supSoldNum',
                     displayName:'供方卖出数量（次）',
                 },{
                     field:'supSoldNumTot',
                     displayName:'供方累计卖出数量（次）',
                 },{
                     field:'rcvDemAmt',
                     displayName:'应付供方金额（元）',
                 },{
                     field:'rcvDemAmtAct',
                     displayName:'实付供方金额（元）',
                 }]
             },
        };

    })
    .service("dls_datas",function() {                  //放置从远端获取的数据
        return {
            test: {                                    //showData所需的json
                sum : 20 ,
                data: [{
                    "name": 1,
                    contents: [{
                        "key": 11,
                        "value": 111
                    }, {
                        "key": 12,
                        "value": 121
                    }, {
                        "key": 13,
                        "value": 131
                    }, {
                        "key": 14,
                        "value": 141
                    }, {
                        "key": 15,
                        "value": 151
                    }, {
                        "key": 16,
                        "value": 161
                    }, {
                        "key": 17,
                        "value": 171
                    }, {
                        "key": 18,
                        "value": 181
                    }]
                }, {
                    "name": 2,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 3,
                    contents: [{
                        "key": 11,
                        "value": 111
                    }, {
                        "key": 12,
                        "value": 121
                    }, {
                        "key": 13,
                        "value": 131
                    }, {
                        "key": 14,
                        "value": 141
                    }, {
                        "key": 15,
                        "value": 151
                    }, {
                        "key": 16,
                        "value": 161
                    }, {
                        "key": 17,
                        "value": 171
                    }, {
                        "key": 18,
                        "value": 181
                    }]
                }, {
                    "name": 4,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 5,
                    contents: [{
                        "key": 11,
                        "value": 111
                    }, {
                        "key": 12,
                        "value": 121
                    }, {
                        "key": 13,
                        "value": 131
                    }, {
                        "key": 14,
                        "value": 141
                    }, {
                        "key": 15,
                        "value": 151
                    }, {
                        "key": 16,
                        "value": 161
                    }, {
                        "key": 17,
                        "value": 171
                    }, {
                        "key": 18,
                        "value": 181
                    }]
                }, {
                    "name": 6,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 7,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 8,
                    contents: [{
                        "key": 11,
                        "value": 111
                    }, {
                        "key": 12,
                        "value": 121
                    }, {
                        "key": 13,
                        "value": 131
                    }, {
                        "key": 14,
                        "value": 141
                    }, {
                        "key": 15,
                        "value": 151
                    }, {
                        "key": 16,
                        "value": 161
                    }, {
                        "key": 17,
                        "value": 171
                    }, {
                        "key": 18,
                        "value": 181
                    }]
                }, {
                    "name": 9,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 10,
                    contents: [{
                        "key": 11,
                        "value": 111
                    }, {
                        "key": 12,
                        "value": 121
                    }, {
                        "key": 13,
                        "value": 131
                    }, {
                        "key": 14,
                        "value": 141
                    }, {
                        "key": 15,
                        "value": 151
                    }, {
                        "key": 16,
                        "value": 161
                    }, {
                        "key": 17,
                        "value": 171
                    }, {
                        "key": 18,
                        "value": 181
                    }]
                }, {
                    "name": 11,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 12,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 13,
                    contents: [{
                        "key": 11,
                        "value": 111
                    }, {
                        "key": 12,
                        "value": 121
                    }, {
                        "key": 13,
                        "value": 131
                    }, {
                        "key": 14,
                        "value": 141
                    }, {
                        "key": 15,
                        "value": 151
                    }, {
                        "key": 16,
                        "value": 161
                    }, {
                        "key": 17,
                        "value": 171
                    }, {
                        "key": 18,
                        "value": 181
                    }]
                }, {
                    "name": 14,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 15,
                    contents: [{
                        "key": 11,
                        "value": 111
                    }, {
                        "key": 12,
                        "value": 121
                    }, {
                        "key": 13,
                        "value": 131
                    }, {
                        "key": 14,
                        "value": 141
                    }, {
                        "key": 15,
                        "value": 151
                    }, {
                        "key": 16,
                        "value": 161
                    }, {
                        "key": 17,
                        "value": 171
                    }, {
                        "key": 18,
                        "value": 181
                    }]
                }, {
                    "name": 16,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 17,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 18,
                    contents: [{
                        "key": 11,
                        "value": 111
                    }, {
                        "key": 12,
                        "value": 121
                    }, {
                        "key": 13,
                        "value": 131
                    }, {
                        "key": 14,
                        "value": 141
                    }, {
                        "key": 15,
                        "value": 151
                    }, {
                        "key": 16,
                        "value": 161
                    }, {
                        "key": 17,
                        "value": 171
                    }, {
                        "key": 18,
                        "value": 181
                    }]
                }, {
                    "name": 19,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }, {
                    "name": 20,
                    contents: [{
                        "key": 21,
                        "value": 211
                    }, {
                        "key": 22,
                        "value": 221
                    }, {
                        "key": 23,
                        "value": 231
                    }, {
                        "key": 24,
                        "value": 241
                    }, {
                        "key": 25,
                        "value": 251
                    }, {
                        "key": 26,
                        "value": 261
                    }, {
                        "key": 27,
                        "value": 171
                    }, {
                        "key": 28,
                        "value": 181
                    }]
                }]
            }
        };
    })
    .service("account_quota_datas", function () {
        return {
            testDatas:{
                quotaTitles:["序号","更新时间","额度调整类型","金额","剩余额度","操作账户"],
                quotaDatas:[{
                    "number":"1",
                    "update":"2016-11-25 10:14:36",
                    "adjustType":"充值",
                    "amount":"1000.00",
                    "amountLeft":"3004.32",
                    "account":"0000079_adm"
                    },{
                    "number":"1",
                    "update":"2016-11-25 10:14:36",
                    "adjustType":"充值",
                    "amount":"-2000.00",
                    "amountLeft":"3004.32",
                    "account":"0000079_adm"
                    }
                ]
            }
        };
    })
    .service("memberAuditServ",function(){
        return {
            auditState:[{
                label:'全部',value:'0'
            },{
                label:'待审核',value:'1'
            },{
                label:'通过审核',value:'2'
            },{
                label:'退回修改',value:'3'
            },{
                label:'已拒绝',value:'4'
            }] ,

            auditGridOptions:{
                columnDefs:[{
                    field:'sequence',
                    displayName:'序号',
                    width:"80",
                },{
                    field:'applyNo',
                    displayName:'申请编号',
                    width:"180"
                },{
                    field:'orgFullNameCN',
                    displayName:'申请企业/组织',
                    width:"220"
                },{
                    field:'deptName',
                    displayName:'部门/机关',
                    width:"180"
                },{
                    field:'applyName',
                    displayName:'申请人',
                    width:"220"
                },{
                    field:'applyProgCd',
                    displayName:'审核状态',
                    width:"180"
                },{
                    field:'openAcctStatCd',
                    displayName:'审核操作',
                    width:"220"
                },{
                    field:'openAccount',
                    displayName:'开户操作',
                    width:"180"
                }]
            }
        }
    })
    .service("memberApplyArrs", [function(){
        return {
            orgTypeArr: [
                {
                    label: '国有企业',
                    value: '01',
                },
                {
                    label: '集体企业',
                    value: '02',
                },
                {
                    label: '联营企业',
                    value: '03',
                },
                {
                    label: '股份合作制企业',
                    value: '04',
                },
                {
                    label: '私营企业',
                    value: '05',
                },
                {
                    label: '个体户',
                    value: '06',
                },
                {
                    label: '合伙企业',
                    value: '07',
                },
                {
                    label: '有限责任公司',
                    value: '08',
                },
                {
                    label: '股份有限公司',
                    value: '09',
                },
            ],
            industryTypeArr: [
                {
                    label: '农业',
                    value: '01',
                },
                {
                    label: '林业',
                    value: '02',
                },
                {
                    label: '畜牧业',
                    value: '03',
                },
                {
                    label: '渔业',
                    value: '04',
                },
                {
                    label: '农、林、牧、渔服务业',
                    value: '05',
                },
                {
                    label: '煤炭开采和洗选业',
                    value: '06',
                },
                {
                    label: '石油和天然气开采业',
                    value: '07',
                },
                {
                    label: '黑色金属矿采选业',
                    value: '08',
                },
                {
                    label: '有色金属矿采选业',
                    value: '09',
                },
                {
                    label: '非金属矿采选业',
                    value: '10',
                },
                {
                    label: '开采辅助活动',
                    value: '11',
                },
                {
                    label: '其他采矿业',
                    value: '12',
                },
                {
                    label: '农副食品加工业',
                    value: '13',
                },
                {
                    label: '食品制造业',
                    value: '14',
                },
                {
                    label: '酒、饮料和精制茶制造业',
                    value: '15',
                },
                {
                    label: '烟草制品业',
                    value: '16',
                },
                {
                    label: '纺织业',
                    value: '17',
                },
                {
                    label: '纺织服装、服饰业',
                    value: '18',
                },
                {
                    label: '皮革、毛皮、羽毛及其制品和制鞋业',
                    value: '19',
                },
                {
                    label: '木材加工和木、竹、藤、棕、草制品业',
                    value: '20',
                },
                {
                    label: '家具制造业',
                    value: '21',
                },
                {
                    label: '造纸和纸制品业',
                    value: '22',
                },
                {
                    label: '印刷和记录媒介复制业',
                    value: '23',
                },
                {
                    label: '文教、工美、体育和娱乐用品制造业',
                    value: '24',
                },
                {
                    label: '石油加工、炼焦和核燃料加工业',
                    value: '25',
                },
                {
                    label: '化学原料和化学制品制造业',
                    value: '26',
                },
                {
                    label: '医药制造业',
                    value: '27',
                },
                {
                    label: '化学纤维制造业',
                    value: '28',
                },
                {
                    label: '橡胶和塑料制品业',
                    value: '29',
                },
                {
                    label: '非金属矿物制品业',
                    value: '30',
                },
                {
                    label: '黑色金属冶炼和压延加工业',
                    value: '31',
                },
                {
                    label: '有色金属冶炼和压延加工业',
                    value: '32',
                },
                {
                    label: '金属制品业',
                    value: '33',
                },
                {
                    label: '通用设备制造业',
                    value: '34',
                },
                {
                    label: '专用设备制造业',
                    value: '35',
                },
                {
                    label: '汽车制造业',
                    value: '36',
                },
                {
                    label: '铁路、船舶、航空航天和其他运输设备制造业',
                    value: '37',
                },
                {
                    label: '电气机械和器材制造业',
                    value: '38',
                },
                {
                    label: '计算机、通信和其他电子设备制造业',
                    value: '39',
                },
                {
                    label: '仪器仪表制造业',
                    value: '40',
                },
                {
                    label: '其他制造业',
                    value: '41',
                },
                {
                    label: '废弃资源综合利用业',
                    value: '42',
                },
                {
                    label: '金属制品、机械和设备修理业',
                    value: '43',
                },
                {
                    label: '电力、热力生产和供应业',
                    value: '44',
                },
                {
                    label: '燃气生产和供应业',
                    value: '45',
                },
                {
                    label: '水的生产和供应业',
                    value: '46',
                },
                {
                    label: '房屋建筑业',
                    value: '47',
                },
                {
                    label: '土木工程建筑业',
                    value: '48',
                },
                {
                    label: '建筑安装业',
                    value: '49',
                },
                {
                    label: '建筑装饰和其他建筑业',
                    value: '50',
                },
                {
                    label: '批发业',
                    value: '51',
                },
                {
                    label: '零售业',
                    value: '52',
                },
                {
                    label: '铁路运输业',
                    value: '53',
                },
                {
                    label: '道路运输业',
                    value: '54',
                },
                {
                    label: '水上运输业',
                    value: '55',
                },
                {
                    label: '航空运输业',
                    value: '56',
                },
                {
                    label: '管道运输业',
                    value: '57',
                },
                {
                    label: '装卸搬运和运输代理业',
                    value: '58',
                },
                {
                    label: '仓储业',
                    value: '59',
                },
                {
                    label: '邮政业',
                    value: '60',
                },
                {
                    label: '住宿业',
                    value: '61',
                },
                {
                    label: '餐饮业',
                    value: '62',
                },
                {
                    label: '电信、广播电视和卫星传输服务',
                    value: '63',
                },
                {
                    label: '互联网和相关服务',
                    value: '64',
                },
                {
                    label: '软件和信息技术服务业',
                    value: '65',
                },
                {
                    label: '货币金融服务',
                    value: '66',
                },
                {
                    label: '资本市场服务',
                    value: '67',
                },
                {
                    label: '保险业',
                    value: '68',
                },
                {
                    label: '其他金融业',
                    value: '69',
                },
                {
                    label: '房地产业',
                    value: '70',
                },
                {
                    label: '租赁业',
                    value: '71',
                },
                {
                    label: '商务服务业',
                    value: '72',
                },
                {
                    label: '研究和试验发展',
                    value: '73',
                },
                {
                    label: '专业技术服务业',
                    value: '74',
                },
                {
                    label: '科技推广和应用服务业',
                    value: '75',
                },
                {
                    label: '水利管理业',
                    value: '76',
                },
                {
                    label: '生态保护和环境治理业',
                    value: '77',
                },
                {
                    label: '公共设施管理业',
                    value: '78',
                },
                {
                    label: '居民服务业',
                    value: '79',
                },
                {
                    label: '机动车、电子产品和日用产品修理业',
                    value: '80',
                },
                {
                    label: '其他服务业',
                    value: '81',
                },
                {
                    label: '教育',
                    value: '82',
                },
                {
                    label: '卫生',
                    value: '83',
                },
                {
                    label: '社会工作',
                    value: '84',
                },
                {
                    label: '新闻和出版业',
                    value: '85',
                },
                {
                    label: '广播、电视、电影和影视录音制作业',
                    value: '86',
                },
                {
                    label: '文化艺术业',
                    value: '87',
                },
                {
                    label: '体育',
                    value: '88',
                },
                {
                    label: '娱乐业',
                    value: '89',
                },
                {
                    label: '中国共产党机关',
                    value: '90',
                },
                {
                    label: '国家机构',
                    value: '91',
                },
                {
                    label: '人民政协、民主党派',
                    value: '92',
                },
                {
                    label: '社会保障',
                    value: '93',
                },
                {
                    label: '群众团体、社会团体和其他成员组织',
                    value: '94',
                },
                {
                    label: '基层群众自治组',
                    value: '95',
                },
                {
                    label: '国际组织',
                    value: '96',
                },
            ],
            nationTypeArr:[
                {
                    "label": "中国",
                    "value": "156"
                },
                {
                    "label": "阿富汗",
                    "value": "004"
                },
                {
                    "label": "阿尔巴尼亚",
                    "value": "008"
                },
                {
                    "label": "南极洲",
                    "value": "010"
                },
                {
                    "label": "阿尔及利亚",
                    "value": "012"
                },
                {
                    "label": "美属萨摩亚",
                    "value": "016"
                },
                {
                    "label": "安道尔",
                    "value": "020"
                },
                {
                    "label": "安哥拉",
                    "value": "024"
                },
                {
                    "label": "安提瓜和巴布达",
                    "value": "028"
                },
                {
                    "label": "阿塞拜疆",
                    "value": "031"
                },
                {
                    "label": "阿根廷",
                    "value": "032"
                },
                {
                    "label": "澳大利亚",
                    "value": "036"
                },
                {
                    "label": "奥地利",
                    "value": "040"
                },
                {
                    "label": "巴哈马",
                    "value": "044"
                },
                {
                    "label": "巴林",
                    "value": "048"
                },
                {
                    "label": "孟加拉国",
                    "value": "050"
                },
                {
                    "label": "亚美尼亚",
                    "value": "051"
                },
                {
                    "label": "巴巴多斯",
                    "value": "052"
                },
                {
                    "label": "比利时",
                    "value": "056"
                },
                {
                    "label": "百慕大",
                    "value": "060"
                },
                {
                    "label": "不丹",
                    "value": "064"
                },
                {
                    "label": "玻利维亚",
                    "value": "068"
                },
                {
                    "label": "波黑",
                    "value": "070"
                },
                {
                    "label": "博茨瓦纳",
                    "value": "072"
                },
                {
                    "label": "布维岛",
                    "value": "074"
                },
                {
                    "label": "巴西",
                    "value": "076"
                },
                {
                    "label": "伯利兹",
                    "value": "084"
                },
                {
                    "label": "英属印度洋领地",
                    "value": "086"
                },
                {
                    "label": "所罗门群岛",
                    "value": "090"
                },
                {
                    "label": "英属维尔京群岛",
                    "value": "092"
                },
                {
                    "label": "文莱",
                    "value": "096"
                },
                {
                    "label": "保加利亚",
                    "value": "100"
                },
                {
                    "label": "缅甸",
                    "value": "104"
                },
                {
                    "label": "布隆迪",
                    "value": "108"
                },
                {
                    "label": "白俄罗斯",
                    "value": "112"
                },
                {
                    "label": "柬埔寨",
                    "value": "116"
                },
                {
                    "label": "喀麦隆",
                    "value": "120"
                },
                {
                    "label": "加拿大",
                    "value": "124"
                },
                {
                    "label": "佛得角",
                    "value": "132"
                },
                {
                    "label": "开曼群岛",
                    "value": "136"
                },
                {
                    "label": "中非",
                    "value": "140"
                },
                {
                    "label": "斯里兰卡",
                    "value": "144"
                },
                {
                    "label": "乍得",
                    "value": "148"
                },
                {
                    "label": "智利",
                    "value": "152"
                },
                {
                    "label": "台湾",
                    "value": "158"
                },
                {
                    "label": "圣诞岛",
                    "value": "162"
                },
                {
                    "label": "科科斯（基林）群岛",
                    "value": "166"
                },
                {
                    "label": "哥伦比亚",
                    "value": "170"
                },
                {
                    "label": "科摩罗",
                    "value": "174"
                },
                {
                    "label": "马约特",
                    "value": "175"
                },
                {
                    "label": "刚果（布）",
                    "value": "178"
                },
                {
                    "label": "刚果（金）",
                    "value": "180"
                },
                {
                    "label": "库克群岛",
                    "value": "184"
                },
                {
                    "label": "哥斯达黎加",
                    "value": "188"
                },
                {
                    "label": "克罗地亚",
                    "value": "191"
                },
                {
                    "label": "古巴",
                    "value": "192"
                },
                {
                    "label": "塞浦路斯",
                    "value": "196"
                },
                {
                    "label": "捷克",
                    "value": "203"
                },
                {
                    "label": "贝宁",
                    "value": "204"
                },
                {
                    "label": "丹麦",
                    "value": "208"
                },
                {
                    "label": "多米尼克",
                    "value": "212"
                },
                {
                    "label": "多米尼加",
                    "value": "214"
                },
                {
                    "label": "厄瓜多尔",
                    "value": "218"
                },
                {
                    "label": "萨尔瓦多",
                    "value": "222"
                },
                {
                    "label": "赤道几内亚",
                    "value": "226"
                },
                {
                    "label": "埃塞俄比亚",
                    "value": "231"
                },
                {
                    "label": "厄立特里亚",
                    "value": "232"
                },
                {
                    "label": "爱沙尼亚",
                    "value": "233"
                },
                {
                    "label": "法罗群岛",
                    "value": "234"
                },
                {
                    "label": "福克兰群岛（马尔维纳斯）",
                    "value": "238"
                },
                {
                    "label": "南乔治亚岛和南桑德维奇岛",
                    "value": "239"
                },
                {
                    "label": "斐济",
                    "value": "242"
                },
                {
                    "label": "芬兰",
                    "value": "246"
                },
                {
                    "label": "法国",
                    "value": "250"
                },
                {
                    "label": "法属圭亚那",
                    "value": "254"
                },
                {
                    "label": "法属伯利尼西亚",
                    "value": "258"
                },
                {
                    "label": "法属南部领地",
                    "value": "260"
                },
                {
                    "label": "吉布提",
                    "value": "262"
                },
                {
                    "label": "加蓬",
                    "value": "266"
                },
                {
                    "label": "格鲁吉亚",
                    "value": "268"
                },
                {
                    "label": "冈比亚",
                    "value": "270"
                },
                {
                    "label": "巴勒斯坦",
                    "value": "275"
                },
                {
                    "label": "德国",
                    "value": "276"
                },
                {
                    "label": "加纳",
                    "value": "288"
                },
                {
                    "label": "直布罗陀",
                    "value": "292"
                },
                {
                    "label": "基里巴斯",
                    "value": "296"
                },
                {
                    "label": "希腊",
                    "value": "300"
                },
                {
                    "label": "格陵兰",
                    "value": "304"
                },
                {
                    "label": "格林纳达",
                    "value": "308"
                },
                {
                    "label": "瓜德罗普",
                    "value": "312"
                },
                {
                    "label": "关岛",
                    "value": "316"
                },
                {
                    "label": "危地马拉",
                    "value": "320"
                },
                {
                    "label": "几内亚",
                    "value": "324"
                },
                {
                    "label": "圭亚那",
                    "value": "328"
                },
                {
                    "label": "海地",
                    "value": "332"
                },
                {
                    "label": "赫德岛和麦克唐纳岛",
                    "value": "334"
                },
                {
                    "label": "梵蒂冈",
                    "value": "336"
                },
                {
                    "label": "洪都拉斯",
                    "value": "340"
                },
                {
                    "label": "香港",
                    "value": "344"
                },
                {
                    "label": "匈牙利",
                    "value": "348"
                },
                {
                    "label": "冰岛",
                    "value": "352"
                },
                {
                    "label": "印度",
                    "value": "356"
                },
                {
                    "label": "印度尼西亚",
                    "value": "360"
                },
                {
                    "label": "伊朗",
                    "value": "364"
                },
                {
                    "label": "伊拉克",
                    "value": "368"
                },
                {
                    "label": "爱尔兰",
                    "value": "372"
                },
                {
                    "label": "以色列",
                    "value": "376"
                },
                {
                    "label": "意大利",
                    "value": "380"
                },
                {
                    "label": "科特迪瓦",
                    "value": "384"
                },
                {
                    "label": "牙买加",
                    "value": "388"
                },
                {
                    "label": "日本",
                    "value": "392"
                },
                {
                    "label": "哈萨克斯坦",
                    "value": "398"
                },
                {
                    "label": "约旦",
                    "value": "400"
                },
                {
                    "label": "肯尼亚",
                    "value": "404"
                },
                {
                    "label": "朝鲜",
                    "value": "408"
                },
                {
                    "label": "韩国",
                    "value": "410"
                },
                {
                    "label": "科威特",
                    "value": "414"
                },
                {
                    "label": "吉尔吉斯斯坦",
                    "value": "417"
                },
                {
                    "label": "老挝",
                    "value": "418"
                },
                {
                    "label": "黎巴嫩",
                    "value": "422"
                },
                {
                    "label": "莱索托",
                    "value": "426"
                },
                {
                    "label": "拉脱维亚",
                    "value": "428"
                },
                {
                    "label": "利比里亚",
                    "value": "430"
                },
                {
                    "label": "利比亚",
                    "value": "434"
                },
                {
                    "label": "列支敦士登",
                    "value": "438"
                },
                {
                    "label": "立陶宛",
                    "value": "440"
                },
                {
                    "label": "卢森堡",
                    "value": "442"
                },
                {
                    "label": "澳门",
                    "value": "446"
                },
                {
                    "label": "马达加斯加",
                    "value": "450"
                },
                {
                    "label": "马拉维",
                    "value": "454"
                },
                {
                    "label": "马来西亚",
                    "value": "458"
                },
                {
                    "label": "马尔代夫",
                    "value": "462"
                },
                {
                    "label": "马里",
                    "value": "466"
                },
                {
                    "label": "马耳他",
                    "value": "470"
                },
                {
                    "label": "马提尼克",
                    "value": "474"
                },
                {
                    "label": "毛里塔尼亚",
                    "value": "478"
                },
                {
                    "label": "毛里求斯",
                    "value": "480"
                },
                {
                    "label": "墨西哥",
                    "value": "484"
                },
                {
                    "label": "摩纳哥",
                    "value": "492"
                },
                {
                    "label": "蒙古",
                    "value": "496"
                },
                {
                    "label": "摩尔多瓦",
                    "value": "498"
                },
                {
                    "label": "蒙特塞拉特",
                    "value": "500"
                },
                {
                    "label": "摩洛哥",
                    "value": "504"
                },
                {
                    "label": "莫桑比克",
                    "value": "508"
                },
                {
                    "label": "阿曼",
                    "value": "512"
                },
                {
                    "label": "纳米比亚",
                    "value": "516"
                },
                {
                    "label": "瑙鲁",
                    "value": "520"
                },
                {
                    "label": "尼泊尔",
                    "value": "524"
                },
                {
                    "label": "荷兰",
                    "value": "528"
                },
                {
                    "label": "荷属安的列斯",
                    "value": "530"
                },
                {
                    "label": "阿鲁巴",
                    "value": "533"
                },
                {
                    "label": "新喀里多尼亚",
                    "value": "540"
                },
                {
                    "label": "瓦努阿图",
                    "value": "548"
                },
                {
                    "label": "新西兰",
                    "value": "554"
                },
                {
                    "label": "尼加拉瓜",
                    "value": "558"
                },
                {
                    "label": "尼日尔",
                    "value": "562"
                },
                {
                    "label": "尼日利亚",
                    "value": "566"
                },
                {
                    "label": "纽埃",
                    "value": "570"
                },
                {
                    "label": "诺福克岛",
                    "value": "574"
                },
                {
                    "label": "挪威",
                    "value": "578"
                },
                {
                    "label": "北马里亚纳",
                    "value": "580"
                },
                {
                    "label": "美国本土外小岛屿",
                    "value": "581"
                },
                {
                    "label": "密克罗尼西亚联邦",
                    "value": "583"
                },
                {
                    "label": "马绍尔群岛",
                    "value": "584"
                },
                {
                    "label": "帕劳",
                    "value": "585"
                },
                {
                    "label": "巴基斯坦",
                    "value": "586"
                },
                {
                    "label": "巴拿马",
                    "value": "591"
                },
                {
                    "label": "巴布亚新几内亚",
                    "value": "598"
                },
                {
                    "label": "巴拉圭",
                    "value": "600"
                },
                {
                    "label": "秘鲁",
                    "value": "604"
                },
                {
                    "label": "菲律宾",
                    "value": "608"
                },
                {
                    "label": "皮特凯恩",
                    "value": "612"
                },
                {
                    "label": "波兰",
                    "value": "616"
                },
                {
                    "label": "葡萄牙",
                    "value": "620"
                },
                {
                    "label": "几内亚比绍",
                    "value": "624"
                },
                {
                    "label": "东帝汶",
                    "value": "626"
                },
                {
                    "label": "波多黎各",
                    "value": "630"
                },
                {
                    "label": "卡塔尔",
                    "value": "634"
                },
                {
                    "label": "留尼汪",
                    "value": "638"
                },
                {
                    "label": "罗马尼亚",
                    "value": "642"
                },
                {
                    "label": "俄罗斯联邦",
                    "value": "643"
                },
                {
                    "label": "卢旺达",
                    "value": "646"
                },
                {
                    "label": "圣赫勒拿",
                    "value": "654"
                },
                {
                    "label": "圣基茨和尼维斯",
                    "value": "659"
                },
                {
                    "label": "安圭拉",
                    "value": "660"
                },
                {
                    "label": "圣卢西亚",
                    "value": "662"
                },
                {
                    "label": "圣皮埃尔和密克隆",
                    "value": "666"
                },
                {
                    "label": "圣文森特和格林纳丁斯",
                    "value": "670"
                },
                {
                    "label": "圣马力诺",
                    "value": "674"
                },
                {
                    "label": "圣多美和普林西比",
                    "value": "678"
                },
                {
                    "label": "沙特阿拉伯",
                    "value": "682"
                },
                {
                    "label": "塞内加尔",
                    "value": "686"
                },
                {
                    "label": "塞舌尔",
                    "value": "690"
                },
                {
                    "label": "塞拉利昂",
                    "value": "694"
                },
                {
                    "label": "新加坡",
                    "value": "702"
                },
                {
                    "label": "斯洛伐克",
                    "value": "703"
                },
                {
                    "label": "越南",
                    "value": "704"
                },
                {
                    "label": "斯洛文尼亚",
                    "value": "705"
                },
                {
                    "label": "索马里",
                    "value": "706"
                },
                {
                    "label": "南非",
                    "value": "710"
                },
                {
                    "label": "津巴布韦",
                    "value": "716"
                },
                {
                    "label": "西班牙",
                    "value": "724"
                },
                {
                    "label": "西撒哈拉",
                    "value": "732"
                },
                {
                    "label": "苏丹",
                    "value": "736"
                },
                {
                    "label": "苏里南",
                    "value": "740"
                },
                {
                    "label": "斯瓦尔巴岛和养马延岛",
                    "value": "744"
                },
                {
                    "label": "斯威士兰",
                    "value": "748"
                },
                {
                    "label": "瑞典",
                    "value": "752"
                },
                {
                    "label": "瑞士",
                    "value": "756"
                },
                {
                    "label": "叙利亚",
                    "value": "760"
                },
                {
                    "label": "塔吉克斯坦",
                    "value": "762"
                },
                {
                    "label": "泰国",
                    "value": "764"
                },
                {
                    "label": "多哥",
                    "value": "768"
                },
                {
                    "label": "托克劳",
                    "value": "772"
                },
                {
                    "label": "汤加",
                    "value": "776"
                },
                {
                    "label": "特立尼达和多巴哥",
                    "value": "780"
                },
                {
                    "label": "阿联酋",
                    "value": "784"
                },
                {
                    "label": "突尼斯",
                    "value": "788"
                },
                {
                    "label": "土耳其",
                    "value": "792"
                },
                {
                    "label": "土库曼斯坦",
                    "value": "795"
                },
                {
                    "label": "特克斯和凯克斯群岛",
                    "value": "796"
                },
                {
                    "label": "图瓦卢",
                    "value": "798"
                },
                {
                    "label": "乌干达",
                    "value": "800"
                },
                {
                    "label": "乌克兰",
                    "value": "804"
                },
                {
                    "label": "前南马其顿",
                    "value": "807"
                },
                {
                    "label": "埃及",
                    "value": "818"
                },
                {
                    "label": "英国",
                    "value": "826"
                },
                {
                    "label": "坦桑尼亚",
                    "value": "834"
                },
                {
                    "label": "美国",
                    "value": "840"
                },
                {
                    "label": "美属维尔京群岛",
                    "value": "850"
                },
                {
                    "label": "布基纳法索",
                    "value": "854"
                },
                {
                    "label": "乌拉圭",
                    "value": "858"
                },
                {
                    "label": "乌兹别克斯坦",
                    "value": "860"
                },
                {
                    "label": "委内瑞拉",
                    "value": "862"
                },
                {
                    "label": "瓦利斯和富图纳",
                    "value": "876"
                },
                {
                    "label": "萨摩亚",
                    "value": "882"
                },
                {
                    "label": "也门",
                    "value": "887"
                },
                {
                    "label": "南斯拉夫",
                    "value": "891"
                },
                {
                    "label": "赞比亚",
                    "value": "894"
                },
                {
                    "label": "其他国家和地区",
                    "value": "999"
                }
            ],
            provTypeArr:[
                {
                    "label": "上海市",
                    "value": "310"
                },
                {
                    "label": "江苏省",
                    "value": "320"
                },
                {
                    "label": "浙江省",
                    "value": "330"
                },
                {
                    "label": "北京市",
                    "value": "110"
                },
                {
                    "label": "天津市",
                    "value": "120"
                },
                {
                    "label": "河北省",
                    "value": "130"
                },
                {
                    "label": "山西省",
                    "value": "140"
                },
                {
                    "label": "内蒙古自治区",
                    "value": "150"
                },
                {
                    "label": "辽宁省",
                    "value": "210"
                },
                {
                    "label": "吉林省",
                    "value": "220"
                },
                {
                    "label": "黑龙江省",
                    "value": "230"
                },
                {
                    "label": "安徽省",
                    "value": "340"
                },
                {
                    "label": "福建省",
                    "value": "350"
                },
                {
                    "label": "江西省",
                    "value": "360"
                },
                {
                    "label": "山东省",
                    "value": "370"
                },
                {
                    "label": "河南省",
                    "value": "410"
                },
                {
                    "label": "湖北省",
                    "value": "420"
                },
                {
                    "label": "湖南省",
                    "value": "430"
                },
                {
                    "label": "广东省",
                    "value": "440"
                },
                {
                    "label": "广西壮族自治区",
                    "value": "450"
                },
                {
                    "label": "海南省",
                    "value": "460"
                },
                {
                    "label": "重庆市",
                    "value": "500"
                },
                {
                    "label": "四川省",
                    "value": "510"
                },
                {
                    "label": "贵州省",
                    "value": "520"
                },
                {
                    "label": "云南省",
                    "value": "530"
                },
                {
                    "label": "西藏自治区",
                    "value": "540"
                },
                {
                    "label": "陕西省",
                    "value": "610"
                },
                {
                    "label": "甘肃省",
                    "value": "620"
                },
                {
                    "label": "青海省",
                    "value": "630"
                },
                {
                    "label": "宁夏回族自治区",
                    "value": "640"
                },
                {
                    "label": "新疆维吾尔自治区",
                    "value": "650"
                },
                {
                    "label": "台湾省",
                    "value": "710"
                },
                {
                    "label": "香港特别行政区",
                    "value": "810"
                },
                {
                    "label": "澳门特别行政区",
                    "value": "820"
                }
            ]
        }
    }])
