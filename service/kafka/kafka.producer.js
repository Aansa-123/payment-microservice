import {Kafka} from 'kafkajs'

 const kafkaBroker = process.env.KAFKA_BROKER;
const kafka = new Kafka({
    clientId: 'payment-producer-service',
    brokers: [kafkaBroker],
});

const producer = kafka.producer();

let isConnected = false;

export const connectProducer = async () => {
    try {
        await producer.connect();
        isConnected = true;
        console.log('Payment Kafka producer connected');
    } catch (error) {
        console.error('Error connecting to Kafka producer:', error);
        throw error;
    }

};

export const publishPaymentSuccessful = async (paymentData) => {
    if(!isConnected){
        throw new Error("kafka producer is not connected");
    }

    await producer.send({
        topic: "payment-successful-events",
        messages: [
        {
            key: String(paymentData.paymentId),
            value: JSON.stringify({
                eventType: "PAYMENT_SUCCESSFUL",
                paymentData
            }),
        },
    ],
});
    console.log(
        "PAYMENT_SUCCESSFUL event published:",
        paymentData
    );
};

export const disconnectProducer = async() => {
    if(isConnected){
        await producer.disconnect();
    }
};

