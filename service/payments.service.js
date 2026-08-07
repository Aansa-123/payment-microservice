import Payment from "../models/payment.models.js";
import { userAPI, invoiceAPI } from "../utils/payments.utils.js";
// import { publishPaymentSuccessful } from './kafka/kafka.producer.js'
import axios from "axios";

const blogAPI = axios.create({
  baseURL: process.env.BLOG_API,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createPayment = async (req) => {
  const { invoiceId } = req.body;

  const authHeader = req.headers.authorization;

  // 1. Get invoice through existing HTTP request
  let invoice;

  try {
    const response = await invoiceAPI.get(`/invoice/${invoiceId}`, {
      headers: {
        Authorization: authHeader,
      },
    });

    invoice = response.data;
    console.log(
      "FULL INVOICE FROM INVOICE SERVICE:",
      JSON.stringify(invoice, null, 2),
    );
    console.log("Invoice received in Payment Service:", invoice);
  } catch (error) {
    console.error("Invoice API Error:", error.message);

    throw new Error(`Invoice not found: ${error.message}`);
  }

  // 2. Validate invoice status
  if (invoice.status === "Paid") {
    throw new Error("Invoice already paid");
  }

  if (invoice.status === "Overdue") {
    throw new Error("Invoice overdue. Extend date first");
  }

  // 3. Check existing payment
  const existingPayment = await Payment.findOne({
    invoiceId,
  });

  if (existingPayment) {
    throw new Error("Payment already exists");
  }

  // 4. Get blog ID
  const blogId = invoice.blogId;

  console.log("Blog ID:", blogId);

  // 5. Publish Kafka event FIRST to ensure downstream services get notified
  const paymentMethod = invoice.paymentMethod || "Credit Card";
  const buyerName = invoice.buyerName || req.user.name;

  // Generate a temporary payment ID for the Kafka event; actual payment will be created after
  // await publishPaymentSuccessful({

  //     invoiceId: invoiceId,

  //     blogId: blogId,

  //     userId: req.user.id,

  //     buyerName: buyerName,

  //     paymentMethod: paymentMethod,

  //     amount: invoice.amount

  // });

  // 6. Create payment with buyerName and paymentMethod from invoice
  //    Only create the payment record AFTER Kafka event was successfully published
  const payment = await Payment.create({
    invoiceId: invoice._id,

    userId: req.user.id,

    amount: invoice.amount,

    paymentStatus: "Success",

    paymentMethod: paymentMethod,

    buyerName: buyerName,
  });

  return payment;
};

export const getAllPayments = async (userId) => {
  return await Payment.find({ userId }).sort({ createdAt: -1 });
};

export const getPaymentById = async (id, userId) => {
  return await Payment.findOne({
    _id: id,

    userId,
  });
};

export const deletePayment = async (id, userId) => {
  return await Payment.findOneAndDelete({
    _id: id,

    userId,
  });
};

export const deleteAllPayments = async (userId) => {
  return await Payment.deleteMany({
    userId,
  });
};
