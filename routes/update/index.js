const router = require("express").Router();
const controller = require("../../controllers/update");

router.post('/new_or_used',controller.new_or_used);
router.post('/remarks',controller.remarks);
router.post('/quantity',controller.quantity);

module.exports = router;