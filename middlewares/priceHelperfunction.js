function normalizeProduct(product) {
    return {
        ...product,
        price: Number(product.price)
    };
}

export default normalizeProduct