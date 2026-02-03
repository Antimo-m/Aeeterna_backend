export default function notFound(req, res, next){
    return res.status(404).json({
        error: "Not Found 400",
        message: `${req.path} not found`
    })
}