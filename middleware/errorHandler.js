export default function errorHandler (err, req, res, next){

    res.status(500)
        .json({
        error: process.env.ENVIRONMENT === "development" ? err : "INTERNAL ERROR",
        message: "Internal server error",
    });
};