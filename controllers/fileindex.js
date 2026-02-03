import connection from "../db/createConnection.js";

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

export default index;
