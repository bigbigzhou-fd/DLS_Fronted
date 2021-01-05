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
    .service("providerService",function($resource,dlsAPI){
        var api = dlsAPI.packApi("/sup/:detail");
        return $resource(api,{detail:"@detail"});
    })
    .service("accountService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/rpt/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("userService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/acc/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("settlementService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/stt/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("clearingService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/acc/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("logService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/stt/log/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("workOrderService", function(dlsAPI, $resource){
        var api = dlsAPI.packApi("/mall/job/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("accService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/account/:detail")
        return $resource(api,{detail:"@detail"});
    })
    .service("demandService",function(dlsAPI,$resource){
        var api = "/rps/req/:detail";
        return $resource(api,{detail:"@detail"});
    })
    .service("tagMAlgCatService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/sys/tagM/algCat/:detail")        
        return $resource(api,{detail:"@detail"});
    })
    .service("supTradeService",function(dlsAPI,$resource){
        var api = dlsAPI.packApi("/sup/trade/:detail")        
        return $resource(api,{detail:"@detail"});
    })







