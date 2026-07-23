import axios from "axios";

export const userAPI = axios.create({
    baseURL: process.env.USER_API,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

export const invoiceAPI = axios.create({
    baseURL: process.env.INVOICE_API,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

