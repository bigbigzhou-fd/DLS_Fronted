//mockAPI.js

var fs = require('fs');
var path = require('path');

var mockbase = path.join(__dirname, 'app/data');

var mockApi = function(res, pathname, paramObj, next) {

    var pattern=new RegExp('api/');
    pathname=pathname.replace(/%2F/g, "/");
    if (pattern.test(pathname)) {
        switch (pathname) {

            case '/api/':
                var data = fs.readFileSync(path.join(mockbase, 'csrfToken.json'), 'utf-8');
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8"
                });
                res.write(data);
                res.end();
                return ;

            case '/api/user_login/':
                var data = fs.readFileSync(path.join(mockbase, 'user_login.json'), 'utf-8');
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8"
                });
                res.write(data);
                res.end();
                return ;

            case '/api/mall':
                var data = fs.readFileSync(path.join(mockbase, 'mall.json'), 'utf-8');
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8"
                });
                res.write(data);
                res.end();
                return ;

            case '/api/mall/category/list':
                var data = fs.readFileSync(path.join(mockbase, 'mall_category_list.json'), 'utf-8');
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8"
                });
                res.write(data);
                res.end();
                return ;

                case '/api/mall/cart/listCart':
                var data = fs.readFileSync(path.join(mockbase, 'cart_listCart.json'), 'utf-8');
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8"
                });
                res.write(data);
                res.end();
                return ;

                case '/api/mall/order/list/dataTable':
                var data = fs.readFileSync(path.join(mockbase, 'mall_order_list.json'), 'utf-8');
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8"
                });
                res.write(data);
                res.end();
                return ;

                case '/api/stt/sett/list/user':
                var data = fs.readFileSync(path.join(mockbase, 'sett_list_user.json'), 'utf-8');
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8"
                });
                res.write(data);
                res.end();
                return ;

                case '/api/stt/sett/dataTable/user':
                var data = fs.readFileSync(path.join(mockbase, 'sett_dataTable_user.json'), 'utf-8');
                res.writeHead(200,{
                    "Content-type":"application/json;charset=UTF-8"
                });
                res.write(data);
                res.end();
                return ;





            default:
                ;
        }
    }
    next();
};

module.exports = mockApi;