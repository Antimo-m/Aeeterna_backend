export default function errorHandler(err, req, res, next) {
    console.error("ERROR:", err);
    res.status(500)
        .json({
            error: process.env.ENVIRONMENT === "development" ? err : "INTERNAL ERROR",
            message: "Internal server error",
        });
};