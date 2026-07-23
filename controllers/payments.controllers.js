import * as paymentService from "../service/payments.service.js";

export const createPayment = async (req, res) => {

    try {

        const payment = await paymentService.createPayment(req);

        res.status(200).json({
            message: "Payment Successful",
            payment
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};

export const getAllPayments = async (req, res) => {

    try {

        const payments = await paymentService.getAllPayments(req.user.id);

        res.status(200).json(payments);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const getPaymentById = async (req, res) => {

    try {

        const payment = await paymentService.getPaymentById(
            req.params.id,
            req.user.id
        );

        if (!payment) {

            return res.status(404).json({
                message: "Payment not found"
            });

        }

        res.status(200).json(payment);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const deletePayment = async (req, res) => {

    try {

        const payment = await paymentService.deletePayment(
            req.params.id,
            req.user.id
        );

        if (!payment) {

            return res.status(404).json({
                message: "Payment not found"
            });

        }

        res.status(200).json({
            message: "Payment deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const deleteAllPayments = async (req, res) => {

    try {

        await paymentService.deleteAllPayments(req.user.id);

        res.status(200).json({
            message: "All payments deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};