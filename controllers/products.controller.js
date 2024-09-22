const { response} = require('../helpers/response.formatter');

const { Products } = require('../models');

const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {

    //Create Products
    createProduct : async (req,res) => {
        try {
            
            //schema validation
            const schema = {
                name: {
                    type: "string",
                    min: 1,
                    required: true
                },
                price: {
                    type: "number",
                    required: true
                },
                stock: {
                    type: "number",
                    required: true
                },
                sold: {
                    type: "number"
                }
            }
            
            // Check if req.body is undefined
            // if (!req.body) {
            //     return res.status(400).json(response(400, 'Request body is missing'));
            // }

            //create object product
            let prodCreateObj = {
                name: req.body.name,
                price: req.body.price,
                stock: req.body.stock,
                sold: req.body.sold
            }

            //validate
            const validate = v.validate(prodCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            //create an product
            let prodCreate = await Products.create(prodCreateObj);

            //response
            res.status(201).json(response(201, 'Product created successfully', prodCreate));
        }catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }
    },

    //get products
    getProduct : async (req,res) => {
        try {
            //get all
            let prodGets = await Products.findAll();

        //response
        res.status(200).json(response(200,'Product List', prodGets));

        } catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }
    },

    //get product by id
    getProductById : async (req,res) => {
        try{
            //get id
            let prodGet = await Products.findOne({
                where : {
                    id : req.params.id
                }
            });

            //check data
            if(!prodGet){
                res.status(404).json(response(404,'product not found'));
                return;
            }

            //response
            res.status(200).json(response(200,'Product Detail', prodGet));
        }catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }
    },

    //update
    updateProduct : async (req, res) => {
        try {
            //get id
            let prodGet = await Products.findOne({
                where:{
                    id : req.params.id
                }
            })

            //check the product
            if(!prodGet){
                res.status(404).json(response(404,'products not found'));
                return;
            }

            //validation schema
            const schema = {
                name: {
                    type: "string"
                },
                price: {
                    type: "number"
                },
                stock: {
                    type: "number"
                },
                sold: {
                    type: "number"
                }
            }

            let prodUpdateObj = {
                name: req.body.name,
                price: req.body.price,
                stock: req.body.stock,
                sold: req.body.sold
            }

            //validation
            const validate = v.validate(prodUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            //update product
            await Products.update(prodUpdateObj, {
                where:{
                    id: req.params.id
                }
            })

            //get products after update
            let prodAfterUpdate = await Products.findOne({
                where:{
                    id: req.params.id
                }
            })

            //response
            res.status(200).json(response(200,'Product updated successfully', prodAfterUpdate));
            
        } catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }   
    },

    //delete product
    deleteProduct: async (req, res) => {
        try {

            //get id
            let prodGet = await Products.findOne({
                where:{
                    id : req.params.id
                }
            })

            //check if product exist
            if(!prodGet){
                res.status(404).json(response(404,'product not found'));
                return;
            }

            const prodDelete = prodGet.dataValues;

            await Products.destroy({
                where:{
                    id: req.params.id
                }
            })

            //response
            res.status(200).json(response(200,'Product deleted successfully', prodDelete));

        } catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }
    }
}