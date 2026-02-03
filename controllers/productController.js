import connection from "../db/createConnection.js"

function bestSeller(req, res, next) {

    const query = `
        select products.*, sum(product_invoice.quantity) as quantity, skin_types.name as type_of_skin, categories.name as category_product
        from products
        left join product_invoice
        on products.id = product_invoice.id_product
        inner join skin_types
        on skin_types.id = products.id_skin_type
        inner join categories   
        on categories.id = products.id_category
        group by products.id 
        order by quantity desc
        limit 10
        `;

    connection.query(query, (err, results) => {
        if (err) return next(err);

        res.json(results)
    });
}

function newArrivals(req, res, next) {
    const query = `
        select products.*, skin_types.name as type_of_skin, categories.name as category_product 
        from products
        inner join skin_types
        on skin_types.id = products.id_skin_type
        inner join categories   
        on categories.id = products.id_category
        group by products.id 
        order by products.created_at desc
        limit 10
        `;

    connection.query(query, (err, results) => {
        if (err) return next(err);

        res.json(results)
    });

}

function showConSlug(req, res, next) {
    const slug = req.params.slug;
    console.log("Sto cercando lo slug:", slug);

    const query = `SELECT * FROM products WHERE products.slug = ?`;
    connection.query(query, [slug], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) {
            res.status(404);
            return res.json({
                error: "NOT FOUND",
                message: "Prodotti not found"
            })
        }
        const product = results[0];
        res.json(product);
    })


}

function index(req, res, next) {


}

export default {
    bestSeller,
    newArrivals,
    index,
    showConSlug
}