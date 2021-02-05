const router = require('express').Router();
const removeAllDuplicates = require('fyrebrick-helper').helpers.removeAllDuplicates;
const controllers = {
    all : require('../controllers/all'),
    inventory : require('../controllers/inventory'),
    ordersAll : require('../controllers/ordersAll'),
    ordersNew : require('../controllers/ordersNew'),
    order: require('../controllers/order'),
};
const routes = {
    update : require('../routes/update'),
}
router.post('/all',controllers.all);
router.post('/order/:order_id',controllers.order);
router.post('/orders/all',controllers.ordersAll);
router.post('/orders/new',controllers.ordersNew);
router.post('/inventory',controllers.inventory);
router.use('/update',routes.update);
router.post('/orders/removeDuplicates',async (req,res,nex)=>{
    await removeAllDuplicates(req.body.CONSUMER_KEY);
    res.send(req.body.CONSUMER_KEY);
});
module.exports = router;