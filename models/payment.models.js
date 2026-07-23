import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({

    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
         ref:"Invoice",
        required: true
    },

    userId: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true,
    },

    paymentDate: {
        type: Date,
        default: Date.now
    },

    paymentStatus:{
        type:String,
        enum:[
            "Success",
            "Failed"
        ],
        default:"Success"
    },

     paymentMethod:{
        type:String,
        enum: [
            "Credit Card",
            "Debit Card",
            "PayPal",
            "Bank Transfer",
            "JazzCash",
            "EasyPaisa"
        ],
        default:"Credit Card"
    },

    buyerName: {
        type: String,
        required: true
    }

},
{
    timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
