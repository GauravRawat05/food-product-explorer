const BASE_URL = 'https://world.openfoodfacts.org';

export const api = {
    /**
     * Search for products by name
     * @param {string} query 
     * @param {number} page 
     * @returns {Promise<any>}
     */
    searchProducts: async (query, page = 1) => {
        if (!query) return { products: [] };
        const response = await fetch(`${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=24`);
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    },

    /**
     * Get product details by barcode
     * @param {string} barcode 
     * @returns {Promise<any>}
     */
    getProductByBarcode: async (barcode) => {
        const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
        if (!response.ok) throw new Error('Product not found');
        return response.json();
    },

    /**
     * Get list of categories
     * @returns {Promise<any>}
     */
    getCategories: async () => {
        const response = await fetch(`${BASE_URL}/categories.json`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
    },

    /**
     * Get products by category
     * @param {string} category 
     * @param {number} page 
     * @returns {Promise<any>}
     */
    getProductsByCategory: async (category, page = 1) => {
        const response = await fetch(`${BASE_URL}/category/${category}/${page}.json`);
        if (!response.ok) throw new Error('Failed to fetch category products');
        return response.json();
    }
};
