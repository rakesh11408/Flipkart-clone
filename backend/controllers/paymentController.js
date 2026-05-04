const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paytm = require('paytmchecksum');
const Razorpay = require('razorpay');
const https = require('https');
const Payment = require('../models/paymentModel');
const ErrorHandler = require('../utils/errorHandler');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// Stripe Payment Intent
exports.createStripePaymentIntent = asyncErrorHandler(async (req, res, next) => {
    const { amount, currency = "inr" } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
            currency,
            metadata: {
                company: "Flipkart",
            },
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Confirm Stripe Payment
exports.confirmStripePayment = asyncErrorHandler(async (req, res, next) => {
    const { payment_intent_id, payment_method_id } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(payment_intent_id, {
            payment_method: payment_method_id,
        });

        if (paymentIntent.status === 'succeeded') {
            // Save payment to database
            await Payment.create({
                stripePaymentIntentId: paymentIntent.id,
                stripePaymentMethodId: payment_method_id,
                status: 'SUCCESS',
                orderId: paymentIntent.id,
                txnId: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                resultInfo: {
                    resultStatus: 'TXN_SUCCESS',
                    resultCode: '01',
                    resultMsg: 'Payment successful via Stripe'
                }
            });

            res.status(200).json({
                success: true,
                message: "Payment confirmed successfully",
                payment_intent: paymentIntent,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment confirmation failed",
                status: paymentIntent.status,
            });
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get Stripe Publishable Key
exports.getStripePublishableKey = asyncErrorHandler(async (req, res, next) => {
    res.status(200).json({ 
        success: true,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
    });
});

// Process Payment
exports.processPayment = asyncErrorHandler(async (req, res, next) => {

    const { amount, email, phoneNo } = req.body;

    var params = {};

    /* initialize an array */
    params["MID"] = process.env.PAYTM_MID;
    params["WEBSITE"] = process.env.PAYTM_WEBSITE;
    params["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
    params["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE;
    params["ORDER_ID"] = "oid" + uuidv4();
    params["CUST_ID"] = process.env.PAYTM_CUST_ID;
    params["TXN_AMOUNT"] = JSON.stringify(amount);
    // params["CALLBACK_URL"] = `${req.protocol}://${req.get("host")}/api/v1/callback`;
    params["CALLBACK_URL"] = `https://${req.get("host")}/api/v1/callback`;
    params["EMAIL"] = email;
    params["MOBILE_NO"] = phoneNo;

    let paytmChecksum = paytm.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);
    paytmChecksum.then(function (checksum) {

        let paytmParams = {
            ...params,
            "CHECKSUMHASH": checksum,
        };

        res.status(200).json({
            paytmParams
        });

    }).catch(function (error) {
        console.log(error);
    });
});

// Paytm Callback
exports.paytmResponse = (req, res, next) => {

    // console.log(req.body);

    let paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;

    let isVerifySignature = paytm.verifySignature(req.body, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);
    if (isVerifySignature) {
        // console.log("Checksum Matched");

        var paytmParams = {};

        paytmParams.body = {
            "mid": req.body.MID,
            "orderId": req.body.ORDERID,
        };

        paytm.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function (checksum) {

            paytmParams.head = {
                "signature": checksum
            };

            /* prepare JSON string for request */
            var post_data = JSON.stringify(paytmParams);

            var options = {
                /* for Staging */
                hostname: 'securegw-stage.paytm.in',
                /* for Production */
                // hostname: 'securegw.paytm.in',
                port: 443,
                path: '/v3/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            // Set up the request
            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function () {
                    let { body } = JSON.parse(response);
                    // let status = body.resultInfo.resultStatus;
                    // res.json(body);
                    addPayment(body);
                    // res.redirect(`${req.protocol}://${req.get("host")}/order/${body.orderId}`)
                    res.redirect(`https://${req.get("host")}/order/${body.orderId}`)
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });

    } else {
        console.log("Checksum Mismatched");
    }
}

const addPayment = async (data) => {
    try {
        await Payment.create(data);
    } catch (error) {
        console.log("Payment Failed!");
    }
}

exports.getPaymentStatus = asyncErrorHandler(async (req, res, next) => {

    const payment = await Payment.findOne({ orderId: req.params.id });

    if (!payment) {
        return next(new ErrorHandler("Payment Details Not Found", 404));
    }

    const txn = {
        id: payment.txnId,
        status: payment.resultInfo.resultStatus,
    }

    res.status(200).json({
        success: true,
        txn,
    });
});

// Create Razorpay Order
exports.createRazorpayOrder = asyncErrorHandler(async (req, res, next) => {
    const { amount, currency = 'INR', receipt } = req.body;

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100, // amount in smallest currency unit (paise)
        currency,
        receipt: receipt || `receipt_order_${Date.now()}`,
        payment_capture: 1,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Verify Razorpay Payment
exports.verifyRazorpayPayment = asyncErrorHandler(async (req, res, next) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Payment is successful, save to database
        try {
            const payment = await Payment.create({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                status: 'SUCCESS',
                orderId: razorpay_order_id,
                txnId: razorpay_payment_id,
                resultInfo: {
                    resultStatus: 'TXN_SUCCESS',
                    resultCode: '01',
                    resultMsg: 'Payment successful via Razorpay'
                }
            });

            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
            });
        } catch (error) {
            return next(new ErrorHandler("Failed to save payment details", 500));
        }
    } else {
        res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });
    }
});

// Get Razorpay Key
exports.getRazorpayKey = asyncErrorHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
    });
});
