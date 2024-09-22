const { response } = require('../helpers/response.formatter');
const { Orders, Products } = require('../models');

module.exports = {
    // Get Orders
    getOrders: async (req, res) => {
        try {
            const orderList = await Orders.findAll({
                include: [{
                    model: Products,
                    as: 'products',
                }],
            });

            const formattedOrders = orderList.map(order => ({
                id: order.id,
                products: order.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: product.sold,
                    stock: product.stock,
                    created_at: product.createdAt,
                    updated_at: product.updatedAt,
                })),
                created_at: order.createdAt,
                updated_at: order.updatedAt,
            }));

            res.status(200).json(response(200, "Order List", formattedOrders));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    // Create Order
    createOrder: async (req, res) => {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json(response(400, 'Invalid product list'));
        }

        try {
            // Create new order
            const newOrder = await Orders.create();

            // product updates
            const productUpdates = products.map(async (product) => {
                const foundProduct = await Products.findOne({ where: { id: product.id } });

                if (!foundProduct) {
                    throw new Error(`Product with ID ${product.id} not found`);
                }

                if (foundProduct.stock < product.quantity) {
                    throw new Error(`Insufficient stock for product ID ${product.id}`);
                }

                // Update the products sold quantity and stock
                await Products.update(
                    {
                        sold: foundProduct.sold + product.quantity,
                        stock: foundProduct.stock - product.quantity,
                    },
                    { where: { id: product.id } }
                );

                return {
                    id: foundProduct.id,
                    quantity: product.quantity,
                };
            });

            const updatedProducts = await Promise.all(productUpdates);

            await newOrder.setProducts(updatedProducts.map(p => p.id));

            // Response
            res.status(201).json(response(201, 'Order created', {
                id: newOrder.id,
                products: updatedProducts
            }));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err.message));
            console.log(err);
        }
    },

    getOrderById: async (req, res) => {
        const { id } = req.params;

        try {
            // Get ID
            const order = await Orders.findOne({
                where: { id },
                include: [{
                    model: Products,
                    as: 'products',
                }],
            });

            // Check if the order exists
            if (!order) {
                return res.status(404).json(response(404, 'Order not found'));
            }

            // Format the order data
            const formattedOrder = {
                id: order.id,
                products: order.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: product.sold, 
                    stock: product.stock,
                    created_at: product.createdAt,
                    updated_at: product.updatedAt,
                })),
                created_at: order.createdAt,
                updated_at: order.updatedAt,
            };

            // Send the response
            res.status(200).json(response(200, 'Order Detail', formattedOrder));
        } catch (err) {
            res.status(500).json(response(500, 'Internal server error', err.message));
            console.error(err);
        }
    },
    deleteOrder: async (req, res) => {
        const { id } = req.params;
    
        try {
            // Check if the order exists and include associated products
            const order = await Orders.findOne({
                where: { id },
                include: [{
                    model: Products,
                    as: 'products',
                }],
            });
    
            if (!order) {
                return res.status(404).json(response(404, 'Order not found'));
            }
    
            // Prepare the order data for response before deletion
            const orderData = {
                id: order.id,
                products: order.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: product.sold, // Assuming 'sold' is used as quantity for the order
                    stock: product.stock,
                    created_at: product.createdAt,
                    updated_at: product.updatedAt,
                })),
                created_at: order.createdAt,
                updated_at: order.updatedAt,
            };
    
            // Set orderId to NULL in associated products
            await Products.update({ orderId: null }, {
                where: { orderId: id },
            });
    
            // Now delete the order
            await Orders.destroy({
                where: { id },
            });
    
            // Respond with the deleted order data
            res.status(200).json(response(200, 'Order deleted successfully', orderData));
        } catch (err) {
            res.status(500).json(response(500, 'Internal server error', err.message));
            console.error(err);
        }
    }
    
};
