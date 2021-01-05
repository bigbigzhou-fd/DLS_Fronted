/**
 * Created by oxygen on 2017/4/11.
 */
angular.module('myApp.services', [])
    .service("transferData", function () {
        return {
            proCsv: {}
        }
    })
    .service("dls_list_service", function ($http) {
        return {
            trade_scenario_btn_datas: [{       //trade_mall.html
                name: "营销类数据",
                value: "03",
                action: "1",
            }, {
                name: "征信类数据",
                value: "02",
                action: "2",
            }
                // ,{
                //     name:"智慧城市",
                //     value:"04",
                //     action:"3",
                // }
            ],
            trade_type_btn_datas: [{        //trade_mall.html
                name: "通用",
                value: "",
                action: "1"
            }, {
                name: "汽车",
                value: "汽车",
                action: "2"
            }, {
                name: "母婴",
                value: "母婴",
                action: "3"
            }, {
                name: "金融",
                value: "金融",
                action: "4"
            }],
            trade_mall_sets_grid: {
                id: "tradeMallSetsGrid",
                widths: [{
                    displayName: '版本号',
                    width: '80px',
                }, {
                    displayName: '互联对象套餐',
                    width: '160px',
                }, {
                    displayName: '数据供方机构',
                    width: '200px',
                }, {
                    displayName: '数据供方部门',
                    width: '120px',
                }, {
                    displayName: '计价单位',
                    width: '100px',
                }, {
                    displayName: '操作',
                    width: '120px',
                }],
                columnDefs: [{
                    field: 'connSetVer',
                    displayName: '版本号',
                    width: '60px',
                }, {
                    field: 'setName',
                    displayName: '互联对象套餐',
                    width: '120px',
                }, {
                    field: 'supMemName',
                    displayName: '数据供方机构',
                    width: '200px',
                }, {
                    field: 'supMemDept',
                    displayName: '数据供方部门',
                    width: '120px',
                }, {
                    field: 'price_mode',
                    displayName: '计价单位',
                    width: '100px',
                }, {
                    field: 'price',
                    displayName: '价格(元)',
                    width: '100px',
                }],
            },
            dls_operation_btn_datas: [{          //trade.html
                "style": "iconfont icon-website",
                "name": "数据供方平台123",
                "contents": [{
                    "name": "数据单品管理",
                    "action": "dls.provider.itemManage.item",
                    "permission": '29'
                },
                    //    {
                    //    "name":"数据套餐管理",
                    //    "action":"dls.provider.itemManage.set",
                    //    "permission": '38'
                    //    },
                    {
                        "name": "数据来源资质证明管理",
                        "action": "dls.provider.dataOrigin",
                        "permission": '42'
                    }]
            },{ 
                "style": "iconfont icon-website",
                "name": "任务中心",
                "contents": [{
                    "name": "任务管理",
                    // edit by zhou 2021/1/4
                    "action": "dls.task",
                    "permission": '29'
                }]
            },{ 
                "style": "iconfont icon-website",
                "name": "算法模型供方平台",
                "contents": [{
                    "name": "算法模型单品管理",
                    "action": "dls.algorithm.itemManage.item",
                    "permission": '29'
                }]
            },{
                "style": "iconfont icon-chart1",
                "name": "交易撮合1234",
                "contents": [{
                    "name": "交易大厅",
                    "action": "dls.trade.mall.goodsCategory",
                    "permission": '44'
                }, {
                    "name": "购物车",
                    "action": "dls.trade.cartList",
                    "permission": '46'
                }
                    //    ,{
                    //    "name":"供方确认",
                    //    "action":"dls.trade.providerConfirm",
                    //    "permission": '48'
                    //},{
                    //    "name":"订单列表",
                    //    "action":"dls.trade.orderList",
                    //    "permission": '50'
                    //}
                ]
            }, {
                "style": "iconfont icon-manage",
                "name": "订单管理",
                "contents": [{
                    "name": "订单列表（需方）",
                    "action": "dls.trade.demOrder",
                    "permission": '50'
                }, {
                    "name": "订单列表（供方）",
                    "action": "dls.trade.supOrder",
                    "permission": '50'
                }]
            }, {
                "style": "iconfont icon-dataApplication",
                "name": "订单确认",
                "contents": [{
                    "name": "需方确认",
                    "action": "dls.trade.demConfirm",
                    "permission": '50'
                }, {
                    "name": "供方确认",
                    "action": "dls.trade.supConfirm",
                    "permission": '50'
                }]
            }, {
                "style": "iconfont icon-report",
                "name": "我的账户",
                "contents": [{
                    "name": "我的账户",
                    "action": "dls.account.myAccount",
                    "permission": '101'
                }, {
                    "name": "交易明细",
                    "action": "dls.account.tradeDetail",
                    "permission": '104'
                }, {
                    "name": "冻结记录",
                    "action": "dls.account.freezeList",
                    "permission": '105'
                }]
            }, {
                "style": "iconfont icon-report",
                "name": "账户管理",
                "contents": [{
                    "name": "额度查询",
                    "action": "dls.account.quota",
                    "permission": '58'
                }, {
                    "name": "清算",
                    "action": "dls.account.clearing",
                    "permission": '61'
                }]
            }
                // ,{
                //     "style": "glyphicon glyphicon-check",
                //     "name": "结算",
                //     "contents": [{
                //         "name":"结算汇总",
                //         "action":"dls.settlement.summary",
                //         "permission": '99'
                //     }]
                // }
                //, {
                //    "style": "iconfont icon-manage",
                //    "name": "需求管理",
                //    "contents": [{
                //        "name": "需求发布",
                //        "action": "dls.demPublish.demPublish",
                //        "permission": '95'
                //    },{
                //        "name": "需求管理",
                //        "action": "dls.demPublish.demManage",
                //        "permission": '95'
                //    }]
                //}
                , {
                    "style": "iconfont icon-customReport",
                    "name": "业务日志",
                    "contents": [{
                        "name": "营销类业务日志查询(需方)",
                        "action": "dls.log.capDemLog",
                        "permission": '95'
                    }, {
                        "name": "营销类业务日志查询(供方)",
                        "action": "dls.log.capSharedSupLog",
                        "permission": '95'
                    }
                        //    ,{
                        //    "name":"CAP业务日志查询(买断供方)",
                        //    "action":"dls.log.capBuyoutSupLog",
                        //    "permission": '95'
                        //}
                        , {
                            "name": "征信类业务日志查询(需方)",
                            "action": "dls.log.dmixDemLog",
                            "permission": '97'
                        }, {
                            "name": "征信类业务日志查询(供方)",
                            "action": "dls.log.dmixSupLog",
                            "permission": '97'
                        }, {
                            "name": "其他业务日志查询(需方)",
                            "action": "dls.log.stdDemLog",
                            "permission": '96'
                        }, {
                            "name": "其他业务日志查询(供方)",
                            "action": "dls.log.stdSupLog",
                            "permission": '96'
                        }]
                }, {
                    "style": "iconfont icon-ordermanage",
                    "name": "工单管理",
                    "contents": [{
                        "name": "工单管理(需方)",
                        "action": "dls.workOrder.demList",
                        "permission": '50'
                    }, {
                        "name": "工单管理(供方)",
                        "action": "dls.workOrder.supList",
                        "permission": '50'
                    }]
                },{
                    "style":"iconfont icon-ordermanage",
                    "name":"需求发布",
                    "contents":[{
                        "name":"需求大厅",
                        "action":"dls.demand.hall",
                        "permission": '119'
                    },{
                        "name":"需求管理",
                        "action":"dls.demPublish.demManage",
                        "permission": '120'
                    }]
                },{
                    "style":"iconfont icon-ordermanage",
                    "name":"定制服务",
                    "contents":[{
                        "name":"定制交易大厅",
                        "action":"dls.customizedViews.hall",
                        "permission": '119'
                    },{
                        "name":"发布需求及供给管理",
                        "action":"dls.customizedViews.demManage",
                        "permission": '120'
                    }
                    // ,{
                    //     "name":"验收管理",
                    //     "action":"dls.customizedViews.acceptanceCheck",
                    //     "permission": '120'
                    // }
                ]
                }],
            providerOriginDataGrid: {
                id: "providerDataOriginGrid",
                widths: [{
                    displayName: "序号",
                    width: "60",
                }, {
                    displayName: '文件编号',
                    width: "180",
                }, {
                    displayName: '文件名称',
                    width: "180"
                }, {
                    displayName: '上传日期',
                    width: "220"
                }, {
                    displayName: '上传人员',
                    width: "180"
                }, {
                    displayName: '操作',
                    width: "100"
                }],
                columnDefs: [{
                    field: 'code',
                    displayName: '文件编号',
                    width: "180",
                }, {
                    field: 'name',
                    displayName: '文件名称',
                    width: "180"
                }, {
                    field: 'ctime',
                    displayName: '上传日期',
                    width: "220"
                }, {
                    field: 'username',
                    displayName: '上传人员',
                    width: "180"
                }],
            },
            providerItemGrid: {
                id: "providerItemManageGrid", //必须
                widths: [{
                    displayName: '序号',
                    width: '50px'
                }, {
                    displayName: '互联对象编号',
                    width: "140px",
                }, {
                    displayName: '互联对象名称',
                    width: "150px"
                }, {
                    displayName: '版本号',
                    width: "60px"
                }, {
                    displayName: '标签名称',
                    width: "150px"
                }, {
                    displayName: '标签赋值类型',
                    width: "100px"
                }, {
                    displayName: '计价单位',
                    width: "100px"
                }, {
                    displayName: '价格（元）',
                    width: "100px"
                }, {
                    displayName: '状态',
                    width: "100px"
                }, {
                    displayName: '操作',
                    width: "140px"
                }],
                columnDefs: [{
                    field: 'connObjId',
                    displayName: '互联对象编号',
                    width: "140px",
                }, {
                    field: 'prdtName',
                    displayName: '互联对象名称',
                    width: "150px"
                }, {
                    field: 'connObjVer',
                    displayName: '版本号',
                    width: "60px"
                }, {
                    field: 'tagName',
                    displayName: '标签名称',
                    width: "150px"
                }, {
                    field: 'tagValueTypeDisplay',
                    displayName: '标签赋值类型',
                    width: "100px"
                }, {
                    field: 'valuationModeCdDisplay',
                    displayName: '计价单位',
                    width: "100px"
                }, {
                    field: 'valuationPrice',
                    displayName: '价格（元）',
                    width: "100px"
                }],
                //exporterOlderExcelCompatibility: true,    //ui-grid解决中文乱码
                exporterCsvFilename: 'tradeItemList.csv',
                exporterSuppressColumns: [0, 8, 9] //不必导出的columns
            },
            providerSetGrid: {
                id: "providerSetManageGrid", //必须
                widths: [{
                    displayName: '互联对象编号',
                    width: "140",
                }, {
                    displayName: '版本号',
                    width: "60"
                }, {
                    displayName: '套餐名称',
                    width: "150"
                }, {
                    displayName: '计价单位',
                    width: "100"
                }, {
                    displayName: '价格（元）',
                    width: "100"
                }, {
                    displayName: '状态',
                    width: "100"
                }, {
                    displayName: '操作',
                    width: "140"
                }],
                columnDefs: [{
                    field: 'connSetVer',
                    displayName: '版本号',
                    width: "60"
                }, {
                    field: 'setName',
                    displayName: '套餐名称',
                    width: "150"
                }, {
                    field: 'valuationModeCdDispaly',
                    displayName: '计价单位',
                    width: "100"
                }, {
                    field: 'valuationPrice',
                    displayName: '价格（元）',
                    width: "100"
                }],
                //exporterOlderExcelCompatibility: true,    //ui-grid解决中文乱码
                exporterCsvFilename: 'tradeSetList.csv',
                exporterSuppressColumns: [5, 6] //不必导出的columns
            },
            tradeProviderConfirmGrid: {
                columnDefs: [{
                    field: 'connObjNo',
                    displayName: '流通对象编号',
                }, {
                    field: 'connObjCatDisplay',
                    displayName: '类型',
                }, {
                    field: 'prdtName',
                    displayName: '互联对象名称',
                }, {
                    field: 'connObjVer',
                    displayName: '版本号',
                }, {
                    field: 'valuationModeCd_display',
                    displayName: '计价方式',
                }, {
                    field: 'expectPrice',
                    displayName: '价格（元）',
                }]
            },
            logDemGrid: {
                columnDefs: [{
                    field: 'date',
                    displayName: '日期',
                }, {
                    field: 'orderId',
                    displayName: '订单编号',
                }, {
                    field: 'orderName',
                    displayName: '订单名称',
                }, {
                    field: 'demBuyNum',
                    displayName: '买入数量（次）',
                }, {
                    field: 'demBuyNumTot',
                    displayName: '累计买入数量（次）',
                }]
            },
            logSupGrid: {
                columnDefs: [{
                    field: 'date',
                    displayName: '日期',
                }, {
                    field: 'orderId',
                    displayName: '订单编号',
                }, {
                    field: 'orderName',
                    displayName: '订单名称',
                }, {
                    field: 'supSoldNum',
                    displayName: '卖出数量（次）',
                }, {
                    field: 'supSoldNumTot',
                    displayName: '累计卖出数量（次）',
                }]
            },
            logSharedSupGrid: {
                columnDefs: [{
                    field: 'date',
                    displayName: '日期',
                }, {
                    field: 'orderId',
                    displayName: '订单编号',
                }, {
                    field: 'demMemId',
                    displayName: '需方编号',
                }, {
                    field: 'demMemName',
                    displayName: '需方机构名称',
                }, {
                    field: 'orderName',
                    displayName: '订单名称',
                }, {
                    field: 'supSoldNum',
                    displayName: '卖出数量（次）',
                }, {
                    field: 'supSoldNumTot',
                    displayName: '累计卖出数量（次）',
                }]
            },
            logbuyoutSupGrid: {
                columnDefs: [{
                    field: 'statDate',
                    displayName: '日期',
                }, {
                    field: 'prdtIdCd',
                    displayName: '交易品编号',
                }, {
                    field: 'prdtName',
                    displayName: '交易品名称',
                }, {
                    field: 'ConnObjId',
                    displayName: '互联对象编号',
                }, {
                    field: 'ConnObjName',
                    displayName: '互联对象名称',
                }, {
                    field: 'soldNum',
                    displayName: '卖出数量（次）',
                }, {
                    field: 'soldNumTot',
                    displayName: '累计卖出数量（次）',
                }]
            },
            logDemDetailGrid: {
                columnDefs: [{
                    field: 'prdtIdCd',
                    displayName: '交易品编号',
                }, {
                    field: 'name',
                    displayName: '交易品名称',
                }, {
                    field: 'connObjId',
                    displayName: '互联对象编号',
                }, {
                    field: 'prdtName',
                    displayName: '互联对象名称',
                }, {
                    field: 'supMemName',
                    displayName: '供方机构名称',
                }, {
                    field: 'supDeptName',
                    displayName: '供方部门名称',
                }, {
                    field: 'demBuyNum',
                    displayName: '买入数量（次）',
                }, {
                    field: 'demBuyNumTot',
                    displayName: '累计买入数量（次）',
                }]
            },
            logSupDetailGrid: {
                columnDefs: [{
                    field: 'prdtIdCd',
                    displayName: '交易品编号',
                }, {
                    field: 'name',
                    displayName: '交易品名称',
                }, {
                    field: 'connObjId',
                    displayName: '互联对象编号',
                }, {
                    field: 'prdtName',
                    displayName: '互联对象名称',
                }, {
                    field: 'demMemName',
                    displayName: '需方机构名称',
                }, {
                    field: 'demDeptName',
                    displayName: '需方部门名称',
                }, {
                    field: 'supSoldNum',
                    displayName: '卖出数量（次）',
                }, {
                    field: 'supSoldNumTot',
                    displayName: '累计买出数量（次）',
                }]
            },

        };

    })
    .service("dls_datas", function () {                  //放置从远端获取的数据
        return {
            test: {                                    //showData所需的json
                sum: 20,
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
            testDatas: {
                quotaTitles: ["序号", "更新时间", "额度调整类型", "金额", "剩余额度", "操作账户"],
                quotaDatas: [{
                    "number": "1",
                    "update": "2016-11-25 10:14:36",
                    "adjustType": "充值",
                    "amount": "1000.00",
                    "amountLeft": "3004.32",
                    "account": "0000079_adm"
                }, {
                    "number": "1",
                    "update": "2016-11-25 10:14:36",
                    "adjustType": "充值",
                    "amount": "-2000.00",
                    "amountLeft": "3004.32",
                    "account": "0000079_adm"
                }
                ]
            }
        };
    })
    .service("memberAuditServ", function () {
        return {
            auditState: [{
                label: '全部', value: '0'
            }, {
                label: '待审核', value: '1'
            }, {
                label: '通过审核', value: '2'
            }, {
                label: '退回修改', value: '3'
            }, {
                label: '已拒绝', value: '4'
            }],

            auditGridOptions: {
                columnDefs: [{
                    field: 'sequence',
                    displayName: '序号',
                    width: "80",
                }, {
                    field: 'applyNo',
                    displayName: '申请编号',
                    width: "180"
                }, {
                    field: 'orgFullNameCN',
                    displayName: '申请企业/组织',
                    width: "220"
                }, {
                    field: 'deptName',
                    displayName: '部门/机关',
                    width: "180"
                }, {
                    field: 'applyName',
                    displayName: '申请人',
                    width: "220"
                }, {
                    field: 'applyProgCd',
                    displayName: '审核状态',
                    width: "180"
                }, {
                    field: 'openAcctStatCd',
                    displayName: '审核操作',
                    width: "220"
                }, {
                    field: 'openAccount',
                    displayName: '开户操作',
                    width: "180"
                }]
            }
        }
    })
    .factory('Excel', function ($window) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) {
                return $window.btoa(unescape(encodeURIComponent(s)));
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                })
            };
        return {
            tableToExcel: function (tableId, worksheetName) {
                var table = $(tableId),
                    ctx = {worksheet: worksheetName, table: table.html()},
                    href = uri + base64(format(template, ctx));
                return href;
            }
        };
    });
