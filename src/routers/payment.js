const express = require('express');
const { userAuth } = require('../middleware/auth');
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require('../utils/constants');
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {
        const { membershipType } = req.body;
        const { firstName, lastName } = req.user;

        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType], // Ensure the amount is in paise
            currency: "INR",
            receipt: "receipt#1",
            partial_payment: false,
            notes: {
                firstName,
                lastName,
                membershipType,
            },
        });

        console.log(order.notes); // Debugging step

        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: {
                firstName: order.notes.firstName,
                lastName: order.notes.lastName,
                membershipType: order.notes.membershipType,
            },
        });

        console.log(payment); // Debugging step

        const savedPayment = await payment.save();

        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message });
    }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        const paymentDetail = req.body.payload.payment.entity;
        const payment = await Payment.findOne({ orderId: paymentDetail.order_id });
        payment.status = paymentDetail.status;
        await payment.save();

        const user = await User.findOne({ _id: payment.userId });
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();
        return res.send(200).json({ msg: "webhook received successfully" });

    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = paymentRouter;