const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// Mock Razorpay functionality for demo
const mockRazorpay = {
  orders: {
    create: async (options) => {
      return {
        id: `order_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created'
      };
    }
  }
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount and currency are required' 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    // For demo purposes, we'll use mock Razorpay
    const order = await mockRazorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify-payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing payment verification parameters' 
      });
    }

    // For demo purposes, we'll simulate successful verification
    // In production, you would verify the signature properly
    const isValid = true; // Simulated verification

    if (isValid) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpayPaymentId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
});

module.exports = router;