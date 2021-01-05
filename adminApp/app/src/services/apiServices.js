/**
 * Created by oxygen on 2017/4/21.
 */
angular.module('myApp.apiServices', [
    "ngResource"
])
    .service("logInService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/:detail")
        return $resource(api,{detail:"@detail"})
    })
    .service("userService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/acc/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("auditService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/acc/review/reg/?applyNo=:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("memberApplyService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/acc/apply/memApplyView/")
        return $resource(api);
    })
    .service("adminService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/sys/:detail")
        return $resource(api,{detail:"@detail"},{
            'update': {
                method: 'PUT'
            }
        });
    })
    .service("analysisService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/stt/:detail")
        return $resource(api,{detail:"@detail"});
    })
    // .service("quotaService",function(dlsAPI,$resource){
    //     var api = dlsAPI.packApi("/sys/:detail")
    //     return $resource(api,{detail:"@detail"});
    // })
    .service("memberService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/mall/order/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("providerService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/sup/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("settlementService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/stt/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("prdtAccountService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/acc/prdtAccount/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("signManageService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/acc/sign/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("accountManageService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/acc/limit/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("demandService",function(dlsRPS,$resource){
        var api = dlsRPS.packRps("/req/:detail")
        return $resource(api,{detail:"@detail"})
    })
    .service("tradeMallService",function(dlsAPI,$resource,$rootScope){
        var api = dlsAPI.packApi("/mall/:detail");
        return $resource(api,{detail:"@detail"},{
            save: {
                method: 'POST',
                cache:true,
                transformResponse: function (response) {
                  var resp = JSON.parse(response);
                  return {
                    data: resp.data,
                    msg:resp.msg,
                    status:resp.status
                  }
                }
            }
        });
    })
    .service("tagMAlgCatService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/sys/tagM/algCat/:detail")        
        return $resource(api,{detail:"@detail"});
    })
    .service("tagMAlgTagService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/sys/tagM/algTag/:detail")        
        return $resource(api,{detail:"@detail"});
    })
    .service("supTradeService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/sup/trade/:detail")
        return $resource(api,{detail:"@detail"});
    })







