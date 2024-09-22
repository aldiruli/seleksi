const productRoute = require('./product.route');
const orderRoute = require('./order.route');

module.exports = function(app,urlApi){
    app.use(urlApi,productRoute);

    app.use(urlApi,orderRoute);
}