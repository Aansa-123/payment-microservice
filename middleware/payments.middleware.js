import { userAPI } from "../utils/payments.utils.js";

const verifyUser = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        console.log("Payment Middleware Auth Header:", authHeader);

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token missing"
            });
        }

        const response = await userAPI.get("/users/verify", {
            headers: {
                Authorization: authHeader
            }
        });

        console.log(
            "User verification response:",
            response.data
        );

        req.user = response.data;

        req.user.id = Number(req.user.id);

        next();

    } catch (error) {

        console.error(
            "USER VERIFICATION ERROR:",
            error.response?.data || error.message
        );

        return res.status(401).json({
            message: "Unauthorized User"
        });

    }

};

export default verifyUser;