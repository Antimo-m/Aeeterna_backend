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
    LIMIT 10
  `;

    connection.query(query, (err, results) => {
        if (err) return next(err);

        const baseUrl = `${req.protocol}://${req.get("host")}/image/`;

        const formattedResults = results.map(product => ({
            ...pricefunction(product),
            quantity : Number(product.quantity),
            image: `${baseUrl}${product.image}`
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

        const baseUrl = `${req.protocol}://${req.get("host")}/image/`;

        const formattedResults = results.map(product => ({
            ...pricefunction(product),
            image: `${baseUrl}${product.image}`//aggiungeto /image
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

        const {
            id,
            created_at,
            updated_at,
            
            ...publicProduct
        } = product;

        console.log(publicProduct);
        


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
                const baseUrl = `${req.protocol}://${req.get("host")}/image/`;  
                //  risposta finale 
                res.json({
                    ...publicProduct,
                    image :`${baseUrl}${product.image}`,
                    price : Number(product.price),
                    ingredients: ingredientsResults,
                    images: [
                        { path: `${baseUrl}${product.image}` },
                         ...imagesResults.map(img => ({
                            ...img,
                            path: `${baseUrl}${img.path}`
                        }))
                    ]
                })
            })
        });
    });

}

function index(req, res, next) {
    let {
        category,
        search,
        skinType,
        minPrice = 0,
        maxPrice = 9999,
        limit = 80,
        offset = 0
    } = req.query;

    minPrice = Number(minPrice);
    maxPrice = Number(maxPrice);
    limit = parseInt(limit);
    offset = parseInt(offset);

    if (Number.isNaN(minPrice) || Number.isNaN(maxPrice)) {
        return res.status(400).json({
            error: "minPrice e maxPrice devono essere numeri"
        });
    }

    if (minPrice < 0 || maxPrice < 0) {
        return res.status(400).json({
            error: "minPrice e maxPrice non possono essere negativi"
        });
    }

    if (minPrice > maxPrice) {
        return res.status(400).json({
            error: "minPrice non può essere maggiore di maxPrice"
        });
    }

    if (Number.isNaN(limit) || !Number.isInteger(limit) || limit <= 4 || limit > 80) {
        return res.status(400).json({
            error: "limit deve essere un numero intero tra 5 e 80"
        });
    }

    if (Number.isNaN(offset) || !Number.isInteger(offset) || offset < 0) {
        return res.status(400).json({
            error: "offset deve essere un numero intero >= 0"
        });
    }

    let cleanSearch;

    if (search !== undefined) {
        if (typeof search !== "string") {
            return res.status(400).json({
                error: "search deve essere una stringa"
            });
        }

        cleanSearch = search.trim();

        if (cleanSearch.length < 2 && cleanSearch.length > 0) {
            return res.status(400).json({
                error: "search deve contenere almeno 2 caratteri"
            });
        } 

        if (/^\d+$/.test(cleanSearch)) {
            return res.status(400).json({
                error: "search non può contenere solo numeri"
            });
        }

        if (cleanSearch.length > 80) {
            return res.status(400).json({
                error: "search troppo lunga"
            });
        }
    }

    


    /* ===== QUERY BASE ===== */
    let sql = `
        SELECT
            products.name,
            products.description,
            products.slug,
            products.image,
            products.size_ml,
            products.price,
            categories.name AS category_name,
            skin_types.name AS skin_type
        FROM products
        INNER JOIN categories 
            ON categories.id = products.id_category
        INNER JOIN skin_types 
            ON skin_types.id = products.id_skin_type
        WHERE products.price BETWEEN ? AND ?
    `;

    const values = [minPrice, maxPrice];

    /* ===== SEARCH (nome + description prodotto) ===== */
    if (cleanSearch && cleanSearch.length > 0) {
        sql += " AND (products.name LIKE ? OR products.description LIKE ?)";
        values.push(`%${cleanSearch}%`, `%${cleanSearch}%`);
    }

    /* ===== CATEGORY ===== */
    
    if (category !== undefined) {
        const parsedCategory = Number(category);

        if (!Number.isInteger(parsedCategory) || parsedCategory < 0) {
            return res.status(400).json({
                error: "category deve essere un numero intero >= 0"
            });
        }

        // category = 0 → tutte le categorie (NON filtrare)
        if (parsedCategory > 0) {
            sql += " AND products.id_category = ?";
            values.push(parsedCategory);
        }
    }


    /* ===== SKIN TYPE ===== */
    if (skinType !== undefined) {
        const parsedSkinType = Number(skinType);

        if (!Number.isInteger(parsedSkinType) || parsedSkinType < 0) {
            return res.status(400).json({
                error: "skinType deve essere un numero intero positivo o 0"
            });
        }

        if (parsedSkinType > 5) {
            return res.status(404).json({
                error: "Tipologia di pelle non esistente"
            });
        }

        if (parsedSkinType > 0) {
            sql += " AND products.id_skin_type = ?";
            values.push(parsedSkinType);
        }
    }

    /* ===== PAGINAZIONE ===== */
    sql += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    connection.query(sql, values, (err, results) => {
        if (err) return next(err);

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const formattedResults = results.map(product => ({
            ...pricefunction(product),
            image: `${baseUrl}/image/${product.image}`
        }));

        res.json(formattedResults);
    });
}

    




export default {index,
    bestSeller,
    showWithSlug,
    newArrivals
}