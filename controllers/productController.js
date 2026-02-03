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

function index(req, res, next) {


}

export default {
    bestSeller,
    newArrivals,
    index
}