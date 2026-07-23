import express from "express";

import verifyUser from "../middleware/payments.middleware.js";

import {

    createPayment,

    getAllPayments,

    getPaymentById,

    deletePayment,

    deleteAllPayments

} from "../controllers/payments.controllers.js";

const router = express.Router();

router.post("/", verifyUser, createPayment);

router.get("/", verifyUser, getAllPayments);

router.get("/:id", verifyUser, getPaymentById);

router.delete("/:id", verifyUser, deletePayment);

router.delete("/", verifyUser, deleteAllPayments);

export default router;