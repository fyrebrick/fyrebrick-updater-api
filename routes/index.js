const router = require('express').Router();
const controllers = {
    all : require('../controllers/all'),
    inventory : require('../controllers/inventory'),
    ordersAll : require('../controllers/ordersAll'),
    ordersNew : require('../controllers/ordersNew'),
};
const routes = {
    update : require('../routes/update'),
}
router.post('/all',controllers.all);
router.post('/orders/all',controllers.ordersAll);
router.post('/orders/new',controllers.ordersNew);
router.post('/inventory',controllers.inventory);
router.use('/update',routes.update);
module.exports = router;