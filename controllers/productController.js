import connection from "../db/createConnection.js"
import pricefunction from "../middlewares/priceHelperfunction.js"

function bestSeller(req, res, next) {

    const query = `
    SELECT 
      products.name,
      products.description,
      products.slug,
      products.image,
      products.size_ml,
      products.price,
      COALESCE(SUM(product_invoice.quantity), 0) AS quantity,
      skin_types.name AS skin_type,
      categories.name AS category_name
    FROM products
    LEFT JOIN product_invoice
      ON products.id = product_invoice.id_product
    INNER JOIN skin_types
      ON skin_types.id = products.id_skin_type
    INNER JOIN categories
      ON categories.id = products.id_category
    GROUP BY products.id
    ORDER BY quantity DESC
    LIMIT 10
  `;

    connection.query(query, (err, results) => {
        if (err) return next(err);

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const formattedResults = results.map(product => ({
            ...pricefunction(product),
            image: `${baseUrl}/${product.image}`
        }));

        res.json(formattedResults);
    });
}


function newArrivals(req, res, next) {

    const query = `
    SELECT 
      products.name,
      products.description,
      products.slug,
      products.image,
      products.size_ml,
      products.price,
      skin_types.name AS skin_type,
      categories.name AS category_name
    FROM products
    INNER JOIN skin_types
      ON skin_types.id = products.id_skin_type
    INNER JOIN categories   
      ON categories.id = products.id_category
    ORDER BY products.created_at DESC
    LIMIT 10
  `;

    connection.query(query, (err, results) => {
        if (err) return next(err);

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const formattedResults = results.map(product => ({
            ...pricefunction(product),
            image: `${baseUrl}/${product.image}`
        }));

        res.json(formattedResults);
    });
}


function showWithSlug(req, res, next) {
    const slug = req.params.slug;

    if (!slug) {
        return res.status(400).json({
            error: "Slug mancante"
        });
    }
    // se non viene inserito lo slug

    if (typeof slug !== "string") {
        return res.status(400).json({
            error: "Slug non valido"
        })
    }
    // lo slug deve essere scritto in type stringa

    const slugRegex = /^(?=.*[a-z])[a-z0-9]+(?:-[a-z0-9]+)*$/;//cosi non si puo inserire il numero solo in una stringa, se facciamo "123" non funziona ma "crema-123" si
    if (!slugRegex.test(slug)) {
        return res.status(400).json({
            error: "Formato slug non valido"
        });
    }
    // verranno accettati solo slugo validi
    console.log("Sto cercando lo slug:", slug);


    const query = `SELECT products.* ,skin_types.name AS "skin_type", categories.name AS 
    "category_name" FROM products INNER JOIN skin_types ON products.id_skin_type = skin_types.id
    INNER JOIN categories ON products.id_category = categories.id WHERE products.slug = ?`;

    connection.query(query, [slug], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) {
            res.status(404);
            return res.json({
                error: "NOT FOUND",
                message: "Prodotto non trovato"
            })
        }
        const product = results[0];

        /* const sql = `SELECT  ingredients.id, ingredients.name FROM products INNER JOIN product_ingredient
        ON products.id = product_ingredient.id_product INNER JOIN ingredients ON 
        product_ingredient.id_ingredient = ingredients.id
        WHERE products.slug = ?`

        connection.query(sql, [slug], (err, resultsIngredients) => {
            if (err) return next(err);

            let finalProduct = {
                ...product,
                ingredients: resultsIngredients
            }
        const sqlImage= `SELECT images.* FROM products INNER JOIN images ON products.id = images.id_product WHERE products.slug = ?`

        connection.query(sqlImage, [slug], (err, resultsImage) => {
            if (err) return next(err);

             finalProduct = {
                ...finalProduct,
                image: [
                    {path:finalProduct.image},
                    ...resultsImage
                ]
            }
            res.json(finalProduct);
        } )
             */
        const ingredientsQuery = `
            SELECT ingredients.id, ingredients.name
            FROM products
            INNER JOIN product_ingredient
                ON products.id = product_ingredient.id_product
            INNER JOIN ingredients
                ON product_ingredient.id_ingredient = ingredients.id
            WHERE products.slug = ?
        `;

        connection.query(ingredientsQuery, [slug], (err, ingredientsResults) => {
            if (err) return next(err);

            // query immagini
            const imagesQuery = `
                SELECT images.*
                FROM products
                INNER JOIN images
                    ON products.id = images.id_product
                WHERE products.slug = ?
            `;

            connection.query(imagesQuery, [slug], (err, imagesResults) => {
                if (err) return next(err);

                //  risposta finale (UNA SOLA)
                res.json({
                    ...product,
                    ingredients: ingredientsResults,
                    images: [
                        { path: product.image },
                        ...imagesResults
                    ]
                })
            })
        });
    });

}

function index(req, res, next) {
    let { category, skinType, limit, offset, minPrice, maxPrice } = req.query;

    console.log("index controller");
    console.log("req", req.query);

    limit = parseInt(limit) || 10;
    minPrice = parseInt(minPrice) || 0;
    maxPrice = parseInt(maxPrice) || 9999;
    offset = parseInt(offset) || 0;

    if (category === "0" && skinType === "0") {
        const sql = `
        SELECT products.*, categories.name as name_category, skin_types.name as type_of_skin 
        FROM products
        INNER JOIN categories
        ON products.id_category = categories.id
        INNER JOIN skin_types
        ON products.id_skin_type = skin_types.id
        WHERE products.id_category is not null
        AND products.id_skin_type is not null
        AND products.price >= ?
        AND products.price <= ?
        LIMIT ? OFFSET ?
        `;

        connection.query(
            sql,
            [minPrice, maxPrice, limit, offset],
            (err, result) => {
                if (err) {
                    return next(err);
                }
                return res.json({
                    limit,
                    result,
                });
            },
        );
    } else if (category === "0") {
        const sql = `
        SELECT products.*, categories.name as name_category, skin_types.name as type_of_skin 
        FROM products
        INNER JOIN categories
        ON products.id_category = categories.id
        INNER JOIN skin_types
        ON products.id_skin_type = skin_types.id
        WHERE products.id_category is not null
        AND products.id_skin_type = ?
        AND products.price >= ?
        AND products.price <= ?
        LIMIT ? OFFSET ?
    `;
        connection.query(
            sql,
            [parseInt(skinType), minPrice, maxPrice, limit, offset],
            (err, result) => {
                if (err) {
                    return next(err);
                }
                return res.json({
                    limit,
                    result,
                });
            },
        );
    } else if (skinType === "0") {
        const sql = `
        SELECT products.*, categories.name as name_category, skin_types.name as type_of_skin 
        FROM products
        INNER JOIN categories
        ON products.id_category = categories.id
        INNER JOIN skin_types
        ON products.id_skin_type = skin_types.id
        WHERE products.id_category = ?
        AND products.id_skin_type is not null
        AND products.price >= ?
        AND products.price <= ?
        LIMIT ? OFFSET ?
    `;
        connection.query(
            sql,
            [parseInt(category), minPrice, maxPrice, limit, offset],
            (err, result) => {
                if (err) {
                    return next(err);
                }
                return res.json({
                    limit,
                    result,
                });
            },
        );
    } else {
        const sql = `
        SELECT products.*, categories.name as name_category, skin_types.name as type_of_skin 
        FROM products
        INNER JOIN categories
        ON products.id_category = categories.id
        INNER JOIN skin_types
        ON products.id_skin_type = skin_types.id
        WHERE products.id_category = ?
        AND products.id_skin_type = ? 
        AND products.price >= ?
        AND products.price <= ?
        LIMIT ? OFFSET ?
    `;
        connection.query(
            sql,
            [
                parseInt(category),
                parseInt(skinType),
                minPrice,
                maxPrice,
                limit,
                offset,
            ],
            (err, result) => {
                if (err) {
                    return next(err);
                }
                return res.json({
                    limit,
                    result,
                });
            },
        );
    }
}

export default {
    bestSeller,
    newArrivals,
    index,
    showWithSlug
}