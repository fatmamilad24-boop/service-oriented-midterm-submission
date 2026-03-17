const router = require('express').Router();
const { createDelivery, getDeliveries } = require('../controllers/deliveryController');

router.post('/', createDelivery);
router.get('/', getDeliveries);

module.exports = router;

