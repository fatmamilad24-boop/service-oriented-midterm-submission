const Delivery = require('../models/Delivery');

exports.createDelivery = async (req, res) => {
    const delivery = await Delivery.create(req.body);
    res.json(delivery);
};

exports.getDeliveries = async (req, res) => {
    const deliveries = await Delivery.find();
    res.json(deliveries);
};