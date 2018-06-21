let express = require('express');
let router = express.Router();
// Require controller module
var order_controller = require('../controllers/orderController');

//ORDER ROUTE ///
router.get('/salesman/order', order_controller.list_order);

router.get('/salesman/order/:id', order_controller.show_order_detail);

router.get('/salesman/order/add', order_controller.create_order);

router.post('salesman/order/save', order_controller.order_save);

router.get('/salesman/order/edit/:id', order_controller.edit_order);

router.post('/salesman/order/update/:id', order_controller.update_order);

router.post('/salesman/order/detele/:id', order_controller.delete_order);

module.exports = router;